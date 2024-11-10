import React from "react";
import { Link } from "react-router-dom";

const links = [
  {
    title: "FAQ`s",
    to: "/faqs",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-10 w-10 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
        />
      </svg>
    ),
  },
  {
    title: "Laws",
    to: "/laws",
    svg: (
      <svg
        className="h-10 w-10 text-white fill-white"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M21.9,11.553l-3-6a.846.846,0,0,0-.164-.225A.987.987,0,0,0,18,5H13V3a1,1,0,0,0-2,0V5H6a.987.987,0,0,0-.731.328.846.846,0,0,0-.164.225l-3,6a.982.982,0,0,0-.1.447H2a4,4,0,0,0,8,0H9.99a.982.982,0,0,0-.1-.447L7.618,7H11V20H6a1,1,0,0,0,0,2H18a1,1,0,0,0,0-2H13V7h3.382l-2.277,4.553a.982.982,0,0,0-.1.447H14a4,4,0,0,0,8,0h-.01A.982.982,0,0,0,21.9,11.553ZM7.882,12H4.118L6,8.236Zm8.236,0L18,8.236,19.882,12Z" />
      </svg>
    ),
  },
  {
    title: "Library",
    to: "/library",
    svg: (
      <svg
        className="h-10 w-10 text-white fill-white"
        version="1.1"
        id="Layer_1"
        viewBox="0 0 55.203 53.747"
      >
        <path
          d="M53.666,20.361c1.014,0,1.537-0.276,1.537-0.711c0-0.206-0.117-0.447-0.354-0.707c-0.146-0.154-0.332-0.318-0.561-0.487
	L30.197,0.785c-1.428-1.046-3.765-1.046-5.196,0L0.913,18.457C0.296,18.908,0,19.32,0,19.65c0,0.136,0.05,0.255,0.152,0.358
	c0.225,0.222,0.689,0.353,1.384,0.353h4.897v21.144H5.68c-1.235,0-2.238,1.004-2.238,2.238v2.562H2.458
	c-1.235,0-2.237,1.002-2.237,2.233v2.971c0,1.236,1.002,2.238,2.237,2.238h50.071c1.236,0,2.238-1.002,2.238-2.238v-2.971
	c0-1.231-1.002-2.233-2.238-2.233h-0.984v-2.562c0-1.234-1.002-2.238-2.236-2.238h-0.754V20.361H53.666z M18.272,41.504h-5.228
	V20.361h5.228V41.504z M30.105,41.504h-5.227V20.361h5.227V41.504z M27.601,13.337c-1.545,0-2.793-1.248-2.793-2.792
	c0-1.542,1.248-2.79,2.793-2.79c1.543,0,2.793,1.248,2.793,2.79C30.395,12.09,29.145,13.337,27.601,13.337z M41.947,41.504h-5.232
	V20.361h5.232V41.504z"
        />
      </svg>
    ),
  },
  {
    title: "Case Laws",
    to: "/case-laws",
    svg: (
      <svg
        className="h-10 w-10 text-white fill-white"
        xmlns="http://www.w3.org/2000/svg"
        
        viewBox="0 0 100 100"
      >
        <g>
          <g>
            <path
              d="M38,29h4c0.6,0,1-0.4,1-1v-3h14v3c0,0.6,0.4,1,1,1h4c0.6,0,1-0.4,1-1v-3c0-3.3-2.7-6-6-6H43c-3.3,0-6,2.7-6,6
			v3C37,28.6,37.4,29,38,29z"
            />
          </g>
          <g>
            <path d="M74,35H26c-3.3,0-6,2.7-6,6v32c0,3.3,2.7,6,6,6h48c3.3,0,6-2.7,6-6V41C80,37.7,77.3,35,74,35z" />
          </g>
        </g>
      </svg>
    ),
  },
];

const Knowledge = () => {
  return (
    <div className="flex flex-col items-center justify-center md:p-12 p-6 lg:px-28 lg:py-6">
      <h1 className="text-3xl text-center md:text-6xl font-semibold text-black py-6 text-primary">
        We encourage you to empower <br /> your choice with knowledge
      </h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ">
        {links.map((link, index) => (
          <Link to={link.to} key={index} className="group">
            <div className="relative cursor-pointer overflow-hidden bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-lg">
              <span className="absolute top-10 z-0 h-12 w-12 left-10 rounded-full bg-gold transition-all duration-300 group-hover:scale-[10]"></span>
              <div className="relative z-10 mx-auto max-w-md ">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-gold transition-all duration-300 group-hover:bg-sky-400">
                  {link.svg}
                </span>
                <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
                  <p>
                    Empower your knowledge in {link.title.toLowerCase()} to make
                    informed decisions.
                  </p>
                </div>
                <div className="pt-5 text-base font-semibold leading-7">
                  <span className="text-black transition-all duration-300 group-hover:text-white">
                    Explore {link.title} &rarr;
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Knowledge;
