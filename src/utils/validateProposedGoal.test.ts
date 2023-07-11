import {InsertProposedGoalsRequest} from '../interfaces/Requests/InsertProposedGoalsRequest';
import {validateProposedGoal} from './validateProposedGoal';
import {RequiredOnlyNameAndPointsGoalType} from '../interfaces/Requests/InsertProposedGoalsRequest';
import {expect} from 'chai';
describe('valdiateProposedGoal', () => {
  it('should return true if goal has valid points and a valid name', () => {
    const nameRegex = /^[a-z0-9-_\ ]*$/i;

    const goal: RequiredOnlyNameAndPointsGoalType = {
      name: 'the name is my best',
    };
    const result = validateProposedGoal(goal, {nameRegex});
    expect(result).to.be.true;
  });

  it('should return false if user tries adding " of \\ or // ', () => {
    const nameRegex = /^[a-z0-9-_\ ]*$/i;

    const goal: RequiredOnlyNameAndPointsGoalType = {
      name: 'the name / is my best',
    };
    const result = validateProposedGoal(goal, {nameRegex});
    expect(result).to.be.false;
  });

  it('should return true if it has a valid description', () => {
    const nameRegex = /^[a-z0-9-_\ ]*$/i;

    const goal: RequiredOnlyNameAndPointsGoalType = {
      name: 'the name is my best',
      description: 'this is a valid description',
    };
    const result = validateProposedGoal(goal, {nameRegex});
    expect(result).to.be.true;
  });

  it('should return false if it has a invalid description', () => {
    const nameRegex = /^[a-z0-9-_\ ]*$/i;

    const goal: RequiredOnlyNameAndPointsGoalType = {
      name: 'the name / is my best',
      description: 'this is the / invalid description',
    };
    const result = validateProposedGoal(goal, {nameRegex});
    expect(result).to.be.false;
  });

  

});
