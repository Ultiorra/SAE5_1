import React, { useState } from 'react';
import '../css/AuthForm.css';
import { Button, TextField } from '@mui/material'; // Import MUI components as needed

function AuthForm({ isRegistration }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState(''); // Add email state

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegistration) {
            // TODO : Logic to handle registration
        } else {
            // TODO : Logic to handle connection
        }
    };

    const handleForgotPassword = () => {
        // TODO : Logic to handle forgot password
    }
    return (
        <div className="auth-form-container">
            <h1 className="auth-form-title">{isRegistration ? "S'inscrire" : "Se connecter"}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="auth-form-label">Nom d'utilisateur {isRegistration ? "" : "ou Email"}:</label>
                    <input className="auth-form-input" type="text" value={username} onChange={handleUsernameChange} />
                </div>
                <div>
                    <label className="auth-form-label">Mot de passe:</label>
                    <input className="auth-form-input" type="password" value={password} onChange={handlePasswordChange} />
                </div>
                {isRegistration && (
                    <div>
                        <label className="auth-form-label">Confirmer le mot de passe:</label>
                        <input
                            className="auth-form-input"
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                    </div>
                )}
                {isRegistration && (
                    <div>
                        <label className="auth-form-label">Email:</label>
                        <input className="auth-form-input" type="email" value={email} onChange={handleEmailChange} />
                    </div>
                )}
                <Button className="auth-form-button" type="submit">
                    {isRegistration ? "S'inscrire" : "Se connecter"}
                </Button>
                {!isRegistration && (
                    <button className="auth-form-forgot-password" type="button" onClick={handleForgotPassword}>
                        Mot de passe oublié
                    </button>
                )}
            </form>
        </div>
    );
}

export default AuthForm;
