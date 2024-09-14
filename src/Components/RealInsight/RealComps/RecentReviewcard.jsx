import React from 'react';

function RecentReviewsCard() {
  return (
    <div className="mx-auto bg-white m-2 rounded-xl p-4  min-h-72 w-96 ">
      <div className="flex flex-col items-center text-xs">
        <div className="relative">
          <img
            src="./images/1.png"
            alt="Avatar"
            className="rounded-full w-24 h-24"
          />
          <span className="absolute bottom-0 right-0 bg-yellow-400 text-white text-sm font-bold px-2 py-1 rounded-full">
            99
          </span>
        </div>
        <p className="mt-4 text-gray-600">The property is very good</p>
        <h2 className="mt-2 text-xl font-bold">Lorem Ipsum</h2>
        <p className="text-gray-500 text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia dicta quo quae placeat tempore temporibus. Perspiciatis quod ut eum. Qui et necessitatibus quod.</p>
      </div>
    </div>
  );
}

export default RecentReviewsCard;
