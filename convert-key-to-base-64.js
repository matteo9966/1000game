const {Buffer} = require('buffer');
const privateKey= `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtyXec0ttQXkHXq48yfsO
FcEj2mxd2PQDB8hyRIyghzLyUhirmSHbRJmMPypkQBmD1fiun+XY3GEGbFx/GDvm
qJouM0WbKZnvnbAiueP96pHnIScPMbGD3m3T5XcoUnfNzz2D0Df2dwPSC5R2qCwC
m83bOcucpXSrEDisMNB4rkHXko3wPf3eUpOlMPiU8WfPZsEVxEJ5b6Psnv544DJ2
Y6HAXtD18SERnwXcwuN4CpCmdao8l/JRYT/iWZyOQ5QFnJXS/7al0bfNDuBVV9rs
p9ziixZf+V4/OrlKsqI6w2kJYIBmFGR40tbGNJtCcM1Zc12NGr+1YXXvdAc7qMlI
aQIDAQAB
-----END PUBLIC KEY-----`
const buff = Buffer.from(privateKey).toString('base64');
console.log(buff);