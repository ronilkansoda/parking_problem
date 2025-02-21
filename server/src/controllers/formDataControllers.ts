import { Request, Response } from 'express';
import db from '../utils/db'
import ComplaintForm from '../models/ComplaintFormModel';
import Complaint_Vehicle from '../models/Complain_Vehicle';
import VehicleDetails from '../models/VehicleDetailsModel';
import User from '../models/UserModel';
import axios from 'axios';
import dotenv from "dotenv";
import FormData from "form-data";
import fs from "fs";
import path from "path";
dotenv.config();


export const formData = async (req: Request, res: Response): Promise<void> => {
    const { email, vehicleNo, vehicleImage, complainDescription } = req.body;

    await db.sync({ alter: true });

    const confirmedUser = await User.findOne({
        where: { email: email }
    });

    if (!confirmedUser) {
        res.json({ error: "Email not found!!" });
        return;
    }

    for (const number of vehicleNo) {
        const vehicleNum = await VehicleDetails.findOne({
            where: { vehicleNo: number }
        });

        if (!vehicleNum) {
            res.json({ error: "Vehicle numbers are not correct" });
            return;
        }
    }

    const createComplain = await ComplaintForm.create({
        vehicleImage: vehicleImage,
        complainDescription: complainDescription,
        email: email
    });

    for (const number of vehicleNo) {
        await Complaint_Vehicle.create({
            complaintFormFid: createComplain.dataValues.fid,
            vehicleDetailVehicleNo: number
        });
    }

    res.json({ message: "Complaints Created successfully" });
};



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
                    complaintId: complaintNumber?.dataValues.fid,
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

// Function to send message with an image
const sendMessageToThread = async (message: string, imagePath?: string) => {
    try {
        const formData = new FormData();
        formData.append("content", message);

        if (imagePath) {
            const imageStream = fs.createReadStream(imagePath);
            formData.append("file", imageStream, path.basename(imagePath));
        }

        const response = await axios.post(
            `https://discord.com/api/v10/channels/${process.env.DISCORD_THREAD_ID}/messages`,
            formData,
            {
                headers: {
                    "Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                    ...formData.getHeaders(),
                },
            }
        );

        console.log("✅ Message sent to thread:", response.data);
    } catch (error: any) {
        console.error("❌ Error sending message:", error.response?.data || error.message);
    }
};

// API to handle warning messages
export const warningBot = async (req: Request, res: Response) => {
    const { description, date, time, vehicleDetails } = req.body;
    const imagePath = 'D:/CODE/7Span/Week 2/Parking Project/server/src/assets/img1.jpg'

    const vehicleInfo = vehicleDetails.map((vehicle: { vehicleNo: any; empName: any; empEmail: any; teamName: any; }) =>
        `- **Vehicle No:** ${vehicle.vehicleNo}\n  - **Employee Name:** ${vehicle.empName}\n  - **Employee Email:** ${vehicle.empEmail}\n  - **Team:** ${vehicle.teamName}`
    ).join("\n\n");

    const message = `🚨 **Warning Issued** 🚨  
    **Violation Detected!**  
    - **Reason:** Unauthorized parking in corporate premises  
    - **Suspension Duration:** 6 months  
    - **Action Required:** Contact administration immediately  

    **Complaint Details:**  
    - **Description:** ${description}  
    - **Date:** ${date}  
    - **Time:** ${time}  

    **Vehicle Details:**  
    ${vehicleInfo || "_No vehicle details available._"}  

    📸 **Attached Evidence:** (See below)`;

    await sendMessageToThread(message, imagePath);
    res.json({ success: true, message: "Warning sent to Discord thread with image!" });
};

export const suspensionBot = async (req: Request, res: Response) => {
    const { description, date, time, vehicleDetails } = req.body;
    const imagePath = 'D:/CODE/7Span/Week 2/Parking Project/server/src/assets/img2.jpg'

    const vehicleInfo = vehicleDetails.map((vehicle: { vehicleNo: any; empName: any; empEmail: any; teamName: any; }) =>
        `- **Vehicle No:** ${vehicle.vehicleNo}\n  - **Employee Name:** ${vehicle.empName}\n  - **Employee Email:** ${vehicle.empEmail}\n  - **Team:** ${vehicle.teamName}`
    ).join("\n\n");

    const message = `🚫 **Suspension Notice** 🚫  

⚠️ **This vehicle has been suspended for 6 months** due to unauthorized parking in a restricted corporate building.  

**Complaint Details:**  
- **Description:** ${description}  
- **Date:** ${date}  
- **Time:** ${time}  

**Vehicle Details:**  
${vehicleInfo || "_No vehicle details available._"}

  📸 **Attached Evidence:** (See below)
`;

    await sendMessageToThread(message, imagePath);
    res.json({ success: true, message: "Suspension notice sent to Discord thread!" });
};
