"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_server_1 = require("./server/config-server");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 6000;
function main() {
    const app = (0, config_server_1.configServer)();
    if (!app) {
        process.exit(1);
    }
    const server = app.listen(port, () => { var _a; console.log(`Listening on port ${(_a = server === null || server === void 0 ? void 0 : server.address()) === null || _a === void 0 ? void 0 : _a.port}`); });
}
main();
//# sourceMappingURL=index.js.map