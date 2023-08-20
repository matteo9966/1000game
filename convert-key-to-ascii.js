const {Buffer} = require('buffer');
const key = Buffer.from('LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2U29tZU1vcmVDaGFyYWN0ZXJIZXJlcnBsdz09Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K' , 'base64').toString('ascii');

console.log(key)