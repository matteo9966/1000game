export function reachedVoteThreshold(totalplayers:number,voters:number){
    if(totalplayers<=0 || voters<=0) return false
    const total = Math.round(voters/totalplayers*100);
    if(total>50){
        return true
    }
    return false
}