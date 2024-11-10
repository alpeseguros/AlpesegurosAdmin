
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import {AuthProvider} from "./views/context/AuthContext.jsx"
import { SessionProvider } from './views/context/sessionContext.jsx'

import React from 'react';
import Presupuestos from './views/presupuestos/index.js'
import AreaPrivada from './views/areaPrivada/index.js'
import Login from './views/login/index.js'
import Tarifa from './views/agregartarifa'
import TarifaLista from './views/verTarifa/index.js'
import PresupuestosResult from './views/tablaPrespuesto/index.js' 
import Home from './views/home/index.js'
import CustomForm from './views/customForm/index.js'
import PdfSignature from './views/signatureForm/index.js'
import DocumentosConFirmas from './views/revisarDocumentos/index.js';
function App() {
    return (
        <AuthProvider>
            <SessionProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                                                 
                      
                        
                        <Route path="/presupuestos" element={<Presupuestos />}>
                            
                        </Route>

                        <Route path="/areaPrivada" element={<AreaPrivada />} />

                        <Route path="/Login" element={<Login />}>
                            
                        </Route>
                        
                        
                        <Route path="/Agregar-tarifa" element={<Tarifa />}>
                            
                        </Route>
                        
                        <Route path="/ver-tarifas" element={<TarifaLista />}>
                            
                        </Route>

                        <Route path="/resultado-consulta" element={<PresupuestosResult/>}>
                            
                        </Route>

                        <Route path="/customForm" element={<CustomForm/>}>
                            
                        </Route>
                        <Route path="/pdfSignature/:uuid_pdf" element={<PdfSignature/>}>
                            
                        </Route>
                        <Route path="/revisarDocumentos" element={<DocumentosConFirmas />}>
                            
                        </Route>
                        
                        
                    </Routes>

                </BrowserRouter>
                </SessionProvider>
            </AuthProvider>
         
    );
}

export default App;