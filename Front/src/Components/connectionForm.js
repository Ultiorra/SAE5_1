import React, {useEffect, useState} from 'react';
import '../css/AuthForm.css';
import { Button  } from '@mui/material'; // Import MUI components as needed
import {  toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
function AuthForm({ isRegistration, setRegistration, isConnected, setConnected, setUser, user }) {
    const history = useNavigate();
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
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isRegistration){
            if (!validateEmail(email)) {
                toast('Veuillez fournir une adresse email valide', { type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER });
                return;
            }

            if (password.length < 8) {
                toast('Le mot de passe doit contenir au moins 8 caractères', { type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER });
                return;
            }

            if (isRegistration && password !== confirmPassword) {
                toast('Les mots de passe ne correspondent pas', { type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER });
                return;
            }
        }
        if (isRegistration) {
            var requestOption = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: login, password: password, email: email, confirmPassword: confirmPassword }),
            }
            fetch (path + 'sign_in.php', requestOption).then(response => response.json()).then(data => {
                console.log(data);
                if (data.status === "success")
                    toast('Inscription réussie', { type: 'success', autoClose: 2000, position: toast.POSITION.TOP_CENTER });
                else
                    toast('Erreur d\'inscription', { type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER });
            })
                .catch(error => {

                    toast('Erreur d\'inscription', { type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER });

                });
        }
        else {

            var requestOption = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: login, password: password})
            }
            console.log(path + 'login.php' + requestOption.body)
            fetch (path + 'login.php', requestOption).then(response => response.json()).then(data => {
                console.log(data);
                if (data.status === "success") {
                    localStorage.clear();
                    setConnected(true);
                    console.log(data.iduser +"id");
                    setUser({ login: data.user, id: data.iduser, email: data.email, directories: { id: 1, name: 'directory1', ouvertures: 'ouvertures1', nb_tests: 1, nb_success: 1, color: 'white' } });
                    //console.log(user);
                    user.login = data.user;
                    user.id = data.iduser;
                    user.email = data.email;
                    user.password = password;
                    user.lichess_name = data.lichess_name;
                    console.log('user après login : ' + user.login + ' ' + user.password + ' ' + user.id + ' ' + user.email);
                    localStorage.setItem('user', JSON.stringify(user));
                    history('/directories');
                    toast('Connexion réussie, bon retour parmi nous ' + user.login, { type: 'success', autoClose: 5000, position: toast.POSITION.TOP_CENTER });
                }
                else {
                    toast('Erreur de connexion, veuillez vérifier vos identifiants', { type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER });
                }
            }).catch(error => {
                console.log(error)
                toast('Erreur de connexion', { type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER });

            });
        }
    };

    useEffect(() => {
        console.log(user);
    } , [user])
    const handleForgotPassword = () => {
        // TODO : Logic to handle forgot password
    }

    return (
        <div className="auth-form-container" style={{
            alignContent: 'center',
            alignItems: 'center',
        }}>
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
