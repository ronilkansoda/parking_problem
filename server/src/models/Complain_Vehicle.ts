import db from '../utils/db'
import Sequelize, { where } from "sequelize";
const { DataTypes } = Sequelize

const Complaint_Vehicle = db.define('com_vehicle', {
}, {
    timestamps: false
})


export default Complaint_Vehicle