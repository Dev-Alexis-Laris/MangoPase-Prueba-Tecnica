import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Col, Card, CardBody, CardFooter, CardImg, Badge, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { CarritoContext } from '../provider/CarritoContext';

const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
};

const PokeCard = ({ poke, isCart, onRemove }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { agregarAlCarrito } = useContext(CarritoContext);
    const [pokemon, setPokemon] = useState({});
    const [image, setImage] = useState('');
    const fixedPrice = "$50";

    useEffect(() => {
        getPokemon();
    }, [poke.url]);

    const getPokemon = async () => {
        if (!poke.url) {
            console.error('URL de poke está vacía o indefinida');
            enqueueSnackbar('URL de poke está vacía o indefinida', { variant: 'error' });
            return;
        }

        try {
            const response = await axios.get(poke.url);
            const data = response.data;
            setPokemon(data);
            const imageUrl = data.sprites.other.dream_world.front_default || data.sprites.other['official-artwork'].front_default;
            setImage(imageUrl);
        } catch (error) {
            console.error('Error al cargar los datos del Pokémon:', error);
            enqueueSnackbar('Error al cargar los datos del Pokémon', { variant: 'error' });
        }
    };

    
    const addCar = async () => {
        
        if (isCart) {
            try {
                const token = localStorage.getItem('jwtToken');
                
                
                const response = await axios.delete(`http://localhost:8000/api/carrito/eliminar/${pokemon.name}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, 
                    },
                });
                
                
                if (response.status === 200) {
                    
                    onRemove(pokemon.name);
                    
                    
                    enqueueSnackbar('¡Pokémon eliminado del carrito!', { variant: 'success' });
                } else {
                    
                    if (response.data && response.data.message === 'Pokémon no encontrado en el carrito') {
                        enqueueSnackbar('Pokémon no encontrado en el carrito', { variant: 'error' });
                    } else {
                        enqueueSnackbar('Error al eliminar el Pokémon del carrito', { variant: 'error' });
                    }
                }
            } catch (error) {
                
                console.error('Error al eliminar el Pokémon del carrito:', error);
                enqueueSnackbar('Error al eliminar el Pokémon del carrito', { variant: 'error' });
            }
        } else {
            
            const pokemonConUrl = {
                name: pokemon.name,
                url: poke.url,
                sprite: image,
                price: 50,
                id: pokemon.id,
            };
            
            agregarAlCarrito(pokemonConUrl);
            
            try {
                const token = localStorage.getItem('jwtToken');
                
                
                const response = await axios.post('http://localhost:8000/api/carrito/agregar', {
                    pokemon_name: pokemonConUrl.name,
                    sprite: pokemonConUrl.sprite,
                    price: pokemonConUrl.price,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (response.status === 201) {
                    enqueueSnackbar('¡Pokémon agregado al carrito!', { variant: 'success' });
                } else {
                    enqueueSnackbar('Error al agregar el Pokémon al carrito', { variant: 'error' });
                }
            } catch (error) {
                console.error('Error al agregar el Pokémon al carrito:', error);
                enqueueSnackbar('Error al agregar el Pokémon al carrito', { variant: 'error' });
            }
        }
    };
    

    const primaryType = pokemon.types && pokemon.types[0]?.type.name;
    const cardBgColor = typeColors[primaryType] || '#FFFFFF';

    return (
        <Col sm="4" lg="3" className="mb-3">
            <Card style={{ backgroundColor: cardBgColor, borderColor: '#B0B0B0' }} className="shadow border-8">
                <div className="d-flex justify-content-start p-2">
                    <Badge pill color="light" style={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
                        # {pokemon.id}
                    </Badge>
                </div>
                <CardImg src={image} height="200" className="p-2" />
                <CardBody className="text-center">
                    <span className="fs-4 text-capitalize" style={{ fontWeight: 'bold' }}>
                        {pokemon.name}
                    </span>
                    <div>
                        {pokemon.types && pokemon.types.map((type, index) => (
                            <Badge key={index} pill color="info" className="mx-1">
                                {type.type.name}
                            </Badge>
                        ))}
                    </div>
                </CardBody>
                <CardFooter className="bg-warning d-flex justify-content-between align-items-center">
                    <Link className="btn btn-secondary" to={`/pokemon/${pokemon.name}`}>
                        Ver
                    </Link>
                    <div className="text-dark text-center" style={{ fontWeight: 'bold' }}>
                        Precio: {fixedPrice}
                    </div>
                    <Button className="btn btn-danger" onClick={addCar}>
                        <i className={isCart ? "fa-solid fa-trash" : "fa-solid fa-cart-shopping"}></i> {isCart ? "Eliminar" : "Agregar"}
                    </Button>
                </CardFooter>
            </Card>
        </Col>
    );
};

export default PokeCard;
