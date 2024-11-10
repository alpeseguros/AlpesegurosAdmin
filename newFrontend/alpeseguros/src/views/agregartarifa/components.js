import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './agregartarifa.css';

const TarifaComponents = () => {


    const { auth } = useAuth(); // Obtenemos el estado de autenticación
    const navigate = useNavigate();


    useEffect(() => {
        if (!auth) {
            // Si el usuario no está autenticado, redirigimos a la página de login
            navigate("/");
        }
    }, [auth, navigate]);

    const [formData, setFormData] = useState({
        newCompanyName: "",
        newAgeBracket: ""
    });

    const [companies, setCompanies] = useState([]);
    const [ageBrackets, setAgeBrackets] = useState([]);
    const [tarifas, setTarifas] = useState({});
    const [isAddingNewCompany, setIsAddingNewCompany] = useState(false);
    const [isAddingNewAgeBracket, setIsAddingNewAgeBracket] = useState(false);
    const [isEditing, setIsEditing] = useState({}); // To track which cells are being edited

    useEffect(() => {
        // Fetch initial data for companies and age brackets
        axios.get("http://127.0.0.1:8000/api/companies/")
            .then((response) => setCompanies(response.data))
            .catch((error) => console.error("Error al cargar las compañías:", error));

        axios.get("http://127.0.0.1:8000/api/age_brackets/")
            .then((response) => setAgeBrackets(response.data))
            .catch((error) => console.error("Error al cargar los age brackets:", error));

        // Fetch existing premium insurance data (tarifas)
        axios.get("http://127.0.0.1:8000/api/premium_insurance/")
            .then((response) => {
                const tarifasData = response.data.reduce((acc, tarifa) => {
                    if (!acc[tarifa.age_bracket]) acc[tarifa.age_bracket] = {};
                    acc[tarifa.age_bracket][tarifa.company] = tarifa.premium_amount;
                    return acc;
                }, {});
                setTarifas(tarifasData);
            })
            .catch((error) => console.error("Error al cargar las tarifas:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddNewCompany = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/companies/", {
                name: formData.newCompanyName
            });
            setCompanies([...companies, response.data]);
            setFormData({ ...formData, newCompanyName: "" });
            setIsAddingNewCompany(false);
        } catch (error) {
            console.error("Error al agregar la nueva compañía:", error);
        }
    };

    const handleAddNewAgeBracket = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/age_brackets/", {
                age: formData.newAgeBracket
            });
            setAgeBrackets([...ageBrackets, response.data]);
            setFormData({ ...formData, newAgeBracket: "" });
            setIsAddingNewAgeBracket(false);
        } catch (error) {
            console.error("Error al agregar el nuevo rango de edad:", error);
        }
    };

    const handleSavePrice = async (ageId, companyId, newPrice) => {
        if (!isNaN(newPrice) && newPrice !== "") {
            try {
                // Check if the premium already exists, if yes, update it
                const existingTarifa = tarifas[ageId]?.[companyId];

                if (existingTarifa.id!== undefined) {
                    await axios.put(`http://127.0.0.1:8000/api/premium_insurance/${existingTarifa.id}/`, {
                        company: companyId,
                        age_bracket: ageId,
                        premium_amount: newPrice
                    });
                } else {
                    // If no existing tarifa, create a new one
                    await axios.post("http://127.0.0.1:8000/api/premium_insurance/", {
                        company: companyId,
                        age_bracket: ageId,
                        premium_amount: newPrice
                    });
                }

                setTarifas((prevTarifas) => ({
                    ...prevTarifas,
                    [ageId]: {
                        ...prevTarifas[ageId],
                        [companyId]: newPrice
                    }
                }));

                setIsEditing((prev) => ({
                    ...prev,
                    [`${ageId}-${companyId}`]: false
                }));
            } catch (error) {
                console.error("Error al guardar el precio:", error);
            }
        } else {
            alert("Por favor ingrese un valor numérico válido");
        }
    };

    const handlePriceChange = (e, ageId, companyId) => {
        const value = e.target.value;
        if (/^[0-9]*\.?[0-9]*$/.test(value)) {
            setTarifas((prevTarifas) => ({
                ...prevTarifas,
                [ageId]: {
                    ...prevTarifas[ageId],
                    [companyId]: value
                }
            }));
        }
    };

    const handleDeleteCompany = async (companyId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/companies/${companyId}/`);
            setCompanies(companies.filter((company) => company.id !== companyId));
            setTarifas((prevTarifas) => {
                const updatedTarifas = { ...prevTarifas };
                for (const ageId in updatedTarifas) {
                    delete updatedTarifas[ageId][companyId];
                }
                return updatedTarifas;
            });
        } catch (error) {
            console.error("Error al eliminar la compañía:", error);
        }
    };

    const handleDeleteAgeBracket = async (ageId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/age_brackets/${ageId}/`);
            setAgeBrackets(ageBrackets.filter((bracket) => bracket.id !== ageId));
            setTarifas((prevTarifas) => {
                const updatedTarifas = { ...prevTarifas };
                delete updatedTarifas[ageId];
                return updatedTarifas;
            });
        } catch (error) {
            console.error("Error al eliminar el rango de edad:", error);
        }
    };

    const handleEditToggle = (ageId, companyId) => {
        setIsEditing((prev) => ({
            ...prev,
            [`${ageId}-${companyId}`]: !prev[`${ageId}-${companyId}`]
        }));
    };

    return (
        <>
        
            {/* Formulario para agregar nuevas compañías */}
            <button onClick={() => setIsAddingNewCompany(!isAddingNewCompany)}>
                {isAddingNewCompany ? "Cancelar" : "Agregar Nueva Compañía"}
            </button>
            {isAddingNewCompany && (
                <div>
                    <input
                        type="text"
                        name="newCompanyName"
                        value={formData.newCompanyName}
                        onChange={handleChange}
                        placeholder="Nombre de la nueva compañía"
                        required
                    />
                    <button onClick={handleAddNewCompany}>Guardar Nueva Compañía</button>
                </div>
            )}

            {/* Formulario para agregar nuevos rangos de edad */}
            <button onClick={() => setIsAddingNewAgeBracket(!isAddingNewAgeBracket)}>
                {isAddingNewAgeBracket ? "Cancelar" : "Agregar Nuevo Rango de Edad"}
            </button>
            {isAddingNewAgeBracket && (
                <div>
                    <input
                        type="text"
                        name="newAgeBracket"
                        value={formData.newAgeBracket}
                        onChange={handleChange}
                        placeholder="Nuevo Rango de Edad"
                        required
                    />
                    <button onClick={handleAddNewAgeBracket}>Guardar Nuevo Rango</button>
                </div>
            )}
            <br></br>

            <h2>Tabla de Tarifas</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Rango de Edad</th>
                        {companies.map((company) => (
                            <th key={company.id}>
                                {company.name}
                                <button onClick={() => handleDeleteCompany(company.id)}>X</button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {ageBrackets.map((bracket) => (
                        <tr key={bracket.id}>
                            <td>{bracket.age}</td>
                            {companies.map((company) => (
                                <td key={company.id}>
                                    {isEditing[`${bracket.id}-${company.id}`] ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={tarifas[bracket.id]?.[company.id] || ""}
                                                onChange={(e) => handlePriceChange(e, bracket.id, company.id)}
                                                step="0.01"
                                            />
                                            <button onClick={() => handleSavePrice(bracket.id, company.id, tarifas[bracket.id]?.[company.id] || "")}>
                                                Guardar
                                            </button>
                                        </div>
                                    ) : (
                                        tarifas[bracket.id]?.[company.id] || "Sin tarifa"
                                    )}
                                    <button onClick={() => handleEditToggle(bracket.id, company.id)}>
                                        {isEditing[`${bracket.id}-${company.id}`] ? "Cancelar" : "Editar"}
                                    </button>
                                </td>
                            ))}
                            <td>
                                <button onClick={() => handleDeleteAgeBracket(bracket.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        
        </>
        
    );
};

export default TarifaComponents;
