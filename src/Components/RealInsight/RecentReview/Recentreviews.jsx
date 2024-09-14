import RecentReviewsCard from "../RealComps/RecentReviewcard"
export default function RecentReviews() {
    return (
        <>
            <div className="w-1/4  px-4 mt-10" >
                <div className=" w-full h-20 flex items-center justify-between  sticky top-0  z-10">
                    <h1 className="text-xl font-semibold">Recent Reviews</h1>
                    <div className="text-primary text-xs cursor-pointer rounded">View All</div>
                </div>
                <div className="w-full">
                    <RecentReviewsCard />
                    <RecentReviewsCard />
                    <RecentReviewsCard />
                    <RecentReviewsCard />
                </div>
            </div>
        </>
    )
}
