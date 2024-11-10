import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { useLocation } from 'react-router-dom';
import Header from '../../utils/header';
import Footer from '../../utils/footer';

const PdfViewer = () => {
    const { uuid_pdf } = useParams();  // Captura uuid_pdf desde la URL
    const [pdfName, setPdfName] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [signature, setSignature] = useState(null);  // Estado para la firma
    const [userIp, setUserIp] = useState('');  // Estado para la IP del usuario
    const canvasRef = useRef(null);
    const location = useLocation();
    console.log(location)
    const pathSegments = location.pathname.split('/'); // Dividimos la URL por '/'
    console.log(pathSegments)
    const id = pathSegments[pathSegments.length - 1];
    console.log(id) 
    useEffect(() => {
        // Realiza la solicitud al backend para obtener el PDF
        const fetchPdfData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/generate_pdf/${uuid_pdf}/`);
                console.log(response.data);
    
                // Revisar si el campo firmado es 1
                if (response.data.firmado === 1) {
                    // Redirige al menú si ya está firmado
                    window.location.href = "http://localhost:3000/menu";  // Ajusta la URL según corresponda
                } else {
                    setPdfName(response.data.nombre_pdf);
                    setPdfData(response.data.pdf_base64);
                }
            } catch (error) {
                console.error("Error al obtener el PDF:", error);
            }
        };
    
        if (uuid_pdf) {
            fetchPdfData();
        }
    
        // Obtener la IP pública del usuario
        const fetchUserIp = async () => {
            try {
                const ipResponse = await axios.get('https://api.ipify.org?format=json');
                setUserIp(ipResponse.data.ip);
            } catch (error) {
                console.error('Error al obtener la IP:', error);
            }
        };
    
        fetchUserIp();  // Obtener la IP al montar el componente
    }, [uuid_pdf]);
    

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Función para limpiar el canvas
    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Función para guardar la firma en el backend
    const handleSave = async () => {
        const canvas = canvasRef.current;
        const signatureImage = canvas.toDataURL(); // Convertir el canvas a una imagen base64
    
        try {
            console.log("IP del usuario:", userIp);
            console.log("Imagen de la firma:", signatureImage);
            console.log("ID del documento seleccionado:", uuid_pdf);
    
            // Enviar la actualización del campo 'firmado' al backend
            const responseAprobado = await axios.put(`http://127.0.0.1:8000/api/generate_pdf/${uuid_pdf}/`, {
                firmado: true
            });
    
            // Verificar si el campo 'firmado' se actualizó correctamente
            if (responseAprobado.status === 200) {
                // Enviar la firma y la IP al backend
                const response = await axios.post(`http://127.0.0.1:8000/api/guardar_firma/${uuid_pdf}/`, {
                    documento_id: id,
                    firma: signatureImage,
                    ip: userIp // Enviar la IP con la firma
                });
    
                // Verificar si la firma se guardó exitosamente
                if (response.status === 201) {
                    alert("Firma guardada exitosamente");
                    localStorage.setItem('signature', signatureImage); // Guardar en localStorage
                    setSignature(signatureImage); // Establecer la firma en el estado
                    
                    // Redirigir a la página principal
                    window.location.href = "http://localhost:3000/";
                }
            } else {
                alert("No se pudo actualizar el estado de firmado en el backend");
            }
        } catch (error) {
            console.error("Error al guardar la firma:", error);
            alert("Error al guardar la firma");
        }
    };
    

    // Funciones para el dibujo en el canvas
    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    };

    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (e.buttons !== 1) return;  // Solo dibujar si el mouse está presionado
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
    };

    useEffect(() => {
        // Cargar la firma guardada desde localStorage al abrir el modal
        const savedSignature = localStorage.getItem('signature');
        if (savedSignature) {
            setSignature(savedSignature);
            
        }
    }, [isModalOpen]);

    return (
        <>
        <Header />
        <div>
            <h2>Visualización del PDF</h2>
            {pdfName && <p>Nombre del PDF: {pdfName}</p>}
            {pdfData ? (
                <iframe
                    src={`data:application/pdf;base64,${pdfData}`}
                    title="PDF Viewer"
                    width="100%"
                    height="600px"
                />
            ) : (
                <p>Cargando PDF...</p>
            )}

            {/* Botón para abrir el modal de firma */}
            <button onClick={openModal} style={styles.openButton}>Firmar Documento</button>

            {/* Modal para firmar el documento */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Ventana de Firma"
                ariaHideApp={false}
            >
                <h3>Firma del Documento</h3>

                {/* Canvas para la firma */}
                <div>
                    <canvas
                        ref={canvasRef}
                        width="200"  // Ajustamos el canvas a todo el ancho disponible
                        height="200"  // Altura ajustable según el diseño
                        style={{ border: '1px solid #000', marginTop: '20px', cursor: 'crosshair' }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                    />
                </div>

                <button onClick={handleSave} style={styles.saveButton}>Guardar Firma</button>
                <button onClick={handleClear} style={styles.clearButton}>Limpiar Firma</button>

                <button onClick={closeModal} style={styles.closeButton}>Cerrar</button>
            </Modal>
        </div>
        <Footer />
        </>
        
    );
};

const customStyles = {
    content: {
        width: '80%',
        height: 'auto',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        overflow: 'auto',
    },
};

const styles = {
    openButton: {
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    saveButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    clearButton: {
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    closeButton: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
    },
};

export default PdfViewer;
