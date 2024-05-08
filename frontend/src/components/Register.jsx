import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

function RegisterForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:8000/api/register', data);
            enqueueSnackbar('Registro Exitoso', { variant: 'success' });
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
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
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Registrarse <i className="fa fa-sign-in" aria-hidden="true"></i></h2>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Nombre</label>
                    <input {...register('name', { required: true })} style={styles.input} />
                    {errors.name && <span style={styles.error}>Este campo es requerido</span>}
                </div>
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
                    Registrarse
                </button>
            </form>
        </div>
    );
}

export default RegisterForm;
