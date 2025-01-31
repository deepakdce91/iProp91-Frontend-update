import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/solid";

const Breadcrumb = ({ items, onBack, className }) => {
  return (
    <nav className={className} >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRightIcon className="h-4 w-4 " />
          )}
          {item.link === '/' ? (
            <Link 
              to={item.link}
              className="hover:underline transition-all"
              state={{ fromKnowledgeCenter: true }}
            >
              {item.label}
            </Link>
          ) : (
            <Link 
              to={item.link}
              className="hover:underline transition-all"
              onClick={item.label === "Laws" ? onBack : undefined}
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;