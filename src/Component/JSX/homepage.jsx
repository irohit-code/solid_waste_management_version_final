import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/homepage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleRegisterButtonClick = () => {
    navigate('/register');
  };

  const handleLoginButtonClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-page-container">
      <div className="home-page">
        <div className="header">
          <h1>Welcome to Solid Waste Management</h1>
        </div>
        <div className="content">
          <section>
            <h2>Why Solid Waste Management Matters?</h2>
            <p>
              Improper solid waste management can lead to numerous environmental, social, and health problems.
              It can contaminate soil, water, and air, endanger wildlife, contribute to climate change, and pose risks to human health.
              By implementing proper waste management practices, we can minimize these negative impacts and create a cleaner, safer, and more sustainable world for future generations.
            </p>
          </section>
          <section>
            <h2>Our Platform's Mission</h2>
            <p>
              Our platform is dedicated to promoting responsible solid waste management practices and empowering individuals, communities, and organizations to make a positive impact.
              We provide comprehensive tools, resources, and educational materials to help users understand the importance of waste management, adopt sustainable behaviors, and take meaningful actions to reduce, reuse, and recycle waste.
              Together, we can work towards a greener and more resilient planet.
            </p>
          </section>
        </div>
        <div className="buttons-container">
          <button className="login-button" onClick={handleLoginButtonClick}>Login</button>
          <button className="register-button" onClick={handleRegisterButtonClick}>Register (Only as Citizen)</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
