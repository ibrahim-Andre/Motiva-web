import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Login from './pages/Login'
import TaxiAdmin from './pages/TaxiAdmin'
import "leaflet/dist/leaflet.css";

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import App from './App'
import Admin from './pages/Admin'

ReactDOM.createRoot(document.getElementById('root')).render(

    <React.StrictMode>

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<App />} />

                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/taxi-admin" element={<TaxiAdmin />} />

            </Routes>

        </BrowserRouter>

    </React.StrictMode>,
)