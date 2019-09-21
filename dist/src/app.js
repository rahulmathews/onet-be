"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
class App {
    constructor() {
        //Method to start the express app
        this.Start = (port) => {
            return new Promise((resolve, reject) => {
                this.app.listen(port, () => {
                    resolve(port);
                })
                    .on('error', (err) => reject(err));
            });
        };
        try {
            //Main Express App Module
            this.app = express_1.default();
            //Third Party middlewares
            this.app.use(express_1.default.json());
            this.app.use(express_1.default.urlencoded({ extended: false }));
            //Initialize Router 
            this.app.use('/', routes_1.default);
        }
        catch (err) {
            throw err;
        }
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map