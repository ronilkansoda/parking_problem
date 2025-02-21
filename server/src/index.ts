import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'

import formDataRoutes from './routes/formDataRoutes'
import db from './utils/db'
import User from './models/UserModel';
import VehicleDetails from './models/VehicleDetailsModel';
import './utils/associations'

dotenv.config()

const app = express()
app.use(cors({
    origin: '*',
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());
async function myConnection() {
    await db.authenticate()
    console.log('Connection Successfull')
}
myConnection()

app.use('/form', formDataRoutes)


const createUser = async () => {
    try {
        await db.sync({ alter: true })
        console.log("Database synced successfully");

    } catch (error) {
        console.error("Error syncing database:", error);
    }
}
createUser()
app.listen(3000, () => {
    console.log(`Server is running on 3000`);
});


// const users = await User.bulkCreate([
//     {
//         username: 'ronil',
//         email: 'r@gmail.com',
//         password: 'rk@123',
//     },
//     {
//         username: 'omil',
//         email: 'o@gmail.com',
//         password: 'ok@123',
//     },
//     {
//         username: 'alex',
//         email: 'alex@gmail.com',
//         password: 'alex@123',
//     },
//     {
//         username: 'john',
//         email: 'john@gmail.com',
//         password: 'john@123',
//     },
//     {
//         username: 'emma',
//         email: 'emma@gmail.com',
//         password: 'emma@123',
//     },
//     {
//         username: 'mike',
//         email: 'mike@gmail.com',
//         password: 'mike@123',
//     },
//     {
//         username: 'sophia',
//         email: 'sophia@gmail.com',
//         password: 'sophia@123',
//     },
//     {
//         username: 'david',
//         email: 'david@gmail.com',
//         password: 'david@123',
//     },
//     {
//         username: 'lisa',
//         email: 'lisa@gmail.com',
//         password: 'lisa@123',
//     },
//     {
//         username: 'mark',
//         email: 'mark@gmail.com',
//         password: 'mark@123',
//     }
// ]);

// console.log("Users inserted successfully:", users);


// const parkingData = await VehicleDetails.bulkCreate([
//     { vehicleNo: 1001, empName: 'Ronil', empEmail: 'ronil@gmail.com', teamName: 'AIR' },
//     { vehicleNo: 1002, empName: 'Alex', empEmail: 'alex@gmail.com', teamName: 'Neo' },
//     { vehicleNo: 1003, empName: 'John', empEmail: 'john@gmail.com', teamName: 'Hex' },
//     { vehicleNo: 1004, empName: 'Emma', empEmail: 'emma@gmail.com', teamName: 'Prism' },
//     { vehicleNo: 1005, empName: 'Mike', empEmail: 'mike@gmail.com', teamName: 'Dash' },
//     { vehicleNo: 1006, empName: 'Sophia', empEmail: 'sophia@gmail.com', teamName: 'Fusion' },
//     { vehicleNo: 1007, empName: 'David', empEmail: 'david@gmail.com', teamName: 'Flex' },
//     { vehicleNo: 1008, empName: 'Lisa', empEmail: 'lisa@gmail.com', teamName: 'Elite' },
//     { vehicleNo: 1009, empName: 'Mark', empEmail: 'mark@gmail.com', teamName: 'Ark' },
//     { vehicleNo: 1010, empName: 'Ethan', empEmail: 'ethan@gmail.com', teamName: 'Phoenix' },
//     { vehicleNo: 1011, empName: 'Olivia', empEmail: 'olivia@gmail.com', teamName: 'Nexus' },
//     { vehicleNo: 1012, empName: 'Liam', empEmail: 'liam@gmail.com', teamName: 'Cortex' },
//     { vehicleNo: 1013, empName: 'Ava', empEmail: 'ava@gmail.com', teamName: 'Hive' },
//     { vehicleNo: 1014, empName: 'Noah', empEmail: 'noah@gmail.com', teamName: 'Quant' },
//     { vehicleNo: 1015, empName: 'Mia', empEmail: 'mia@gmail.com', teamName: 'Vibe' },
//     { vehicleNo: 1016, empName: 'Benjamin', empEmail: 'benjamin@gmail.com', teamName: 'Cosmos' },
//     { vehicleNo: 1017, empName: 'Isabella', empEmail: 'isabella@gmail.com', teamName: 'Strike' },
//     { vehicleNo: 1018, empName: 'William', empEmail: 'william@gmail.com', teamName: 'Bolt' },
//     { vehicleNo: 1019, empName: 'Charlotte', empEmail: 'charlotte@gmail.com', teamName: 'Beam' },
//     { vehicleNo: 1020, empName: 'James', empEmail: 'james@gmail.com', teamName: 'Zap' },
// ]);

// console.log("Parking data inserted successfully:", parkingData);