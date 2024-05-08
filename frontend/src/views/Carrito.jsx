import axios from 'axios';
import React, { useContext } from 'react';
import PokeCard from '../components/PokeCard';
import { Container, Row, Col, Button } from 'reactstrap';
import { CarritoContext } from '../provider/CarritoContext';
import { useSnackbar } from 'notistack';

function Carrito() {
    const { carrito, eliminarDelCarrito, vaciarCarrito, userId, updateUserId } = useContext(CarritoContext);
    const { enqueueSnackbar } = useSnackbar();
    

    
    const totalPrecio = carrito.reduce((total, pokemon) => total + pokemon.price, 0);

    const comprarProductos = async () => {
        if (carrito.length === 0) {
            enqueueSnackbar('Carrito Vacío', { variant: 'warning' });
            return;
        }

        
        const datosCompra = carrito.map((pokemon) => ({
            pokemon_name: pokemon.name,
            sprite: pokemon.sprite,
            price: pokemon.price,
            user_id: userId,
          }));

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post('http://localhost:8000/api/comprar', datosCompra, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                vaciarCarrito();
                enqueueSnackbar('¡Felicidades! Compra Exitosa', { variant: 'info' });
            } else {
                const errorData = response.data;
                enqueueSnackbar(`Error al realizar la compra: ${errorData.error}`, { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar(`Error al realizar la compra: ${error.message}`, { variant: 'error' });
        }
    };

    return (
        <Container style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ color: '#fff', marginTop: '10px' }}>CARRITO DE COMPRAS</h2>
                <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    border: '1px solid #ccc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '5px'
                }}>
                    <span style={{ color: '#fff' }}>Total Pokemones:</span>
                    <strong style={{ color: '#90EE90', margin: '10px' }}> ${totalPrecio}</strong>
                    <Button color="success" onClick={comprarProductos}>
                        <i className="fa-solid fa-cart-shopping"></i> Comprar
                    </Button>
                </div>
            </div>

            <Row className="mt-3">
                {carrito.map((pokemon, index) => (
                    <Col key={index} sm="6" md="4" lg="11" className="mb-3">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <PokeCard
                                poke={pokemon}
                                isCart={true}
                                onRemove={() => eliminarDelCarrito(pokemon)}
                            />
                            <span style={{ color: '#fff', marginLeft: '10px', marginRight: 'auto' }}>Producto {index + 1}</span>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Carrito;
