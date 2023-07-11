import {Goal} from '../interfaces/Goal.interface';
import {RequiredOnlyNameAndPointsGoalType} from '../interfaces/Requests/InsertProposedGoalsRequest';

type validateProposedGoalType = (
  gaol: RequiredOnlyNameAndPointsGoalType,
  config: {nameRegex: RegExp}
) => boolean;

export const validateProposedGoal: validateProposedGoalType = (
  goal,
  config
) => {
  const validName = config.nameRegex.test(goal.name);
  let validDescription = true;

  if (goal?.description) {
    validDescription = config.nameRegex.test(goal.description);
  }

  if (!validDescription) {
   return false
  }

  if (!validName) {
    return false;
  }

  return true;
};
