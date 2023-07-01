//same as lodash omit

//type Omit<T, K extends string | number | symbol> = { [P in Exclude<keyof T, K>]: T[P]; }

// export function omit<T extends Record<string,string>,K extends keyof T>(obj:T ,key:K):{[P in Exclude<keyof T,K>]:T[P]}{

// }

// export const omit: <T extends Record<string, string>,K extends string >(
//   obj: T,
//   key: K[] | K
// ) => {[P in Exclude<keyof T, K>]: T[P]} = <
//   T extends Record<string, string>,
  
// >(
//   obj: T,
//   key: string[] | string
// ) => {
//   let keys: string[];
//   let filteredObj:{[P in Exclude<keyof T,string>]:T[P]}
//   if (!Array.isArray(key)) {
//     keys = [key];
//   }else{
//     keys = key
//   }

//   for(let [key,value] of Object.entries(obj)){
//     if(keys.includes(key))
//   }

//   return obj;
// };
