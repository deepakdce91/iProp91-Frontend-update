import React from "react";

const InputCard = ({ label, value }) => {
  return (
    <div className="bg-gray-100 p-2 rounded-lg !w-full ">
      <label className="block">{label}</label>
      <input
        type="text"
        className="w-full  bg-gray-100 text-lg  focus:outline-none "
        value={value}
      />
    </div>
  );
};
function PropertyForm() {
  return (
    <div className="px-10 w-full 2xl:w-2/3">
      <div className="flex flex-col w-full">
        <div className="flex flex-col xl:flex-row justify-between gap-6 my-2">
          <InputCard label="Developer" value="Mahira" />
          <InputCard label="Project Name" value="Mahira Homes-68" />
        </div>
        <div className="flex flex-col xl:flex-row justify-between gap-6 my-2 ">
          <InputCard label="Tower" value="A" />
          <InputCard label="Unit" value="101" />
        </div>
        <div className="my-2">
          <InputCard label="Area" value="1000 sqft" />
        </div>
        <div className="my-2 w-full">
          <label className="block mb-2">Nature of Property</label>
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex   ">
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
              <div className="flex items-center ps-3">
                <input
                  id="nature-residential"
                  type="radio"
                  value=""
                  name="nature"
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300     focus:ring-2  "
                />
                <label
                  for="nature-residential"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 "
                >
                  Residential{" "}
                </label>
              </div>
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
              <div className="flex items-center ps-3">
                <input
                  id="nature-commercial"
                  type="radio"
                  value=""
                  name="nature"
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300     focus:ring-2  "
                />
                <label
                  for="nature-commercial"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 "
                >
                  Commercial
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div className="my-2 w-full">
          <div className=" w-full">
            <label className="block w-full  mb-2">Status</label>
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex   ">
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
              <div className="flex items-center ps-3">
                <input
                  id="status-completed"
                  type="radio"
                  value=""
                  name="status"
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 "
                />
                <label
                  for="status-completed"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 "
                >
                  Completed{" "}
                </label>
              </div>
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
              <div className="flex items-center ps-3">
                <input
                  id="status-under-construction"
                  type="radio"
                  value=""
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300  "
                  name="status"
                />
                <label
                  for="status-under-construction"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 "
                >
                  Under Construction
                </label>
              </div>
            </li>
          </ul>
          </div>
        </div>

        <div className="my-4">
          <button className="px-10 py-2  border border-b-4  border-gold rounded-md text-lg w-full md:w-72">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyForm;
