import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PropertyCard } from './components/property-card';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function CategoryPage() {
  const { categoryType } = useParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const fetchCategoryProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/fetchAllProjects?userId=${decoded.userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            }
          }
        );

        if (response.data) {
          const filteredProperties = response.data.filter(
            project => project.category === categoryType
          );
          setProperties(filteredProperties);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProperties();
  }, [categoryType]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 lg:rounded-xl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 capitalize">
          {categoryType.replace('_', ' ')} Properties
        </h1>
        
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 