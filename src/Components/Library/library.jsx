import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Make sure to install this package
import { ArrowRightIcon } from "@heroicons/react/outline";
import { FaGreaterThan } from "react-icons/fa";

const Library = () => {
  const [data, setData] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null);

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
    setActiveBlog(blog);
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
      <section className="mt-28 px-4 md:px-10 lg:px-20">
        <button onClick={()=> setActiveBlog(null)} 
                  className="mb-6  text-gold hover:font-semibold hover:underline"
        >
          Back to all blogs
        </button>
        <div className="flex flex-col lg:flex-row justify-center items-center md:items-start gap-5">
          <div className="flex-1">
            <h1 className="md:text-4xl text-2xl font-bold mb-4">{activeBlog.title}</h1>
            <p className="text-xs text-gray-500 mb-2">
              Published on {formatDate(activeBlog.createdAt)}
            </p>

            <p className="md:text-lg text-sm text-gray-700">
              {stripHtml(activeBlog.content)}
            </p>
          </div>
          <div className="flex-1 ">
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
      <div className="grid gap-8 place-items-center lg:place-items-stretch sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:mt-6">
        {data.map((item) => (
          <div
            key={item._id}
            className="max-w-[350px] lg:w-[350px] lg:h-[520px] min-h-[520px] flex flex-col justify-between hover:scale-105 hover:shadow-xl transition-all bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
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
                className="relative flex gap-2 w-[60%] bg-gold rounded-full p-2 items-center justify-center shadow-lg font-semibold text-lg group"
              >
               
                <p className="capitalize text-white">Read more</p>
                <span className="rounded-full p-2 bg-white">
                  <svg className="fill-black w-4 font-semibold"
                    viewBox="-5 0 25 25"
                    version="1.1"
                  >
                    <g
                      id="icons"
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      <g
                        id="ui-gambling-website-lined-icnos-casinoshunter"
                        transform="translate(-1783.000000, -158.000000)"
                        fill="#1C1C1F"
                        fill-rule="nonzero"
                      >
                        <g
                          id="1"
                          transform="translate(1350.000000, 120.000000)"
                        >
                          <path
                            d="M436.453517,38.569249 L447.302459,48.9938158 L447.39261,49.0748802 C447.75534,49.423454 447.968159,49.8870461 448,50.4382227 L447.998135,50.6228229 C447.968159,51.1129539 447.75534,51.576546 447.333675,51.9774469 L447.339095,51.9689832 L436.453517,62.430751 C435.663694,63.1897497 434.399001,63.1897497 433.609178,62.430751 C432.796941,61.650213 432.796941,60.3675924 433.609432,59.5868106 L443.012324,50.5572471 L433.609178,41.4129456 C432.796941,40.6324076 432.796941,39.349787 433.609178,38.569249 C434.399001,37.8102503 435.663694,37.8102503 436.453517,38.569249 Z"
                            id="right"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Library;
