import React from 'react'

const WeDoMore = () => {
  return (
    <section className='py-20 px-2 relative overflow-hidden bg-black/90 border-y-[1px] border-y-white/30'>
        <style jsx>{`
          ::selection {
            color: white;
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>
        <div className='flex items-center lg:pl-40'>
            <div className='flex flex-col gap-5 text-white w-full md:w-[60%]'>
                <p className='lg:text-6xl md:text-4xl text-3xl font-semibold'>do more with <br /> your real estate assets</p>
                <p className='text-lg md:text-2xl text-gray-500'>Join exclusive club of verified owners of your project, manage all your real estate documents well, earn reward points, get access to expert views & other owner reviews, understand your documents, stay compliant and a lot more</p>
            </div>

            <div className='absolute -z-10 md:z-10 md:block -right-14 -bottom-20'>
                <img src="/images/domore.png" className='w-full h-[400px]' alt="ss" />
            </div>
        </div>
    </section>
  )
}

export default WeDoMore