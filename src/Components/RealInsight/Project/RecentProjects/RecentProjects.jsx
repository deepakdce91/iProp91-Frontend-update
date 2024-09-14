
const RecentCard = () => {
    return (
        <div className="w-[307px] h-[335px] bg-gray-100 rounded-lg  p-4 m-auto my-2">
            <img
                src="./images/image2.jpg"
                alt="Property"
                className="rounded-lg w-[285.89px] h-[199.75px] object-cover"
            />

            <h2 className="mt-2 text-xl ">Mahira-68</h2>

            <div className="flex flex-row justify-between items-center">

                <div className="flex items-center mt-2">
                    <img
                        src="https://via.placeholder.com/32"
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full "
                    />
                    <span className="ml-2 text-sm text-gray-700">Deepak</span>
                </div>

                <div className="mt-1">
                    <button className="p-3 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200">
                        view
                    </button>
                </div>
            </div>
        </div>
    )
}
export default function RecentProjects() {
    return (
        <>
            <div className="">
                <div className=" w-full h-20 flex items-center justify-between px-4   z-10">
                    <h1 className="text-xl font-semibold">Recent Projects</h1>
                    <div className="text-primary text-xs cursor-pointer px-4 py-2 rounded">See All</div>
                </div>
                <div className="flex flex-col">
                    <RecentCard />
                    <RecentCard />
                    <RecentCard />
                    <RecentCard />
                </div>
            </div>
        </>
    )
}