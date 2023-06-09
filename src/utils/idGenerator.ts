export const idGenerator:()=>string = ()=>{
    return Math.random().toString(16).slice(2)
}