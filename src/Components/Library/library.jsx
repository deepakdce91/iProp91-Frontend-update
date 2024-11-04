import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Make sure to install this package

const Library = () => {
  const [data, setData] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in local storage.");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId; // Assuming userId is stored within the token

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/library/fetchAllActiveBlogs?userId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
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
    setActiveBlog(blog);
  };

  const handleBack = () => {
    setActiveBlog(null);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (activeBlog) {
    return (
      <section className="mt-24 px-3 md:px-10 lg:px-20">
        <button
          onClick={handleBack}
          className="mb-4 text-gold hover:font-semibold hover:underline"
        >
          Back to all blogs
        </button>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-5">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{activeBlog.title}</h1>
            <p className="text-sm text-gray-500 mb-2">
              Published on {formatDate(activeBlog.createdAt)}
            </p>

            <p className="text-lg text-gray-700">
              {stripHtml(activeBlog.content)}
            </p>
          </div>
          <div className="flex-1">
            <img
              src={activeBlog.thumbnail || "images/2.jpg"}
              alt={activeBlog.title}
              className="mb-4 rounded-lg   "
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-28 lg:mt-32 px-3 md:px-10 lg:px-20 ">
      {/* <p className="font-semibold text-3xl md:text-4xl lg:text-5xl">
        Library Blogs
      </p> */}
      <div className="grid gap-8  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:mt-6 ">
        {data.map((item) => (
          <div
            key={item._id}
            className="w-80 hover:scale-105 hover:shadow-xl transition-all bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <img
              className="rounded-t-lg"
              src={item.thumbnail || "images/2.jpg"}
              alt={item.title}
            />
            <div className="p-5">
              <h5 className="mb-2 text-xl font-bold font-sans tracking-tight text-gray-900 dark:text-white">
                {item.title}
              </h5>
              <p className="text-sm font-sans text-gray-500 mb-2">
                Published on {formatDate(item.createdAt)}
              </p>

              <p className="mb-3 font-sans font-normal text-gray-700 dark:text-gray-400">
                {stripHtml(item.content).split(" ").slice(0, 10).join(" ")}...
              </p>
              <a
                href="/"
                className="relative  inline-block text-lg group"
              >
                <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                  <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                  <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gold group-hover:-rotate-180 ease"></span>
                  <span className="relative text-sm">Read more</span>
                </span>
                <span
                  className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                  data-rounded="rounded-lg"
                ></span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Library;
