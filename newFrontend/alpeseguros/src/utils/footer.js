import React from 'react';
import './footer.css'; // Importamos el archivo de estilos

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} AlpesSeguros. Todos los derechos reservados.</p>
        <p><a href="/privacidad">Política de Privacidad</a> | <a href="/terminos">Términos y Condiciones</a></p>
      </div>
    </footer>
  );
};

export default Footer;
