import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Esto navega hacia la página anterior
  };

  return (
    <button onClick={handleBack} className="back-button">
      Volver
    </button>
  );
};

export default BackButton;
