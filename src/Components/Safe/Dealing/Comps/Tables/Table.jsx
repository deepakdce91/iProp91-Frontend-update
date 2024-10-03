import { useState, useRef, useEffect } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { uploadFileToCloud, getSignedUrlForPrivateFile } from "../../../../../config/s3client";
import { client } from '../../../../../config/s3client'
import SimpleInput from '../../../../CompoCards/InputTag/simpleinput';

import {
  Dialog,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  IconButton,
} from "@material-tailwind/react";
import Goldbutton from "../../../../CompoCards/GoldButton/Goldbutton"


const Table = ({ tablename, tableData, tableopen = false, setdata }) => {
  const [isExpanded, setIsExpanded] = useState(tableopen); // Initialize with the tableopen prop
  const [maxHeight, setMaxHeight] = useState(tableopen ? 'auto' : '0px'); // Adjust the height accordingly

  const contentRef = useRef(null);

  const toggleExpand = () => {
    setMaxHeight(isExpanded ? '0px' : `${contentRef.current.scrollHeight}px`);
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    // If tableopen prop changes, update the state accordingly
    setIsExpanded(tableopen);
    setMaxHeight(tableopen ? `${contentRef.current.scrollHeight}px` : '0px');
  }, [tableopen]);



  // backend stuffs
  const [Files, setFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');

  const handleFileChange = async (e) => {
    const files = e.target.files;
    setFiles(files);
    console.log(files);
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);

    if (files.length > 0) {
      const newData = [];
      for (let i = 0; i < files.length; i++) {
        let item = files[i];
        let cloudFilePath = await uploadFileToCloud(item, user.userId);
        newData.push({
          name: item.name,
          addedBy: user.userId,
          path: cloudFilePath,
        });
      }
      setdata([...tableData, ...newData]);
    }
  }

  const handleDelete = (index) => {
    const newData = tableData.filter((_, i) => i !== index);
    setdata(newData);
  };

  const handleEdit = (file, index) => {
    setSelectedFile({ ...file, index });
    setNewFileName(file.name);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const newData = [...tableData];
    newData[selectedFile.index].name = newFileName;
    setdata(newData);
    setIsModalOpen(false);
  };

  const handleView = async (file) => {
    const url = await getSignedUrlForPrivateFile(file.path);
  // navigate to this url

   window.open(url, '_blank');
  };

  const handleDownload = async (file) => {
    const url = await getSignedUrlForPrivateFile(file.path);
    
    // Fetch the file as a Blob
    const response = await fetch(url);
    const blob = await response.blob();
  
    // Create a download link
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
  
    link.href = objectUrl;
    link.download = file.name; // Specify the file name for the download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl); // Revoke the object URL to free up memory
  };
  

  return (
    <>
      <div className={`${!isExpanded ? 'border-2 rounded-xl border-gray-300 !text-black' : ''} w-full my-2 `}>
        <div
          className={`${!isExpanded ? '' : 'bg-gold'} p-4 rounded-t-lg flex justify-between items-center w-full cursor-pointer px-10 py-6`}
          onClick={toggleExpand}
        >
          <h2 className={`${isExpanded ? 'text-white' : 'text-black'} text-sm md:text-xl`}>
            {tablename}
          </h2>
          <button className={`text-black transition-all delay-150 duration-50 font-bold text-2xl ${!isExpanded ? 'transform rotate-180 text-gold' : 'text-white'}`}>
            <FaChevronUp />
          </button>
        </div>

        <div
          ref={contentRef}
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: `${maxHeight}` }}
        >
          <div className="bg-white shadow-md rounded-b-lg w-full overflow-x-scroll no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-yellow-50 text-yellow-700">
                  <th className="py-3 px-6">No.</th>
                  <th className="py-3 px-6">Name</th>
                  {/* <th className="py-3 px-6">File Size</th> */}
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((file, index) => (
                  <tr key={index} className="hover:bg-yellow-50">
                    <td className="py-3 px-6">{index + 1}</td>
                    <td className="py-3 px-6">{file.name}</td>
                    {/* <td className="py-3 px-6">{file.size}</td> */}
                    <td className="py-3 px-6">{
                      file.updatedAt ? new Date(file.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}

                    </td>
                    <td className="py-3 px-6 flex space-x-4">
                      <button onClick={() => handleView(file)}>
                        <i className="fas fa-eye text-gray-700"></i>
                      </button>
                      <button onClick={() => handleEdit(file, index)}>
                        <i className="fas fa-edit text-gray-700"></i>
                      </button>
                      <button onClick={() => handleDownload(file)}>
                      <i className="fas fa-download text-gray-700"></i>
                    </button>
                      <button onClick={() => handleDelete(index)} >
                        <i className="fas fa-trash text-gray-700"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-center w-full">
              <label for="dropzone-file" className="flex flex-col items-center justify-center w-full h-40  cursor-pointer ">
                <div className="flex flex-col items-center justify-center">
                  <button className="flex items-center text-gold border border-gold rounded-full p-2">
                    <i className="fas fa-upload"></i>
                  </button>
                  <p className="text-gold mt-2">Click to Upload or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">(Max. File size: 25 MB)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
              </label>
            </div>

          </div>
        </div>
      </div>
      {/* {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit File Name</h2>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 p-2 rounded">
                Cancel
              </button>
              <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
       */}
      <Dialog size="sm" open={isModalOpen} handler={handleSave} className="p-4">
        <DialogHeader className="relative m-0 block ">
          <Typography variant="h4" color="blue-gray">
            Edit File Name
          </Typography>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
             className="!absolute right-3.5 top-3.5"
            onClick={handleSave}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6">
          <div>
            <div className="w-full">
              <SimpleInput
                type="text"
                value={newFileName}
                setValue={setNewFileName}
              />
            </div>
          </div>


        </DialogBody>
        <DialogFooter>
          <Goldbutton
            btnname={"Edit"}
            bgcolor={"w-40"}
            onclick={handleSave}
          />
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Table;
