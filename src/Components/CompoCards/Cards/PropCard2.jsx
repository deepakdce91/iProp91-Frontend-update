import { useState } from "react";
import PropertyForm from "../../Safe/Dealing/DealingPages/PropDetails";
import { Link } from "react-router-dom";

export default function PropCard2({props, key}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onClickEdit = () =>{
      isModalOpen(true);
  }

  const closeEditModal = ()=>{
    isModalOpen(false)
  }
  return (
    <>
      <div className="min-h-52 border-transparent border-b-4 border-[1px] hover:border-simple hover:border-b-4 hover:border-[1px] p-4 rounded-xl">
      <img
            src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&amp;w=1770&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="home"
            className=" rounded-xl object-cover "
          />
          <div className=" flex justify-between mt-3 mb-1">
            <h1 className="text-xl responsive-text">{props.project}</h1>
            <p className="text-xs text-gray-500 mt-auto mb-auto responsive-text">Tower: {props.tower}</p>
          </div>
          <div className="flex justify-between">
            <h1 className="text-xs responsive-text">{props.builder}</h1>
            <p className="text-xs text-gray-500 responsive-text">Unit: {props.unit}</p>
          </div>
          <div className="flex flex-row justify-between mt-4 gap-2">
            <Link to={`/safe/Dealing/${key}/Documents`}>
            <button className=" w-[90%] text-[14px] bg-slate-100 py-2 px-4 rounded-lg">
              {props.applicationStatus === "approved" ? "View Details" : props.applicationStatus}
            </button>
            </Link>
            <button onClick={onClickEdit} className=" w-[10%] text-[14px] bg-slate-100 py-2 px-4 rounded-lg">
              Edit
            </button>
          </div>


          {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-4 shadow-lg max-w-lg w-full">
              <button onClick={closeEditModal} className="absolute top-2 right-2 text-gray-600">
                &times;
              </button>
              <PropertyForm propertyId={props._id}  />
            </div>
          </div>
        )}
        </div>
    </>
  );
}
