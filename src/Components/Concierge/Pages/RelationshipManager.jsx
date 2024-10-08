import { Carousel } from "@material-tailwind/react";

export default function RelationshipManager (){
    return (
      <>
        <div className="mt-8  ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex  flex-col ">
          <div className="hidden lg:!grid bg-primary lg:h-[73vh]  relative grid-cols-[40%,60%] gap-6 py-16 px-20  w-full">
            <div className="flex flex-col relative z-20">
              <p className="text-white text-4xl">Relationship</p>
              <p className="text-white text-4xl mb-4">Manager</p>
              <textarea
                className="flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full h-40 mb-4 text-black"
                placeholder="Submit your query to us.."
              ></textarea>
              <button className="px-4 rounded-lg py-2 mr-auto text-lg font-semibold bg-white text-primary-background">
                Send
              </button>
            </div>
            <div className="flex flex-col mt-10 gap-10 relative z-20 text-white">
              <div className="flex justify-around w-2/3 bg-[#ffffff25] py-2.5 rounded-lg ml-auto">
                <img
                  alt="star"
                  loading="lazy"
                  width="12"
                  height="12"
                  decoding="async"
                  data-nimg="1"
                  className="mt-auto mb-auto"
                  src="/svgs/star.b7742a54.svg"
                  style={{ color: "transparent" }}
                />
                <p>Guidance through ownership</p>
                <img
                  alt="star"
                  loading="lazy"
                  width="12"
                  height="12"
                  decoding="async"
                  data-nimg="1"
                  className="mt-auto mb-auto"
                  src="/svgs/star.b7742a54.svg"
                  style={{ color: "transparent" }}
                />
              </div>
              <div className="flex justify-around w-2/3 bg-[#ffffff25] relative py-2.5 rounded-lg ml-auto mr-auto">
                <img
                  alt="star"
                  loading="lazy"
                  width="12"
                  height="12"
                  decoding="async"
                  data-nimg="1"
                  className="mt-auto mb-auto"
                  src="/svgs/star.b7742a54.svg"
                  style={{ color: "transparent" }}
                />
                <p>Assistance in identification</p>
                <img
                  alt="star"
                  loading="lazy"
                  width="12"
                  height="12"
                  decoding="async"
                  data-nimg="1"
                  className="mt-auto mb-auto"
                  src="/svgs/star.b7742a54.svg"
                  style={{ color: "transparent" }}
                />
              </div>
              <div className="flex justify-around w-2/3 bg-[#ffffff25] py-2.5 rounded-lg">
                <img
                  alt="star"
                  loading="lazy"
                  width="12"
                  height="12"
                  decoding="async"
                  data-nimg="1"
                  className="mt-auto mb-auto"
                  src="/svgs/star.b7742a54.svg"
                  style={{ color: "transparent" }}
                />
                <p>Handling in transaction process</p>
                <img
                  alt="star"
                  loading="lazy"
                  width="12"
                  height="12"
                  decoding="async"
                  data-nimg="1"
                  className="mt-auto mb-auto"
                  src="/svgs/star.b7742a54.svg"
                  style={{ color: "transparent" }}
                />
              </div>
            </div>
            <img
              alt="relationship"
              loading="lazy"
              width="618"
              height="411"
              decoding="async"
              data-nimg="1"
              className="h-[300px] w-[451px] absolute z-10 left-[-2px] bottom-0"
              src="/webp/bg1.webp"
              style={{ color: "transparent" }}
            />
            <img
              alt="relationship"
              loading="lazy"
              width="524"
              height="391"
              decoding="async"
              data-nimg="1"
              className="h-[285px] w-[382px] absolute z-10 right-0 bottom-0"
              src="/webp/bg2.webp"
              style={{ color: "transparent" }}
            />
          </div>
          <div className="lg:!hidden relative bg-primary flex  flex-col gap-3 py-16 px-6 w-full">
            <div className="flex flex-col relative z-20">
              <p className="text-white text-4xl">Relationship</p>
              <p className="text-white text-4xl mb-4">Manager</p>
              <textarea
                className="flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full h-40 mb-4 text-black"
                placeholder="Submit your query to us.."
              ></textarea>
              <button className="px-4 rounded-lg py-2 mr-auto text-lg font-semibold bg-white text-primary-background">
                Send
              </button>
            </div>
            <div className="w-full relative z-20 mt-7 text-white">
              <div className="overflow-hidden">
                <div
                  className="flex -ml-4"
                  style={{ transform: "translate3d(0px, 0px, 0px)" }}
                >
                  <Carousel
                    className="rounded-xl"
                    autoplay={true}
                    loop={true}
                    autoplayDelay={3000}
                    navigation={false}
                    prevArrow={({ handlePrev }) => (
                      <span onClick={handlePrev} />
                    )}
                    nextArrow={({ handleNext }) => (
                      <span onClick={handleNext} />
                    )}
                  >
                    <div className="min-w-0 shrink-0 grow-0 basis-full pl-4">
                      <div className="flex justify-around bg-[#ffffff25] py-2.5 rounded-lg">
                        <img
                          alt="star"
                          loading="lazy"
                          width="12"
                          height="12"
                          decoding="async"
                          data-nimg="1"
                          className="mt-auto mb-auto"
                          src="/svgs/star.b7742a54.svg"
                          style={{ color: "transparent" }}
                        />
                        <p>Guidance through ownership</p>
                        <img
                          alt="star"
                          loading="lazy"
                          width="12"
                          height="12"
                          decoding="async"
                          data-nimg="1"
                          className="mt-auto mb-auto"
                          src="/svgs/star.b7742a54.svg"
                          style={{ color: "transparent" }}
                        />
                      </div>
                    </div>
                    <div className="min-w-0 shrink-0 grow-0 basis-full pl-4">
                      <div className="flex justify-around bg-[#ffffff25] py-2.5 rounded-lg">
                        <img
                          alt="star"
                          loading="lazy"
                          width="12"
                          height="12"
                          decoding="async"
                          data-nimg="1"
                          className="mt-auto mb-auto"
                          src="/svgs/star.b7742a54.svg"
                          style={{ color: "transparent" }}
                        />
                        <p>Assistance in identification</p>
                        <img
                          alt="star"
                          loading="lazy"
                          width="12"
                          height="12"
                          decoding="async"
                          data-nimg="1"
                          className="mt-auto mb-auto"
                          src="/svgs/star.b7742a54.svg"
                          style={{ color: "transparent" }}
                        />
                      </div>
                    </div>
                    <div className="min-w-0 shrink-0 grow-0 basis-full pl-4">
                      <div className="flex justify-around bg-[#ffffff25] py-2.5 rounded-lg">
                        <img
                          alt="star"
                          loading="lazy"
                          width="12"
                          height="12"
                          decoding="async"
                          data-nimg="1"
                          className="mt-auto mb-auto"
                          src="/svgs/star.b7742a54.svg"
                          style={{ color: "transparent" }}
                        />
                        <p>Handling in transaction process</p>
                        <img
                          alt="star"
                          loading="lazy"
                          width="12"
                          height="12"
                          decoding="async"
                          data-nimg="1"
                          className="mt-auto mb-auto"
                          src="/svgs/star.b7742a54.svg"
                          style={{ color: "transparent" }}
                        />
                      </div>
                    </div>
                  </Carousel>
                </div>
              </div>
            </div>
            <img
              alt="relationship"
              loading="lazy"
              width="618"
              height="411"
              decoding="async"
              data-nimg="1"
              className="h-[100px] w-[150px] absolute z-10 left-[-1px] bottom-0"
              src="/webp/bg1.webp"
              style={{ color: "transparent" }}
            />
            <img
              alt="relationship"
              loading="lazy"
              width="524"
              height="391"
              decoding="async"
              data-nimg="1"
              className="h-[85px] w-[127px] absolute z-10 right-0 bottom-0"
              src="/webp/bg2.webp"
              style={{ color: "transparent" }}
            />
          </div>
        </div>
      </>
    );
  };