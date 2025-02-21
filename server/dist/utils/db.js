"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('parking_problem', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306
});
exports.default = sequelize;
