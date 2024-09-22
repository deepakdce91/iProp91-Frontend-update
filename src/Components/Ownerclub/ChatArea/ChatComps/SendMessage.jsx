import React from 'react';
import { FaPaperclip, FaSmile, FaPaperPlane } from 'react-icons/fa';

const SendMessage = () => {
    return (
        <div className="relative bottom-0 sticky flex items-center bg-white rounded-lg  max-w-full p-2">
            <FaPaperclip className="text-gray-400 text-xl cursor-pointer mr-3" />
            <FaSmile className="text-gray-400 text-xl cursor-pointer mr-3" />
            <div className="w-full">
                <input type="search" id="default-search" className="block w-full p-3 text-lg text-gray-900 border border-gray-300 rounded-lg " placeholder="Write Message" required />
            </div>
            <FaPaperPlane className="text-red-600 text-xl cursor-pointer ml-3" />
        </div>
    );
};

export default SendMessage;
