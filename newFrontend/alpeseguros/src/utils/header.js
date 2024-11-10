import React from 'react';
import './header.css'; // Importamos el archivo de estilos

const Header = () => {
  // Verifica si el usuario está autenticado (por ejemplo, revisando un token en localStorage)
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <header className="header">
      <div className="logo-container">
        <img src="IMG-20241104-WA0010.jpg" alt="AlpesSeguros Logo" className="logo" /> {/* Asegúrate de poner el path correcto para el logo */}
      </div>
      <nav className="nav-links">
        <ul>
          {/* Si el usuario NO está autenticado, mostrar estas opciones */}
          {!isAuthenticated && (
            <>
              <li><a href="/correduria">Correduría de Seguros AlpesSeguros</a></li>
              <li><a href="/grupo-aico">Grupo AlpesSeguros</a></li>
              <li><a href="/contrata-seguro">Contrata un Seguro</a></li>
              <li><a href="/contacto">Contacto</a></li>
              <li><a href="/unete">Únete a Nosotros</a></li>
            </>
          )}

          {/* Si el usuario está autenticado, mostrar solo estas opciones */}
          {isAuthenticated && (
            <>
              <li><a href="/presupuestos">Calculadora de seguros</a></li>
              <li><a href="/revisarDocumentos">Revisar Documentos</a></li>
              <li><a href="/areaPrivada">Área Privada</a></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
