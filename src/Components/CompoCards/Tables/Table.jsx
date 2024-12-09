import { useState, useRef, useEffect } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { uploadFileToCloud, getSignedUrlForPrivateFile } from "../../../config/s3client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Table = ({ tablename, category, tableopen = false}) => {
  const [isExpanded, setIsExpanded] = useState(tableopen);
  const [maxHeight, setMaxHeight] = useState(tableopen ? 'auto' : '0px');
  const [tableData, setdata] = useState([]);
  const contentRef = useRef(null);

  // const toggleExpand = () => {
  //   setMaxHeight(isExpanded ? '0px' : `${contentRef.current.scrollHeight}px`);
  //   setIsExpanded(!isExpanded);
  // };

  // useEffect(() => {
  //   setIsExpanded(tableopen);
  //   setMaxHeight(tableopen ? `${contentRef.current.scrollHeight}px` : '0px');
  // }, [tableopen]);

  useEffect(() => {
    // Automatically adjust height when tableData changes
    if (isExpanded) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [tableData, isExpanded]);

  // backend stuffs

  useEffect(() => {
    fetchSafeDate();
  }, [tableData]);

  const fetchSafeDate = async () => {

    const propertyId = window.location.pathname.split('/')[3];
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/safe/fetchCategoryDocuments/${propertyId}/${category}?userId=${user.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      });
      if (response.ok) {
        const data = await response.json();
        setdata(data.data);
        // console.log("Fetched",category, data);
      }
    }
    catch (err) {
      toast.error("Error fetching data");
      console.log(err);
    }
  }
  
  const addSafeDocument = async (newData) => {
    const propertyId = window.location.pathname.split('/')[3];
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);
    
    console.log("Adding document:", newData);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/safe/addDocument/${propertyId}/${category}?userId=${user.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify(newData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Added", category);
        console.log(data);
        toast.success("Documents Added!")
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        toast.error("Error adding document: " + errorData.message);
      }
    } catch (err) {
      toast.error("Error fetching data");
      console.log(err);
    }
  };

  const DeletebyId = async (file) => {
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);
    const propertyId = window.location.pathname.split('/')[3];
    try{
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/safe/deleteDocument/${propertyId}/${category}/${file._id}?userId=${user.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Deleted",category);
      }

    }
    catch (err) {
      toast.error("Error fetching data");
      console.log(err);
    }
  }



  const handleFileChange = async (e) => {
    const files = e.target.files;
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);
    const userId = user.userId;
    const newData = [];
    // if now fieles are selected
    // any file has more than 25MB size then it will not be uploaded
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 25000000) {
        toast.error('File size should be less than 25MB');
        return;
      }
    }
    if (!files.length) {
      toast.error('Please select a file');
      return;
    }

    const userPhone = localStorage.getItem("userPhone");

    for (let i = 0; i < files.length; i++) {
      let item = files[i];
      let cloudFilePath = await uploadFileToCloud(item, userPhone || "exception");
      newData.push({
        name: item.name,
        path: cloudFilePath,
        addedBy: userId,
      });
    }

    for (let i = 0; i < newData.length; i++) {
      addSafeDocument(newData[i]);
    }
  }


  const handleDelete = async (file) => {
    DeletebyId(file);
    fetchSafeDate();
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

  // text wrap for file name
  const textWrap = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit 
      ? words.slice(0, wordLimit).join(' ') + '...' 
      : text;
  };

  return (
    <>
      <div className={`${!isExpanded ? 'border-2 rounded-xl border-gray-600 ' : ''} w-full   `}>
        <div
          className={`${!isExpanded ? '' : 'bg-white text-black border-[1px] border-black/20 '} p-4 rounded-t-lg flex text-black  justify-between items-center w-full cursor-pointer px-10 py-6`}
          
        >
          <h2 className={`${isExpanded ? 'text-black font-semibold' : ''} text-sm md:text-2xl font-semibold text-center w-full`}>
            {tablename}
          </h2>
          {/* <button className={`text-black transition-all delay-150 duration-50 font-bold text-2xl ${!isExpanded ? 'transform rotate-180 text-white' : 'text-white'}`}>
            <FaChevronUp />
          </button> */}
          <button onClick={() => document.getElementById('dropzone-file').click()} className="ml-4 text-gray-700 text-2xl">
            <i className="fas fa-plus"></i>
          </button>
        </div>

        <div
          ref={contentRef}
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: `${maxHeight}` }}
        >
          <div className="bg-white border-[1px] border-black/20 shadow-md rounded-b-lg w-full overflow-x-scroll no-scrollbar text-sm lg:text-lg">
            <table className="w-full  text-left border-collapse">
              <thead>
                <tr className="bg-[#f3f3f3] text-black">
                  <th className="py-3 px-6">No.</th>
                  <th className="py-3 px-6">Name</th>
               
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.map((file, index) => (
                  <tr key={index} className="">
                    <td className="py-3 px-6">{index + 1}.</td>
                    <td className="py-3 px-6" title={file.name}>
                      {textWrap(file.name, 5)}
                    </td>
                    <td className="py-3 px-6" title={file.updatedAt}>{
                      file.updatedAt ? new Date(file.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 flex space-x-4" >
                      <button onClick={() => handleView(file)}>
                        <i className="fas fa-eye text-gray-700"></i>
                      </button>
                      <button onClick={() => handleDownload(file)}>
                        <i className="fas fa-download text-gray-700"></i>
                      </button>
                      <button onClick={() => handleDelete(file)}>
                        <i className="fas fa-trash text-gray-700"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="relative flex items-center justify-center w-full">
              <input
                id="dropzone-file"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
                multiple
              />
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-40 cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center">
                  <button className="flex items-center text-black/40 border border-black/30 rounded-full p-2">
                    <i className="fas fa-upload"></i>
                  </button>
                  <p className="text-black/40 mt-2">Click to Upload or drag and drop</p>
                  {/* <p className="text-xs text-gray-500 dark:text-gray-400">(Max. File size: 25 MB)</p> */}
                </div>
              </label>
            </div>



          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default Table;
