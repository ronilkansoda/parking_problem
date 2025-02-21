"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
const sequelize_1 = __importDefault(require("sequelize"));
const { DataTypes } = sequelize_1.default;
const User = db_1.default.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            myEmailValidator(value) {
                if (value === null) {
                    throw new Error("Please enter an email");
                }
            }
        }
    },
    password: {
        type: DataTypes.STRING
    },
}, {
    timestamps: false
});
// db.sync({ alter: true }).then(() => {
//     console.log("sync")
// });
exports.default = User;
