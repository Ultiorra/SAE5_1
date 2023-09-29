import React, { useState } from 'react';
import '../css/AuthForm.css';
import { Button, TextField } from '@mui/material'; // Import MUI components as needed

function AuthForm({ isRegistration, setRegistration, isConnected, setConnected}) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState(''); // Add email state

    const path = "http://localhost/my-app/prochess/";

    const handleLoginChange = (e) => {
        setLogin(e.target.value);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isRegistration) {
            var requestOption = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: login, password: password, email: email, confirmPassword: confirmPassword }),
            }
            //console.log(requestOption.body)
            fetch (path + 'sign_in.php', requestOption).then(response => {
                console.log(response.status)
                if (response.status === 200)
                    console.log("Creation de compte reussi");
            })
                .catch(error => {
                    console.log(error);
                });
        }
        else {

            var requestOption = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: login, password: password})
            }
            fetch (path + 'login.php', requestOption).then(response => {
                console.log(response.status)
                if (response.status === 200) {
                    console.log("Connexion reussi");
                    setConnected(true);
                }
                else {
                    console.log("Echec de connexion");
                }
            }).catch(error => {
                console.log(error);
            });
        }
    };

    const handleForgotPassword = () => {
        // TODO : Logic to handle forgot password
    }
    return (
        <div className="auth-form-container">
            <h1 className="auth-form-title">{isRegistration ? "S'inscrire" : "Se connecter"}</h1>
            <form onSubmit={handleSubmit} method="POST">
                <div>
                    <label className="auth-form-label">Nom d'utilisateur {isRegistration ? "" : "ou Email"}:</label>
                    <input name="login" className="auth-form-input" type="text" value={login} onChange={handleLoginChange} />
                </div>
                <div>
                    <label className="auth-form-label">Mot de passe:</label>
                    <input name="password" className="auth-form-input" type="password" value={password} onChange={handlePasswordChange} />
                </div>
                {isRegistration && (
                    <div>
                        <label className="auth-form-label">Confirmer le mot de passe:</label>
                        <input className="auth-form-input" type="password" value={confirmPassword} onChange={handleConfirmPasswordChange}/>
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

                <button  className="auth-form-forgot-password" type="button" onClick={() => setRegistration(!isRegistration)}>
                    {isRegistration ? "Se connecter" : "S'inscrire"}
                </button>
            </form>
        </div>
    );
}

export default AuthForm;
