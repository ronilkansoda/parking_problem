import { Request, Response } from 'express';
import db from '../utils/db'
import ComplaintForm from '../models/ComplaintFormModel';
import Complaint_Vehicle from '../models/Complain_Vehicle';
import VehicleDetails from '../models/VehicleDetailsModel';
import User from '../models/UserModel';

export const formData = async (req: Request, res: Response) => {
    const { email, vehicleNo, vehicleImage, complainDescription } = req.body

    await db.sync({ alter: true });
    const createComplain = await ComplaintForm.create({
        vehicleImage: vehicleImage,
        complainDescription: complainDescription,
        email: email
    })

    vehicleNo.map(async (number: any) => {
        const vehicleNum = await VehicleDetails.findOne({
            where: { vehicleNo: number }
        })
        if (!vehicleNum) res.json({ error: "Vehicle numbers are not correct" })
    })

    vehicleNo.map(async (number: any) => {
        await Complaint_Vehicle.create({
            complaintFormFid: createComplain.dataValues.fid,
            vehicleDetailVehicleNo: number
        })
    })


    res.json(createComplain)
}


export const allComplaints = async (req: Request, res: Response) => {
    // const allCom = await Complaint_Vehicle.findAll();

    // const allComplaints: Object = {}
    // const complaintData = await Promise.all(
    //     allCom.map(async (complaint) => {
    //         const vehicleNum = await VehicleDetails.findOne({
    //             where: { vehicleNo: complaint.dataValues.vehicleDetailVehicleNo }
    //         })

    //         const complaintNumber = await ComplaintForm.findOne({
    //             where: { fid: complaint.dataValues.complaintFormFid }
    //         })

    //         const UserId = await User.findOne({
    //             where: { email: complaintNumber?.dataValues.email }
    //         })

    //         return {
    //             userName: UserId?.dataValues.username,
    //             userEmail: UserId?.dataValues.email,

    //             complaintId: complaintNumber?.dataValues.fid,
    //             vehicleImage: complaintNumber?.dataValues.vehicleImage,
    //             complainDescription: complaintNumber?.dataValues.complainDescription,
    //             createdAt: complaintNumber?.dataValues.createdAt,

    //             vehicleNo: vehicleNum?.dataValues.vehicleNo,
    //             empName: vehicleNum?.dataValues.empName,
    //             empEmail: vehicleNum?.dataValues.empEmail,
    //             teamName: vehicleNum?.dataValues.teamName
    //         };
    //     })
    // )
    // let complaintId
    // let vehicleId
    // const groupedComplaints = allCom.reduce((acc, complaint) => {
    //     complaintId = complaint.dataValues.complaintFormFid;
    //     vehicleId = complaint.dataValues.vehicleDetailVehicleNo;

    //     if (!acc[complaintId]) {
    //         acc[complaintId] = {
    //             complaintId,
    //             vehicleDetails: []
    //         };
    //     }

    //     if (vehicleId) {
    //         acc[complaintId].vehicleDetails.push(vehicleId);
    //     }

    //     return acc;
    // }, {} as Record<number, { complaintId: number; vehicleDetails: number[] }>);

    // // Convert object to array format
    // const response = Object.values(groupedComplaints);

    // res.json({ complaints: response });

    // let list: Array<{ vehicleDetails: any }> = [];
    // let finalRes: Array<{ vehicleDetails: any }> = [];
    // response.map(async (complaint) => {

    //     const complaintNumber = await ComplaintForm.findOne({
    //         where: { fid: complaint.complaintId }
    //     })
    //     const UserId = await User.findOne({
    //         where: { email: complaintNumber?.dataValues.email }
    //     })


    //     // Fetch all vehicle details concurrently
    //     const vehicleDetails = await Promise.all(
    //         complaint.vehicleDetails.map(async (number) => {
    //             return await VehicleDetails.findOne({
    //                 where: { vehicleNo: number }
    //             });
    //         })
    //     );

    //     // Store the fetched objects in `list`
    //     list = vehicleDetails.filter(Boolean).map((vehicle) => ({
    //         vehicleDetails: vehicle
    //     }));
    //     // finalRes = finalRes.concat(list); 
    //     finalRes.push(...list);  // Spread operator to append objects


    //     // console.log({ list })

    // })

    const allCom = await Complaint_Vehicle.findAll();

    const groupedComplaints = await Promise.all(
        allCom.map(async (complaint) => {
            const complaintId = complaint.dataValues.complaintFormFid;

            const complaintNumber = await ComplaintForm.findOne({
                where: { fid: complaintId }
            });

            const UserId = await User.findOne({
                where: { email: complaintNumber?.dataValues.email }
            });

            const vehicleDetails = await Promise.all(
                allCom
                    .filter(c => c.dataValues.complaintFormFid === complaintId)
                    .map(async (c) => {
                        return await VehicleDetails.findOne({
                            where: { vehicleNo: c.dataValues.vehicleDetailVehicleNo }
                        });
                    })
            );
            console.log("------" + vehicleDetails.filter(Boolean) + "------")
            return {
                complaintId: complaintId,
                details: {
                    userName: UserId?.dataValues.username,
                    userEmail: UserId?.dataValues.email,
                    vehicleImage: complaintNumber?.dataValues.vehicleImage,
                    complainDescription: complaintNumber?.dataValues.complainDescription,
                    createdAt: complaintNumber?.dataValues.createdAt,
                },
                vehicleDetails: vehicleDetails.filter(Boolean)
            };
        })
    );


    const response = Object.values(groupedComplaints.reduce((acc: any, complaint) => {
        acc[complaint.complaintId] = {
            ...complaint.details,
            vehicleDetails: complaint.vehicleDetails
        };
        return acc;
    }, {}));


    res.json(response);

}

