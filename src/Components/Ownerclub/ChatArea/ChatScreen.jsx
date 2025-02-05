import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "@mui/material";
import { IoChevronBackSharp } from "react-icons/io5";
import { BsInfoCircle, BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import { IoStarOutline, IoStar, IoLockClosed } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import Chats from "./Chat";
import { jwtDecode } from "jwt-decode";
import NameHeader from "../../CompoCards/Header/NameHeader";
import { Link } from "react-router-dom";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, X, Image, FileIcon, Mic, Music, Video, File, Link2 } from "lucide-react";

const defaultCommunityUrl = "/community-pfp.jpg";

function ChatScreen() {
  const theme = useTheme();

  const [groupNames, setGroupNames] = useState([]);
  const [filteredGroupNames, setFilteredGroupNames] = useState([]);
  const [currentGroupData, setCurrentGroupData] = useState();
  const [isUsersListOpen, setIsUsersListOpen] = useState(false);
  const [communitySearchQuery, setCommunitySearchQuery] = useState("");
  const [hasGroups, setHasGroups] = useState(true);
  const [currentGroupThumbnail, setCurrentGroupThumbnail] =
    useState(defaultCommunityUrl);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [articlesData, setArticlesData] = useState([]);
  const [pinnedCommunities, setPinnedCommunities] = useState([]);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [communityMessages, setCommunityMessages] = useState({});
  const [unreadMessages, setUnreadMessages] = useState({});
  const [allMessages, setAllMessages] = useState({});
  const [inviteUrl, setInviteUrl] = useState("");

  // Move useMemo before any conditional returns
  const sortedCommunities = useMemo(() => {
    return filteredGroupNames.sort((a, b) => {
      const aIsPinned = pinnedCommunities.includes(a._id);
      const bIsPinned = pinnedCommunities.includes(b._id);
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return 0;
    });
  }, [filteredGroupNames, pinnedCommunities]);

  // Get token and userId at the top level
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken?.userId;

  // Filter the communities based on search query
  useEffect(() => {
    if (communitySearchQuery.trim() === "") {
      setFilteredGroupNames(groupNames);
    } else {
      const filtered = groupNames.filter((community) =>
        community.name
          .toLowerCase()
          .includes(communitySearchQuery.toLowerCase())
      );
      setFilteredGroupNames(filtered);
    }
  }, [communitySearchQuery, groupNames]);

  // Move fetchAllCommunities outside useEffect and make it a function declaration
  const fetchAllCommunities = () => {
    if (!token || !userId) return;

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
        console.log(response.data.data)
        setFilteredGroupNames(response.data.data);
        setHasGroups(response.data.data.length > 0);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Fetch all communities
  useEffect(() => {
    if (!token || !userId) return;
    fetchAllCommunities();
  }, [token, userId]);

  // Set the first group data as default if available
  useEffect(() => {
    if (groupNames.length > 0) {
      setCurrentGroupData(groupNames[0]);
    }
  }, [groupNames]);

  // Fetch articles data
  useEffect(() => {
    if (!token || !userId) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/articles/fetchAllArticles`,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
            params: { userId },
          }
        );
        setArticlesData(response.data);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, [token, userId]);

  // Early return if no token
  if (!token || !userId) {
    console.error("No token found in local storage.");
    return null; // or return some UI for unauthorized access
  }

  // Toggle admin status
  const toggleAdmin = async (communityId, idOfUser) => {
    if (!token || !userId) {
      console.error("No token found in local storage.");
      return;
    }

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

  // Function to generate invite link for a specific community
  const generateInviteLink = async (community) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/testimonials/generate`,
        {
          communityId: community._id,
          name: community.name,
          state: community.state,
          builder: community.builder,
          city: community.city
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          }
        }
      );

      if (response.data.success) {
        // Construct the full URL
        const inviteUrl = `${window.location.origin}/welcome/${response.data.token}`;
        setInviteUrl(inviteUrl);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error generating invitation link');
      console.error('Error:', error);
    }
  };

  // Update current group data and thumbnail when a group is selected
  const handleGroupSelect = (item) => {
    setCurrentGroupData(item);
    setCurrentGroupThumbnail(
      item.thumbnail !== "" ? item.thumbnail : defaultCommunityUrl
    );
    generateInviteLink(item); // Generate invite link for the selected community
  };

  // Function to handle pinning/unpinning
  const togglePin = (communityId) => {
    setPinnedCommunities((prev) => {
      if (prev.includes(communityId)) {
        return prev.filter((id) => id !== communityId);
      }
      return [...prev, communityId];
    });
    setMenuOpenFor(null);
  };

  // Function to count media by type
  const getMediaCounts = (messages) => {
    if (!Array.isArray(messages)) return {};
    
    return messages.reduce((acc, msg) => {
      if (msg.file) {
        // Get the file extension from the file type or name
        const fileType = msg.file.type.toLowerCase();
        
        // Categorize files
        if (fileType.includes('png') || fileType.includes('jpg') || fileType.includes('jpeg') || fileType.includes('gif')) {
          acc.image = (acc.image || 0) + 1;
        } else if (fileType.includes('mp4') || fileType.includes('mov') || fileType.includes('webm')) {
          acc.video = (acc.video || 0) + 1;
        } else if (fileType.includes('pdf') || fileType.includes('doc') || fileType.includes('xls') || 
                   fileType.includes('ppt') || fileType.includes('txt')) {
          acc.application = (acc.application || 0) + 1;
        }
      }
      return acc;
    }, {});
  };

  // Function to filter media by type
  const getMediaByType = (messages, type) => {
    if (!Array.isArray(messages)) return [];
    
    return messages.filter((msg) => {
      if (!msg.file) return false;
      
      const fileType = msg.file.type.toLowerCase();
      switch (type) {
        case 'image':
          return fileType.includes('png') || fileType.includes('jpg') || 
                 fileType.includes('jpeg') || fileType.includes('gif');
        case 'video':
          return fileType.includes('mp4') || fileType.includes('mov') || 
                 fileType.includes('webm');
        case 'application':
          return fileType.includes('pdf') || fileType.includes('doc') || 
                 fileType.includes('xls') || fileType.includes('ppt') || 
                 fileType.includes('txt');
        default:
          return false;
      }
    });
  };

  // Add function to handle message updates from Chat component
  const handleMessageUpdate = (data) => {
    const { communityId, messages, type } = data;
    
    // Update messages for the specific community
    setAllMessages(prev => ({
      ...prev,
      [communityId]: messages
    }));

    // Keep existing unread message logic
    if (type === 'new' && messages.userId !== userId) {
      setUnreadMessages((prev) => ({
        ...prev,
        [communityId]: [...(prev[communityId] || []), messages._id],
      }));
    }
  };

  // Handle message seen status
  const handleMessageSeen = (messageId) => {
    setUnreadMessages((prev) => {
      const newUnread = { ...prev };
      Object.keys(newUnread).forEach((communityId) => {
        newUnread[communityId] = newUnread[communityId].filter(
          (id) => id !== messageId
        );
      });
      return newUnread;
    });
  };

  // Render media panel
  const MediaPanel = ({ messages }) => {
    // Ensure we're working with the messages array from the community data
    const messagesList = messages?.messages || messages || [];
    const mediaCounts = getMediaCounts(messagesList);

    return (
      <div className="max-w-md">
      <div className="flex justify-between items-center my-4">
        <h3 className="text-base font-medium">Files</h3>
      </div>

      <div className="space">
        {/* Photos Section */}
        <div>
          <div className="flex items-center gap-3 p-3">
            <Image className="w-4 h-4 " />
            <span className="text-sm">{mediaCounts.image || 0} photos</span>
          </div>
          <div className="overflow-x-scroll ">
            <div className="flex gap-2 p-2 min-w-min">
              {getMediaByType(messagesList, "image").map((msg, idx) => (
                <img
                  key={idx}
                  src={msg.file.url || "/placeholder.svg"}
                  alt=""
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div>
          <div className="flex items-center gap-3 p-3">
            <Video className="w-4 h-4 " />
            <span className="text-sm">{mediaCounts.video || 0} videos</span>
          </div>
          <div className="overflow-x-auto ">
            <div className="flex gap-2 p-2 min-w-min">
              {getMediaByType(messagesList, "video").map((msg, idx) => (
                <div key={idx} className="w-48 flex-shrink-0">
                  <video src={msg.file.url} className="w-full rounded-lg" controls />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <div className="flex items-center gap-3 p-3">
            <File className="w-4 h-4 " />
            <span className="text-sm">{mediaCounts.application || 0} files</span>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 p-2 min-w-min">
              {getMediaByType(messagesList, "application").map((msg, idx) => (
                <a
                  key={idx}
                  href={msg.file.url}
                  className="min-w-[200px] flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileIcon className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm truncate">{msg.file.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Audio Section */}
        <div>
          <div className="flex items-center gap-3 p-3">
            <Music className="w-4 h-4 " />
            <span className="text-sm">{mediaCounts.audio || 0} audio files</span>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 p-2 min-w-min">{/* Audio content would go here */}</div>
          </div>
        </div>

        {/* Links Section */}
        <div>
          <div className="flex items-center gap-3 p-3">
            <Link2 className="w-4 h-4 " />
            <span className="text-sm">{mediaCounts.link || 0} shared links</span>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 p-2 min-w-min">{/* Links content would go here */}</div>
          </div>
        </div>

        {/* Voice Messages Section */}
        <div>
          <div className="flex items-center gap-3 p-3">
            <Mic className="w-4 h-4 " />
            <span className="text-sm">{mediaCounts.voice || 0} voice messages</span>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 p-2 min-w-min">{/* Voice messages content would go here */}</div>
          </div>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="h-[98vh] w-full ">
      {/* Lock modal when no groups are available */}
      {!hasGroups && (
        <div className="fixed lg:ml-64 inset-0 flex items-center justify-center  bg-opacity-75 z-50 pointer-events-auto">
          <div className="text-center flex flex-col items-center justify-center">
            <IoLockClosed className="w-32 h-32 text-gray-700" />
            <p className="text-gray-700 mt-4">
              No groups available. Please Add property to unlock this feature.
            </p>
          </div>
        </div>
      )}

      <div className={` w-full ${!hasGroups ? "blur-sm" : ""}`}>
        {/* <!-- component --> */}
        <div className="flex w-full  overflow-hidden relative gap-2 ">
          <div className="overflow-hidden w-full flex md:rounded-xl md:w-[80%] bg-white">
            {/* <!-- Sidebar --> */}
            <div
              className={`relative bg-white text-black md:h-[95vh] h-screen md:w-[40%] w-full border-r-[1px] border-r-black/20 ${
                currentGroupData ? "hidden md:block  " : "w-[30%]"
              }`}
            >
              <div className=" p-2 relative top-0 ">
                <div className="mx-2 my-5">
                  <NameHeader
                    firstname="iProp91 "
                    secondname={"Owner's Club"}
                  />
                </div>
                {/* <div className="">
                  <div className="relative ">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none  ">
                      <svg
                        className="w-4 h-4 text-black"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="search"
                      value={communitySearchQuery}
                      onChange={(e) => {
                        setCommunitySearchQuery(e.target.value);
                      }}
                      id="default-search"
                      className="block w-full px-4 py-3  ps-10 text-md text-black bg-gray-300 border outline-none rounded-xl placeholder-black/70 "
                      placeholder="Search"
                      required
                    />
                  </div>
                </div> */}
              </div>

              {/* <!-- Contact List --> */}
              <div className="overflow-y-auto  mt-3   px-3  ">
                {sortedCommunities.map((item, index) => {
                  // Get the last message for this community
                  const lastMessage =
                    item.messages?.[item.messages?.length - 1];

                  // Create message preview text
                  const messagePreview = lastMessage ? (
                    <span className="truncate">
                      {lastMessage.userId === userId
                        ? `You: ${
                            lastMessage.text ||
                            (lastMessage.file ? "Shared a file" : "")
                          }`
                        : `${lastMessage.userName}: ${
                            lastMessage.text ||
                            (lastMessage.file ? "Shared a file" : "")
                          }`}
                    </span>
                  ) : (
                    "No messages yet"
                  );

                  // Calculate time ago
                  const timeAgo = lastMessage
                    ? formatDistanceToNow(new Date(lastMessage.createdAt), {
                        addSuffix: true,
                      })
                    : "";

                  return (
                    <div
                      key={`community-${index}`}
                      className={`flex items-center mb-1 hover:bg-gray-300   cursor-pointer ${
                        currentGroupData &&
                        (currentGroupData._id === item._id
                          ? "bg-gradient-to-r from-gray-300 to-gray-50 text-black border-2 border-b-[2px] border-b-gold "
                          : null)
                      } hover:bg-gray-100  ${
                        theme.palette.mode === "dark"
                          ? "bg-opacity-20 hover:bg-opacity-20"
                          : null
                      } px-2 py-2 rounded-xl`}
                      onClick={() => handleGroupSelect(item)}
                    >
                      <div className="flex-1 flex items-center">
                        <div className="bg-gray-300 rounded-xl mr-3 border-2 border-gold">
                          <img
                            src={item.thumbnail || defaultCommunityUrl}
                            alt="Community Avatar"
                            className="w-12 h-12 rounded-xl"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-gray-600 truncate">
                            {messagePreview}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{timeAgo}</span>
                        {pinnedCommunities.includes(item._id) && (
                          <BsPinAngleFill className="text-gold w-4 h-4" />
                        )}
                        <div className="relative">
                          <BsThreeDotsVertical
                            className="w-5 h-5  text-black  cursor-pointer hidden"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenFor(
                                menuOpenFor === item._id ? null : item._id
                              );
                            }}
                          />
                          {menuOpenFor === item._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                              <div className="py-1">
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    togglePin(item._id);
                                  }}
                                >
                                  {pinnedCommunities.includes(item._id) ? (
                                    <>
                                      <BsPinAngleFill className="mr-2" />
                                      Unpin Community
                                    </>
                                  ) : (
                                    <>
                                      <BsPinAngle className="mr-2" />
                                      Pin Community
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Add unread message indicator */}
                      {unreadMessages[item._id]?.length > 0 && (
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Guidelines Footer */}
              <div className="absolute bottom-0 left-0 p-2 text-xs bg-gray-200  w-full">
                <p>
                  You shall adhere to these{" "}
                  <span
                    className="cursor-pointer text-blue-600"
                    onClick={() => setShowGuidelines(true)}
                  >
                    guidelines
                  </span>{" "}
                  while using the services at iProp91.
                </p>
              </div>
            </div>

            {/* <!-- Main Chat Area --> */}
            <div
              className={`w-full  ${
                currentGroupData ? "w-full" : "hidden"
              } custom-scrollbar`}
              // style={{ backgroundImage: `url(${currentGroupThumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity:50,  }}
            >
              <div className="flex flex-col h-screen md:h-[97vh]">
                {/* <!-- Chat Header --> */}
                <header
                  className={`${
                    theme.palette.mode === "dark"
                      ? "bg-white text-black"
                      : "text-black bg-gradient-to-r from-gray-300 to-gray-50 "
                  }  p-4  `}
                >
                  {currentGroupData && (
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col ">
                        <button
                          className="text-black hover:scale-110 hover:text-black/90 lg:hidden flex"
                          onClick={() => setCurrentGroupData()}
                        >
                          <IoChevronBackSharp className="w-6 h-6 mr-3  " />
                        </button>
                        <h1 className="text-3xl font-semibold capitalize">
                          {currentGroupData.name}
                        </h1>
                        <p className="text-sm text-black/80 ">
                          {currentGroupData?.customers?.length || 0} Members
                        </p>
                      </div>
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
                    onMessageUpdate={handleMessageUpdate}
                    onSeenMessage={handleMessageSeen}
                    messages={allMessages[currentGroupData._id] || []}
                    inviteUrl={inviteUrl}
                  />
                )}
                {!currentGroupData && (
                  <div className="h-full w-full flex items-center justify-center">
                    <p className="text-lg mx-3">{`Select a community to see the messages.`}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:flex flex-col gap-2 w-[20%] h-[99vh] hidden  ">
            {/* ------ members list sidebar  */}
            <div
              className={` bg-white rounded-xl overflow-y-scroll ease-in-out  h-[100%]  p-4   border-l shadow-md   `}
            >
              <h3 className="text-xl font-bold text-center leading-none mb-2">
                Group Info
              </h3>

              <ul
                className={` ${
                  theme.palette.mode === "dark"
                    ? "divide-gray-600"
                    : "divide-gray-300"
                }`}
              >
                {currentGroupData?.customers?.map((customer, index) => {
                  return (
                    <li className="py-2" key={`user-${index}-list`}>
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="w-12 h-12 rounded-xl"
                            src={
                              customer.profilePicture !== ""
                                ? customer.profilePicture
                                : process.env.REACT_APP_DEFAULT_PROFILE_URL
                            }
                            alt="user image"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium capitalize">
                            {customer.name}
                          </p>
                        </div>
                        {customer.admin === false ? <IoStar /> : ""}
                        {/* <button onClick={()=>{console.log(customer.admin)}}>hyeeee</button> */}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Media Panel */}
              <MediaPanel 
                messages={allMessages[currentGroupData?._id] || []}
              />
            </div>

            {/* article section */}
            {/* <div
              className={` h-[60%] overflow-y-scroll bg-white border-[1px] border-black/20 lg:flex hidden lg:flex-col py-5 px-4 gap-5  rounded-xl`}
            >
              <p className="text-center text-2xl font-semibold text-black">
                Articles Section
              </p>
              <div className="flex flex-col gap-4 justify-center items-center">
                {articlesData.map((item, index) => (
                  <Link
                    to={item.redirectionLink}
                    className="w-full h-[250px]"
                    key={index}
                  >
                    <img
                      src={item.image.url}
                      alt={item.image.name}
                      className="object-cover"
                    />
                  </Link>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* Guidelines Popup */}
      {showGuidelines && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50  ">
          <div className="bg-white px-6 py-16 rounded-lg shadow-lg max-w-2xl w-full h-4/5 overflow-hidden border-[1px] border-black">
            <h2 className="text-xl font-bold mb-4">Guidelines</h2>
            <div className="h-full overflow-y-auto space-y-6 pr-4 custom-scrollbar">
              <p>
                Thanks for using iProp91! We value your views and independence
                to express your views on this platform. However, we also value
                the sentiments and thoughts of your fellow users and in the
                interest of everyone on this platform, we expect you to adhere
                to the following guidelines at all times while using this
                platform. In case of any questions, please write us on
                info@iprop91.com
              </p>
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  Hate Speech and Discrimination: Do not post content that
                  promotes discrimination, hatred, or violence based on race,
                  ethnicity, gender, religion, disability, sexual orientation,
                  or any other characteristic. Avoid using derogatory language
                  and slurs that may offend or harm other users of this
                  platform.
                </li>
                <li>
                  Harassment and Bullying: Refrain from engaging in or endorsing
                  any form of online harassment, bullying, or intimidation.
                  Report incidents of harassment promptly and assist in creating
                  a supportive online community.
                </li>
                <li>
                  Graphic or Violent Content: Do not share graphic or violent
                  content that may disturb or harm others. Exercise sensitivity
                  when sharing content that involves tragedy or crisis
                  situations.
                </li>
                <li>
                  Misinformation and Fake News: Verify information before
                  sharing to prevent the spread of misinformation. Refrain from
                  intentionally spreading false or misleading content.
                </li>
                <li>
                  Privacy Violations: Respect the privacy of others and avoid
                  sharing personal information without consent. Be cautious
                  about sharing your own sensitive information online.
                </li>
                <li>
                  Spam and Scams: Do not engage in spamming activities or share
                  content intended to deceive or defraud others. Report and
                  block suspicious accounts to help maintain a secure online
                  environment.
                </li>
                <li>
                  Copyright Infringement: Avoid posting content that infringes
                  on the intellectual property rights of others, including
                  copyrighted material. Give proper credit when sharing content
                  created by others.
                </li>
                <li>
                  NSFW (Not Safe For Work) Content: Refrain from posting
                  explicit or sexually suggestive content, unless allowed by the
                  platform's community guidelines.
                </li>
                <li>
                  Impersonation: Do not create fake accounts or impersonate
                  others to deceive or harm users. Report accounts that engage
                  in impersonation or identity theft.
                </li>
                <li>
                  Illegal Activities: Do not promote or share content related to
                  illegal activities, including but not limited to drug
                  trafficking, violence, or terrorism. Report any illegal
                  activities or content to the appropriate authorities.
                </li>
                <li>
                  Respectful Communication: Engage in respectful and
                  constructive conversations, even when disagreeing with others.
                  Avoid using offensive language or engaging in personal
                  attacks.
                </li>
                <li>
                  Platform-Specific Rules: Familiarize yourself with the
                  specific rules and community guidelines of iProp91.
                </li>
              </ol>
              <p>
                We believe these guidelines provide a foundation for a positive
                and inclusive online community. iProp91 reserves the right to
                delete comments that violate any of these Guidelines. Comments
                that violate these Guidelines, but also offer valuable
                contributions may be edited by the iProp91 team. Keep in mind
                that information posted on this platform may be available for
                all to see, and comments are subject to defamation, antitrust,
                privacy, and other laws. iProp91 reserves the right to remove
                any comments for any reason at any time.
              </p>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setShowGuidelines(false)}
              >
                Agree & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatScreen;
