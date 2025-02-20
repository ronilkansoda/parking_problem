import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Form() {
    const [vehicleNo, setParkingNumbers] = useState<string[]>([""]);
    const [vehicleImage, setVehicleImage] = useState<string>('');
    const [complainDescription, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState<String>("");
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleAddParkingNumber = () => {
        setParkingNumbers([...vehicleNo, ""]);
    };

    const handleRemoveParkingNumber = (index: number) => {
        const updatedNumbers = vehicleNo.filter((_, i) => i !== index);
        setParkingNumbers(updatedNumbers);
    };

    const handleParkingChange = (index: number, value: string) => {
        const updatedNumbers = [...vehicleNo];
        updatedNumbers[index] = value;
        setParkingNumbers(updatedNumbers);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const vehicleImage1 = e.target.files[0]
            setVehicleImage(URL.createObjectURL(vehicleImage1));
        }
    };

    const handleRemoveImage = () => {
        setVehicleImage('');
    };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const formData = { vehicleImage, complainDescription, vehicleNo, email }
        // console.log(formData)
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:3000/form/createFormData`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            console.log(data);
            setLoading(false);
            console.log(formData);

            if (data.error) {
                setError(data.error);
                return;
            }
            navigate('/');
        } catch (error) {
            setLoading(false);
            setError("Server Error");
        }
    };




    return (
        <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 border border-[#FA5651]">
                <h1 className="text-2xl font-bold text-[#B30000] mb-6">🚗 Parking Complaint Form</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-[#FA5651] rounded-lg focus:ring-2 focus:ring-[#FA5651] outline-none"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Vehicle Image Upload */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Vehicle Image</label>
                        <div className="flex items-center justify-center w-full bg-gray-50 rounded-lg border-2 border-dashed border-[#FA5651] p-4 relative">
                            {vehicleImage ? (
                                <div className="relative">
                                    <img
                                        src={vehicleImage}
                                        alt="Uploaded Vehicle"
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-0 right-0 bg-[#FA5651] text-white px-2 py-1 rounded-full hover:bg-[#B30000] transition"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="vehicleImage"
                                    />
                                    <label
                                        htmlFor="vehicleImage"
                                        className="cursor-pointer text-gray-500 hover:text-[#FA5651] transition"
                                    >
                                        <span className="text-sm">Click to Upload Vehicle Image</span>
                                    </label>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Complaint Description */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Complaint Description</label>
                        <textarea
                            value={complainDescription}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full p-2 border border-[#FA5651] rounded-lg focus:ring-2 focus:ring-[#FA5651] outline-none"
                            placeholder="Describe your complaint..."
                            required
                        />
                    </div>

                    {/* Parking Numbers */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Parking Numbers</label>
                        <div className="flex flex-wrap gap-2">
                            {vehicleNo.map((num, index) => (
                                <div key={index} className="flex items-center gap-2 flex-1 min-w-[150px]">
                                    <input
                                        type="text"
                                        value={num}
                                        onChange={(e) => handleParkingChange(index, e.target.value)}
                                        className="w-full p-2 border border-[#FA5651] rounded-lg focus:ring-2 focus:ring-[#FA5651] outline-none"
                                        placeholder="Enter parking number"
                                        required
                                    />
                                    {vehicleNo.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveParkingNumber(index)}
                                            className="bg-[#FA5651] text-white px-3 py-1 rounded-lg hover:bg-[#B30000] transition"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddParkingNumber}
                            className="mt-2 bg-[#FA5651] text-white py-2 px-4 rounded-lg hover:bg-[#B30000] transition"
                        >
                            + Add Another Parking Number
                        </button>
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#FA5651] text-white py-2 rounded-lg hover:bg-[#B30000] transition font-semibold"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Submit Complaint'}
                    </button>

                    {error && (
                        <div className="text-red-400 mt-4 text-center animate-fade-in">
                            {error || 'Something went wrong!'}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}