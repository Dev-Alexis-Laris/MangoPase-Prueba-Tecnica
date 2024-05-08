import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/Register';
import LoginForm from './components/Login';
import MainPage from './views/MainPage';
import PokemonDetail from './views/PokemonDetail';
import Navbar from './components/NavBar';
import Carrito from './views/Carrito';
import HistorialCompras from './views/HistorialCompras';
import { SnackbarProvider } from 'notistack';
import { CarritoProvider } from './provider/CarritoContext';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');

    const handleLoginSuccess = (name) => {
        setIsAuthenticated(true);
        setUserName(name);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserName('');
        localStorage.removeItem('jwtToken');
    };

    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Router>
                <CarritoProvider>
                    <div>
                        <Navbar isAuthenticated={isAuthenticated} userName={userName} onLogout={handleLogout} />
                        <Routes>
                            <Route path="/" element={<MainPage />} />
                            <Route path="/home" element={<MainPage />} />
                            <Route path="/register" element={<RegisterForm />} />
                            <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
                            <Route path="/carrito" element={<Carrito />} />
                            <Route path="/historial-compras" element={<HistorialCompras />} />
                            <Route path="/pokemon/:pokemonName" element={<PokemonDetail />} />
                        </Routes>
                    </div>
                </CarritoProvider>
            </Router>
        </SnackbarProvider>
    );
}

export default App;
