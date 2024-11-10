import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../utils/header';
import Footer from '../../utils/footer';

const HomeComponents = () => {
  return (
    <>
   <Header /> {/* Incluir el header */}
      <div className="main-content">
        <h1 className="welcome-title">Bienvenido a AlpesSeguros</h1>
        <div className="insurance-info">
                <img 
          src="IMG-20241104-WA0010.jpg"  // Aquí iría el link de la imagen
          alt="Seguro de salud"
          className="insurance-image"
        />

          <p className="insurance-description">
            En AlpesSeguros ofrecemos las mejores opciones de seguros adaptados a tus necesidades.
            Descubre planes que te brindan tranquilidad y protección para ti y tu familia.
          </p>
        </div>
      </div>
      <Footer /> {/* Incluir el footer */}
    </>
    
  );
};

export default HomeComponents;