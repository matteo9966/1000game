import {RequestHandler} from 'express';
import {UpvoteGoalRequest} from '../../interfaces/Requests/upvoteGoalRequest';
import {CustomServerError} from '../../errors/CustomServerError';
import {gameModel} from '../../db/Models/Game.model';
import {Game} from '../../interfaces/Game.interface';
import {UpvoteGoalResponse} from '../../interfaces/Responses/upvoteGoalResponse';
import {reachedVoteThreshold} from '../../utils/reachedVoteCounter';

type asyncRequestHandler = (
  ...args: Parameters<RequestHandler>
) => Promise<void>;
export const upvoteGoalController: asyncRequestHandler = async (
  req,
  res,
  next
) => {
  const body: UpvoteGoalRequest = req.body;
  if (!body.gameId || !body.goalId || !body.username) {
    throw new CustomServerError(
      'Missing gameId or goalId or username to upvote',
      400
    );
  }

  const game = await gameModel.findById<Game>(body.gameId);
  if (!game) throw new CustomServerError('no game with this provided Id', 400);

  const user = game.players.find(p => p === body.username);
  if (!user) {
    throw new CustomServerError(
      "You don't have the authorization to edit this game",
      401
    );
  }

  const proposedGoal = game.proposedGoals.find(
    goal => goal?.goal?.id === body?.goalId
  );
  if (!proposedGoal) {
    throw new CustomServerError('no proposed goal  with this ID', 400);
  }

  const creatorVotedForGoal = proposedGoal.proposedBy === body.username;
  if (creatorVotedForGoal) {
    throw new CustomServerError(
      "You created this goal so you can't vote for it",
      400
    );
  }

  if (proposedGoal?.votedBy?.includes(body.username)) {
    throw new CustomServerError('you already voted for this goal', 400);
  }

  const players = game.players.length;
  const upvoted = proposedGoal.votedBy.length + 1; //add the last one that voted

  //

  const reachedvotecount = reachedVoteThreshold(players, upvoted);

  if (reachedvotecount) {
    const goal = proposedGoal.goal;
    const addedNewGoal = await gameModel.appendGoals([goal], body.gameId);
    if (!addedNewGoal) {
      throw new CustomServerError('error while upgrading the goal', 500);
    }

    const goalIndex = await gameModel.getProposedGoalIndex(
      body.gameId,
      body.goalId
    );

    const deleded = await gameModel.deleteProposedGoal(goalIndex, body.gameId);
    if(!deleded){
      throw new CustomServerError('error while deliting the proposed goal',500);
    }

  }
  else{
    
     await gameModel.upvoteProposedGoal(
      body.gameId,
      body.goalId,
      body.username
    );

  }

  const updatedGame = await gameModel.getGameById(body.gameId);

  const response: UpvoteGoalResponse = {
    data: {
      goals:updatedGame.goals,
      proposedGoals:updatedGame.proposedGoals,  
    },
    error: null,
  };
  res.json(response);
};
