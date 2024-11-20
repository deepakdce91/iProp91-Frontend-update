import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const Stats = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const statsData = [
    { end: 40, label: 'Developers Covered' },
    { end: 250, label: 'Projects Mapped' },
    { end: 2000, label: 'Verified Owners' },
    { end: 50, label: 'Active Communities' },
  ];

  return (
    <div
      ref={ref}
      className="flex bg-[#212121] border-y-[1px] border-y-white/40 flex-col md:flex-row items-center justify-around p-6 md:p-10  space-y-6 md:space-y-0 py-4"
    >
      {statsData.map((stat, index) => (
        <div key={index} className="text-center my-4">
          <h2 className="text-4xl md:text-3xl lg:text-4xl font-bold text-white">
            {inView ? (
              <CountUp start={0} end={stat.end} duration={2} separator="," />
            ) : (
              0
            )}
            +
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-white/80">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stats;
