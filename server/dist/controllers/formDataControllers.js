"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suspensionBot = exports.warningBot = exports.allComplaints = exports.formData = void 0;
const db_1 = __importDefault(require("../utils/db"));
const ComplaintFormModel_1 = __importDefault(require("../models/ComplaintFormModel"));
const Complain_Vehicle_1 = __importDefault(require("../models/Complain_Vehicle"));
const VehicleDetailsModel_1 = __importDefault(require("../models/VehicleDetailsModel"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const formData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, vehicleNo, vehicleImage, complainDescription } = req.body;
    yield db_1.default.sync({ alter: true });
    const confirmedUser = yield UserModel_1.default.findOne({
        where: { email: email }
    });
    if (!confirmedUser) {
        res.json({ error: "Email not found!!" });
        return;
    }
    for (const number of vehicleNo) {
        const vehicleNum = yield VehicleDetailsModel_1.default.findOne({
            where: { vehicleNo: number }
        });
        if (!vehicleNum) {
            res.json({ error: "Vehicle numbers are not correct" });
            return;
        }
    }
    const createComplain = yield ComplaintFormModel_1.default.create({
        vehicleImage: vehicleImage,
        complainDescription: complainDescription,
        email: email
    });
    for (const number of vehicleNo) {
        yield Complain_Vehicle_1.default.create({
            complaintFormFid: createComplain.dataValues.fid,
            vehicleDetailVehicleNo: number
        });
    }
    res.json({ message: "Complaints Created successfully" });
});
exports.formData = formData;
const allComplaints = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const allCom = yield Complain_Vehicle_1.default.findAll();
    const groupedComplaints = yield Promise.all(allCom.map((complaint) => __awaiter(void 0, void 0, void 0, function* () {
        const complaintId = complaint.dataValues.complaintFormFid;
        const complaintNumber = yield ComplaintFormModel_1.default.findOne({
            where: { fid: complaintId }
        });
        const UserId = yield UserModel_1.default.findOne({
            where: { email: complaintNumber === null || complaintNumber === void 0 ? void 0 : complaintNumber.dataValues.email }
        });
        const vehicleDetails = yield Promise.all(allCom
            .filter(c => c.dataValues.complaintFormFid === complaintId)
            .map((c) => __awaiter(void 0, void 0, void 0, function* () {
            return yield VehicleDetailsModel_1.default.findOne({
                where: { vehicleNo: c.dataValues.vehicleDetailVehicleNo }
            });
        })));
        console.log("------" + vehicleDetails.filter(Boolean) + "------");
        return {
            complaintId: complaintId,
            details: {
                userName: UserId === null || UserId === void 0 ? void 0 : UserId.dataValues.username,
                userEmail: UserId === null || UserId === void 0 ? void 0 : UserId.dataValues.email,
                complaintId: complaintNumber === null || complaintNumber === void 0 ? void 0 : complaintNumber.dataValues.fid,
                vehicleImage: complaintNumber === null || complaintNumber === void 0 ? void 0 : complaintNumber.dataValues.vehicleImage,
                complainDescription: complaintNumber === null || complaintNumber === void 0 ? void 0 : complaintNumber.dataValues.complainDescription,
                createdAt: complaintNumber === null || complaintNumber === void 0 ? void 0 : complaintNumber.dataValues.createdAt,
            },
            vehicleDetails: vehicleDetails.filter(Boolean)
        };
    })));
    const response = Object.values(groupedComplaints.reduce((acc, complaint) => {
        acc[complaint.complaintId] = Object.assign(Object.assign({}, complaint.details), { vehicleDetails: complaint.vehicleDetails });
        return acc;
    }, {}));
    res.json(response);
});
exports.allComplaints = allComplaints;
// Function to send message with an image
const sendMessageToThread = (message, imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const formData = new form_data_1.default();
        formData.append("content", message);
        if (imagePath) {
            const imageStream = fs_1.default.createReadStream(imagePath);
            formData.append("file", imageStream, path_1.default.basename(imagePath));
        }
        const response = yield axios_1.default.post(`https://discord.com/api/v10/channels/${process.env.DISCORD_THREAD_ID}/messages`, formData, {
            headers: Object.assign({ "Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}` }, formData.getHeaders()),
        });
        console.log("✅ Message sent to thread:", response.data);
    }
    catch (error) {
        console.error("❌ Error sending message:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
    }
});
// API to handle warning messages
const warningBot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, date, time, vehicleDetails } = req.body;
    const imagePath = 'D:/CODE/7Span/Week 2/Parking Project/server/src/assets/img1.jpg';
    const vehicleInfo = vehicleDetails.map((vehicle) => `- **Vehicle No:** ${vehicle.vehicleNo}\n  - **Employee Name:** ${vehicle.empName}\n  - **Employee Email:** ${vehicle.empEmail}\n  - **Team:** ${vehicle.teamName}`).join("\n\n");
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
    yield sendMessageToThread(message, imagePath);
    res.json({ success: true, message: "Warning sent to Discord thread with image!" });
});
exports.warningBot = warningBot;
const suspensionBot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, date, time, vehicleDetails } = req.body;
    const imagePath = 'D:/CODE/7Span/Week 2/Parking Project/server/src/assets/img2.jpg';
    const vehicleInfo = vehicleDetails.map((vehicle) => `- **Vehicle No:** ${vehicle.vehicleNo}\n  - **Employee Name:** ${vehicle.empName}\n  - **Employee Email:** ${vehicle.empEmail}\n  - **Team:** ${vehicle.teamName}`).join("\n\n");
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
    yield sendMessageToThread(message, imagePath);
    res.json({ success: true, message: "Suspension notice sent to Discord thread!" });
});
exports.suspensionBot = suspensionBot;
