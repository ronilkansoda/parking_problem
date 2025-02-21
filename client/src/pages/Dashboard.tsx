import { useState, useEffect } from "react";
import ComplaintCard from "../components/ComplaintCard";
import img1 from '../assets/img1.jpg'

interface Complaint {
    id: number;
    complaintId: number;
    image: string;
    description: string;
    date: string;
    time: string;
    userName: string;
    userEmail: string;
    vehicleDetails: { vehicleNo: number; empName: string; empEmail: string; teamName: string }[];
}

export default function Dashboard() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch("http://localhost:3000/form/allComplaints"); // Adjust URL
                const data = await response.json();
                console.log(data)
                // Transform API response to match UI structure
                const formattedComplaints = data.map((item: any, index: number) => ({
                    id: index + 1,
                    complaintId: item.complaintId,
                    image: item.vehicleImage,
                    description: item.complainDescription,
                    date: new Date(item.createdAt).toISOString().split("T")[0],
                    time: new Date(item.createdAt).toLocaleTimeString(),
                    userName: item.userName,
                    userEmail: item.userEmail,
                    vehicleDetails: item.vehicleDetails || [],
                }));

                setComplaints(formattedComplaints);
            } catch (error) {
                console.error("Error fetching complaints:", error);
            }
        };

        fetchComplaints();
    }, []);

    const sendWarning = async (complaint: Complaint) => {
        try {
            const response = await fetch("http://localhost:3000/form/warningBot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: complaint.userName,
                    userEmail: complaint.userEmail,
                    description: complaint.description,
                    date: complaint.date,
                    time: complaint.time,
                    vehicleDetails: complaint.vehicleDetails,
                }),
            });
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Error sending warning:", error);
        }
    }
    const sendSuspension = async (complaint: Complaint) => {
        try {
            const response = await fetch("http://localhost:3000/form/suspensionBot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: complaint.userName,
                    userEmail: complaint.userEmail,
                    description: complaint.description,
                    date: complaint.date,
                    time: complaint.time,
                    vehicleDetails: complaint.vehicleDetails,
                }),
            });
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Error sending suspension:", error);
        }
    };


    // Filter complaints based on selected date range
    const filteredComplaints = complaints.filter((complaint) => {
        if (!startDate || !endDate) return true;
        return complaint.date >= startDate && complaint.date <= endDate;
    });

    return (
        <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold text-[#B30000] mb-6 text-center">
                🚗 Complaint Dashboard
            </h1>

            {/* Responsive Filter Section */}
            <div className="bg-white p-4 rounded-xl shadow-md flex flex-col md:flex-row md:items-center gap-4 mb-6 border border-[#FA5651]">
                <div className="flex flex-col w-full md:w-auto">
                    <label className="text-gray-700 font-medium text-sm md:text-base">Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-[#FA5651] p-2 rounded-lg focus:ring-2 focus:ring-[#FA5651] outline-none w-full md:w-auto text-sm md:text-base"
                    />
                </div>
                <div className="flex flex-col w-full md:w-auto">
                    <label className="text-gray-700 font-medium text-sm md:text-base">End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-[#FA5651] p-2 rounded-lg focus:ring-2 focus:ring-[#FA5651] outline-none w-full md:w-auto text-sm md:text-base"
                    />
                </div>
            </div>

            {/* Responsive Grid for Complaints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((complaint) => (
                        <ComplaintCard
                            key={complaint.id}
                            {...complaint}
                            onClick={() => setSelectedComplaint(complaint)}
                        />
                    ))
                ) : (
                    <p className="text-gray-600 text-center text-sm md:text-base">
                        No complaints found in the selected date range.
                    </p>
                )}
            </div>

            {/* Complaint Details Modal */}
            {selectedComplaint && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-lg md:max-w-2xl">
                        <h2 className="text-lg md:text-xl font-bold text-[#B30000] text-center">Complaint Details</h2>
                        <img
                            src={img1}
                            alt="Complaint"
                            className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                        <p className="text-sm md:text-base"><strong>User Name:</strong> {selectedComplaint.userName}</p>
                        <p className="text-sm md:text-base"><strong>Email:</strong> {selectedComplaint.userEmail}</p>
                        <p className="text-sm md:text-base"><strong>Description:</strong> {selectedComplaint.description}</p>
                        <p className="text-sm md:text-base"><strong>Date:</strong> {selectedComplaint.date}</p>
                        <p className="text-sm md:text-base"><strong>Time:</strong> {selectedComplaint.time}</p>

                        <h3 className="mt-4 font-bold text-sm md:text-base">Vehicle Details:</h3>
                        {selectedComplaint.vehicleDetails.length > 0 ? (
                            selectedComplaint.vehicleDetails.map((vehicle, index) => (
                                <div key={index} className="border border-gray-200 p-2 rounded-lg my-2 text-sm md:text-base">
                                    <p><strong>Vehicle No:</strong> {vehicle.vehicleNo}</p>
                                    <p><strong>Employee Name:</strong> {vehicle.empName}</p>
                                    <p><strong>Employee Email:</strong> {vehicle.empEmail}</p>
                                    <p><strong>Team:</strong> {vehicle.teamName}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm md:text-base">No vehicle details available.</p>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4 mt-4">
                            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full" onClick={() => sendWarning(selectedComplaint)}>
                                ⚠️ Warning
                            </button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full" onClick={() => sendSuspension(selectedComplaint)}>
                                🚫 Suspend
                            </button>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full" onClick={() => setSelectedComplaint(null)}>
                                ❌ Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
