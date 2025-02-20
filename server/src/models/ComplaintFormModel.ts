import db from '../utils/db'
import Sequelize, { where } from "sequelize";
const { DataTypes } = Sequelize

const ComplaintForm = db.define('complaintForm', {
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
})

// db.sync({ alter: true }).then(() => {
//     console.log("sync")
// });

export default ComplaintForm