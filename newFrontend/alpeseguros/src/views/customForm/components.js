import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from '../../utils/header';
import Footer from '../../utils/footer';

const CustomFormComponents = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate("/");
    }
  }, [auth, navigate]);

  const [baseFields, setBaseFields] = useState({
    nombre: '',
    telefono: '',
    email: '',
  });
  
  const [extraFields, setExtraFields] = useState([
    { name: '', value: '', type: 'text' }
  ]);

  const [files, setFiles] = useState([]);

  const handleBaseFieldChange = (e) => {
    const { name, value } = e.target;
    setBaseFields({
      ...baseFields,
      [name]: value,
    });
  };

  const handleExtraFieldChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = [...extraFields];
    updatedFields[index][name] = value;
    setExtraFields(updatedFields);
  };

  const addExtraField = () => {
    setExtraFields([...extraFields, { name: '', value: '', type: 'text' }]);
  };

  const removeExtraField = (index) => {
    const updatedFields = extraFields.filter((_, i) => i !== index);
    setExtraFields(updatedFields);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // Convierte FileList a Array para manejar múltiples archivos
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('uuid_pdf', generateUUID());
    formData.append('nombre_cliente', baseFields.nombre);
    formData.append('email_cliente', baseFields.email);
    formData.append('nombre_pdf', `documento-${baseFields.nombre}-${baseFields.email}.pdf`);
    formData.append('firmado', 'false');
    formData.append('aprobado', 'false');

    Object.entries(baseFields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    extraFields.forEach((field) => {
      formData.append(field.name, field.value);
    });

    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    try {
      const response = await fetch('http://localhost:8000/api/generate_pdf/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('PDF generado y enviado exitosamente');
      } else {
        alert('Error al generar el PDF');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit}>
        <h2>Formulario Personalizado</h2>

        {/* Campos base */}
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={baseFields.nombre}
            onChange={handleBaseFieldChange}
            required
          />
        </label>
        <label>
          Teléfono:
          <input
            type="tel"
            name="telefono"
            value={baseFields.telefono}
            onChange={handleBaseFieldChange}
            required
          />
        </label>
        <label>
          E-mail:
          <input
            type="email"
            name="email"
            value={baseFields.email}
            onChange={handleBaseFieldChange}
            required
          />
        </label>

        {/* Campos adicionales dinámicos */}
        {extraFields.map((field, index) => (
          <div key={index}>
            <label>
              Nombre del campo:
              <input
                type="text"
                name="name"
                value={field.name}
                onChange={(e) => handleExtraFieldChange(index, e)}
                required
              />
            </label>
            <label>
              Tipo de campo:
              <select
                name="type"
                value={field.type}
                onChange={(e) => handleExtraFieldChange(index, e)}
              >
                <option value="text">Texto</option>
                <option value="number">Número</option>
                <option value="email">Correo Electrónico</option>
                <option value="textarea">Texto Largo</option>
              </select>
            </label>
            <label>
              Valor del campo:
              {field.type === 'text' && (
                <input
                  type="text"
                  name="value"
                  value={field.value}
                  onChange={(e) => handleExtraFieldChange(index, e)}
                  required
                />
              )}
              {field.type === 'number' && (
                <input
                  type="number"
                  name="value"
                  value={field.value}
                  onChange={(e) => handleExtraFieldChange(index, e)}
                  required
                />
              )}
              {field.type === 'email' && (
                <input
                  type="email"
                  name="value"
                  value={field.value}
                  onChange={(e) => handleExtraFieldChange(index, e)}
                  required
                />
              )}
              {field.type === 'textarea' && (
                <textarea
                  name="value"
                  value={field.value}
                  onChange={(e) => handleExtraFieldChange(index, e)}
                  required
                  style={{ width: '100%', height: '100px', resize: 'vertical' }}
                />
              )}
            </label>
            <button type="button" onClick={() => removeExtraField(index)}>Eliminar campo</button>
          </div>
        ))}
        
        {/* Campo de carga de archivos */}
        <label>
          Archivos:
          <input
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </label>
        {/* Mostrar nombres de archivos seleccionados */}
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
        
        <button type="button" onClick={addExtraField}>Agregar campo</button>
        <button type="submit">Generar PDF</button>
      </form>
      <Footer />
    </>
  );
};

export default CustomFormComponents;

function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
