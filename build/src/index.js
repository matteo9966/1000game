"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./config/environment");
const DB_1 = require("./db/DB");
const config_server_1 = require("./server/config-server");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 6000;
function main() {
    const initialized = (0, DB_1.initDB)();
    const app = (0, config_server_1.configServer)();
    if (!app) {
        process.exit(1);
    }
    const server = app.listen(port, () => {
        var _a;
        console.log(`Listening on port ${(_a = server === null || server === void 0 ? void 0 : server.address()) === null || _a === void 0 ? void 0 : _a.port}`);
        console.log(`Basepath: ${environment_1.environment.basepath}`);
        console.log(`DBName: ${environment_1.environment.dbname}`);
        console.log(`env: ${environment_1.environment.env}`);
        console.log(`__dirname: ${__dirname}`);
        console.log(`__filename: ${__filename}`);
    });
}
main();
//# sourceMappingURL=index.js.map