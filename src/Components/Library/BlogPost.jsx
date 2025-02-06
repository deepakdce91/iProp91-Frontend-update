import React from "react";
import { useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import Breadcrumb from "../Landing/Breadcrumb";

const BlogPost = () => {
  const location = useLocation();
  const { blog } = location.state; // Get the blog data from the state
  const trimmedTitle = blog.title.split(" ").slice(0, 10).join(" ");
  const breadcrumbItems = [
    { label: "Knowledge Center", link: "/" },
    { label: "Library", link: "/library" },
    { label: trimmedTitle } // Use the blog title for breadcrumb
  ];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!blog) return <div>Loading...</div>; // Fallback in case blog is not found

  return (
    <section className="pt-28 px-4 md:px-10 lg:px-20 text-text bg-white min-h-screen pb-20">
    <Breadcrumb className={"flex z-50 items-center space-x-2 text-black text-sm   my-3"} items={breadcrumbItems} />
    
    {/* Hero Section with Image and Title */}
    <div className="max-w-7xl mx-auto mt-10">
      <div className="flex flex-col lg:flex-row gap-10 mb-16">
        
        <div className="lg:w-1/2">
          <h1 className="md:text-5xl text-3xl font-bold mb-4">
            {blog.title}
          </h1>
          <p className="text-sm text-gray-700 mb-4">
            Published on {formatDate(blog.createdAt)}
          </p>
          {/* <div
            className="prose prose-invert max-w-none md:text-lg text-sm text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(activeBlog.content.split(' ').slice(0, 30).join(' ') + '...')
            }}
          /> */}
        </div>
        <div className="lg:w-1/2">
          <img
            src={blog.thumbnail || "images/2.jpg"}
            alt={blog.title}
            className="rounded-lg w-full object-cover aspect-video"
          />
        </div>
      </div>
    </div>

    {/* Full Width Content Section */}
    <div className="max-w-none mx-auto">
      <div className="border-t border-gray-800 pt-16">
        <div
          className="prose prose-invert max-w-none mx-auto md:text-lg text-sm text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(blog.content)
          }}
        />
      </div>
    </div>
  </section>
  );
};

export default BlogPost; 