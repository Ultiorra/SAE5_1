import React, {useEffect,  useState} from 'react';
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Button, Typography} from "@mui/material";
import "../css/ProfilePage.css";
function ProfileEditPage({ user }) {
    const navigate = useNavigate();
    const [editedUser, setEditedUser] = useState(user);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const path = "http://localhost/my-app/prochess/";

    useEffect(() => {
        //console.log('\n' + user + '\n');
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setEditedUser(JSON.parse(loggedInUser));
        }
    } , [user])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleOpenChangePasswordModal = () => {
        setShowChangePasswordModal(true);
    };

    const handleCloseChangePasswordModal = () => {
        setShowChangePasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        var requestOption = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: user.id, login: editedUser.login, email: editedUser.email, lichess_name: editedUser.lichess_name }),
        }
        fetch (path + 'edit_user.php', requestOption).then(response => response.json()).then(data => {
            console.log(data);
            if (data.status === "success") {
                const loggedInUser = localStorage.getItem("user");
                console.log('loggedInUser from ProfilEditPage : \n' + loggedInUser + '\n');
                const newUser = JSON.parse(loggedInUser);
                newUser.login = editedUser.login;
                newUser.email = editedUser.email;
                newUser.lichess_name = editedUser.lichess_name;
                console.log('newUser dans ProfilEditPage : \n' + JSON.stringify(newUser) + '\n')
                localStorage.setItem("user", JSON.stringify(newUser));
                toast('Profil modifié', { type: 'success', autoClose: 2000, position: toast.POSITION.TOP_CENTER });
            }
            else {
                toast('Erreur de mise à jour', { type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER });
            }
        }).catch(error => {
            console.log(error)
            toast('Erreur de mise à jour', { type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER });

        });
    };

    const handleChangePassword = () => {
        if (newPassword === confirmPassword) {
            handleCloseChangePasswordModal();
        } else {
            toast('Les mots de passe ne correspondent pas', { type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER });
        }
    };

    return (
        <div>
            <h1 className="mb-4 text-4xl font-semibold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white text-center">
                Modifier le profil
            </h1>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <div className="mb-5">
                    <label htmlFor="login" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom d'utilisateur :</label>
                    <input type="text" name="login" value={editedUser.login} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email :</label>
                    <input type="email" name="email" value={editedUser.email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-5">
                    <label htmlFor="lichess_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom Lichess :</label>
                    <input type="text" name="lichess_name" value={editedUser.lichess_name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>

                <div className="flex flex-row items-center space-x-4">
                    <button type="button" onClick={handleOpenChangePasswordModal} className="text-white bg-custom-yellow hover:bg-custom-yellow-dark focus:ring-4 focus:ring-custom-yellow-light font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-custom-yellow-dark dark:hover:bg-custom-yellow focus:outline-none dark:focus:ring-custom-yellow">Modifier mot de passe</button>

                    <button type="submit" className="text-white bg-custom-yellow hover:bg-custom-yellow-dark focus:ring-4 focus:ring-custom-yellow-light font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-custom-yellow-dark dark:hover:bg-custom-yellow focus:outline-none dark:focus:ring-custom-yellow">Enregistrer les modifications</button>
                </div>

                </form>

            {showChangePasswordModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseChangePasswordModal}>&times;</span>
                        <h2>Modifier le mot de passe</h2>
                        <label>
                            Nouveau mot de passe:
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </label>
                        <label>
                            Confirmer le mot de passe:
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </label>
                        <Button    variant="contained"
                                  color="primary" onClick={handleChangePassword}>
                            Confirmer
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileEditPage;
