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

https://www.npmjs.com/package/kill-port
