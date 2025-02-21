"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
const sequelize_1 = __importDefault(require("sequelize"));
const { DataTypes } = sequelize_1.default;
const Complaint_Vehicle = db_1.default.define('com_vehicle', {}, {
    timestamps: false
});
exports.default = Complaint_Vehicle;
