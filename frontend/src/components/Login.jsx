import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

function LoginForm({ onLoginSuccess }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

        const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:8000/api/login', data);
            console.log('User logged in:', response.data);
            
            if (response.data && response.data.token) {
                // Guarda el token en el local storage
                localStorage.setItem('jwtToken', response.data.token);
                
                // Llama a la función de éxito de inicio de sesión
                onLoginSuccess();
                
                // Redirige a la página de inicio y recarga la página
                navigate('/home');
                window.location.reload();

                // Mostrar una notificación de éxito
                enqueueSnackbar('Inicio de sesión exitoso', { variant: 'success' });
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh', 
        },
        form: {
            backgroundColor: '#f7f7f7',
            padding: '40px', 
            borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
            width: '400px', 
            maxWidth: '100%', 
        },
        formGroup: {
            marginBottom: '20px', 
        },
        label: {
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
        },
        input: {
            width: '100%', 
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box', 
        },
        error: {
            color: 'red', 
            fontSize: '12px',
            marginTop: '5px', 
        },
        button: {
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#007bff', 
            color: '#fff', 
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
        },
        buttonHover: {
            backgroundColor: '#0056b3', 
        },
    };

    const handleButtonHover = (e, hover) => {
        e.currentTarget.style.backgroundColor = hover ? styles.buttonHover.backgroundColor : styles.button.backgroundColor;
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Ingresar <i className="fa-solid fa-user"></i></h2>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input {...register('email', { required: true })} style={styles.input} />
                    {errors.email && <span style={styles.error}>Este campo es requerido</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Contraseña</label>
                    <input type="password" {...register('password', { required: true })} style={styles.input} />
                    {errors.password && <span style={styles.error}>Este campo es requerido</span>}
                </div>
                <button
                    type="submit"
                    style={styles.button}
                    onMouseEnter={(e) => handleButtonHover(e, true)}
                    onMouseLeave={(e) => handleButtonHover(e, false)}
                >
                    Ingresar
                </button>
            </form>
        </div>
    );
}

export default LoginForm;
