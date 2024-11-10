import { useState } from "react";
import clienteAxios from "../config/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import Header from '../../utils/header';
import Footer from '../../utils/footer';
import React from 'react';

function LoginComponent() {
    const { login } = useAuth();
    const navigate = useNavigate();

    // Estado para almacenar los valores de email y password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Función para manejar el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            
            const response = await clienteAxios.post('/auth/login/', { email, password });
            const { access } = response.data;

            if (response.status === 200) {
                login(access); // Pasas el token al contexto
                toast.success("Login exitoso");
                navigate('/AreaPrivada');
            } else {
                toast.error("Error al iniciar sesión");
            }
        } catch (error) {
            toast.error("Error en la solicitud: " + error.message);
        }
    };

    return (
        <>
            <Header />
            <div className="login-form-container">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Ingresa tu correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Iniciar Sesión</button>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default LoginComponent;
