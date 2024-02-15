import React, {useEffect,  useState} from 'react';
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
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
            <h1>Modifier le profil</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nom d'utilisateur:
                    <input type="text" name="login" value={editedUser.login} onChange={handleChange} />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={editedUser.email} onChange={handleChange} />
                </label>

                <label>
                    Nom Lichess:
                    <input type="text" name="lichess_name" value={editedUser.lichess_name} onChange={handleChange} />
                </label>

                <button type="button" onClick={handleOpenChangePasswordModal}>Modifier mot de passe</button>

                <button type="submit">Enregistrer les modifications</button>
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
                        <button onClick={handleChangePassword}>Confirmer</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileEditPage;
