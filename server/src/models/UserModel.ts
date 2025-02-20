import db from '../utils/db'
import Sequelize, { where } from "sequelize";
const { DataTypes } = Sequelize
const User = db.define('user', {
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
            myEmailValidator(value: string) {
                if (value === null) {
                    throw new Error("Please enter an email")
                }
            }
        }
    },
    password: {
        type: DataTypes.STRING
    },
}, {
    timestamps: false
})
// db.sync({ alter: true }).then(() => {
//     console.log("sync")
// });

export default User