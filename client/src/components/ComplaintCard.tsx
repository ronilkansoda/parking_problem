import React from "react";

interface Complaint {
    id: number;
    image: string;
    description: string;
    date: string;
    time: string;
    onClick: () => void;
}

const ComplaintCard: React.FC<Complaint> = ({ id, image, description, date, time, onClick }) => {
    return (
        <div
            key={id}
            className="bg-white p-4 rounded-lg shadow-lg border border-[#FC867A] hover:scale-101 transition-transform hover:shadow-sm hover:shadow-[#fa5751de] cursor-pointer"
            onClick={onClick}
        >
            <img src={image} alt="Complaint" className="w-full h-40 object-cover rounded-lg mb-3" />
            <p className="text-gray-800 font-semibold text-sm md:text-base">{description}</p>
            <p className="text-gray-500 text-xs md:text-sm mt-1">📅 {date} | ⏰ {time}</p>
        </div>
    );
};

export default ComplaintCard;
