"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_schedule_1 = __importDefault(require("node-schedule"));
var index_1 = __importDefault(require("./scrapper/index"));
node_schedule_1.default.scheduleJob({ hour: 22, minute: 0 }, index_1.default);
