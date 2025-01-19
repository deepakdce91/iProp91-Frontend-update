import React from 'react';
import JourneyForm from '../Journey/JourneyForm';


function JourneyPage({setIsLoggedIn}) {
  return (
    <div className='pt-[14vh] min-h-[90vh] bg-black'>
      <JourneyForm setIsLoggedIn={setIsLoggedIn}/>
    </div>
  )
}

export default JourneyPage
