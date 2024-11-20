import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { IoChevronBackSharp } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import { IoStarOutline, IoStar } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import Chats from "./Chat";
import { jwtDecode } from "jwt-decode";
import NameHeader from "../../CompoCards/Header/NameHeader";

const defaultCommunityUrl = "/community-pfp.jpg";

function ChatScreen() {
    
  const theme = useTheme();
  

  const [groupNames, setGroupNames] = useState([]);
  const [filteredGroupNames, setFilteredGroupNames] = useState([]);
  const [currentGroupData, setCurrentGroupData] = useState();
  const [isUsersListOpen, setIsUsersListOpen] = useState(false);
  const [communitySearchQuery, setCommunitySearchQuery] = useState("");
  

  // Fetch all communities
  const fetchAllCommunities = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage.");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/communities/getAllCommunitiesForCustomers?userId=${userId}`,
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then((response) => {
        setGroupNames(response.data.data);
        setFilteredGroupNames(response.data.data); // Initialize with all communities
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Toggle admin status
  const toggleAdmin = async (communityId, idOfUser) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage.");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/api/communities/toggleAdmin/${communityId}/${idOfUser}?userId=${userId}`,
        {},
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then((response) => {
        toast(response.data.message);

        // Update the state locally to reflect the admin change
        setCurrentGroupData((prevGroup) => {
          const updatedCustomers = prevGroup.customers.map((customer) => {
            if (customer._id === idOfUser) {
              return {
                ...customer,
                admin: customer.admin === "true" ? "false" : "true",
              };
            }
            return customer;
          });

          return { ...prevGroup, customers: updatedCustomers };
        });

        fetchAllCommunities();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  // Filter the communities based on search query
  useEffect(() => {
    if (communitySearchQuery.trim() === "") {
      setFilteredGroupNames(groupNames); // Reset to full list if search query is empty
    } else {
      const filtered = groupNames.filter((community) =>
        community.name
          .toLowerCase()
          .includes(communitySearchQuery.toLowerCase())
      );
      setFilteredGroupNames(filtered);
    }
  }, [communitySearchQuery, groupNames]);

  useEffect(() => {
    fetchAllCommunities();
  }, []);

  const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage.");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

  return (
    <div className="min-h-screen w-full   ">
      {/* <!-- component --> */}
      <div className="flex gap-4 min-h-screen overflow-hidden relative  ">
        {/* <!-- Sidebar --> */}
        <div
          className={` bg-transparent  w-full md:w-[60%] lg:w-[30%] ${
            currentGroupData ? "hidden md:block  " : "w-[30%]"
          }`}
        >
            <div className="bg-white p-2 relative top-0 ">
                    <div className="m-2">
                        <NameHeader firstname="iProp91" secondname="Family" />
                    </div>
                    <div className="my-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" 
                            value={communitySearchQuery}
                            onChange={(e) => {
                              setCommunitySearchQuery(e.target.value);
                            }}
                            id="default-search" className="block w-full p-4 ps-10 text-md text-black border border-gray-300 rounded-lg " placeholder="Search" required />
                        </div>
                    </div>
                </div>
        
         

          {/* <!-- Contact List --> */}
          <div className="overflow-y-auto     p-3  ">
            {filteredGroupNames.map((item, index) => {
              return (
                <div
                  onClick={() => {
                    setCurrentGroupData(item);
                  }}
                  key={`community-${index}`}
                  className={`flex items-center mb-2 hover:bg-gold   cursor-pointer ${
                    currentGroupData &&
                    (currentGroupData._id === item._id ? "bg-gray-100 border-2 border-gold" : null)
                  } hover:bg-gray-100  ${
                    theme.palette.mode === "dark"
                      ? "bg-opacity-20 hover:bg-opacity-20"
                      : null
                  } px-4 py-3 rounded-xl`}
                >
                  <div className="w-[52px] h-[52px] items-center flex justify-center bg-gray-300 rounded-full mr-3 border-[2px] border-gold">
                    <img
                      src={
                        item.thumbnail !== ""
                          ? item.thumbnail
                          : defaultCommunityUrl
                      }
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* <!-- Main Chat Area --> */}
        <div className={`flex-1   ${currentGroupData ? "w-full  " : " hidden"}`}
        style={{ backgroundImage: 'url("/images/chatbg.jpg")' }}
        >
          <div className="flex flex-col h-[100vh]">
            {/* <!-- Chat Header --> */}
            <header
              className={`${
                theme.palette.mode === "dark"
                  ? "bg-white text-black"
                  : "text-black bg-white "
              }  p-4  `}
            >
              {currentGroupData && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <button
                      className="text-black/70 hover:scale-110 hover:text-black"
                      onClick={() => setCurrentGroupData()}
                    >
                      <IoChevronBackSharp className="w-6 h-6 mr-3  " />
                    </button>
                    <h1 className="text-2xl font-semibold">
                      {currentGroupData.name}
                    </h1>
                  </div>

                  <button
                    onClick={() => {
                      setIsUsersListOpen(true);
                    }}
                    className="font-bold text-black/70 hover:text-black hover:scale-110"
                  >
                    <BsInfoCircle className="w-6 h-6 mr-4 " />
                  </button>
                </div>
              )}

              {!currentGroupData && (
                <div className="flex absolute right-5 top-5 justify-between text-black items-center">
                  <p className="text-2xl">See all conversations here</p>
                </div>
              )}
            </header>

            {/* <!-- Chat Messages --> */}

            {currentGroupData && (
              <Chats
                currentGroupDetails={currentGroupData}
                communityId={currentGroupData._id}
                userId={userId}
                userToken={token}

              />
            )}
            {!currentGroupData && (
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-lg mx-3">{`Select a community to see the messages.`}</p>
              </div>
            )}
          </div>
        </div>

        {/* ------ members list sidebar  */}
        {currentGroupData && isUsersListOpen === true && (
          <div
            className={` animate-slide-in-right  ease-in-out absolute top-0 right-0 h-full w-[300px] p-4   border-l shadow-md sm:p-8  ${
              theme.palette.mode === "dark"
                ? "bg-[#141B2D] text-gray-100"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <button
              className="absolute top-4 left-4 hover:-rotate-90 hover scale-110 transition-all duration-300 mr-8"
              onClick={() => {
                setIsUsersListOpen(false);
              }}
            >
              <MdOutlineClose className="w-6 h-6  " />
            </button>

            <h3 className="text-xl font-bold text-center leading-none mb-4">
              List of users
            </h3>

            <ul
              role="list"
              className={`divide-y ${
                theme.palette.mode === "dark"
                  ? "divide-gray-600"
                  : "divide-gray-300"
              }`}
            >
              {currentGroupData.customers.map((customer, index) => {
                return (
                  <li className="py-3 sm:py-4" key={`user-${index}-list`}>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="w-8 h-8 rounded-full"
                          src={
                            customer.profilePicture !== ""
                              ? customer.profilePicture
                              : process.env.REACT_APP_DEFAULT_PROFILE_URL
                          }
                          alt="user image"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{customer.name}</p>
                      </div>
                      {customer.admin == false ? (<IoStar/>) : ""}
                      {/* <button onClick={()=>{console.log(customer.admin)}}>hyeeee</button> */}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatScreen;
