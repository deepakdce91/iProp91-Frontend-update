import { useState, useRef, useEffect } from 'react';
import { FaChevronUp } from 'react-icons/fa';

const Table = ({ tablename, tableData, tableopen = false }) => {
  const [isExpanded, setIsExpanded] = useState(tableopen); // Initialize with the tableopen prop
  const [maxHeight, setMaxHeight] = useState(tableopen ? 'auto' : '0px'); // Adjust the height accordingly

  const contentRef = useRef(null);

  const toggleExpand = () => {
    setMaxHeight(isExpanded ? '0px' : `${contentRef.current.scrollHeight}px`);
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    // If tableopen prop changes, update the state accordingly
    setIsExpanded(tableopen);
    setMaxHeight(tableopen ? `${contentRef.current.scrollHeight}px` : '0px');
  }, [tableopen]);

  return (
    <div className={`${!isExpanded ? 'border-2 rounded-xl border-gray-300 !text-black' : ''} w-full my-2`}>
      <div
        className={`${!isExpanded ? '' : 'bg-gold'} p-4 rounded-t-lg flex justify-between items-center w-full cursor-pointer px-10 py-6`}
        onClick={toggleExpand}
      >
        <h2 className={`${isExpanded ? 'text-white' : 'text-black'} text-sm md:text-xl`}>
          {tablename}
        </h2>
        <button className={`text-black transition-all delay-150 duration-50 font-bold text-2xl ${!isExpanded ? 'transform rotate-180 text-gold' : 'text-white'}`}>
          <FaChevronUp />
        </button>
      </div>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: `${maxHeight}` }}
      >
        <div className="bg-white shadow-md rounded-b-lg w-full overflow-x-scroll">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-yellow-50 text-yellow-700">
                <th className="py-3 px-6">No.</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">File Size</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((file, index) => (
                <tr key={index} className="hover:bg-yellow-50">
                  <td className="py-3 px-6">{index+1}</td>
                  <td className="py-3 px-6">{file.name}</td>
                  <td className="py-3 px-6">{file.size}</td>
                  <td className="py-3 px-6">{file.date}</td>
                  <td className="py-3 px-6 flex space-x-4">
                    <button>
                      <i className="fas fa-eye text-gray-700"></i>
                    </button>
                    <button>
                      <i className="fas fa-edit text-gray-700"></i>
                    </button>
                    <button>
                      <i className="fas fa-download text-gray-700"></i>
                    </button>
                    <button>
                      <i className="fas fa-trash text-gray-700"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 flex flex-col items-center cursor-pointer">
            <button className="flex items-center text-gold border border-gold rounded-full p-2">
              <i className="fas fa-upload"></i>
            </button>
            <p className="text-gold mt-2">Click to Upload or drag and drop</p>
            <p className="text-sm text-gray-500">(Max. File size: 25 MB)</p>
            <input type="file" className="hidden" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
