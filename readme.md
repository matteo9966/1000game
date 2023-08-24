# 1000 goals home page api

# start in development

# run the debugger
inside .vscode:
- create the launch.json file 
- create the tasks.json file

### launch.json
`
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug app",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/build/src/index.js",
            "outFiles": [
                "${workspaceFolder}/build/**/*.js"
            ],
            "preLaunchTask": "tsc: watch - tsconfig.json"
        }
    ]
}
`

### tasks.json
`
{
	"version": "2.0.0",
	"tasks": [
		{
			"type": "typescript",
			"tsconfig": "tsconfig.json",
			"option": "watch",
			"isBackground": true,
			"problemMatcher": [
				"$tsc-watch"
			],
			"group": {
				"kind": "build",
				"isDefault": true
			},
			"label": "tsc: watch - tsconfig.json"
		}
	]
}
`
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!! use powershell as the default shell for debugging !!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

source ~/.nvm/nvm.sh



|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 when adding the private and public key use the utility 
 convert-key-to-base-64.js to convert the generated public key to a base 64 version
 |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||


 # FIRESTORE 

 - install these dependencies: 
  `npm i firebase-admin`
  `npm i firebase`

  follow this guide to setup the sdk for the firestore admin on nodejs server
  https://firebase.google.com/docs/admin/setup#initialize-sdk

  you can generate the private key inside 
  firestore => project settings => service account => generate private key

  emulators: 
  follow the emulators guide on firebase, to setup the connection between project and emulator 
  follow this guide

# => before you start the emulators, in the CLI run `firebase use` in your working directory
   

  https://firebase.google.com/docs/emulator-suite/connect_firestore

since i'm not using the google cloud environment i must set the project id inside the code

`admin.initializeApp({ projectId: "your-project-id" });`


# testing 
### ATTENTION !!! 
in order to test you need to setup the firestore emulators
once you start the firestore emulators you can run the tests!

If there is something running on the pors 10000 and 8080 you could kill the 
processes using 
npx kill-port --port 10000

USE NODE V 20

https://www.npmjs.com/package/kill-port

# TESTS
some tests that run using firebase
`
 insertGameController
    ✔ should throw if user already created a game
    ✔ should populate res.locals.payload and res.locals.authorizationPayload and call next if successfull

  insertProposedGoalsController
    ✔ should throw if missing goals or gameId or userid properties
    ✔ should not throw if trying to insert no goal, just a response 200
    ✔ should add proposed goal given an array of goals in the body request

  upvoteGoalController
    ✔ should throw if user is not part of game
    ✔ should throw if user created the goal and tries to vote for it
    ✔ should append goal to goals if the voters are at least 50% of the players
    removing the vote from an upvoted proposedGoal
      ✔ should remove the username from the votedBy array

  insertReachedGoalController Test
    ✔ should throw a customServer error if missing goalId name or gameId in body
    ✔ should throw if no game with provide id
    valid gameId
      ✔ should throw if no user with provided username
        ✔ should clear the firestore database and there should not be any data (415ms)
      insertUser
in test:
        ✔ should add a user to the firestore databae and there should be only one user in the Users collection (76ms)
        ✔ should return false if trying to insert a user with a username that already exists (99ms)
      addGameIdToUser
CLEARED DB : , true
        ✔ should update a user with a game id (82ms)
        ✔ should not update a username that does not exist
      addGoalIdToUser
        ✔ should add a goalId to an existing user (75ms)
        ✔ should return false if there is no user with the id
      removeGoalFromUser
        ✔ should remove the goal from a user that exists and has the goalId (54ms)
        ✔ should return false if trying to remove a goal from a non existing user
        ✔ should return the user unchanged if the user does not contain the goalId (72ms)
      changeUserPassword
        ✔ should update the users password (60ms)
        ✔ should return false if the user is not in the db
      removeTempPassword
        ✔ should remove the tempPassword of a user (69ms)
        ✔ should return false if the user does not exist
      getUser
        ✔ should return a user if it exists
        ✔ should return null if no user with username
    FirestoreGameModel
      insertGame
        ✔ should insert a game and return true if inserted (45ms)
        ✔ should not insert a game if there is a game with the same id
        Insert game with goals
          ✔ should insert the goals in a sub collection inside the game (71ms)
      appendGoals
        ✔ should append a goal to an existing game (59ms)
        ✔ should not append goal if the game does not exist
      appendProposedGoals
        ✔ should append a proposed goal to an existing game (47ms)
        ✔ should not append a goal to a non existing game
      getGameById
        ✔ should return a game that exists
        ✔ should not return anything if the game does
      getGameByIdLookupPlayers
        ✔ should return a game with looked up users based on their id (116ms)
        ✔ should return the game with an empty array if there are no corresponding users to the username (85ms)
        ✔ should return null if there is no game with the provided id
        ✔ should return the looked up players without the password property (114ms)
      insertPlayer
        ✔ should insert a player in an existing game and return true (54ms)
        ✔ should not insert a player if game does not exist and return false
      upvoteProposedGoal
        ✔ should add username to votedBy list in the game if game exists and proposed goal exists (57ms)
        ✔ should not add username to votedBy if there is no proposedGoal (46ms)
        ✔ should not add username to votedBy if there is no game
      deleteProposedGoalByGoalId
        ✔ should delete a proposed goal from the proposed goal collection (81ms)
        ✔ should return false if there is no game with provided id
      removeUsernameFromProposedGoalUserUpvoteList
        ✔ should remove the username from votedBy list if game and collection exists (84ms)
        ✔ should return false if there is no game with provided id

  addAccessTokenMiddleware
    ✔ should add a token to the request header
  insert-game-route
    ✔ should add a session token when making a request to insert-game

  login route
hello!!!
    ✔ should return 200 and a token

  createJWT
    ✔ should return a token
    ✔ should return null if no private key

  verifyJWT
    ✔ should return null if there is no public key
    ✔ should return the payload if the token is valid

  reachedVoteThreshold
    ✔ should return false if there is only one player
    ✔ should return true if there are 2 players and 1 voted
    ✔ should return false if there are 3 players and only one voted
    ✔ should return true if there are 4 players and 2  voted
    ✔ should return true if there are 5 players and 2  voted
    ✔ should return true if there are 6 players and 3 voted
    ✔ should return true if there are 6 players and 2 voted

  valdiateProposedGoal
    ✔ should return true if goal has valid points and a valid name
    ✔ should return false if user tries adding " of \ or // 
    ✔ should return true if it has a valid description
    ✔ should return false if it has a invalid description

  validateUsername
    ✔ should return null if it is a valid username
    ✔ should return error object if provide username with spaces

`