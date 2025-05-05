import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Filters({ stateCity }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Pass the current state/city to the filters page if available
    const params = new URLSearchParams();
    if (stateCity?.state) params.set('state', stateCity.state);
    if (stateCity?.city) params.set('city', stateCity.city);
    
    // Redirect to the filters page
    navigate(`/filters?${params.toString()}`);
  }, [navigate, stateCity]);

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-[1000] p-4 flex justify-center items-center">
      <div className="text-center">
        <p className="text-lg">Redirecting to filters page...</p>
      </div>
    </div>
  );
}