import PropCard from "../../CompoCards/Cards/PropCard";
import PropCard2 from "../../CompoCards/Cards/PropCard2";
import React, { useRef, useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import "../../../css/embla.css";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import { CrossIcon } from "lucide-react";

const usePrevNextButtons = (emblaApi, onButtonClick) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    if (onButtonClick) onButtonClick(emblaApi);
  }, [emblaApi, onButtonClick]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    if (onButtonClick) onButtonClick(emblaApi);
  }, [emblaApi, onButtonClick]);

  const onSelect = useCallback((emblaApi) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

const PrevButton = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className="embla__button embla__button--prev border-2 border-black"
      type="button"
      {...restProps}
    >
      <svg className="embla__button__svg " viewBox="0 0 532 532">
        <path
          fill="currenColor"
          d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
        />
      </svg>
      {children}
    </button>
  );
};

const NextButton = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className="embla__button embla__button--next border-2 border-gold"
      type="button"
      {...restProps}
    >
      <svg className="embla__button__svg" viewBox="0 0 532 532">
        <path
          fill="gold"
          d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
        />
      </svg>
      {children}
    </button>
  );
};

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max);

const OPTIONS = { loop: true };
// SLIDES should be PropCard2 list

const EmblaCarousel = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback((emblaApi) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__slide__number");
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback((emblaApi, eventName) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = eventName === "scroll";

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const tweenValue = 1.3 - Math.abs(diffToTarget * tweenFactor.current);
        const scale = numberWithinRange(tweenValue, 0, 1.3).toString();
        const tweenNode = tweenNodes.current[slideIndex];
        tweenNode.style.transform = `scale(${scale})`;
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale);
  }, [emblaApi, tweenScale]);

  return (
    <div className="embla ">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((card, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">{card}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </div>
  );
};

export default function MyProperties() {
  const [prop, setProp] = useState([]);
  const [SLIDES, setSlides] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    // fetch properties from the server
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    const fetchProperties = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/property/fetchallpropertiesForUser?userId=${decoded.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      if (response) {
        const properties = await response.json();
        setProp(properties);
        console.log(properties);

        // Populate slides only for approved properties
        properties.forEach((property) => {
          if (property.applicationStatus === "approved") {
            setSlides((prev) => [
              ...prev,
              <Link to={"/safe/Dealing/" + property._id} key={property._id}>
                <PropCard2 props={property} />
              </Link>,
            ]);
          }
        });
        return;
      }
      toast.error("Error fetching properties");
    };
    fetchProperties();
  }, []);

  // Function to handle card click
  const handleCardClick = (property) => {
    if (property.applicationStatus === "approved") {
      // Redirect to the defined state
      window.location.href = `/safe/Dealing/${property._id}`;
    } else if (
      property.applicationStatus === "more-info-required" ||
      property.applicationStatus === "under-review"
    ) {
      console.log("clicked a ", property.applicationStatus);

      // Open modal for other statuses
      setModalMessage(
        `Property status: ${property.applicationStatus}. Please check back later.`
      );
      setModalIsOpen(true);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      {modalIsOpen ? (
        <div class=" fixed inset-0 z-50 grid h-screen w-screen place-items-center   backdrop-blur-sm transition-opacity duration-300">
          <div class="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white border-[2px] border-black/20 shadow-lg">
            <div class="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
              Sorry but you need to complete your documents
            </div>
            <div class="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
              {modalMessage}
            </div>
            <div class="flex shrink-0 flex-wrap items-center pt-4 justify-end">
              <button
                onClick={closeModal}
                data-dialog-close="true"
                class="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="hidden lg:!flex flex-wrap gap-4 pb-5 mx-2">
            {prop.map((property, index) => (
              <div key={index} onClick={() => handleCardClick(property)}>
                <PropCard key={property._id} props={property} />
              </div>
            ))}
            <div className="bg-white drop-shadow-2xl  border-transparent border-b-4 border-[1px] hover:border-simple hover:border-b-4 hover:border-[1px] p-4 rounded-xl w-64">
              <div className="flex flex-col items-center justify-center gap-4">
                <img
                  className="w-[60%]  "
                  src={"/images/propertyicon.png"}
                  alt="img"
                />
                <div className="bg-gray-200 p-2 rounded-xl w-full ">Haven&apos;t added property yet!! </div>
                <Link className="w-full" to="/addproperty">
                  <button className="text-black w-full bg-white border-secondary hover:border-simple shadow-2xl flex border-[1.5px]  text-xs py-3 rounded-md  gap-2 items-center justify-center"> 
                    Add property
                    <img
                      alt="plus"
                      loading="lazy"
                      width="12"
                      height="12"
                      decoding="async"
                      data-nimg="1"
                      className="mt-auto mb-auto"
                      style={{ color: "transparent" }}
                      src="/svgs/plus.aef96496.svg"
                    />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:!hidden pb-5 mt-10">
            <EmblaCarousel slides={SLIDES} options={OPTIONS} />
          </div>
        </div>
      )}
    </>
  );
}
