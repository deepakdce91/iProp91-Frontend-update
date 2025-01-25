import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "@mui/material";

import io from "socket.io-client";

import { format } from "date-fns";
import { getDate, getTime } from "../../MyFunctions.jsx";

import axios from "axios";
import { toast } from "react-toastify";
import ScrollToBottom from "react-scroll-to-bottom";
import EmojiPicker from "emoji-picker-react";
import heic2any from "heic2any";
import {
  getNameList,
  getUniqueItems,
  removeSpaces,
  sortArrayByName,
} from "../../MyFunctions.jsx";

import ReactPlayer from "react-player";

import { PutObjectCommand } from "@aws-sdk/client-s3";

import { Image } from "primereact/image";
import { TiDelete } from "react-icons/ti";

import { FaSmile } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";

import { GrFlagFill, GrFlag } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

import { TbPaperclip } from "react-icons/tb";
import { FaRegFilePdf } from "react-icons/fa";
import { GrDocumentWord } from "react-icons/gr";
import { GrDocumentExcel } from "react-icons/gr";
import { FaRegFilePowerpoint } from "react-icons/fa";
import { supabase } from "../../../config/supabase.js";
import { client } from "../../../config/s3client.js";
import { Search } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";

import { Share2, Copy, X, Mail, Link2, PhoneIcon as WhatsApp } from 'lucide-react'

const socket = io(process.env.REACT_APP_BACKEND_URL, {
  transportOptions: ["websocket"],
});

function isValidURL(text) {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol (http or https)
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IPv4 address
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-zA-Z\\d_]*)?$", // fragment locator
    "i"
  );
  return !!urlPattern.test(text);
}

function checkFileType(file) {
  const images = ["jpg", "jpeg", "png", "gif"];
  const videos = ["mp4", "mkv", "mov", "webm"];

  if (images.includes(file.type)) {
    return "image";
  } else if (videos.includes(file.type)) {
    return "video";
  } else {
    return "none";
  }
}

function hasExcelExtension(filename) {
  const excelExtensions = [
    "xlsx",
    "xls",
    "xlsm",
    "xlsb",
    "xltx",
    "xltm",
    "csv",
    "xml",
  ];
  const lowerCaseFilename = filename.toLowerCase();
  return excelExtensions.some((extension) =>
    lowerCaseFilename.endsWith(extension)
  );
}

function hasPowerPointExtension(filename) {
  const pptExtensions = [
    "pptx",
    "ppt",
    "pptm",
    "potx",
    "pot",
    "potm",
    "ppsx",
    "ppsm",
    "pps",
    "odp",
  ];
  const lowerCaseFilename = filename.toLowerCase();
  return pptExtensions.some((extension) =>
    lowerCaseFilename.endsWith(extension)
  );
}

function hasWordExtension(filename) {
  const wordExtensions = [
    "docx",
    "doc",
    "dotx",
    "dot",
    "docm",
    "dotm",
    "rtf",
    "txt",
    "odt",
  ];
  const lowerCaseFilename = filename.toLowerCase();
  return wordExtensions.some((extension) =>
    lowerCaseFilename.endsWith(extension)
  );
}

function IncomingMessage({
  userId,
  _id,
  flag,
  userProfilePicture,
  userName,
  text,
  file,
  senderId,
  removeMessage,
  flagMessage,
  unflagMessage,
  createdAt,
  isGroupAdmin,
}) {
  const theme = useTheme();

  return (
    <div className="flex flex-col  cursor-pointer group">
      <div className="flex items-center">
        <div className="w-9 h-9 relative mb-4 rounded-full flex items-center justify-center ">
          <img
            src={userProfilePicture}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          {isGroupAdmin && (
            <img
              src="/star-badge.svg"
              alt="admin-badge"
              className="absolute text-yellow-500 right-0 -top-1 z-20 w-5 h-5"
            />
          )}
        </div>
        <div className="flex flex-col items-start max-w-[80%]">
          <p className="ml-3 text-sm text-black">{userName}</p>
          <div
            className={`relative flex w-full rounded-lg px-3 ${
              file || isValidURL(text) ? "bg-[#3f3f3f] ml-2 text-white p-2" : ""
            }`}
          >
            {file ? (
              checkFileType(file) === "image" ? (
                <Image
                  className="w-48"
                  src={file.url}
                  alt="Image"
                  width="250"
                  preview
                />
              ) : checkFileType(file) === "video" ? (
                <video src={file.url} className=" w-56" controls />
              ) : (
                <div className="flex items-center">
                  {file.type.includes("pdf") ? (
                    <FaRegFilePdf className="w-8 h-8 mr-3 mt-1" />
                  ) : hasWordExtension(file.type) ? (
                    <GrDocumentWord className="w-8 h-8 mr-3" />
                  ) : hasExcelExtension(file.type) ? (
                    <GrDocumentExcel className="w-8 h-8 mr-3" />
                  ) : hasPowerPointExtension(file.type) ? (
                    <FaRegFilePowerpoint className="w-8 h-8 mr-3" />
                  ) : (
                    <FaFileAlt className="w-8 h-8 mr-3" />
                  )}

                  <a
                    className="hover:underline text-sm"
                    target="/_blank"
                    href={file.url}
                  >
                    {file.name}
                  </a>
                </div>
              )
            ) : isValidURL(text) ? (
              text.includes("youtu") ? (
                <ReactPlayer controls url={text} />
              ) : (
                <a
                  className="underline text-[16px]"
                  href={text}
                  target="/_blank"
                >
                  {text}
                </a>
              )
            ) : (
              <div
                className="text-gray-600 text-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(text, {
                    ALLOWED_TAGS: [
                      "p",
                      "b",
                      "i",
                      "em",
                      "strong",
                      "u",
                      "h1",
                      "h2",
                      "h3",
                      "ul",
                      "ol",
                      "li",
                      "span",
                      "div",
                    ],
                    ALLOWED_ATTR: ["style", "class"],
                  }),
                }}
              />
            )}
          </div>
          <p className="text-[12px] font-extralight text-white mt-1">
            {getTime(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

function OutgoingMessage({
  _id,
  flag,
  userProfilePicture,
  text,
  file,
  userId,
  removeMessage,
  flagMessage,
  senderId,
  unflagMessage,
  createdAt,
  isGroupAdmin,
}) {
  const theme = useTheme();

  return (
    <div className="flex flex-col  cursor-pointer group">
      <div className="flex">
        <div className="w-9 h-9 mb-4 relative rounded-full flex items-center justify-center ">
          <img
            src={userProfilePicture}
            alt="My Avatar"
            className="w-8 h-8 rounded-full"
          />
          {isGroupAdmin && (
            <img
              src="/star-badge.svg"
              alt="admin-badge"
              className="absolute text-yellow-500 right-0 -top-1 z-20 w-5 h-5"
            />
          )}
        </div>
        <div className="flex flex-col items-start max-w-[80%]">
          <p className="ml-3 text-sm text-black">
            {"You"}
          </p>
          <div
            className={`relative flex w-full rounded-lg px-3 ${
              file || isValidURL(text) ? "bg-[#3f3f3f] ml-2 text-white p-2" : ""
            }`}
          >
            <div className="absolute -left-[68px] flex flex-row-reverse"></div>

            {file ? (
              checkFileType(file) === "image" ? (
                <Image
                  className="w-48"
                  src={file.url}
                  alt="Image"
                  width="250"
                  preview
                />
              ) : checkFileType(file) === "video" ? (
                <video src={file.url} className=" w-56" controls />
              ) : (
                <div className="flex items-center">
                  {file.type.includes("pdf") ? (
                    <FaRegFilePdf className="w-8 h-8 mr-3" />
                  ) : hasWordExtension(file.type) ? (
                    <GrDocumentWord className="w-8 h-8 mr-3" />
                  ) : hasExcelExtension(file.type) ? (
                    <GrDocumentExcel className="w-8 h-8 mr-3" />
                  ) : hasPowerPointExtension(file.type) ? (
                    <FaRegFilePowerpoint className="w-8 h-8 mr-3" />
                  ) : (
                    <FaFileAlt className="w-8 h-8 mr-3" />
                  )}

                  <a
                    className="hover:underline text-[16px]"
                    target="_blank"
                    href={file.url}
                  >
                    {file.name}
                  </a>
                </div>
              )
            ) : isValidURL(text) ? (
              text.includes("youtu") ? (
                <ReactPlayer controls url={text} />
              ) : (
                <a
                  className="underline text-[16px]"
                  href={text}
                  target="_blank"
                >
                  {text}
                </a>
              )
            ) : (
              <div
                className="text-gray-600 text-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(text, {
                    ALLOWED_TAGS: [
                      "p",
                      "b",
                      "i",
                      "em",
                      "strong",
                      "u",
                      "h1",
                      "h2",
                      "h3",
                      "ul",
                      "ol",
                      "li",
                      "span",
                      "div",
                    ],
                    ALLOWED_ATTR: ["style", "class"],
                  }),
                }}
              />
            )}
            <div className={`absolute -top-5 -right-[68px] flex`}>
              <button
                onClick={() => {
                  removeMessage(_id, userId);
                }}
              >
                <MdDelete
                  className={`rounded-full py-2 hover:text-red-400  h-8 my-2 w-8 p-1  group-hover:block hidden  ${
                    theme.palette.mode === "dark"
                      ? " text-gray-300 hover:bg-gray-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                />
              </button>
            </div>
          </div>
          <p className="text-[12px] font-extralight text-white mt-1">
            {getTime(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------

function Chats({
  communityId,
  userId = "IPP0001",
  userToken,
  currentGroupDetails,
}) {
  // users/fetchuser/:id

  const inputRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  let lastMessageDate = null;

  const fileInputRef = useRef(null);
  const theme = useTheme();

  const [messages, setMessages] = useState([]);

  const [textMessage, setTextMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const [fileToUpload, setFileToUpload] = useState();

  const [filteredMessages, setFilteredMessages] = useState([]);
  // for message filtering
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!(searchTerm.trim() === "")) {
      // Function to filter messages based on the search term
      const myFilteredMessages = messages.messages.filter((message) => {
        if (message.text) {
          return message.text.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (message.file) {
          return message.file.url.includes(searchTerm.toLowerCase());
        }
      });
      setFilteredMessages((prevData) => ({
        ...prevData,
        messages: myFilteredMessages,
      }));
    } else {
      setFilteredMessages(messages);
      console.log(messages);
    }
  }, [searchTerm, messages]);

  const isBlank = (input) => {
    return !input || input.trim().length === 0;
  };

  const getPublicUrlFromSupabase = (path) => {
    const { data, error } = supabase.storage
      .from(process.env.REACT_APP_SHARED_FILES_BUCKET)
      .getPublicUrl(path);
    if (error) {
      console.error("Error fetching public URL:", error);
      return null;
    }
    return data.publicUrl;
  };

  const uploadFileToCloud = async (myFile) => {
    const myFileName = removeSpaces(myFile.name); // removing blank space from name
    const myPath = `sharedFiles/${userId}/${myFileName}`;
    try {
      const uploadParams = {
        Bucket: process.env.REACT_APP_SHARED_FILES_BUCKET,
        Key: myPath,
        Body: myFile, // The file content
        ContentType: myFile.type, // The MIME type of the file
      };
      const command = new PutObjectCommand(uploadParams);
      await client.send(command);
      return myPath; //  return the file path
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  useEffect(() => {
    socket.emit("joinCommunity", { communityId, userId, userToken });

    socket.on(`existingMessages-${communityId}`, (existingMessages) => {
      setMessages(existingMessages);
    });

    socket.on(`newMessage-${communityId}`, (data) => {
      if (data.communityId === communityId) {
        setMessages((prev) => ({
          ...prev,
          messages: [...prev.messages, data.message],
        }));
      }
    });

    socket.on(`messageDeleted-${communityId}`, (messageId) => {
      setMessages((prev) => ({
        ...prev,
        messages: prev.messages.filter((message) => message._id !== messageId),
      }));
    });

    // Listen for flagging events
    socket.on(`messageFlagged-${communityId}`, (data) => {
      const { messageId, flag } = data;
      toast("Message flagged!");
      setMessages((prevObj) => ({
        ...prevObj,
        messages: prevObj.messages.map((message) =>
          message._id === messageId ? { ...message, flag: flag } : message
        ),
      }));
    });

    // Listen for unflagging events
    socket.on(`messageUnflagged-${communityId}`, (data) => {
      const { messageId, flag } = data;
      toast("Message unflagged!");
      setMessages((prevObj) => ({
        ...prevObj,
        messages: prevObj.messages.map((message) =>
          message._id === messageId ? { ...message, flag: flag } : message
        ),
      }));
    });

    // Listen for 'errorMessage' event
    socket.on(`errorMessage-${communityId}`, (data) => {
      toast.error(data.error);
    });

    return () => {
      socket.off(`existingMessages-${communityId}`);
      socket.off(`newMessage-${communityId}`);
      socket.off(`messageDeleted-${communityId}`);
      socket.off(`messageFlagged-${communityId}`);
      socket.off(`messageUnflagged-${communityId}`);
      socket.off(`errorMessage-${communityId}`);
    };
  }, [communityId]);

  const handleSendMessage = (messageObj, userId, userToken) => {
    socket.emit("sendMessage", {
      communityId,
      message: messageObj,
      userId,
      userToken,
    });
  };

  const handleDeleteMessage = (communityId, messageId, userId, userToken) => {
    socket.emit("deleteMessage", { communityId, messageId, userId, userToken });
  };

  const handleFlagMessage = (
    communityId,
    messageId,
    userId,
    userToken,
    reportData
  ) => {
    socket.emit("flagMessage", {
      communityId,
      messageId,
      userId,
      userToken,
      reportData,
    });
  };

  const handleUnflagMessage = (communityId, messageId, userId, userToken) => {
    socket.emit("unflagMessage", { communityId, messageId, userId, userToken });
  };

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Simulate a click on the hidden input
  };

  const handleFileAdding = async (event) => {
    const file = event.target.files[0];

    // checking for .heic files and converting it into jpeg before adding
    if (file.type === "image/heic") {
      try {
        // Convert .heic file to .png
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
        });

        // Create a new File object from the Blob
        const convertedFile = new File(
          [convertedBlob],
          file.name.replace(/\.heic$/i, ".jpeg"),
          {
            type: "image/jpeg",
          }
        );

        setFileToUpload(convertedFile);
      } catch (error) {
        console.error("Error converting HEIC file:", error);
      }
    } else {
      // if file is not jpeg..adding directly
      setFileToUpload(file);
    }
  };

  const handleFileRemoving = () => {
    setFileToUpload();
  };

  const addFile = async (e) => {
    e.preventDefault();

    const fileName = fileToUpload.name;
    const fileExtension = fileName.split(".")[fileName.split(".").length - 1];

    try {
      let cloudFilePath = await uploadFileToCloud(fileToUpload);
      if (cloudFilePath) {
        let publicUrl = getPublicUrlFromSupabase(cloudFilePath);
        if (publicUrl) {
          const msgObj = {
            userId,
            userProfilePicture: "/images/default.png", /// try catch
            file: {
              name: fileName,
              url: publicUrl,
              type: fileExtension,
            },
            userName: "Admin",
          };

          handleSendMessage(msgObj, userId, userToken);
          setTextMessage("");
          setFileToUpload();
        }
      }
    } catch (error) {
      console.log(error.message);
      setFileToUpload();
    }
  };

  const sanitizeHTML = (html) => {
    // Remove potentially dangerous tags/attributes while keeping basic formatting
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/on\w+="[^"]*"/g, "")
      .replace(/javascript:/g, "")
      .trim();
  };

  const addMessage = () => {
    if (!isBlank(textMessage)) {
      // First sanitize the HTML content
      const sanitizedText = DOMPurify.sanitize(textMessage, {
        ALLOWED_TAGS: [
          "p",
          "b",
          "i",
          "em",
          "strong",
          "u",
          "h1",
          "h2",
          "h3",
          "ul",
          "ol",
          "li",
          "span",
          "div",
        ],
        ALLOWED_ATTR: ["style", "class"],
      });

      // Remove any extra whitespace and check if there's actual content
      const textWithoutTags = sanitizedText.replace(/<[^>]*>/g, "").trim();

      if (textWithoutTags !== "") {
        const msgObj = {
          text: sanitizedText,
          userId,
          userProfilePicture: "/admin-avatar.jpg",
          userName: "Admin",
          isRichText: true,
        };
        handleSendMessage(msgObj, userId, userToken);
        setTextMessage("");
      }
    }
  };

  const removeMessage = (messageId) => {
    handleDeleteMessage(communityId, messageId, userId, userToken);
  };

  const flagMessage = (messageId, message, messageBy) => {
    const reportData = {
      groupName: currentGroupDetails.name,
      reportedBy: userId,
      message,
      messageId,
      messageBy,
      groupId: communityId,
    };

    handleFlagMessage(communityId, messageId, userId, userToken, reportData);
  };

  const unflagMessage = (messageId) => {
    handleUnflagMessage(communityId, messageId, userId, userToken);
  };

  const onEmojiClick = (emojiObject) => {
    setTextMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const handleTextMessageChange = (value) => {
    setTextMessage(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent new line
      addMessage(); // Send message on Enter key press
    }
  };
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const isAdmin = (id, myObj) => {
    const customers = myObj.customers;
    const customer = customers.find((customer) => customer._id === id);
    return customer ? customer.admin === "true" : false;
  };

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "color",
    "background",
    "list",
    "bullet",
    "link",
  ];
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const baseUrl = window.location.href;
const url = baseUrl.split('/').slice(0, 3).join('/');
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareToWhatsApp = () => {
    const whatsappUrl = ``
    window.open(whatsappUrl, '_blank')
  }

  const shareToEmail = () => {
    const emailUrl = ``
    window.location.href = emailUrl
  }


  return (
    <>
      <div
        className={`md:flex absolute top-5 right-[17%] hidden  md:right-[37%] lg:right-[35%] items-center  overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "w-48 border-b-[1px] border-b-black/20  " : "w-6"
        }`}
      >
        <button
          onClick={handleToggle}
          className="mr-3 focus:outline-none"
          aria-label={isExpanded ? "Collapse search" : "Expand search"}
        >
          <Search className="w-6 h-6 text-black" />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className={`w-full outline-none bg-transparent text-black text-sm transition-all duration-300 ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
          style={{ pointerEvents: isExpanded ? "auto" : "none" }}
        />
      </div>
      <div className="absolute hidden md:block top-5 right-[12%] md:right-[33%] lg:right-[32%] ">
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center  text-sm font-medium text-gray-900   hover:text-gray-900 "
      >
        <Share2 className="w-6 h-6" />
        
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Share</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-4 space-y-4">
              {/* Copy link section */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 truncate text-sm text-gray-500">
                  {url}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  {copied ? (
                    'Copied!'
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Share options */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={shareToWhatsApp}
                  className="flex items-center justify-center gap-2 p-3 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <WhatsApp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </button>
                <button
                  onClick={shareToEmail}
                  className="flex items-center justify-center gap-2 p-3 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Email</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 p-3 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 col-span-2"
                >
                  <Link2 className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Copy Link</span>
                </button>
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      <ScrollToBottom className="h-screen overflow-y-auto px-4 ">
        {filteredMessages.messages?.length > 0 &&
          filteredMessages.messages?.map((msg, index) => {
            // msg daywise seperator logic
            const currentMessageDate = format(
              new Date(msg.createdAt),
              "yyyy-MM-dd"
            );
            const isNewDay = lastMessageDate !== currentMessageDate;
            lastMessageDate = currentMessageDate;

            const isGroupAdmin = isAdmin(msg.userId, currentGroupDetails);

            return (
              <div key={`msg-${index}`}>
                {isNewDay && (
                  // date wise seperator
                  <div className="text-center text-sm text-black ">
                    {format(new Date(msg.createdAt), "yyyy-MM-dd") ===
                    format(new Date(), "yyyy-MM-dd")
                      ? "Today"
                      : getDate(msg.createdAt)}
                  </div>
                )}
                {msg.userId === userId ? (
                  msg.file ? (
                    <OutgoingMessage
                      createdAt={msg.createdAt}
                      _id={msg._id}
                      flag={msg.flag}
                      userProfilePicture={msg.userProfilePicture}
                      userId={userId}
                      senderId={msg.userId}
                      file={msg.file}
                      removeMessage={removeMessage}
                      flagMessage={flagMessage}
                      unflagMessage={unflagMessage}
                      isGroupAdmin={isGroupAdmin}
                    />
                  ) : (
                    <OutgoingMessage
                      createdAt={msg.createdAt}
                      flag={msg.flag}
                      _id={msg._id}
                      senderId={msg.userId}
                      userId={userId}
                      userProfilePicture={msg.userProfilePicture}
                      text={msg.text}
                      removeMessage={removeMessage}
                      flagMessage={flagMessage}
                      unflagMessage={unflagMessage}
                      isGroupAdmin={isGroupAdmin}
                    />
                  )
                ) : msg.file ? (
                  <IncomingMessage
                    createdAt={msg.createdAt}
                    userId={userId}
                    flag={msg.flag}
                    senderId={msg.userId}
                    _id={msg._id}
                    userProfilePicture={msg.userProfilePicture}
                    userName={msg.userName}
                    file={msg.file}
                    removeMessage={removeMessage}
                    flagMessage={flagMessage}
                    unflagMessage={unflagMessage}
                    isGroupAdmin={isGroupAdmin}
                  />
                ) : (
                  <IncomingMessage
                    createdAt={msg.createdAt}
                    userId={userId}
                    flag={msg.flag}
                    _id={msg._id}
                    senderId={msg.userId}
                    userProfilePicture={msg.userProfilePicture}
                    userName={msg.userName}
                    text={msg.text}
                    removeMessage={removeMessage}
                    flagMessage={flagMessage}
                    unflagMessage={unflagMessage}
                    isGroupAdmin={isGroupAdmin}
                  />
                )}
              </div>
            );
          })}
      </ScrollToBottom>
      {/* <!-- Chat Input --> */}
      <footer className="border-t-[1px]  border-t-black/20 p-4  w-full">
        {!fileToUpload && (
          <div className="flex flex-col">
            <div className="bg-gray-200 rounded-md mb-2">
              <ReactQuill
                value={textMessage}
                onChange={handleTextMessageChange}
                onKeyDown={handleKeyDown}
                modules={modules}
                formats={formats}
                placeholder="Type a message..."
                theme="snow"
                className="bg-white text-black rounded-lg"
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileAdding}
                />
                <button className="ml-3" onClick={handleButtonClick}>
                  <TbPaperclip
                    className={
                      theme.palette.mode === "dark"
                        ? "h-6 w-6 text-gray-500 hover:scale-110 hover:text-black"
                        : "h-6 w-6 text-gray-500 hover:scale-110 hover:text-gray-900"
                    }
                  />
                </button>
                <button
                  className="mr-1"
                  onClick={() => setShowPicker(!showPicker)}
                >
                  <FaSmile
                    className={
                      theme.palette.mode === "dark"
                        ? "text-gray-500 hover:scale-110 hover:text-black"
                        : "text-gray-500 hover:scale-110 hover:text-gray-900"
                    }
                    style={{
                      fontSize: "24px",
                      cursor: "pointer",
                      marginLeft: "8px",
                    }}
                  />
                </button>
              </div>
              <button
                disabled={textMessage === "" ? true : false}
                className={`bg-gray-200 text-black px-4 py-2 rounded-md ml-2`}
                onClick={(e) => {
                  e.preventDefault();
                  addMessage();
                }}
              >
                Send
              </button>
            </div>
            {showPicker && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100px",
                  right: "0px",
                  zIndex: 1000,
                }}
              >
                <EmojiPicker
                  pickerStyle={{ width: "70%" }}
                  onEmojiClick={onEmojiClick}
                  emojiStyle="native"
                />
              </div>
            )}
          </div>
        )}

        {fileToUpload && (
          <div className="flex flex-row justify-around items-center">
            <div className="flex flex-row items-center">
              <button onClick={handleFileRemoving}>
                <TiDelete className="h-7 w-7 text-red-400 hover:scale-110 hover:text-red-500 mr-4" />
              </button>
              <p
                className={`${
                  theme.palette.mode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {fileToUpload.name}
              </p>
            </div>
            <button
              className="bg-gold hover:bg-gold/60 text-black px-4 py-2 rounded-md ml-2"
              onClick={addFile}
            >
              Send
            </button>
          </div>
        )}
      </footer>
    </>
  );
}

export default Chats;
