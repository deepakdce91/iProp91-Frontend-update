//will work on that later...errors due to react
// import React, { useEffect, useRef } from "react";

// const TextReveal = ({ text }) => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("visible");
//           } else {
//             entry.target.classList.remove("visible");
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     const words = containerRef.current.querySelectorAll(".reveal");
//     words.forEach((word) => observer.observe(word));

//     // Clean up observer on component unmount
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div ref={containerRef} className="flex flex-wrap justify-center">
//       {text.split(" ").map((word, index) => (
//         <span key={index} className="reveal mx-1">
//           {word}
//         </span>
//       ))}
//     </div>
//   );
// };

// export default TextReveal;
