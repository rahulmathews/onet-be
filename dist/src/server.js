"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = process.env.PORT || 3000;
//Initialize Express app
const app = new app_1.App();
//Start Express Server
const server = app.Start(port)
    .then(port => console.log(`Server Listening on port ${port}`))
    .catch(error => {
    console.log(error);
    process.exit(1);
});
exports.default = server;
//# sourceMappingURL=server.js.map