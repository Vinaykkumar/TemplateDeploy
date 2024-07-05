
// WelcomePage.js

import React from 'react';
import { useHistory } from 'react-router-dom';
import './css/WelcomePage.css'; // Import CSS file for styling

const WelcomePage = () => {
  const history = useHistory(); // Hook for navigation
  // Function to handle button click and navigate to the template selection page
  const handleNext = () => {
    history.push('/template'); // Navigate to '/template' route
  };
  return (
    <div className="welcome-page-container"> {/* Container for the welcome page */}
      <div className="welcome-message"> {/* Box for the welcome message */}
        <h1>Welcome to Infokalash Low Code Application</h1> {/* Heading */}
        <button onClick={handleNext}>Next</button> {/* Button to navigate to the next page */}
      </div>
    </div>
  );
};

export default WelcomePage;