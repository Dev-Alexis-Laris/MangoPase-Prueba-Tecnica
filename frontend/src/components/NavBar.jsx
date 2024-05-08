import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';



function Navbar() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            axios.get('http://localhost:8000/api/userInfo', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setUserName(response.data.name);
                })
                .catch((error) => {
                    console.error('Error fetching user info:', error);
                    setUserName('');
                });
        } else {
            setUserName('');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setUserName('');
        navigate('/');
    };

    const styles = {
        navbar: {
            backgroundColor: '#6c757d',
            padding: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        leftLinks: {
            display: 'flex',
            alignItems: 'center',
        },
        rightLinks: {
            display: 'flex',
            alignItems: 'center',
        },
        link: {
            color: '#fff',
            textDecoration: 'none',
            marginLeft: '15px',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'background-color 0.3s ease',
        },
        link2: {
            color: '#FFD300',
            textDecoration: 'none',
            marginLeft: '15px',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'background-color 0.3s ease',
        },
        linkHover: {
            backgroundColor: '#0056b3',
        },
        icon: {
            marginRight: '8px',
        },
        button: {
            color: '#fff',
            backgroundColor: '#dc3545',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '15px',
        },
    };

    const handleLinkHover = (e, hover) => {
        e.currentTarget.style.backgroundColor = hover ? styles.linkHover.backgroundColor : 'transparent';
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <div style={styles.leftLinks}>
                    {userName && (
                        <b style={styles.link2}>{`Bienvenido: ${userName}`}</b>
                    )}
                    <Link
                        to="/home"
                        style={styles.link}
                        onMouseEnter={(e) => handleLinkHover(e, true)}
                        onMouseLeave={(e) => handleLinkHover(e, false)}
                    >
                        <i className="fa-solid fa-house"></i> Menú Principal
                    </Link>
                </div>

                <div style={styles.rightLinks}>
                    {userName ? (
                        <>
                            <Link
                                to="/historial-compras"
                                style={styles.link}
                                onMouseEnter={(e) => handleLinkHover(e, true)}
                                onMouseLeave={(e) => handleLinkHover(e, false)}
                            >
                                <i className="fa fa-history" aria-hidden="true"></i> Historial de Compras
                            </Link>
                            <Link
                                to="/carrito"
                                style={styles.link}
                                onMouseEnter={(e) => handleLinkHover(e, true)}
                                onMouseLeave={(e) => handleLinkHover(e, false)}
                            >
                                <i className="fa-solid fa-cart-shopping"></i> Carrito 
                            </Link>
                            <button
                                onClick={handleLogout}
                                style={styles.button}
                            >
                                Cerrar Sesión 
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/register"
                                style={styles.link}
                                onMouseEnter={(e) => handleLinkHover(e, true)}
                                onMouseLeave={(e) => handleLinkHover(e, false)}
                            >
                                Registrarse <i className="fa fa-sign-in" aria-hidden="true"></i>
                            </Link>
                            <Link
                                to="/login"
                                style={styles.link}
                                onMouseEnter={(e) => handleLinkHover(e, true)}
                                onMouseLeave={(e) => handleLinkHover(e, false)}
                            >
                                Ingresar <i className="fa-solid fa-user"></i>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
