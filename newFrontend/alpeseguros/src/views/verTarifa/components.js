import React, { useEffect, useState } from "react";
import axios from "axios";
import TarifaComponents from "../agregartarifa/components.js";
import "./TarifaList.css";

const TarifaList = () => {
    const [records, setRecords] = useState([]);

    const fetchRecords = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/premium_insurance/");
            setRecords(response.data);
        } catch (error) {
            console.error("Error fetching records:", error);
        }
    };

    const handleAddSuccess = (newRecord) => {
        setRecords([newRecord, ...records]);
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    return (
        <div className="tarifa-list-container">
            <h2>Health Insurance Premiums</h2>
            <TarifaComponents onAddSuccess={handleAddSuccess} />
            <table className="tarifa-table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Age Bracket</th>
                        <th>Premium Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => (
                        <tr key={record.id}>
                            <td>{record.company}</td>
                            <td>{record.age_bracket}</td>
                            <td>${record.premium_amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TarifaList;
