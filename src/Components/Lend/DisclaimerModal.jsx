import React from "react";

const DisclaimerModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-[90%] max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Disclaimer</h2>
         
        </div>
        <p className="text-gray-600 mb-6">
          The website you are about to visit is owned and operated by a third
          party. We do not control, endorse, or assume responsibility for its
          content, products, or services. Your use of the third-party website
          will be governed by its terms of service, privacy policy, and any
          other applicable agreements. We encourage you to review these
          documents before proceeding. By clicking the link below, you
          acknowledge that you have read, understood, and agreed to this
          disclaimer.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-black text-white py-2 px-4 rounded  transition"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="bg-white text-black border-[1px] border-black py-2 px-4 rounded hover:bg-black hover:text-white transition"
          >
            Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
