import db from '../utils/db'
import Sequelize from "sequelize";
const { DataTypes, } = Sequelize

const VehicleDetails = db.define('vehicleDetail', {
    vehicleNo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    empName: {
        type: DataTypes.STRING
    },
    empEmail: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            myEmailValidator(value: string) {
                if (value === null) {
                    throw new Error("Please enter an email")
                }
            }
        }
    },
    teamName: {
        type: DataTypes.STRING
    },
}, {
    timestamps: false
})

// db.sync({ alter: true }).then(() => {
//     console.log("sync")
// });

export default VehicleDetails