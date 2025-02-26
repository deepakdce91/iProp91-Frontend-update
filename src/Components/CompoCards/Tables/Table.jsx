import { useState, useRef, useEffect } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { uploadFileToCloud, getSignedUrlForPrivateFile } from "../../../config/s3client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from '@material-tailwind/react';

const Table = ({ tablename, category, tableopen = false, loading }) => {
  const [isExpanded, setIsExpanded] = useState(tableopen);
  const [maxHeight, setMaxHeight] = useState(tableopen ? 'auto' : '0px');
  const [tableData, setdata] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    // Automatically adjust height when tableData changes
    if (isExpanded && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [tableData, isExpanded]);

  // Fetch data when the category changes
  useEffect(() => {
    fetchSafeDate();
  }, [category]);

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
      }
    } catch (err) {
      toast.error("Error fetching data");
      console.log(err);
    }
  };

  const addSafeDocument = async (newData) => {
    const propertyId = window.location.pathname.split('/')[3];
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/safe/addDocument/${propertyId}/${category}?userId=${user.userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          },
          body: JSON.stringify(newData),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      const data = await response.json();
      if (response.ok && data.success) {
        // toast.success(`${newData.name} added successfully!`);
        fetchSafeDate(); // Refresh the document list after adding
      } else {
        throw new Error(data.message || 'Failed to add document');
      }
    } catch (err) {
      toast.error(`Error adding document: ${err.message}`);
      console.error("Error in addSafeDocument:", err);
    }
  };

  const DeletebyId = async (file) => {
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);
    const propertyId = window.location.pathname.split('/')[3];

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/safe/deleteDocument/${propertyId}/${category}/${file._id}?userId=${user.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
      });
      if (response.ok) {
        fetchSafeDate(); // Refresh the document list after deleting
      }
    } catch (err) {
      toast.error("Error deleting document");
      console.log(err);
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);
    const userId = user.userId;
    const newData = [];

    try {
      if (!files.length) {
        toast.error('Please select a file');
        return;
      }

      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 25000000) { // 25MB limit
          toast.error(`File ${files[i].name} is larger than 25MB`);
          return;
        }
      }

      const userPhone = localStorage.getItem("userPhone");
      toast.info('Uploading files...', { autoClose: false });

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
        try {
          await addSafeDocument(newData[i]);
        } catch (error) {
          toast.error(`Failed to add ${newData[i].name}`);
        }
      }

      e.target.value = '';
      toast.success('All files uploaded successfully!');
    } catch (error) {
      console.error("File upload error:", error);
      toast.error('Error uploading files: ' + error.message);
    }
  };

  const handleDelete = async (file) => {
    await DeletebyId(file);
  };

  const handleView = async (file) => {
    const url = await getSignedUrlForPrivateFile(file.path);
    window.open(url, '_blank');
  };

  const handleDownload = async (file) => {
    const url = await getSignedUrlForPrivateFile(file.path);
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  };

  const textWrap = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit 
      ? words.slice(0, wordLimit).join(' ') + '...' 
      : text;
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner size={40} className="animate-spin" />
        </div>
      ) : (
        <div className={`${!isExpanded ? 'border-2 rounded-xl border-black ' : ''} w-full`}>
          <div
            className={`${!isExpanded ? '' : 'bg-[#e0e0e0] text-black border-[1px] border-black '} p-4 rounded-t-lg flex text-black  justify-between items-center w-full cursor-pointer px-10 py-6`}
          >
            <h2 className={`${isExpanded ? 'text-black font-semibold' : ''} text-sm md:text-2xl font-semibold text-center w-full`}>
              {tablename}
            </h2>
            <button onClick={() => document.getElementById('dropzone-file').click()} className="ml-4 text-gray-700 text-2xl">
              <i className="fas fa-plus"></i>
            </button>
          </div>

          <div
            ref={contentRef}
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: `${maxHeight}` }}
          >
            <div className=" border-[1px] border-black shadow-md rounded-b-lg w-full overflow-x-scroll no-scrollbar text-sm lg:text-lg">
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
                    <button className="flex items-center text-black border border-black rounded-full p-2">
                      <i className="fas fa-upload"></i>
                    </button>
                    <p className="text-black   mt-2">Click to Upload or drag and drop</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default Table;