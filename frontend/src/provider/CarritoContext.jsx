import React, { createContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

const CarritoProvider = ({ children }) => {
    // Inicializa el carrito con los datos guardados en localStorage, si existen.
    const [carrito, setCarrito] = useState(() => {
        const carritoGuardado = localStorage.getItem('carrito');
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    });

    // Usa useEffect para guardar el carrito en localStorage cada vez que cambie el estado.
    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }, [carrito]);

    const agregarAlCarrito = (pokemon) => {
        setCarrito((prevCarrito) => [...prevCarrito, pokemon]);
    };

    const eliminarDelCarrito = (pokemon) => {
        setCarrito((prevCarrito) => prevCarrito.filter(p => p.id !== pokemon.id));
    };
    

    const vaciarCarrito = () => {
        setCarrito([]);
        // Elimina también el carrito de localStorage
        localStorage.removeItem('carrito');
    };

    const value = {
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
    };

    return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
};

export { CarritoContext, CarritoProvider };
