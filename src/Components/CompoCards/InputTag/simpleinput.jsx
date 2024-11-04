

import React, { useState } from "react";

const OtpInput = ({ placeholder, type,setValue, value }) => {
    // State to hold individual OTP box values
    const [otp, setOtp] = useState(new Array(6).fill(""));

    // Handle change in OTP input
    const handleChange = (e, index) => {
        const val = e.target.value;
        if (isNaN(val)) return; // Allow only numbers

        // Update OTP array
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);
        setValue(newOtp.join("")); // Update the overall OTP value

        // Move to the next input box
        if (val && index < 5) {
            e.target.nextSibling?.focus();
        }
    };

    // Handle backspace functionality
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            e.target.previousSibling?.focus();
        }
    };

    return (
        <div className="flex space-x-2">
            {otp.map((data, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="bg-white border border-yellow-600 text-gray-900 text-center text-sm focus:ring-blue-500 focus:border-yellow-500 w-10 h-10 rounded-md"
                    value={data}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    required
                />
            ))}
        </div>
    );
};

export default OtpInput;
