import { Link } from "react-router-dom";
import Profile from "../User/Profile/profile";
const NameHeader = () => {
  return (
    <>
      <div className=" mt-5 lg:hidden">
        <p className=" text-xl font-semibold mb-2">
          Real <span className=" text-primary"> Insight</span>
        </p>
        <hr className="bg-primary w-12 h-1 rounded-sm" />
      </div>
      <div className=" lg:!flex justify-between mt-5 align-middle hidden">
        <div className=" mb-auto">
          <p className=" text-xl font-semibold mb-2">
            Real <span className=" text-primary"> Insight </span>
          </p>
          <hr className="bg-primary w-12 h-1 rounded-sm" />
        </div>
        <Profile />
      </div>
      <p className="text-xs text-secondary">
        No biased reviews &amp; ratings, that's it!
      </p>
    </>
  );
}

const ReviewCard = () => {
  return (
    <div className="flex flex-1 flex-col mx-3 bg-white rounded-xl px-8 text-center gap-3 py-8">
    <div className=" relative ml-auto mr-auto">
      <img
        alt="accountDemoImg"
        loading="lazy"
        width="259"
        height="258"
        decoding="async"
        data-nimg="1"
        className=" h-24 w-24"
        style={{ color: "transparent" }}
        src="/webp/profile.webp"
      />
      <img
        alt="quotes"
        loading="lazy"
        width="52"
        height="53"
        decoding="async"
        data-nimg="1"
        className=" absolute bottom-0 right-0 h-10 w-10 translate-x-[25%] translate-y-[25%]"
        style={{ color: "transparent" }}
        src="/svgs/quotes.3c860e81.svg"
      />
    </div>
    <p className="text-xs text-secondary font-regular">
      The property is very good{" "}
    </p>
    <div className="h-2.5 ml-auto mr-auto w-2.5 rounded-full bg-primary"></div>
    <p className=" font-bold text-base">Lorem Ipsum</p>
    <p className="text-xs text-secondary font-regular">Lorem Ipsum </p>
  </div>
  )
}

const PopularProjectCard = () => {
  return (
    <div className="bg-white  p-4 rounded-xl">
      <img
        src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&amp;w=1770&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="home"
        className=" rounded-xl"
      />
      <h1 className="text-xl mt-3">Mahira-68</h1>
      <div className="flex flex-row justify-between mt-4">
        <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full mt-auto mb-auto mr-1">
          <img
            className="aspect-square h-full w-full"
            alt="profilePic"
            src="https://api.dicebear.com/8.x/pixel-art/svg?seed=pp"
          />
        </span>
        <p className=" text-xs mt-auto mb-auto flex-1 ml-1 mr-1"> Deepak </p>
        <button className=" text-[14px] bg-[#eaf8ec] text-[#55c960] py-2 px-4  rounded-xl">
          view
        </button>
      </div>
    </div>
  );
}

const RecentReviewCard = () => {
  return (
    <div className="flex-1 flex flex-col h-screen sticky top-0 mt-[62px] ">
      <div className="flex justify-between">
        <p className=" text-xl font-semibold">Recent Reviews</p>
        <Link className="mt-auto mb-auto text-primary text-xs" to="/">
          {" "}
          See all{" "}
        </Link>
      </div>
      <div className="flex flex-col flex-1 my-5 gap-5">
        <ReviewCard />
        <ReviewCard />
      </div>
    </div>
  );
}

const ExploreProjectCard = () =>{
  return (
    <div className="flex flex-row justify-between">
      <div className="flex gap-2">
        <div className=" h-10 rounded-full w-10 bg-yellow-400"></div>
        <div className="flex flex-col">
          <p className="text-sm">Kabir</p>
          <p className="text-xs mt-auto text-secondary">@kabirr342</p>
        </div>
      </div>
      <button className="inactive text-black hover:text-white shadow-2xl flex border-[1.5px] px-5 text-xs py-3 rounded-md  gap-2">
        <p className="mt-auto mb-auto">Follow</p>
      </button>
    </div>
  );
}

const ExploreProject = () => {
  return (
    <div className="">
      <div className="flex justify-between">
        <p className=" text-xl font-semibold">Explore Projects</p>
        <Link className="mt-auto mb-auto text-primary text-xs" to="/">
          {" "}
          See all{" "}
        </Link>
      </div>
      <div className="mx-2 bg-white py-7 px-3 gap-5 flex flex-col mt-5 rounded-lg">
        <ExploreProjectCard />
        <ExploreProjectCard />
      </div>
    </div>
  );
}

const Explore = () => {
  return (
    <div className="flex-1 flex flex-col gap-5">
      <div className="flex bg-white py-2 px-4 rounded-xl gap-2">
        <img
          alt="search"
          loading="lazy"
          width="22"
          height="22"
          decoding="async"
          data-nimg="1"
          className=" mt-auto mb-auto"
          style={{ color: "transparent" }}
          src="/svgs/search.ad094338.svg"
        />
        <input
          type="text"
          className="flex h-8 w-full border-2 rounded-lg bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 border-none border-transparent"
          placeholder="Search Projects"
        />
      </div>
      <ExploreProject />
      <div className="">
        <div className="flex justify-between">
          <p className=" text-xl font-semibold">Popular Projects</p>
          <Link className="mt-auto mb-auto text-primary text-xs" to="/">
            {" "}
            See all{" "}
          </Link>
        </div>
        <div className=" px-2 gap-5 flex flex-col mt-5 rounded-lg">
          <PopularProjectCard />
          <PopularProjectCard />
        </div>
      </div>
    </div>
  );
}

const FavouritesCard = () => {
  return (
    <>
      <Link className="flex flex-col gap-2" to="/insight/discussion/1">
        <div className="flex flex-col gap-2">
          <div className=" h-14 w-14 rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1521574873411-508db8dbe55f?q=80&amp;w=1887&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="favourite"
              className=" h-full w-full rounded-lg"
            />
          </div>
          <p className=" text-xs text-center">Mahira</p>
        </div>
      </Link>
    </>
  );
}

const Favourites = () => {
  return (
    <>
      <p className=" text-xl font-semibold">Favourites</p>
      <div className="flex flex-row overflow-x-scroll w-full  gap-7 mt-4 ">
        <FavouritesCard />
        <FavouritesCard />
        <FavouritesCard />
        <FavouritesCard />
        <FavouritesCard />
   
        {/* <Link className="flex flex-col gap-2" to="/insight/discussion/8">
          <div className="flex flex-col gap-2">
            <div className=" h-14 w-14 rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1521574873411-508db8dbe55f?q=80&amp;w=1887&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="favourite"
                className=" h-full w-full rounded-lg"
              />
            </div>
            <p className=" text-xs text-center">Mahira</p>
          </div>
        </Link>
        <Link className="flex flex-col gap-2" to="/insight/discussion/9">
          <div className="flex flex-col gap-2">
            <div className=" h-14 w-14 rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1521574873411-508db8dbe55f?q=80&amp;w=1887&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="favourite"
                className=" h-full w-full rounded-lg"
              />
            </div>
            <p className=" text-xs text-center">Mahira</p>
          </div>
        </Link> */}
      </div>
    </>
  );
}
const parseTextWithLinks = (text) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
          return (
              <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {part}
              </a>
          );
      }
      return part;
  });
};


const PostCard = ({text,imageUrl,VideoUrl}) => {
  return (
    <>
      <div className="flex flex-1 gap-2">
        <div className=" h-10 rounded-full w-10 bg-yellow-400"></div>
        <div className="flex flex-1 flex-col">
          <p className=" text-xs font-medium">
            Sahil D souza <span className=" text-secondary">Sahila9832</span>
          </p>
          <p className=" text-sm my-2 font-normal">
          {parseTextWithLinks(text)}
          </p>
          {VideoUrl ? (
            <div className="rounded-lg overflow-hidden">
              <video className="w-full h-auto" controls src={VideoUrl} alt="User video" />
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden">
              <img src={imageUrl} alt="Favorite spot in palace" className="w-full h-auto object-cover" />
            </div>
          )}
          <div className=" flex gap-6 text-xs mt-3">
            <div className=" flex gap-3">
              <img
                alt="heart"
                loading="lazy"
                width="17"
                height="15"
                decoding="async"
                data-nimg="1"
                className=" mt-2 mb-2"
                style={{ color: "transparent" }}
                src="/svgs/heart.6dcf6617.svg"
              />
              <p className="mt-auto mb-auto">97.5k</p>
            </div>
            <div className=" flex gap-3">
              <img
                alt="comment"
                loading="lazy"
                width="15"
                height="16"
                decoding="async"
                data-nimg="1"
                className=" mt-2 mb-2"
                style={{ color: "transparent" }}
                src="/svgs/comments.85cd7bd9.svg"
              />
              <p className="mt-auto mb-auto">668</p>
            </div>
            <div className=" flex gap-3">
              <img
                alt="share"
                loading="lazy"
                width="15"
                height="16"
                decoding="async"
                data-nimg="1"
                className=" mt-2 mb-2"
                style={{ color: "transparent" }}
                src="/svgs/share.d6a5ee76.svg"
              />
              <p className="mt-auto mb-auto">Share</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const RecentDiscussion = () => {
  // a text containing a link
  const text = "Check out this amazing website: https://example.com";
  return (
    <>
      <div>
        <p className=" text-xl font-semibold">Recent Discussions</p>
        <div className=" px-5 gap-7 mt-7 flex flex-col bg-white py-5 rounded-xl">
          <PostCard text={text} imageUrl={'/images/image.jpg'}/>
          <PostCard text={text} VideoUrl={'/video/video.mp4'}/>
        </div>
      </div>
    </>
  );
}

const ReviewsHere = () => {
  return (
    <>
      <div>
        <p className=" text-xl font-semibold">Recent Reviews</p>
        <div className=" px-5 gap-5  flex flex-col py-5 rounded-xl">
          <div className=" w-full rounded-xl bg-white flex flex-col p-5 gap-3">
            <div className="flex">
              <div className=" h-10 rounded-full w-10 bg-yellow-400"></div>
              <div className=" ml-4">
                <p className="text-sm ">John Doe</p>
                <p className="text-xs">2 days ago</p>
              </div>
              <div className="flex gap-6 mt-auto mb-auto ml-auto ">
                <img
                  alt="starReview"
                  loading="lazy"
                  width="20"
                  height="21"
                  decoding="async"
                  data-nimg="1"
                  style={{color:'transparent'}}
                  src="/_next/static/media/starReview.5e3de9ec.svg"
                />
                <p> 7/10</p>
              </div>
            </div>
            <div className=" text-xs">
              Lorem Ipsum Dolor Lorem Ipsum DolorLorem Ipsum DolorLorem Ipsum
              DolorvLorem Ipsum DolorLorem Ipsum Dolor Lorem Ipsum DolorLorem
              Ipsum DolorLorem Ipsum DolorvLorem Ipsum Dolor
            </div>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="radix-:R1jekafnnja:"
              data-state="closed"
              className="mt-auto flex w-full "
            >
              <div className="flex mt-auto flex-row w-full text-xs text-secondary py-2 px-4 rounded-xl justify-end">
                Show Rating
              </div>
            </button>
          </div>
          <div className=" w-full rounded-xl bg-white flex flex-col p-5 gap-3">
            <div className="flex">
              <div className=" h-10 rounded-full w-10 bg-yellow-400"></div>
              <div className=" ml-4">
                <p className="text-sm ">John Doe</p>
                <p className="text-xs">2 days ago</p>
              </div>
              <div className="flex gap-6 mt-auto mb-auto ml-auto ">
                <img
                  alt="starReview"
                  loading="lazy"
                  width="20"
                  height="21"
                  decoding="async"
                  data-nimg="1"
                  style={{color:'transparent'}}
                  src="/_next/static/media/starReview.5e3de9ec.svg"
                />
                <p> 7/10</p>
              </div>
            </div>
            <div className=" text-xs">
              Lorem Ipsum Dolor Lorem Ipsum DolorLorem Ipsum DolorLorem Ipsum
              DolorvLorem Ipsum DolorLorem Ipsum Dolor Lorem Ipsum DolorLorem
              Ipsum DolorLorem Ipsum DolorvLorem Ipsum Dolor
            </div>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="radix-:R1lekafnnja:"
              data-state="closed"
              className="mt-auto flex w-full "
            >
              <div className="flex mt-auto flex-row w-full text-xs text-secondary py-2 px-4 rounded-xl justify-end">
                Show Rating
              </div>
            </button>
          </div>
          <div className=" w-full rounded-xl bg-white flex flex-col p-5 gap-3">
            <div className="flex">
              <div className=" h-10 rounded-full w-10 bg-yellow-400"></div>
              <div className=" ml-4">
                <p className="text-sm ">John Doe</p>
                <p className="text-xs">2 days ago</p>
              </div>
              <div className="flex gap-6 mt-auto mb-auto ml-auto ">
                <img
                  alt="starReview"
                  loading="lazy"
                  width="20"
                  height="21"
                  decoding="async"
                  data-nimg="1"
                  style={{color:'transparent'}}
                  src="/_next/static/media/starReview.5e3de9ec.svg"
                />
                <p> 7/10</p>
              </div>
            </div>
            <div className=" text-xs">
              Lorem Ipsum Dolor Lorem Ipsum DolorLorem Ipsum DolorLorem Ipsum
              DolorvLorem Ipsum DolorLorem Ipsum Dolor Lorem Ipsum DolorLorem
              Ipsum DolorLorem Ipsum DolorvLorem Ipsum Dolor
            </div>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="radix-:R1nekafnnja:"
              data-state="closed"
              className="mt-auto flex w-full "
            >
              <div className="flex mt-auto flex-row w-full text-xs text-secondary py-2 px-4 rounded-xl justify-end">
                Show Rating
              </div>
            </button>
          </div>
          <div className=" w-full rounded-xl bg-white flex flex-col p-5 gap-3">
            <div className="flex">
              <div className=" h-10 rounded-full w-10 bg-yellow-400"></div>
              <div className=" ml-4">
                <p className="text-sm ">John Doe</p>
                <p className="text-xs">2 days ago</p>
              </div>
              <div className="flex gap-6 mt-auto mb-auto ml-auto ">
                <img
                  alt="starReview"
                  loading="lazy"
                  width="20"
                  height="21"
                  decoding="async"
                  data-nimg="1"
                  style={{color:'transparent'}}
                  src="/_next/static/media/starReview.5e3de9ec.svg"
                />
                <p> 7/10</p>
              </div>
            </div>
            <div className=" text-xs">
              Lorem Ipsum Dolor Lorem Ipsum DolorLorem Ipsum DolorLorem Ipsum
              DolorvLorem Ipsum DolorLorem Ipsum Dolor Lorem Ipsum DolorLorem
              Ipsum DolorLorem Ipsum DolorvLorem Ipsum Dolor
            </div>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="radix-:R1pekafnnja:"
              data-state="closed"
              className="mt-auto flex w-full "
            >
              <div className="flex mt-auto flex-row w-full text-xs text-secondary py-2 px-4 rounded-xl justify-end">
                Show Rating
              </div>
            </button>
          </div>
          <div className=" w-full rounded-xl bg-white flex flex-col p-5 gap-3">
            <div className="flex">
              <div className=" h-10 rounded-full w-10 bg-yellow-400"></div>
              <div className=" ml-4">
                <p className="text-sm ">John Doe</p>
                <p className="text-xs">2 days ago</p>
              </div>
              <div className="flex gap-6 mt-auto mb-auto ml-auto ">
                <img
                  alt="starReview"
                  loading="lazy"
                  width="20"
                  height="21"
                  decoding="async"
                  data-nimg="1"
                  style={{color:'transparent'}}
                  src="/_next/static/media/starReview.5e3de9ec.svg"
                />
                <p> 7/10</p>
              </div>
            </div>
            <div className=" text-xs">
              Lorem Ipsum Dolor Lorem Ipsum DolorLorem Ipsum DolorLorem Ipsum
              DolorvLorem Ipsum DolorLorem Ipsum Dolor Lorem Ipsum DolorLorem
              Ipsum DolorLorem Ipsum DolorvLorem Ipsum Dolor
            </div>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="radix-:R1rekafnnja:"
              data-state="closed"
              className="mt-auto flex w-full "
            >
              <div className="flex mt-auto flex-row w-full text-xs text-secondary py-2 px-4 rounded-xl justify-end">
                Show Rating
              </div>
            </button>
          </div>
          <div className=" w-full rounded-xl bg-white flex flex-col p-5 gap-3">
            <div className="flex">
              <div className=" h-10 rounded-full w-10 bg-yellow-400"></div>
              <div className=" ml-4">
                <p className="text-sm ">John Doe</p>
                <p className="text-xs">2 days ago</p>
              </div>
              <div className="flex gap-6 mt-auto mb-auto ml-auto ">
                <img
                  alt="starReview"
                  loading="lazy"
                  width="20"
                  height="21"
                  decoding="async"
                  data-nimg="1"
                  style={{color:'transparent'}}
                  src="/_next/static/media/starReview.5e3de9ec.svg"
                />
                <p> 7/10</p>
              </div>
            </div>
            <div className=" text-xs">
              Lorem Ipsum Dolor Lorem Ipsum DolorLorem Ipsum DolorLorem Ipsum
              DolorvLorem Ipsum DolorLorem Ipsum Dolor Lorem Ipsum DolorLorem
              Ipsum DolorLorem Ipsum DolorvLorem Ipsum Dolor
            </div>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="radix-:R1tekafnnja:"
              data-state="closed"
              className="mt-auto flex w-full "
            >
              <div className="flex mt-auto flex-row w-full text-xs text-secondary py-2 px-4 rounded-xl justify-end">
                Show Rating
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Real() {
  return (
    <>
      <div className="flex-col w-full flex-1 px-7 h-svh lg:!h-screen hidden lg:!flex overflow-y-scroll justify-between bg-[#f9f9f9] no-scrollbar">
        <NameHeader />
        <div className=" mt-5 flex-1 grid grid-cols-[25%,50%,25%]">
          <RecentReviewCard />
          <div className="flex-1 px-8 flex flex-col gap-8">
            <div className="flex justify-between text-sm gap-5">
              <Link className="flex-1 flex" to="/realinsight">
                <button className=" rounded-lg flex-1 border-simple border-b-4 border-[1px] py-3">
                  Discussions
                </button>
              </Link>
              <Link className="flex-1 flex" to="/realinsight">
                <button className=" rounded-lg  flex-1 border-simple-secondary border-b-4 border-[1px] py-3">
                  Reviews
                </button>
              </Link>
            </div>
            <div>
              <Favourites />
              <RecentDiscussion/>
            </div>
          </div>
          <Explore />
        </div>
      </div>


      <div className="flex-col flex flex-1  h-svh lg:!hidden overflow-y-scroll justify-between bg-[#f9f9f9] no-scrollbar">
        <div className="px-7 mt-5">
          <p className=" text-xl font-semibold mb-2">
            Real <span className=" text-primary">Insight</span>
          </p>
          <hr className="bg-primary w-12 h-1 rounded-sm" />
        </div>
        <div className=" mt-5 flex-1 flex flex-col">
          <div className=" flex w-full justify-between px-2">
            <div className="flex flex-1 justify-between text-sm gap-5">
              <Link className="flex-1 flex" to="/">
                <button className=" rounded-lg flex-1 border-simple border-b-4 border-[1px] py-3">
                  Discussions
                </button>
              </Link>
              <Link className="flex-1 flex" to="/">
                <button className=" rounded-lg flex-1 border-simple-secondary border-b-4 border-[1px] py-3">
                  Reviews
                </button>
              </Link>
            </div>
          </div>
          <button className=" mx-2 my-6 inactive text-black hover:text-white border-secondary flex border-2 sm:px-20 px-2.5 py-2.5 rounded-xl gap-2">
            <img
              alt="search"
              loading="lazy"
              width="24"
              height="24"
              decoding="async"
              data-nimg="1"
              className=" mt-auto mb-auto"
              style={{ color: "transparent" }}
              src="/svgs/search3.943d1ef8.svg"
            />{" "}
            Search Projects{" "}
          </button>
          <div className=" ">
            <div className="flex flex-row overflow-x-scroll gap-7 px-2 mt-4 no-scrollbar">
              <FavouritesCard />
              <FavouritesCard />
              <FavouritesCard />
              <FavouritesCard />
          
            </div>
            <div className="px-5 gap-7 mt-4 flex flex-col bg-white py-5 rounded-xl">
              <PostCard text="Check out this amazing website: https://example.com" imageUrl={'/images/image.jpg'}/>
              <PostCard text="Check out this amazing website: https://example.com" VideoUrl={'/video/video.mp4'}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
