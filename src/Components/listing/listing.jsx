import { useNavigate } from 'react-router-dom';

export default function Listing() {
  const navigate = useNavigate();
  
  return (
    <div className="relative">
      {/* Existing listing content */}
      
      {/* Floating Show Map Button */}
      <button
        onClick={() => navigate('/search-properties')}
        className="fixed bottom-10 left-[45%] px-4 py-3 bg-black hover:bg-black/80 text-white rounded-xl shadow-lg transition-all duration-300 z-50 flex items-center gap-2"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        Show Map
      </button>
    </div>
  );
} 