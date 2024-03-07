import {Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Modal from "react-modal";
import React, {useState,useEffect} from "react";
import {toast} from "react-toastify";


const DirectoryForm = ({ user, isOpen, closeModal, initPgn= null }) => {
    const path = "http://localhost/my-app/prochess/";
    //const [modalIsOpen, setIsOpen] = React.useState(false);
    //const [directoryName, setDirectoryName] = React.useState("");
    //const [directoryColor, setDirectoryColor] = React.useState("0");
    const [directoryName, setDirectoryName] = useState("");
    const [directoryColor, setDirectoryColor] = useState("");
    const [pgn, setPgn] = useState(initPgn);
    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            maxWidth: '500px',
            width: '100%',
            height: '500px',
            textAlign: 'center'
        }
    };
    console.log('initPgn : ' + pgn);
    useEffect(() => {
        setPgn(pgn);
    }, [pgn]);
    const addDirectory = (e) => {
        e.preventDefault();
        if (pgn.length > 0) {
            const newDirectory = ((name, ouvertures, nb_tests, nb_success, color) => {
                return {
                    name,
                    ouvertures,
                    nb_tests,
                    nb_success,
                    color
                };
            })(directoryName, pgn, 0, 0, directoryColor);
            pushDirectory();
            closeModal();
        }
    };

    const pushDirectory = () => {

        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userid: user.user.id, nom: directoryName, ouverture: pgn, couleur: directoryColor, action: 1}),
        }
        fetch(path + 'manage_directories.php', requestOption).then(response => {
            console.log(response.status)
            if (response.status === 200)
                toast('CrÃ©ation de répertoire rÃ©ussie', {
                    type: 'success',
                    autoClose: 2000,
                    position: toast.POSITION.TOP_CENTER
                });
            else
                toast('Erreur de création...', {type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER});
        })
            .catch(error => {
                toast('Erreur de création', {type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER});
            });
    };


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
        >
            <h2 style={{ marginBottom: '20px' }}>Entrez les informations du répertoire</h2>
            <Card className="directory-card">
                <CardContent>
                    <form onSubmit={addDirectory}>
                        <TextField
                            label="Nom du répertoire"
                            variant="outlined"
                            value={directoryName}
                            onChange={(e) => setDirectoryName(e.target.value)}
                            required
                            fullWidth
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="PGN actuel"
                            variant="outlined"
                            value={pgn !== "" && pgn !== null ? pgn : initPgn !== null ? initPgn : ""}
                            onChange={(e) => setPgn(e.target.value)}
                            required
                            fullWidth
                            disabled={initPgn !== null}
                        />
                        <FormControl variant="outlined" fullWidth style={{ marginBottom: '10px' }}>
                            <InputLabel>Couleur du répertoire</InputLabel>
                            <Select
                                value={directoryColor}
                                onChange={(e) => setDirectoryColor(e.target.value)}
                                label="Couleur du répertoire"
                                required
                            >
                                <MenuItem value="0">Blanc</MenuItem>
                                <MenuItem value="1">Noir</MenuItem>
                            </Select>
                        </FormControl>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Button type="submit" variant="contained" color="primary" style={{ marginRight: '20px', width: '100%', height: '50px' }}>Ajouter Répertoire</Button>
                            <Button type="button" variant="contained" color="secondary" onClick={closeModal} style={{ marginLeft: '20px', width: '100%', height: '50px' }}>Annuler</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </Modal>
    );
}

export default DirectoryForm;