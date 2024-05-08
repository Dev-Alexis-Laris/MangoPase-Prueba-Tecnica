import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardImg, Badge, CardFooter, Button } from 'reactstrap';
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

function PokemonDetail({ poke }) {
    const { pokemonName } = useParams();
    const navigate = useNavigate();
    const { carrito, agregarAlCarrito, eliminarDelCarrito } = React.useContext(CarritoContext);
    const { enqueueSnackbar } = useSnackbar();
    const [pokemon, setPokemon] = React.useState({});
    const [image, setImage] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const fixedPrice = "$50";
    const [isCart, setIsCart] = React.useState(false);

    // Inicializar isCart con base en el estado del carrito
    React.useEffect(() => {
        setIsCart(carrito.some(poke => poke.name === pokemonName));
    }, [carrito, pokemonName]);

    // Función para obtener detalles del Pokémon
    const fetchPokemonDetails = async () => {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
        try {
            const response = await axios.get(apiUrl);
            const data = response.data;
            setPokemon(data);
            const spriteUrl = data.sprites.other.dream_world.front_default || data.sprites.other['official-artwork'].front_default;
            setImage(spriteUrl);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    React.useEffect(() => {
        fetchPokemonDetails();
    }, [pokemonName]);

    const addCar = async () => {
        if (isCart) {
            // Si está en el carrito, eliminar el Pokémon
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.delete(`http://localhost:8000/api/carrito/eliminar/${pokemon.name}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    eliminarDelCarrito(pokemon); // Eliminar del carrito en el contexto
                    setIsCart(false); // Actualizar isCart para reflejar que el Pokémon ya no está en el carrito
                    enqueueSnackbar('¡Pokémon eliminado del carrito!', { variant: 'success' });
                } else {
                    enqueueSnackbar('Error al eliminar el Pokémon del carrito', { variant: 'error' });
                }
            } catch (error) {
                console.error('Error al eliminar el Pokémon del carrito:', error);
                enqueueSnackbar('Error al eliminar el Pokémon del carrito', { variant: 'error' });
            }
        } else {
            // Si no está en el carrito, agregar el Pokémon
            const pokemonConUrl = {
                name: pokemon.name,
                url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
                sprite: image,
                price: 50,
                id: pokemon.id,
            };

            agregarAlCarrito(pokemonConUrl); // Agregar al carrito

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
                    setIsCart(true); // Actualizar isCart para reflejar que el Pokémon se agregó al carrito
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
        <Container>
            <Row style={{ marginTop: '15px', marginBottom: '15px' }}>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <Card style={{ backgroundColor: cardBgColor, borderColor: '#B0B0B0' }} className="shadow border-8">
                        <div className="d-flex justify-content-start p-2">
                            <Badge pill color="light" style={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
                                # {pokemon.id}
                            </Badge>
                        </div>
                        <CardImg src={image} height='200' className="p-2" />
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

                            <div className="text-dark text-center mt-3" style={{ fontWeight: 'bold' }}>
                                Precio: {fixedPrice}
                            </div>
                        </CardBody>
                        <CardFooter className="bg-warning d-flex justify-content-between align-items-center">
                            <Button className="btn btn-light" onClick={() => navigate(-1)}>
                                <i className="fa fa-arrow-left"></i> Volver
                            </Button>
                            <Button className="btn btn-danger" onClick={addCar}>
                                <i className={isCart ? "fa-solid fa-trash" : "fa-solid fa-cart-shopping"}></i> {isCart ? "Eliminar" : "Agregar"}
                            </Button>

                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PokemonDetail;
