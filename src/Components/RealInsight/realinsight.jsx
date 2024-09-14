import RealHeader from "./RealComps/RealHeader"
import RecentReviews from "./RecentReview/Recentreviews"
import Project from "./Disscussion/Disscussion"
import Disscussion from "./Project/Project"
import { useState } from 'react';

const TabSelector = () => {
    const [activeTab, setActiveTab] = useState('discussions');
  
    return (
      <div className="flex w-full  lg:w-1/2 m-auto ">
        <button
          onClick={() => setActiveTab('discussions')}
          className={`px-4 py-2 border  border-b-4 rounded-lg mr-1 w-full ${
            activeTab === 'discussions' ? 'border-orange-400' : ''
          } focus:outline-none`}
        >
          Discussions
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 border border-b-4 rounded-lg ml-1 w-full ${
            activeTab === 'reviews' ? 'border-orange-400' : ''
          } focus:outline-none`}
        >
          Reviews
        </button>
      </div>
    );
  };

export default function RealInsight() {
    return (
        <>
            <div className=" min-h-screen w-full overflow-y-scroll no-scrollbar bg-gray-50 " >
                <div className="w-full my-2">
                    <RealHeader />
                </div>
                <div className="w-full px-4 my-4">
                    <TabSelector />
                </div>
                <div className="flex flex-row w-full px-6">
                    <RecentReviews />
                    <Project />
                    <Disscussion />
                </div>
            </div>

        </>
    )
}