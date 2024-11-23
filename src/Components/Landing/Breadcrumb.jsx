 import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/solid";

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-gold text-sm lg:text-base absolute top-28 lg:left-40 left-[5%]">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRightIcon className="h-4 w-4 text-gold/60" />
          )}
          {item.link ? (
            <Link 
              to={item.link}
              className="hover:underline hover:text-gold/80 transition-all"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gold/60">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;