import React from 'react';

const AboutProject = ({ about }) => {
  if (!about) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">About This Project</h2>
      <div className="prose max-w-none">
        {about.description && (
          <p className="text-gray-600 mb-4">{about.description}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {about.constructionStatus && (
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-500">Construction Status</h3>
                <p className="text-sm text-gray-900">{about.constructionStatus}</p>
              </div>
            </div>
          )}
          
          {about.possessionDate && (
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-500">Possession Date</h3>
                <p className="text-sm text-gray-900">{about.possessionDate}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
