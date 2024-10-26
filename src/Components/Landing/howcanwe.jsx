//due to many defintion of this component in different files currently the responsiveness and use of this component is paused


// import React, { useEffect, useRef } from 'react';

// const CircleComponent = () => {
//   const circleRef = useRef(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       const viewportHeight = window.innerHeight;

//       // Adjust this multiplier to fine-tune the speed of the parallax effect
//       const parallaxSpeed = 0.6;

//       // Parallax formula: Positive value for upward movement as user scrolls down
//       const parallaxOffset = -(scrollTop * parallaxSpeed);

//       if (circleRef.current) {
//         // Applying upward translation as you scroll down
//         circleRef.current.style.transform = `translateY(${parallaxOffset}px)`;
//       }
//     };

//     window.addEventListener('scroll', handleScroll);

//     // Cleanup scroll listener on component unmount
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   return (
//     <div
//       ref={circleRef}
//       className="absolute w-full flex items-center justify-center bg-white rounded-t-[50%] lg:mt-20"
//       style={{
//         zIndex: 10,
//         boxShadow: '0 -100px 100px -100px gold',
//         borderTopLeftRadius: '50%',
//         borderTopRightRadius: '50%',
//       }}
//     >
//       <div className="flex flex-col w-full ">
//         <h2 className="text-primary text-4xl md:text-6xl lg:text-7xl font-semibold flex flex-col items-center justify-center h-screen">
//           <p className="py-2">How iProp91 does</p>
//           <p className="py-2">things differently</p>
//         </h2>
//       </div>
//     </div>
//   );
// };

// export default CircleComponent;
