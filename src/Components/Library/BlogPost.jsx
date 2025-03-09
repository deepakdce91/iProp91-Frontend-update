import React from "react";
import { useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import parse, { domToReact } from "html-react-parser";
import ReactPlayer from "react-player/youtube";
import Breadcrumb from "../Landing/Breadcrumb";

const BlogPost = () => {
  const location = useLocation();
  const { blog } = location.state; // Get the blog data from the state
  const trimmedTitle = blog?.title ? blog.title.split(" ").slice(0, 10).join(" ") : "Blog Post";
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

  // Configure DOMPurify to allow tables, links, and related elements/attributes
  const purifyConfig = {
    ADD_TAGS: ['table', 'thead', 'tbody', 'tr', 'td', 'th', 'a'],
    ADD_ATTR: ['colspan', 'rowspan', 'scope', 'href', 'target', 'rel']
  };
  
  // Sanitize HTML content with configuration
  const sanitizedContent = DOMPurify.sanitize(blog.content, purifyConfig);
  
  // Parse HTML with custom options for table and link handling
  const parserOptions = {
    replace: (domNode) => {
      // Handle hyperlinks
      if (domNode.name === 'a' && domNode.attribs) {
        // Extract href attribute
        const href = domNode.attribs.href || '#';
        
        // Determine if it's an external link
        const isExternal = href.startsWith('http') || href.startsWith('www');
        
        // Set appropriate attributes for external links
        const externalProps = isExternal ? {
          target: "_blank",
          rel: "noopener noreferrer"
        } : {};
        
        return (
          <a 
            href={href}
            className="text-blue-600 hover:text-blue-800 underline"
            {...externalProps}
          >
            {domToReact(domNode.children, parserOptions)}
          </a>
        );
      }

      // Handle tables
      if (domNode.name === 'table') {
        return (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full divide-y divide-gray-300 border">
              {domToReact(domNode.children, parserOptions)}
            </table>
          </div>
        );
      }
      
      if (domNode.name === 'th') {
        return (
          <th className="px-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-800">
            {domToReact(domNode.children, parserOptions)}
          </th>
        );
      }
      
      if (domNode.name === 'td') {
        // Check if this is the first cell in a row and might contain S. No.
        const isFirstColumn = domNode.parent && 
                              domNode.parent.children && 
                              domNode.parent.children.indexOf(domNode) === 0;
        
        // Check if content might be a serial number
        const mightBeSerialNo = domNode.children && 
                               domNode.children[0] && 
                               /^(\d+|S\.?\s?No\.?|#)$/i.test(domNode.children[0].data || '');
        
        const widthClass = (isFirstColumn && mightBeSerialNo) ? "w-16" : "";
        
        return (
          <td className={`px-4 py-3 border-t border-gray-200 text-sm ${widthClass}`}>
            {domToReact(domNode.children, parserOptions)}
          </td>
        );
      }
      
      if (domNode.name === 'tr') {
        return (
          <tr className="even:bg-gray-50">
            {domToReact(domNode.children, parserOptions)}
          </tr>
        );
      }
    }
  };
  
  const parsedContent = parse(sanitizedContent, parserOptions);
  
  // For excerpt, sanitize and parse a shortened version if needed
  const createExcerpt = () => {
    if (!blog.content) return null;
    const excerptText = blog.content.split(' ').slice(0, 30).join(' ') + '...';
    const sanitizedExcerpt = DOMPurify.sanitize(excerptText, purifyConfig);
    return parse(sanitizedExcerpt, parserOptions);
  };

  // Render YouTube Videos section
  const renderYoutubeVideos = () => {
    if (!blog.youtubeVideos || !Array.isArray(blog.youtubeVideos) || blog.youtubeVideos.length === 0) {
      return null;
    }

    return (
      <div className="mt-16 border-t border-gray-300 pt-10">
        <h2 className="text-2xl font-bold mb-6">Related Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blog.youtubeVideos.map((videoUrl, index) => (
            <div key={index} className="w-full">
              <div className="relative hover:transition-all hover:scale-105  pt-0 pb-0 h-0" style={{ paddingBottom: '56.25%' }}>
                <ReactPlayer
                  url={videoUrl}
                  className="absolute top-0 left-0 rounded-lg"
                  width="100%"
                  height="100%"
                  controls={true}
                  light={true} // This shows a thumbnail preview
                  config={{
                    youtube: {
                      playerVars: { 
                        rel: 0,
                        modestbranding: 1
                      }
                    }
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-700">Video {index + 1}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="pt-28 px-4 md:px-10 lg:px-20 text-text bg-white min-h-screen pb-20">
      <Breadcrumb className="flex z-50 items-center space-x-2 text-black text-sm my-3" items={breadcrumbItems} />
      
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
            {/* Uncomment below to show excerpt */}
            {/* <div className="prose max-w-none md:text-lg text-sm text-gray-700 leading-relaxed">
              {createExcerpt()}
            </div> */}
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
          <div className="prose max-w-none mx-auto md:text-lg text-sm text-gray-700 leading-relaxed">
            {parsedContent}
          </div>
        </div>
        
        {/* YouTube Videos Section */}
        {renderYoutubeVideos()}
      </div>
    </section>
  );
};

export default BlogPost;