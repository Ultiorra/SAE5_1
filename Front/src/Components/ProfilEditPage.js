import React, {useEffect,  useState} from 'react';
import {useNavigate} from "react-router-dom";
function ProfileEditPage({ user }) {
    const navigate = useNavigate();
    const [editedUser, setEditedUser] = useState(user);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    useEffect(() => {
        if (!user.isConnected) {
            navigate('/');
        }
    }, []);
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
        console.log("Profil mis à jour :", editedUser);
    };

    const handleChangePassword = () => {
        if (newPassword === confirmPassword) {
            console.log("Mot de passe mis à jour :", newPassword);
            handleCloseChangePasswordModal();
        } else {
            alert("Les mots de passe ne correspondent pas.");
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
