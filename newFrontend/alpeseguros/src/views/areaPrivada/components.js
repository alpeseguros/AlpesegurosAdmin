// src/components/AreaPrivada.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta según tu estructura
import Header from '../../utils/header';
import Footer from '../../utils/footer';

const AreaPrivadaComponents = () => {
  const { auth, logout } = useAuth(); // Obtiene el estado de autenticación y la función de logout

  return (

    <>
    <Header /> 
    <div className="private-area-container">
      <h1 className="header">Área Privada</h1>
      <p className="welcome-text">Bienvenido a tu espacio privado donde puedes gestionar todas tus opciones.</p>

      {/* Sección de autenticación */}
      <div className="auth-buttons">
        {!auth ? (
          // Si no está logueado, se muestra el botón de login
          <Link to="/Login">
            <button className="auth-button login-btn">Login</button>
          </Link>
        ) : (
          // Si está logueado, se muestra el botón de logout
          <button onClick={logout} className="auth-button logout-btn">
            Cerrar Sesión
          </button>
        )}
      </div>

      {/* Sección de opciones adicionales */}
      <div className="options-container">
        <Link to="/Agregar-tarifa">
          <button className="option-button">Agregar tarifa</button>
        </Link>

        <Link to="/customForm">
          <button className="option-button">Ingresar formato</button>
        </Link>
      </div>

      {/* Texto explicativo */}
      <div className="info-section">
        <p>Desde aquí podrás agregar nuevas tarifas, ingresar formatos personalizados y gestionar tu cuenta.</p>
      </div>
    </div>

    <Footer /> 
    </>
    
  );
};

export default AreaPrivadaComponents;
