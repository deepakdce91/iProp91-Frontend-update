export default function PropCard () {
    return (
      <>
        <div className="bg-white drop-shadow-2xl  border-transparent border-b-4 border-[1px] hover:border-simple hover:border-b-4 hover:border-[1px] p-4 rounded-xl w-80 ">
          <img
            src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&amp;w=1770&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="home"
            className=" rounded-xl object-cover "
          />
          <div className=" flex justify-between mt-3 mb-1">
            <h1 className="text-xl">Mahira</h1>
            <p className="text-xs text-gray-500 mt-auto mb-auto">Tower: A</p>
          </div>
          <div className="flex justify-between">
            <h1 className="text-xs">Mahira Homes 63A</h1>
            <p className="text-xs text-gray-500">Unit: 101</p>
          </div>
          <div className="flex flex-row justify-between mt-4 gap-2">
            <button className=" w-full text-[14px] bg-slate-100 py-2 px-4 rounded-lg">
              Rent
            </button>
            <button className=" w-full text-[14px] bg-slate-100 py-2 px-4 rounded-lg">
              Sell
            </button>
          </div>
        </div>
      </>
    );
  };