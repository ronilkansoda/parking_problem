"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
const sequelize_1 = __importDefault(require("sequelize"));
const { DataTypes } = sequelize_1.default;
const ComplaintForm = db_1.default.define('complaintForm', {
    fid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // vehicleNo: {
    //     type: DataTypes.ARRAY,
    // },
    vehicleImage: {
        type: DataTypes.STRING
    },
    complainDescription: {
        type: DataTypes.STRING
    },
}, {
    timestamps: true
});
// db.sync({ alter: true }).then(() => {
//     console.log("sync")
// });
exports.default = ComplaintForm;
