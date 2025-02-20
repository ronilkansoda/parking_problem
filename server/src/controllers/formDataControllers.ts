import { Request, Response } from 'express';
import db from '../utils/db'
import ComplaintForm from '../models/ComplaintFormModel';
import Complaint_Vehicle from '../models/Complain_Vehicle';
import VehicleDetails from '../models/VehicleDetailsModel';
import User from '../models/UserModel';

export const formData = async (req: Request, res: Response) => {
    const { vehicleNo, vehicleImage, complainDescription, email } = req.body
    const { id } = req.params;

    await db.sync({ alter: true });
    const createComplain = await ComplaintForm.create({
        vehicleNo: vehicleNo,
        vehicleImage: vehicleImage,
        complainDescription: complainDescription,
        email: email  
    })

    const vehicleNum = await VehicleDetails.findOne({
        where: { vehicleNo: createComplain.dataValues.vehicleNo }
    })
    if (vehicleNum) {
        await Complaint_Vehicle.create({
            complaintFormFid: createComplain.dataValues.fid,
            vehicleDetailVehicleNo: vehicleNum.dataValues.vehicleNo
        })
    }
    else {
        res.json({ error: "Vehicle Number is Wronge" })
    }

    res.json(createComplain)
}


export const allComplaints = async (req: Request, res: Response) => {
    const allCom = await Complaint_Vehicle.findAll();
    const allComplaints: Object = {}

    const complaintData = await Promise.all(
        allCom.map(async (complaint) => {
            const vehicleNum = await VehicleDetails.findOne({
                where: { vehicleNo: complaint.dataValues.vehicleDetailVehicleNo }
            })

            const complaintNumber = await ComplaintForm.findOne({
                where: { fid: complaint.dataValues.complaintFormFid }
            })

            const UserId = await User.findOne({
                where: { email: complaintNumber?.dataValues.email }
            })
            return {
                userName: UserId?.dataValues.username,
                userEmail: UserId?.dataValues.email,

                complaintId: complaintNumber?.dataValues.fid,
                vehicleImage: complaintNumber?.dataValues.vehicleImage,
                complainDescription: complaintNumber?.dataValues.complainDescription,
                createdAt: complaintNumber?.dataValues.createdAt,

                vehicleNo: vehicleNum?.dataValues.vehicleNo,
                empName: vehicleNum?.dataValues.empName,
                empEmail: vehicleNum?.dataValues.empEmail,
                teamName: vehicleNum?.dataValues.teamName
            };
        })
    )

    res.json({ complaints: complaintData })
}

