import ExploreProject from "./ExplorePro/ExploreProject"
import RecentProjects from "./RecentProjects/RecentProjects"

const SearchBar = () => {
    return (
        <><div className="">
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input type="search" id="default-search" className="block w-full p-3 ps-10 text-md text-black  rounded-xl " placeholder="Search" required />
            </div>
        </div>
        </>
    )
}
export default function Disscussion() {
    return (
        <>
            <div className="w-1/4 mx-auto">
                <SearchBar/>
                <ExploreProject />
                <RecentProjects />
            </div>
        </>
    )
}