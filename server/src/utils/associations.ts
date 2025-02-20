import User from "../models/UserModel";
import ComplaintForm from "../models/ComplaintFormModel";
import VehicleDetails from "../models/VehicleDetailsModel";
import Complaint_Vehicle from "../models/Complain_Vehicle";

User.hasMany(ComplaintForm, { foreignKey: 'email', as: 'complaintForm' })
ComplaintForm.belongsTo(User, { foreignKey: 'email', as: 'user' })

VehicleDetails.belongsToMany(ComplaintForm, { through: Complaint_Vehicle })
ComplaintForm.belongsToMany(VehicleDetails, { through: Complaint_Vehicle })