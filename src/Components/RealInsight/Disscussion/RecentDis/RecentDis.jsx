import React from 'react';
import { FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { IoShareOutline } from "react-icons/io5";

const SocialPost = () => {
    return (
        <div className=" mx-auto p-4 ">
            <div className="flex flex-row">
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex-shrink-0"></div>
                <div className="px-4">
                    <div className="flex items-center ">
                            <div className="font-bold text-gray-900 px-1">Sahil D souza</div>
                            <div className="text-sm text-gray-500 px-1">@Sahil9832</div>
                            <div className="text-sm text-gray-500 px-1">23s</div>
                    </div>
                    <div className="mb-4 text-gray-800">
                        Finally achieving my biggest dream, I'm excited to share a picture of my favourite spot in my palace.
                    </div>
                    <div className="rounded-lg overflow-hidden">
                        <img
                            src="./images/2.jpg"
                            alt="Favorite spot in palace"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                    <div className="flex items-center mt-4 space-x-4 text-gray-600">
                        <div className="flex items-center space-x-1">
                            <FaRegHeart color='red' />
                            <span>97.5k</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <FiMessageCircle />
                            <span>668</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <IoShareOutline />
                            <span>Share</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};




export default function RecentDis() {
    return (
        <>
            <div className="mt-4">

                <h2 className="text-lg font-bold mb-4">Recent Disscussion</h2>
                <div className="bg-white rounded-xl">
                    <SocialPost />
                    <SocialPost />
                    <SocialPost />
                </div>
            </div>
        </>
    )
}

