
export const ROUTES = {
    health:`/health`,
    games:{
        base:'/games',
        insertGame:'/game',
        insertGoals:'/goals',
        insertProposedGoals:'/proposed-goals',
        insertUser:'/insert-user',
        upvoteGoal:'/upvote-goal'
    },
    users:{
        base:'/users',
        signupUser:'/signup-user',
        login:'/login',
        reachedGoal:'/reached-goal',
        changePassword:'/change-password',
        refresh:'/refresh/:id'   
    }
}