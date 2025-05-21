import { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PropertyNav = ({ onCategoryChange, counts = {} }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const scrollRef = useRef(null);
  const tabRefs = useRef({});
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const [propertyCategories] = useState([
    { id: "all", label: "All Properties", count: counts.all || 0 },
    { id: "owner", label: "Owner's Property", count: counts.owner || 0 },
    { id: "new", label: "New Projects", count: counts.new || 0 },
    { id: "ready", label: "Ready to Move", count: counts.ready || 0 },
    { id: "budget", label: "Budget Homes", count: counts.budget || 0 },
    { id: "prelaunch", label: "Pre Launch", count: counts.prelaunch || 0 },
    { id: "verified", label: "Verified Owner", count: counts.verified || 0 },
    { id: "sale", label: "New Sale Properties", count: counts.sale || 0 },
    { id: "upcoming", label: "Upcoming Projects", count: counts.upcoming || 0 },
  ]);
  
  // Update the indicator position when active category changes
  useEffect(() => {
    centerActiveTab(activeCategory);
  }, [activeCategory]);
  
  // Check if we need to show scroll arrows
  useEffect(() => {
    if (scrollRef.current) {
      const checkScrollPosition = () => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
      };
      
      checkScrollPosition();
      scrollRef.current.addEventListener('scroll', checkScrollPosition);
      return () => scrollRef.current?.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);
  
  const centerActiveTab = (categoryId) => {
    const tabElement = tabRefs.current[categoryId];
    
    if (tabElement && scrollRef.current) {
      const tabRect = tabElement.getBoundingClientRect();
      const scrollLeft = scrollRef.current.scrollLeft;
      const scrollRect = scrollRef.current.getBoundingClientRect();
      
      // Center the active tab
      scrollRef.current.scrollTo({
        left: tabRect.left + scrollLeft - scrollRect.width / 2 + tabRect.width / 2,
        behavior: 'smooth'
      });
    }
  };
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  const handleTabClick = (categoryId) => {
    setActiveCategory(categoryId);
    // Call the parent handler when category changes
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  // Update counts when they change from parent
  useEffect(() => {
    if (counts && Object.keys(counts).length > 0) {
      // Could update category counts here if needed
    }
  }, [counts]);
  
  return (
    <div className="relative flex items-center py-2 px-6 bg-white border-b border-borderColor h-[85px]">
      {showLeftArrow && (
        <button 
          className="absolute left-2.5 w-9 h-9 flex items-center justify-center bg-white border border-borderColor rounded-full cursor-pointer z-10 shadow-md hover:bg-gray-50 hover:scale-105 transition-all" 
          onClick={() => scroll('left')} 
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-gray-600 text-sm" />
        </button>
      )}
      
      <div 
        className="flex overflow-x-scroll scrollbar-hide scroll-smooth mx-[50px] py-2 flex-grow relative"
        ref={scrollRef}
      >
        {/* Gradient fades for scroll indication */}
        <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent pointer-events-none z-[5]"></div>
        <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent pointer-events-none z-[5]"></div>
        
        <div className="flex relative min-w-full h-[60px]">
          {propertyCategories.map(category => (
            <button
              key={category.id}
              ref={(el) => (tabRefs.current[category.id] = el)}
              className={`flex items-center justify-center min-w-[120px] h-full mx-2.5 px-5 border-none rounded-[25px] cursor-pointer transition-all whitespace-nowrap
                ${activeCategory === category.id 
                  ? 'bg-primary text-white font-semibold shadow-lg transform scale-105' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}
              onClick={() => handleTabClick(category.id)}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm mb-1">{category.label}</span>
                <span className={`flex items-center justify-center w-[18px] h-[18px] text-xs font-bold rounded-full transition-all
                  ${activeCategory === category.id 
                    ? 'bg-white/20 text-white border border-white/40 backdrop-blur-sm' 
                    : 'bg-gray-100 text-gray-600'}`}
                >
                  {category.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {showRightArrow && (
        <button 
          className="absolute right-5 w-9 h-9 flex items-center justify-center bg-white border border-borderColor rounded-full cursor-pointer z-10 shadow-md hover:bg-gray-50 hover:scale-105 transition-all" 
          onClick={() => scroll('right')} 
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-gray-600 text-sm" />
        </button>
      )}
    </div>
  );
};

export default PropertyNav;