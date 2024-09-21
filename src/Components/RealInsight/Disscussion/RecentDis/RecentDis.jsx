import React from 'react';
import { FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { IoShareOutline } from "react-icons/io5";



const parseTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
        if (urlRegex.test(part)) {
            return (
                <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    {part}
                </a>
            );
        }
        return part;
    });
};

const SocialPost = ({ text, imageURl, videoUrl }) => {
    return (
        <div className="mx-auto p-4">
            <div className="flex flex-row">
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex-shrink-0"></div>
                <div className="px-4">
                    <div className="flex items-center">
                        <div className="font-bold text-gray-900 px-1">Sahil D souza</div>
                        <div className="text-sm text-gray-500 px-1">@Sahil9832</div>
                        <div className="text-sm text-gray-500 px-1">23s</div>
                    </div>
                    <div className="mb-4 text-gray-800">
                        {parseTextWithLinks(text)}
                    </div>
                    {videoUrl ? (
                        <div className="rounded-lg overflow-hidden">
                            <video
                                className="w-full h-auto"
                                controls
                                src={videoUrl}
                                alt="User video"
                            />
                        </div>
                    ) : (
                        <div className="rounded-lg overflow-hidden">
                            <img
                                src={imageURl}
                                alt="Favorite spot in palace"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}
                    <div className="flex items-center mt-4 space-x-4 text-gray-600">
                        <div className="flex items-center space-x-1">
                            <FaRegHeart color="red" />
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
    const text = "Hey, I am looking for a 2BHK flat in Bangalore. Can anyone suggest me some good options?";
    return (
        <>
            <div className="mt-4">

                <h2 className="text-lg font-bold mb-4">Recent Disscussion</h2>
                <div className="bg-white rounded-xl">
                    <SocialPost text={text} imageURl="images/image1.jpg" />
                    <SocialPost text={text} videoUrl="videos/video1.mp4" />
                </div>
            </div>
        </>
    )
}

