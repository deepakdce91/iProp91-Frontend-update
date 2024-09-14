import React from 'react';

const RelationshipManager = () => {
    return (


        <div className="rounded-xl m-2  bg-gold  flex justify-between p-2 md:p-8 bg-cover bg-center bg-no-repeat" >
            <div className="w-full">
                <h1 className="text-4xl  text-white m-2 mb-6">Relationship <br /> Manager</h1>
                <div className='flex flex-col 2xl:flex-row w-full justify-between'>
                    <div className="flex flex-col w-full 2xl:w-4/5">
                        <textarea
                            className=" h-52 p-4 m-2 mb-4 text-gray-700 rounded-md border border-gray-300"
                            placeholder="Submit your query to us.."
                        ></textarea>
                        <button className="bg-white m-2 hover:bg-white text-gold font-bold py-2 px-4 rounded">
                            Send
                        </button>
                    </div>
                    <div className="w-full flex flex-col justify-center   p-2">
                        <div className="flex w-full 2xl:justify-end mb-4" >
                            <div className="bg-[#ffffff25] p-2 text-white rounded-lg  flex items-center justify-between w-full 2xl:w-3/5 ">
                                <span className="text-2xl font-bold">+</span>
                                <span className="mx-4 text-center">Guidance through ownership</span>
                                <span className="text-2xl font-bold">+</span>
                            </div>
                        </div>
                        <div className="flex w-full 2xl:justify-center mb-4">
                            <div className="bg-[#ffffff25] p-2 text-white rounded-lg  flex items-center justify-between w-full 2xl:w-3/5">
                                <span className="text-2xl font-bold">+</span>
                                <span className="mx-4 text-center">Assistance in identification</span>
                                <span className="text-2xl font-bold">+</span>
                            </div>
                        </div>
                        <div className="flex w-full 2xl:justify-start">
                            <div className="bg-[#ffffff25] text-white p-2 rounded-lg  flex items-center justify-between w-full 2xl:w-3/5">
                                <span className="text-2xl font-bold">+</span>
                                <span className="mx-4 text-center">Handling in transaction process</span>
                                <span className="text-2xl font-bold">+</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default RelationshipManager;
