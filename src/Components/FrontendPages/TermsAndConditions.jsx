import React, { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

function TermsAndConditions() {
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState();

  // Options for html-react-parser to handle links, images, etc.
  const parserOptions = {
    replace: (domNode) => {
      if (domNode.name === "a" && domNode.attribs) {
        // Make sure links open in new tab and have styling
        return (
          <a
            href={domNode.attribs.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {domNode.children &&
              domNode.children[0] &&
              domNode.children[0].data}
          </a>
        );
      }
    },
  };

  const formatContent = (content) => {
    if (!content) return "";

    // Check if content contains HTML
    const isHTML = /<[^>]+>/.test(content);
    let sanitizedContent;

    if (isHTML) {
      // If it's already HTML, just sanitize it
      sanitizedContent = DOMPurify.sanitize(content);
    } else {
      // If it's plain text, replace links and then sanitize
      sanitizedContent = content.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" class="text-blue-500 underline">$1</a>'
      );
      sanitizedContent = DOMPurify.sanitize(sanitizedContent);
    }

    // Add styles to existing links if any
    sanitizedContent = sanitizedContent.replace(
      /<a /g,
      '<a class="text-blue-500 underline" target="_blank" rel="noopener noreferrer" '
    );

    // Enhance tables with styling if present
    sanitizedContent = sanitizedContent.replace(
      /<table/g,
      '<table class="min-w-full border-collapse border border-gray-300 my-4"'
    );

    sanitizedContent = sanitizedContent.replace(
      /<tr/g,
      '<tr class="border-b border-gray-300"'
    );

    sanitizedContent = sanitizedContent.replace(
      /<th/g,
      '<th class="border border-gray-300 bg-gray-100 p-2 text-left font-medium"'
    );

    sanitizedContent = sanitizedContent.replace(
      /<td/g,
      '<td class="border border-gray-300 p-2"'
    );

    // Add styling for bullet points and ordered lists
    sanitizedContent = sanitizedContent.replace(
      /<ul/g,
      '<ul class="list-disc pl-5 space-y-2 my-4"'
    );

    sanitizedContent = sanitizedContent.replace(
      /<ol/g,
      '<ol class="list-decimal pl-5 space-y-2 my-4"'
    );

    sanitizedContent = sanitizedContent.replace(/<li/g, '<li class="ml-2"');

    return sanitizedContent;
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // for smooth scrolling
    });
  }, []);

  useEffect(() => {
    const fetchLaws = async () => {
      setIsLoading(true);
      try {
        // Fetch list of active states from backend
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/termsAndConditions/latest`
        );
        setData(response.data.text);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLaws();
  }, []);

  return (
    <div>
      {!isLoading && data ? (
        <div className="pt-40 pb-20 px-4 sm:px-10 lg:px-20 xl:px-32">
        {parse(formatContent(data), parserOptions)}
      </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="loader">loading...</div>
        </div>
        
      )}
    </div>
  );
}

export default TermsAndConditions;
