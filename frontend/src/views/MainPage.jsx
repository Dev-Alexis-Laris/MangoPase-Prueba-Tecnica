import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PokeCard from '../components/PokeCard';
import { Container, Row, InputGroupText, Input } from 'reactstrap';
import { PaginationControl } from 'react-bootstrap-pagination-control'

function MainPage() {
    const [pokemones, setPokemones] = useState([]);
    const [allPokemones, setAllPokemones] = useState([]);
    const [listado, setListado] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [limit, setLimit] = useState(20);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        getPokemones(0);
        getAllPokemones();
    }, []);


    const agregarAlCarrito = (pokemon) => {
        console.log('Pokémon agregado al carrito:', pokemon);
    };

    const getPokemones = async (offset) => {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

        axios.get(apiUrl)
            .then(response => {
                const res = response.data;
                setPokemones(res.results);
                setListado(res.results);
                setTotal(res.count)
            })
            .catch(error => {
                console.error('Error al obtener los pokemones:', error);
            });
    };

    const getAllPokemones = async () => {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;

        axios.get(apiUrl)
            .then(response => {
                const res = response.data;
                setAllPokemones(res.results);
            })
            .catch(error => {
                console.error('Error al obtener los pokemones:', error);
            });
    };

    useEffect(() => {
        if (filtro.trim() === '') {
            setListado(pokemones);
        } else {

            const filtroLower = filtro.toLowerCase();

            const id = parseInt(filtro, 10);
            if (!isNaN(id)) {
                const pokeById = allPokemones.find(p => p.url.endsWith(`/${id}/`));
                if (pokeById) {

                    setListado([pokeById]);
                } else {
                    axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
                        .then(response => {
                            setListado([response.data]);
                        })
                        .catch(error => {
                            console.error(`Error al obtener el Pokémon con ID ${id}:`, error);
                            setListado([]);
                        });
                }
            } else {
                const results = allPokemones.filter(p => p.name.includes(filtroLower));
                setListado(results);
            }
        }
    }, [filtro, pokemones, allPokemones]);

    const goPage = async (p) => {
        setListado([]);
        await getPokemones((p == 1 ? 0 : (p - 1) * limit));
        setOffset(p);
    };

    return (
        <>
            <Container>

                <Row>
                    <InputGroupText style={{ marginTop: '15px', marginBottom: '15px' }}>
                        <i className='fa-solid fa-search' style={{ marginRight: '8px' }}></i>
                        <Input
                            value={filtro}
                            onChange={(e) => {
                                setFiltro(e.target.value);
                            }}
                            placeholder='Buscar pokemon'
                            style={{ flex: 1, width: '100%' }}
                        />
                    </InputGroupText>
                    <br />
                </Row>
                <Row className='mt-3'>
                    {listado.map((pok, i) => (
                        <PokeCard
                        key={i}
                        poke={pok}
                        agregarAlCarrito={agregarAlCarrito}
                        />
                    ))}
                </Row>
                    <PaginationControl
                        last={true}
                        limit={limit}
                        total={total}
                        page={offset}
                        changePage={goPage}
                    />

            </Container>
        </>
    );
}

export default MainPage;
