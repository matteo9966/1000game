import {Goal} from '../interfaces/Goal.interface';

export const parseObject = <T extends Record<string, any>>(
  template: T,
  obj: Partial<T>
) => {
  const newObj = Object.assign({...template}, obj);
  console.log(template)
  const clearObj = Object.keys(template).reduce<Record<string, any>>(
    (acc, key) => {
      acc[key] = newObj[key];
      return acc;
    },
    {}
  );
  return clearObj as T;
};

const goalTemplate: Goal = {
  categories: [],
  description: '',
  id: '',
  name: '',
  points: 0,
};


export const parseNewGoal = (obj: Record<string, any>, id?: string) => {
  const newGoal = parseObject(goalTemplate, obj);
  if (id) {
    newGoal.id = id;
  }
  return newGoal;
};

