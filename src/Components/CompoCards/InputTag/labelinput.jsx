import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline"; // Ensure you have these icons imported or use any other eye icons

const LableInput = ({ label, placeholder, type, setValue, value }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleChange = (e) => {
        setValue(e.target.value); 
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    return (
        <div className="w-full my-2 font-sm relative">
            <label className="text-gray-900 font-[500] my-2">
                {label}
            </label>
            <div className="relative">
                <input
                    type={isPasswordVisible && type === "password" ? "text" : type}
                    name={label}
                    className="bg-white border border-yellow-600 text-gray-900 text-sm focus:ring-blue-500 focus:border-yellow-500 block w-full p-2.5 pr-10 rounded-xl font-sm"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    required
                />
                {type === "password" && (
                    <span
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600 dark:text-gray-300"
                    >
                        {isPasswordVisible ? (
                            <EyeOffIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </span>
                )}
            </div>
        </div>
    );
};

export default LableInput;
