import React from "react";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

const FeaturesList = () => {
  return (
    <>
      <motion.div
        drag="x"
        dragConstraints={{ left: -150, right: 0 }}
        dragElastic={0.1}
        className="max-lg:w-[35vw] max-md:w-[10rem] mt-8 lg:mt-[10vh] lg:mt-0 top-20 right-0 fixed max-sm:right-[-8rem]"
        whileDrag={{ scale: 1.02 }}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-6 border-b border-gray-200 pb-3 max-sm:text-sm">
            Document Types Supported
          </h3>

          <div className="space-y-4 max-sm:text-sm">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-black" />
              <span className="cursor-pointer hover:underline">Concierge</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-black" />
              <span className="cursor-pointer hover:underline">Listing</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-black" />
              <span className="cursor-pointer hover:underline">safe</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-black" />
              <span className="cursor-pointer hover:underline">
                owners club
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-bold mb-4 max-sm:text-sm">Get Started Today</h4>
            <a
              href="https://i-prop91-frontend-update.vercel.app/"
              className="bg-black text-white w-full px-6 py-2 rounded-md text-center inline-block max-sm:text-sm"
            >
              Sign Up
            </a>
            <p className="text-sm text-gray-500 mt-3 max-sm:text-xs">
              Secure your real estate documents with iProp91 Safe
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FeaturesList;
