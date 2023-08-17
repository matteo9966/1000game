import {Goal} from '../interfaces/Goal.interface';
import { User } from '../interfaces/User.interface';

export const parseObject = <T extends Record<string, any>>(
  template: T,
  obj: Partial<T>
) => {
  const copy = JSON.parse(JSON.stringify(template))
  const newObj = Object.assign(copy, obj);
  const clearObj = Object.keys(template).reduce<Record<string, any>>(
    (acc, key) => {
      acc[key] = newObj[key];
      return acc;
    },
    {}
  );
  return clearObj as T;
};





export const parseNewGoal = (obj: Record<string, any>, id?: string) => {
  const goalTemplate: Goal = {
    categories: [],
    description: '',
    id: '',
    name: '',
    points: 0,
  };
  
  const newGoal = parseObject(goalTemplate, obj);
  if (id) {
    newGoal.id = id;
  }
  return newGoal;
};


export const parseNewUser = (obj: Record<string, any>, id?: string)=>{
  const userTemplate:User = {
    gameID:"",
    goals:[],
    id:"",
    name:"",
    password:"",
    proposed:[],
    role:"user",
  }
  const newUser = parseObject(userTemplate,obj);
  if(id){
    newUser.id=id;
  }
  return newUser
}
