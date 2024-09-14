
const ExploreCard = () => {
    return (
        <>
        <div className="flex flex-row m-2 p-2 items-center">
            <div className="w-10 h-10 bg-yellow-500 rounded-full"></div>

            <div className="px-2">
                <div className=" text-md">Kabir</div>
                <div className="text-sm text-gray-500">@kabirr342</div>
            </div>

            <button className="ml-auto p-3 bg-white rounded-xl text-sm font-medium text-gray-700 shadow-md hover:bg-gold">
                Follow
            </button>
        </div>
        </>
    )
}
export default function ExploreProject() {
    return (
        <>
            <div className="w-full/4">
                <div className=" w-full h-20 flex items-center justify-between px-4   z-10">
                    <h1 className="text-xl font-semibold">Explore Projects</h1>
                    <div className="text-primary text-xs cursor-pointer px-4 py-2 rounded">See All</div>
                </div>
                <div className="  bg-gray-100 m-2 py-1 rounded-xl">
                    <ExploreCard />
                    <ExploreCard />
                </div>
            </div>

        </>
    )
}