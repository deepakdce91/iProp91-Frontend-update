import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/solid";

const Breadcrumb = ({ items, onBack }) => {
  return (
    <nav className="flex z-50 items-center space-x-2 text-white text-sm lg:text-base absolute top-28 lg:left-40 left-[5%]">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRightIcon className="h-4 w-4 text-white" />
          )}
          {item.link ? (
            <Link 
              to={item.link}
              className="hover:underline transition-all"
              onClick={item.label === "Laws" ? onBack : undefined}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white/80">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;