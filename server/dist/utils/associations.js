"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../models/UserModel"));
const ComplaintFormModel_1 = __importDefault(require("../models/ComplaintFormModel"));
const VehicleDetailsModel_1 = __importDefault(require("../models/VehicleDetailsModel"));
const Complain_Vehicle_1 = __importDefault(require("../models/Complain_Vehicle"));
UserModel_1.default.hasMany(ComplaintFormModel_1.default, { foreignKey: 'email', as: 'complaintForm' });
ComplaintFormModel_1.default.belongsTo(UserModel_1.default, { foreignKey: 'email', as: 'user' });
VehicleDetailsModel_1.default.belongsToMany(ComplaintFormModel_1.default, { through: Complain_Vehicle_1.default });
ComplaintFormModel_1.default.belongsToMany(VehicleDetailsModel_1.default, { through: Complain_Vehicle_1.default });
