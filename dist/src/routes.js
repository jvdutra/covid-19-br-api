"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var CovidController_1 = __importDefault(require("./controllers/CovidController"));
var routes = express_1.default.Router();
var covidController = new CovidController_1.default();
routes.get('/get', covidController.index);
routes.get('/get/:uf', covidController.show);
exports.default = routes;
