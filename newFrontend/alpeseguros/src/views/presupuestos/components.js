import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import BackButton from '../../utils/backbutton';
import Header from '../../utils/header';


const PresupuestosComponents = () => {
  const navigate = useNavigate();

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    telefono: '',
    email: '',
    provincia: '',
    edades: [],
    aceptaProteccionDatos: false,
    deseaPromociones: false,
  });

  const [currentEdad, setCurrentEdad] = useState('');

  // Manejar el cambio en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Agregar edad a la lista
  const addEdad = () => {
    if (currentEdad) {
      setFormData({
        ...formData,
        edades: [...formData.edades, currentEdad],
      });
      setCurrentEdad(''); // Resetear campo
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generar un UUID único
    const uniqueId = uuidv4();

    // Enviar cada edad como un registro separado
    const promises = formData.edades.map(async (edad) => {
      const dataToSave = {
        nombre: uniqueId,
        telefono: formData.telefono,
        email: formData.email,
        provincia: formData.provincia,
        asegurar: "Asegurado",
        edad: parseInt(edad),
        aceptaProteccionDatos: formData.aceptaProteccionDatos,
        deseaPromociones: formData.deseaPromociones,
      };
      console.log(dataToSave)

      // Realizar la solicitud POST a la API de Django
      await fetch('http://127.0.0.1:8000/api/save_health_insurance/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });
    });

    // Esperar que todas las solicitudes terminen
    await Promise.all(promises);

    // Redirigir a la página de resultado usando el UUID único
    navigate(`/resultado-consulta?nombre=${uniqueId}`);
  };

  // Estilos
  const formStyle = { display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' };
  const inputStyle = { marginBottom: '15px', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' };
  const buttonStyle = { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s' };

  return (

    <>
     <Header /> {/* Aquí se incluye el header */}
    <BackButton />  {/* Aquí se muestra el botón "Volver" */}
    
    <form onSubmit={handleSubmit} style={formStyle}>

<h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Calcular Seguro de Salud</h2>
<label>Teléfono:
  <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required style={inputStyle} />
</label>
<label>E-mail:
  <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
</label>
<label>Provincia:
  <select name="provincia" value={formData.provincia} onChange={handleChange} required style={inputStyle}>
    <option value="">Seleccionar Provincia</option>
    <option value="Provincia 1">Provincia 1</option>
    <option value="Provincia 2">Provincia 2</option>
  </select>
</label>
<label>¿A quién vas a asegurar? Edad:
  <input type="number" value={currentEdad} onChange={(e) => setCurrentEdad(e.target.value)} style={inputStyle} />
  <button type="button" onClick={addEdad}>Agregar Edad</button>
</label>
<ul>
  {formData.edades.map((edad, index) => (
    <li key={index}>{edad}</li>
  ))}
</ul>
<label>Acepto la información básica sobre protección de datos
  <input type="checkbox" name="aceptaProteccionDatos" checked={formData.aceptaProteccionDatos} onChange={handleChange} required />
</label>
<label>¿Desea estar informado sobre ofertas y promociones de seguros?
  <input type="radio" name="deseaPromociones" value="true" checked={formData.deseaPromociones === true} onChange={() => setFormData({ ...formData, deseaPromociones: true })} />
  Sí
  <input type="radio" name="deseaPromociones" value="false" checked={formData.deseaPromociones === false} onChange={() => setFormData({ ...formData, deseaPromociones: false })} />
  No
</label>
<button type="submit" style={buttonStyle}>Calcular seguro</button>
</form></>
   
  );
};

export default PresupuestosComponents;
