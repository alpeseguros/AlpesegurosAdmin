import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './TablaPreciosComponent.css'; // Importamos el archivo de estilos
import BackButton from '../../utils/backbutton';
import Header from '../../utils/header';
import Footer from '../../utils/footer';

const TablaPreciosComponent = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [totalPrice, setTotalPrice] = useState({});
  const [companyNames, setCompanyNames] = useState({});
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const nombre = queryParams.get('nombre');

    const fetchHealthInsuranceData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/save_health_insurance/?nombre=${nombre}`);
        const result = await response.json();
        const filteredItems = result.filter(item => item.nombre === nombre);
        setFilteredData(filteredItems);
      } catch (error) {
        console.error("Error al obtener datos de Health Insurance:", error);
      }
    };

    if (nombre) {
      fetchHealthInsuranceData();
    }
  }, [location]);

  useEffect(() => {
    const fetchPrices = async () => {
      if (filteredData.length === 0) return;

      try {
        const responseCompanies = await fetch('http://127.0.0.1:8000/api/companies/');
        const companies = await responseCompanies.json();

        const responseAgeBrackets = await fetch('http://127.0.0.1:8000/api/age_brackets/');
        const ageBrackets = await responseAgeBrackets.json();

        const responsePrices = await fetch('http://127.0.0.1:8000/api/premium_insurance/');
        const prices = await responsePrices.json();

        const sumaPorCompania = {};
        const companyNamesDict = {};

        filteredData.forEach(item => {
          const ageBracket = ageBrackets.find(bracket => bracket.age === item.edad);
          if (ageBracket) {
            prices.forEach(priceItem => {
              if (priceItem.age_bracket === ageBracket.id) {
                const companyId = priceItem.company;
                const premiumAmount = parseFloat(priceItem.premium_amount);

                if (sumaPorCompania[companyId]) {
                  sumaPorCompania[companyId] += premiumAmount;
                } else {
                  sumaPorCompania[companyId] = premiumAmount;
                  companyNamesDict[companyId] = companies.find(comp => comp.id === companyId)?.name || "Desconocida";
                }
              }
            });
          }
        });

        setTotalPrice(sumaPorCompania);
        setCompanyNames(companyNamesDict);
      } catch (error) {
        console.error("Error al obtener precios:", error);
      }
    };

    fetchPrices();
  }, [filteredData]);

  return (
    <>
     <Header /> 

     <div className="tabla-precios-container">
       <BackButton />  {/* Aquí se muestra el botón "Volver" */}
      <h2>Tabla de Precios</h2>
      <table className="tabla-precios">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Compañía</th>
            <th>Total Precio</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(totalPrice).length > 0 ? (
            Object.keys(totalPrice).map((companyId, index) => (
              <tr key={index}>
                <td><img src={`${companyNames[companyId]}.png`} alt="Logo" className="company-logo" /></td>
                <td>{companyNames[companyId]}</td>
                <td>{totalPrice[companyId]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Cargando o no hay datos disponibles para el nombre especificado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
     <Footer /> 
    </>
    
  );
};

export default TablaPreciosComponent;
