import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import Breadcrumb from "../Landing/Breadcrumb";
import { useNavigate } from "react-router-dom";

const Library = () => {
  const [data, setData] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Knowledge Center", link: "/" },
    { label: "Library" }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/library/fetchAllActiveBlogs`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setData(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, []);

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const handleReadMore = (blog) => {
    navigate(`/library/${blog.title.replace(/\s+/g, '-').toLowerCase()}`, { state: { blog } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // if (activeBlog) {
  //   return (
  //     <section className="pt-28 px-4 md:px-10 lg:px-20 text-black bg-pink-500 min-h-screen">
  //       <Breadcrumb items={[...breadcrumbItems, { label: activeBlog.title }]} />
  //       <button
  //         onClick={() => setActiveBlog(null)}
  //         className="mb-6 text-gold hover:font-semibold hover:underline"
  //       >
  //         <ArrowLeftIcon className="w-5 inline mr-2" />
  //         Back to all blogs
  //       </button>
        
  //       {/* Hero Section with Image and Title */}
  //       <div className="max-w-7xl mx-auto ">
  //         <div className="flex flex-col lg:flex-row gap-10 mb-16">
            
  //           <div className="lg:w-1/2">
  //             <h1 className="md:text-5xl text-3xl font-bold mb-4">
  //               {activeBlog.title}
  //             </h1>
  //             <p className="text-sm text-gray-400 mb-4">
  //               Published on {formatDate(activeBlog.createdAt)}
  //             </p>
  //             {/* <div
  //               className="prose prose-invert max-w-none md:text-lg text-sm text-gray-300 leading-relaxed"
  //               dangerouslySetInnerHTML={{
  //                 __html: DOMPurify.sanitize(activeBlog.content.split(' ').slice(0, 30).join(' ') + '...')
  //               }}
  //             /> */}
  //           </div>
  //           <div className="lg:w-1/2">
  //             <img
  //               src={activeBlog.thumbnail || "images/2.jpg"}
  //               alt={activeBlog.title}
  //               className="rounded-lg w-full object-cover aspect-video"
  //             />
  //           </div>
  //         </div>
  //       </div>

  //       {/* Full Width Content Section */}
  //       <div className="max-w-none mx-auto ">
  //         <div className="border-t border-gray-800 pt-16">
  //           <div
  //             className="prose prose-invert max-w-none mx-auto md:text-lg text-sm text-gray-300 leading-relaxed"
  //             dangerouslySetInnerHTML={{
  //               __html: DOMPurify.sanitize(activeBlog.content)
  //             }}
  //           />
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  return (
    <section className="py-32 lg:pt-32 px-3 md:px-10 lg:px-20 bg-white text-white min-h-screen ">
      <Breadcrumb items={breadcrumbItems} className={"flex  items-center space-x-2 text-black text-sm lg:text-base absolute top-28 lg:left-24 left-[5%]"} />
      <div className="grid gap-8 place-items-center lg:place-items-stretch sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:mt-6">
        {data.map((item) => (
          <div
            key={item._id}
            className="max-w-[350px] lg:w-[350px] lg:h-[520px] min-h-[520px] flex flex-col justify-between hover:scale-105 hover:shadow-xl duration-300 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <img
              className="rounded-t-lg h-48 w-full object-cover"
              src={item.thumbnail ? item.thumbnail : "images/2.jpg"}
              alt={item.title}
            />
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h5 className="mb-2 text-xl font-bold font-sans tracking-tight text-gray-900 dark:text-white">
                  {stripHtml(item.title).split(" ").slice(0, 10).join(" ")}...
                </h5>
                <p className="text-sm font-sans text-gray-500 mb-2">
                  Published on {formatDate(item.createdAt)}
                </p>
              </div>
              <div className="mb-3 font-sans font-normal text-gray-700 dark:text-gray-400 overflow-hidden">
                {stripHtml(item.content).split(" ").slice(0, 16).join(" ")}...
              </div>
              <button
                onClick={() => handleReadMore(item)}
                className="relative flex gap-2 w-[60%] bg-gray-200 border-b-gold border-b-[4px] hover:shadow-lg hover:shadow-gold  rounded-full p-2 items-center justify-center shadow-lg font-semibold text-lg group"
              >
                <p className="capitalize text-black">Read more</p>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Library;
   