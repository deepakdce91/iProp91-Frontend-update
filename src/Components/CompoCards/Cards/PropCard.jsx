export default function PropCard ({props}) {
    return (
      <>
        <div className="bg-white drop-shadow-2xl  border-transparent border-b-4 border-[1px] hover:border-simple hover:border-b-4 hover:border-[1px] p-4 rounded-xl w-64 ">
          <img
            src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&amp;w=1770&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="home"
            className=" rounded-xl object-cover "
          />
          <div className=" flex justify-between mt-3 mb-1">
            <h1 className="text-xl text-black">{props.project}</h1>
            <p className="text-xs text-black mt-auto mb-auto">Tower: {props.tower}</p>
          </div>
          <div className="flex justify-between">
            <h1 className="text-xs text-black">{props.builder}</h1>
            <p className="text-xs text-black">Unit: {props.unit}</p>
          </div>
          <div className="flex flex-row justify-between mt-4 gap-2">
            <button className=" w-full text-[14px] hover:border-[1px] hover:border-b-[5px] hover:border-b-gold hover:border-gold hover:shadow-gold border-b-[4px] border-b-gold  bg-[#edeaea] text-black font-semibold py-2 px-4 rounded-xl">
              {props.applicationStatus === "approved" ? "View Details" : props.applicationStatus}
            </button>
          </div>
        </div>
      </>
    );
  };