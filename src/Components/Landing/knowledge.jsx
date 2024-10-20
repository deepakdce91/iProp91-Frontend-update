import React from 'react';
import { Link } from 'react-router-dom';

const links = [
  {
    title : 'FAQ`s',
    img : 'images/image.jpg',
    to: '/faqs',
  },
  {
    title : 'Laws',
    img : 'images/image.jpg',
    to: '/laws',
  },
  {
    title: 'Library',
    img : 'images/image.jpg',
    to: '/library',
  },
  {
    title: 'Case Laws',
    img : 'images/image.jpg',
    to: '/case-laws',
  }
]

const Knowledge = () => {
  return (
    <div className="flex flex-col items-center justify-center  p-6">
      <h1 className="text-3xl text-center md:text-6xl font-semibold text-black py-6 text-primary">
        We encourage to empower <br /> your choice with knowledge
      </h1>
      <div className="flex flex-wrap gap-10">
        {links.map((link, index) => (
          <Link to={link.to} >
            <div key={index} className="bg-gray-800  mx-auto  rounded-xl overflow-hidden shadow-lg">
              <img
                src={link.img}
                alt="Library"
                className="object-cover w-full h-48 opacity-70"
              />
              <div className="z-50 flex items-center text-center justify-center">
                <p className="text-primary text-xl  font-semibold ">{link.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Knowledge;
