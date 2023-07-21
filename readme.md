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