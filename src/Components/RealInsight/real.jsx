import { Link } from "react-router-dom";

const NameHeader = () => {
  return (
    <>
      <div class=" mt-5 lg:hidden">
        <p class=" text-xl font-semibold mb-2">
          Real <span class=" text-primary"> Insight</span>
        </p>
        <hr class="bg-primary w-12 h-1 rounded-sm" />
      </div>
      <div class=" lg:!flex justify-between mt-5 align-middle hidden">
        <div class=" mb-auto">
          <p class=" text-xl font-semibold mb-2">
            Real <span class=" text-primary"> Insight </span>
          </p>
          <hr class="bg-primary w-12 h-1 rounded-sm" />
        </div>
        <button class=" px-1 py-1 lg:!flex mt-auto mb-auto bg-white rounded-full hidden border-black border-[1px]">
          <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full mt-auto mb-auto mr-1">
            <img
              class="aspect-square h-full w-full"
              alt="profilePic"
              src="https://images.unsplash.com/photo-1523560220134-8f26a720703c?q=80&amp;w=1854&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </span>
          <p class="mt-auto mb-auto text-xs mx-1">Deepak</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-down mt-auto mb-auto h-4"
          >
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </button>
      </div>
      <p class="text-xs text-secondary">
        No biased reviews &amp; ratings, that's it!
      </p>
    </>
  );
}

const ReviewCard = () => {
  return (
    <div class="flex flex-1 flex-col mx-3 bg-white rounded-xl px-8 text-center gap-3 py-8">
    <div class=" relative ml-auto mr-auto">
      <img
        alt="accountDemoImg"
        loading="lazy"
        width="259"
        height="258"
        decoding="async"
        data-nimg="1"
        class=" h-24 w-24"
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
        class=" absolute bottom-0 right-0 h-10 w-10 translate-x-[25%] translate-y-[25%]"
        style={{ color: "transparent" }}
        src="/svgs/quotes.3c860e81.svg"
      />
    </div>
    <p class="text-xs text-secondary font-regular">
      The property is very good{" "}
    </p>
    <div class="h-2.5 ml-auto mr-auto w-2.5 rounded-full bg-primary"></div>
    <p class=" font-bold text-base">Lorem Ipsum</p>
    <p class="text-xs text-secondary font-regular">Lorem Ipsum </p>
  </div>
  )
}

const PopularProjectCard = () => {
  return (
    <div class="bg-white  p-4 rounded-xl">
      <img
        src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&amp;w=1770&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="home"
        class=" rounded-xl"
      />
      <h1 class="text-xl mt-3">Mahira-68</h1>
      <div class="flex flex-row justify-between mt-4">
        <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full mt-auto mb-auto mr-1">
          <img
            class="aspect-square h-full w-full"
            alt="profilePic"
            src="https://api.dicebear.com/8.x/pixel-art/svg?seed=pp"
          />
        </span>
        <p class=" text-xs mt-auto mb-auto flex-1 ml-1 mr-1"> Deepak </p>
        <button class=" text-[14px] bg-[#eaf8ec] text-[#55c960] py-2 px-4  rounded-xl">
          view
        </button>
      </div>
    </div>
  );
}

const RecentReviewCard = () => {
  return (
    <div class="flex-1 flex flex-col h-screen sticky top-0 mt-[62px] ">
      <div class="flex justify-between">
        <p class=" text-xl font-semibold">Recent Reviews</p>
        <Link class="mt-auto mb-auto text-primary text-xs" to="/">
          {" "}
          See all{" "}
        </Link>
      </div>
      <div class="flex flex-col flex-1 my-5 gap-5">
        <ReviewCard />
        <ReviewCard />
      </div>
    </div>
  );
}

const ExploreProjectCard = () =>{
  return (
    <div class="flex flex-row justify-between">
      <div class="flex gap-2">
        <div class=" h-10 rounded-full w-10 bg-yellow-400"></div>
        <div class="flex flex-col">
          <p class="text-sm">Kabir</p>
          <p class="text-xs mt-auto text-secondary">@kabirr342</p>
        </div>
      </div>
      <button class="inactive text-black hover:text-white shadow-2xl flex border-[1.5px] px-5 text-xs py-3 rounded-md  gap-2">
        <p class="mt-auto mb-auto">Follow</p>
      </button>
    </div>
  );
}

const ExploreProject = () => {
  return (
    <div class="">
      <div class="flex justify-between">
        <p class=" text-xl font-semibold">Explore Projects</p>
        <Link class="mt-auto mb-auto text-primary text-xs" to="/">
          {" "}
          See all{" "}
        </Link>
      </div>
      <div class="mx-2 bg-white py-7 px-3 gap-5 flex flex-col mt-5 rounded-lg">
        <ExploreProjectCard />
        <ExploreProjectCard />
      </div>
    </div>
  );
}

const Explore = () => {
  return (
    <div class="flex-1 flex flex-col gap-5">
      <div class="flex bg-white py-2 px-4 rounded-xl gap-2">
        <img
          alt="search"
          loading="lazy"
          width="22"
          height="22"
          decoding="async"
          data-nimg="1"
          class=" mt-auto mb-auto"
          style={{ color: "transparent" }}
          src="/svgs/search.ad094338.svg"
        />
        <input
          type="text"
          class="flex h-8 w-full border-2 rounded-lg bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 border-none border-transparent"
          placeholder="Search Projects"
        />
      </div>
      <ExploreProject />
      <div class="">
        <div class="flex justify-between">
          <p class=" text-xl font-semibold">Popular Projects</p>
          <Link class="mt-auto mb-auto text-primary text-xs" to="/">
            {" "}
            See all{" "}
          </Link>
        </div>
        <div class=" px-2 gap-5 flex flex-col mt-5 rounded-lg">
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
      <Link class="flex flex-col gap-2" to="/insight/discussion/1">
        <div class="flex flex-col gap-2">
          <div class=" h-14 w-14 rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1521574873411-508db8dbe55f?q=80&amp;w=1887&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="favourite"
              class=" h-full w-full rounded-lg"
            />
          </div>
          <p class=" text-xs text-center">Mahira</p>
        </div>
      </Link>
    </>
  );
}

const Favourites = () => {
  return (
    <>
      <p class=" text-xl font-semibold">Favourites</p>
      <div class="flex flex-row overflow-x-scroll w-fit  gap-7 mt-4">
        <FavouritesCard />
        <FavouritesCard />
        <FavouritesCard />
        <FavouritesCard />
        <FavouritesCard />
        <FavouritesCard />
        <FavouritesCard />
        {/* <Link class="flex flex-col gap-2" to="/insight/discussion/8">
          <div class="flex flex-col gap-2">
            <div class=" h-14 w-14 rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1521574873411-508db8dbe55f?q=80&amp;w=1887&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="favourite"
                class=" h-full w-full rounded-lg"
              />
            </div>
            <p class=" text-xs text-center">Mahira</p>
          </div>
        </Link>
        <Link class="flex flex-col gap-2" to="/insight/discussion/9">
          <div class="flex flex-col gap-2">
            <div class=" h-14 w-14 rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1521574873411-508db8dbe55f?q=80&amp;w=1887&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="favourite"
                class=" h-full w-full rounded-lg"
              />
            </div>
            <p class=" text-xs text-center">Mahira</p>
          </div>
        </Link> */}
      </div>
    </>
  );
}

const PostCard = () => {
  return (
    <>
      <div class="flex flex-1 gap-2">
        <div class=" h-10 rounded-full w-10 bg-yellow-400"></div>
        <div class="flex flex-1 flex-col">
          <p class=" text-xs font-medium">
            Sahil D souza <span class=" text-secondary">Sahila9832</span>
          </p>
          <p class=" text-sm mt-2 font-normal">
            Finally achieving my biggest dream, I'm excited to share a picture
            of my favourite spot in my palace.
          </p>
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&amp;w=1770&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="home"
            class=" rounded-xl mt-2"
          />
          <div class=" flex gap-6 text-xs mt-3">
            <div class=" flex gap-3">
              <img
                alt="heart"
                loading="lazy"
                width="17"
                height="15"
                decoding="async"
                data-nimg="1"
                class=" mt-2 mb-2"
                style={{ color: "transparent" }}
                src="/svgs/heart.6dcf6617.svg"
              />
              <p class="mt-auto mb-auto">97.5k</p>
            </div>
            <div class=" flex gap-3">
              <img
                alt="comment"
                loading="lazy"
                width="15"
                height="16"
                decoding="async"
                data-nimg="1"
                class=" mt-2 mb-2"
                style={{ color: "transparent" }}
                src="/svgs/comments.85cd7bd9.svg"
              />
              <p class="mt-auto mb-auto">668</p>
            </div>
            <div class=" flex gap-3">
              <img
                alt="share"
                loading="lazy"
                width="15"
                height="16"
                decoding="async"
                data-nimg="1"
                class=" mt-2 mb-2"
                style={{ color: "transparent" }}
                src="/svgs/share.d6a5ee76.svg"
              />
              <p class="mt-auto mb-auto">Share</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const RecentDiscussion = () => {
  return (
    <>
      <div>
        <p class=" text-xl font-semibold">Recent Discussions</p>
        <div class=" px-5 gap-7 mt-7 flex flex-col bg-white py-5 rounded-xl">
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
        </div>
      </div>
    </>
  );
}

const ReviewsHere = () => {
  return (
    <>
      <div>
        <p class=" text-xl font-semibold">Recent Reviews</p>
        <div class=" px-5 gap-5  flex flex-col py-5 rounded-xl">
          <div class=" w-full rounded-xl bg-white flex flex-col p-5 gap-3">
            <div class="flex">
              <div class=" h-10 rounded-full w-10 bg-yellow-400"></div>
              <div class=" ml-4">
                <p class="text-sm ">John Doe</p>
                <p class="text-xs">2 days ago</p>
              </div>
              <div class="flex gap-6 mt-auto mb-auto ml-auto ">
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
            <div class=" text-xs">
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
              class="mt-auto flex w-full "
            >
              <div class="flex mt-auto flex-row w-full text-xs text-secondary py-2 px-4 rounded-xl justify-end">
                Show Rating
              </div>
            </button>
          </div>
          <div class=" w-full rounded-xl bg-white flex flex-col p-5 gap-3">
            <div class="flex">
              <div class=" h-10 rounded-full w-10 bg-yellow-400"></div>
              <div class=" ml-4">
                <p class="text-sm ">John Doe</p>
                <p class="text-xs">2 days ago</p>
              </div>
              <div class="flex gap-6 mt-auto mb-auto ml-auto ">
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
            <div class=" text-xs">
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
              class="mt-auto flex w-full "
            >
              <div class="flex mt-auto flex-row w-full text-xs text-secondary py-2 px-4 rounded-xl justify-end">
                Show Rating
              </div>
            </button>
          </div>
          <div class=" w-full rounded-xl bg-white flex flex-col p-5 gap-3">
            <div class="flex">
              <div class=" h-10 rounded-full w-10 bg-yellow-400"></div>
              <div class=" ml-4">
                <p class="text-sm ">John Doe</p>
                <p class="text-xs">2 days ago</p>
              </div>
              <div class="flex gap-6 mt-auto mb-auto ml-auto ">
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
            <div class=" text-xs">
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
              class="mt-auto flex w-full "
            >
              <div class="flex mt-auto flex-row w-full text-xs text-secondary py-2 px-4 rounded-xl justify-end">
                Show Rating
              </div>
            </button>
          </div>
          <div class=" w-full rounded-xl bg-white flex flex-col p-5 gap-3">
            <div class="flex">
              <div class=" h-10 rounded-full w-10 bg-yellow-400"></div>
              <div class=" ml-4">
                <p class="text-sm ">John Doe</p>
                <p class="text-xs">2 days ago</p>
              </div>
              <div class="flex gap-6 mt-auto mb-auto ml-auto ">
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
            <div class=" text-xs">
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
              class="mt-auto flex w-full "
            >
              <div class="flex mt-auto flex-row w-full text-xs text-secondary py-2 px-4 rounded-xl justify-end">
                Show Rating
              </div>
            </button>
          </div>
          <div class=" w-full rounded-xl bg-white flex flex-col p-5 gap-3">
            <div class="flex">
              <div class=" h-10 rounded-full w-10 bg-yellow-400"></div>
              <div class=" ml-4">
                <p class="text-sm ">John Doe</p>
                <p class="text-xs">2 days ago</p>
              </div>
              <div class="flex gap-6 mt-auto mb-auto ml-auto ">
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
            <div class=" text-xs">
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
              class="mt-auto flex w-full "
            >
              <div class="flex mt-auto flex-row w-full text-xs text-secondary py-2 px-4 rounded-xl justify-end">
                Show Rating
              </div>
            </button>
          </div>
          <div class=" w-full rounded-xl bg-white flex flex-col p-5 gap-3">
            <div class="flex">
              <div class=" h-10 rounded-full w-10 bg-yellow-400"></div>
              <div class=" ml-4">
                <p class="text-sm ">John Doe</p>
                <p class="text-xs">2 days ago</p>
              </div>
              <div class="flex gap-6 mt-auto mb-auto ml-auto ">
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
            <div class=" text-xs">
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
              class="mt-auto flex w-full "
            >
              <div class="flex mt-auto flex-row w-full text-xs text-secondary py-2 px-4 rounded-xl justify-end">
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
      <div class="flex-col w-full flex-1 px-7 h-svh lg:!h-screen hidden lg:!flex overflow-y-scroll justify-between bg-[#f9f9f9]">
        <NameHeader />
        <div class=" mt-5 flex-1 grid grid-cols-[25%,50%,25%]">
          <RecentReviewCard />
          <div class="flex-1 px-8 flex flex-col gap-8">
            <div class="flex justify-between text-sm gap-5">
              <Link class="flex-1 flex" to="/realinsight">
                <button class=" rounded-lg flex-1 border-simple border-b-4 border-[1px] py-3">
                  Discussions
                </button>
              </Link>
              <Link class="flex-1 flex" to="/realinsight">
                <button class=" rounded-lg  flex-1 border-simple-secondary border-b-4 border-[1px] py-3">
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


      <div class="flex-col flex flex-1  h-svh lg:!hidden overflow-y-scroll justify-between bg-[#f9f9f9]">
        <div class="px-7 mt-5">
          <p class=" text-xl font-semibold mb-2">
            Real <span class=" text-primary">Insight</span>
          </p>
          <hr class="bg-primary w-12 h-1 rounded-sm" />
        </div>
        <div class=" mt-5 flex-1 flex flex-col">
          <div class=" flex w-full justify-between px-2">
            <div class="flex flex-1 justify-between text-sm gap-5">
              <Link class="flex-1 flex" to="/">
                <button class=" rounded-lg flex-1 border-simple border-b-4 border-[1px] py-3">
                  Discussions
                </button>
              </Link>
              <Link class="flex-1 flex" to="/">
                <button class=" rounded-lg flex-1 border-simple-secondary border-b-4 border-[1px] py-3">
                  Reviews
                </button>
              </Link>
            </div>
          </div>
          <button class=" mx-2 my-6 inactive text-black hover:text-white border-secondary flex border-2 sm:px-20 px-2.5 py-2.5 rounded-xl gap-2">
            <img
              alt="search"
              loading="lazy"
              width="24"
              height="24"
              decoding="async"
              data-nimg="1"
              class=" mt-auto mb-auto"
              style={{ color: "transparent" }}
              src="/svgs/search3.943d1ef8.svg"
            />{" "}
            Search Projects{" "}
          </button>
          <div class=" ">
            <div class="flex flex-row overflow-x-scroll gap-7 px-2 mt-4">
              <FavouritesCard />
              <FavouritesCard />
              <FavouritesCard />
              <FavouritesCard />
              <FavouritesCard />
              <FavouritesCard />
              <FavouritesCard />
            </div>
            <div class="px-5 gap-7 mt-4 flex flex-col bg-white py-5 rounded-xl">
              <PostCard/>
              <PostCard/>
              <PostCard/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
