import React,{useState} from 'react';
import { FaSearch, FaUserPlus, FaInfoCircle } from 'react-icons/fa';


const SearchBar = () => {
  return (
    <div className="absolute right-0 top-20 right-10 z-10 flex items-center bg-gray-300 bg-opacity-40 rounded-md shadow-md p-3 w-[30vw]">
      <input
        type="text"
        placeholder="Search"
        className="flex-grow rounded-xl  bg-white outline-none p-2 text-gray-700"
      />
      <div className="flex items-center">
        <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6l5.5 5.5-5.5 5.5"
            />
          </svg>
        </button>
        <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6l5.5 5.5-5.5 5.5"
            />
          </svg>
        </button>
        <button className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 bg-black font-bold text-white rounded-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};


const ChatHeader = () => {
  const [showSearch, setShowSearch] = useState(false);
  const HandleSearch = () => {
    setShowSearch(!showSearch);
  };
  return (
    <>
      {showSearch && <SearchBar />}
      <div className="flex items-center justify-between p-4 bg-white  rounded-lg max-w-full">
        <div className="flex items-center">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2">
            <img src="./images/1.png" alt="" />
          </div>
          <div className="text-xl font-bold text-gray-800">Jessica Doe</div>
        </div>
        <div className="flex items-center space-x-4">
          <FaSearch className="text-lg text-gray-600 cursor-pointer" onClick={HandleSearch} />
          <FaUserPlus className="text-lg text-gray-600 cursor-pointer" />
          <FaInfoCircle className="text-lg text-gray-600 cursor-pointer" />
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
