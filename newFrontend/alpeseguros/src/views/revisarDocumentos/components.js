import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Usamos react-bootstrap para el modal
import axios from 'axios';
import Header from '../../utils/header';
import Footer from '../../utils/footer';

const DocumentosConFirmasComponent = () => {
  const [documentos, setDocumentos] = useState([]);
  const [firmas, setFirmas] = useState([]);
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Obtener los documentos y firmas desde la API
    const fetchData = async () => {
      try {
        // Obtener los documentos
        const documentosResponse = await axios.get('http://127.0.0.1:8000/api/generate_pdf/');
        console.log(documentosResponse)
        setDocumentos(documentosResponse.data);

        // Obtener las firmas
        const firmasResponse = await axios.get('http://127.0.0.1:8000/api/guardar_firma/'); // Ajusta la URL según sea necesario
        console.log(firmasResponse.data)
        setFirmas(firmasResponse.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  // Función para asociar la firma a cada documento
  const asociarFirma = (documentoId) => {
   
    console.log(documentoId)

    const firma = firmas.find(f => f.pdf_documento=== documentoId);
    console.log("firma elegida",firma)
    return firma ? firma.uuid_firma : 'No disponible'; // Cambia 'nombre' por el campo correspondiente en tu API de firmas
    
  };

  // Función para abrir el modal con el documento seleccionado
  const handleRevisar = (documento) => {
    setSelectedDocumento(documento);
    setShowModal(true);
  };

  // Función para aprobar el documento
  const handleAprobar = async () => {
    try {
      console.log(selectedDocumento.uuid_pdf);
      const response = await axios.put(`http://127.0.0.1:8000/api/generate_pdf/${selectedDocumento.uuid_pdf}/`, {
        aprobado: true, // Cambia a 1 si tu API espera un valor numérico
      });
  
      if (response.status === 200) {
        // Actualizar el estado local para reflejar el cambio
        setDocumentos(documentos.map(doc =>
          doc.id === selectedDocumento.id ? { ...doc, aprobado: true } : doc
        ));
        setShowModal(false);
  
        // Redirigir a /areaPrivada después de aprobar
        window.location.href = '/areaPrivada';
      }
    } catch (error) {
      console.error('Error al aprobar el documento:', error);
    }
  };
  
  return (
    <>
    <Header />

    <div>
      <h2>Documentos y Firmas</h2>
      
      <table className="table">
        <thead>
          <tr>
            <th>UUID PDF</th>
            <th>Nombre Cliente</th>
            <th>Email Cliente</th>
            <th>Nombre PDF</th>
            <th>Firmado</th>
            <th>Aprobado</th>
            <th>Fecha Creación</th>
            <th>Firma Asociada</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((documento) => (
            <tr key={documento.id}>
              <td>{documento.uuid_pdf}</td>
              <td>{documento.nombre_cliente}</td>
              <td>{documento.email_cliente}</td>
              <td>{documento.nombre_pdf}</td>
              <td>{documento.firmado ? 'Sí' : 'No'}</td>
              <td>{documento.aprobado ? 'Sí' : 'No'}</td>
              <td>{documento.fecha_creacion}</td>
              <td>{asociarFirma(documento.uuid_pdf)}</td>
              <td>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleRevisar(documento)}
                  disabled={documento.aprobado}
                >
                  Revisar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para aprobar documento */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Revisar Documento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDocumento ? (
            <div>
              <h5>Detalles del Documento</h5>
              <p><strong>UUID PDF:</strong> {selectedDocumento.uuid_pdf}</p>
              <p><strong>Cliente:</strong> {selectedDocumento.nombre_cliente}</p>
              <p><strong>Email:</strong> {selectedDocumento.email_cliente}</p>
              <p><strong>PDF:</strong> {selectedDocumento.nombre_pdf}</p>
              <p><strong>Firmado:</strong> {selectedDocumento.firmado ? 'Sí' : 'No'}</p>
              <p><strong>Aprobado:</strong> {selectedDocumento.aprobado ? 'Sí' : 'No'}</p>
              <p><strong>Fecha de Creación:</strong> {selectedDocumento.fecha_creacion}</p>
            </div>
          ) : (
            <p>Cargando...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={handleAprobar}>
            Aprobar
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          
        </Modal.Footer>
      </Modal>
    </div>
    <Footer />
    </>
   
  );
};

export default DocumentosConFirmasComponent;
