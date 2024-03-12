import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import '../css/Directories.css';
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import Modal from "react-modal";
import DirectoryForm from "./DirectoryForm";

const path = "http://localhost/my-app/prochess/";

const Directories = (user, isConnected) => {
    const [selectedDirectory, setSelectedDirectory] = useState(null);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(user);
    const [userDirectories, setUserDirectories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [directoryName, setDirectoryName] = useState("");
    const [directoryColor, setDirectoryColor] = useState("");
    const [pgn, setPgn] = useState("");
    useEffect(() => {
        /*if (!user.isConnected) {
            navigate('/');
        } else {
            console.log("user" + user.user.login + " " + user.user.id + " " + user.user.email + " " + user.user.password)
            fetchUserDirectories();
        }*/
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            console.log("loggedInUser" + loggedInUser);
            console.log("loggedInUser login " + loggedInUser.login);
            setCurrentUser(JSON.parse(loggedInUser))
            console.log("currentUser id " + currentUser.id)
            console.log("loggedInUser id " + JSON.parse(loggedInUser).id)
            console.log("user id " + user.id)
            fetchUserDirectories(JSON.parse(loggedInUser).id);
        }
    }, []);
    const closeModal = () => {
        setModalOpen(false);
        setDirectoryColor("");
        setDirectoryName("");
        setPgn("");
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
                toast('Création de répertoire réussie', {
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
    const addDirectory = (e) => {
        e.preventDefault()
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

            console.log('New directory:', newDirectory);
            pushDirectory();
            closeModal();
        }
    };

    const fetchUserDirectories = (userId) => {
        console.log("fetchUserDirectories" + userId)
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userid: userId, action: 2 }),
        };
        console.log(path + 'manage_directories.php' + requestOptions.body)
        fetch(path + 'manage_directories.php', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setUserDirectories(data.repertoires);
                    console.log("userDirectories" + JSON.stringify(data.repertoires))
                } else {
                    toast('Erreur de récupération...', {
                        type: 'error',
                        autoClose: 2000,
                        position: toast.POSITION.TOP_CENTER,
                    });
                }
            })
            .catch(error => {
                console.log(error)
                toast('Erreur de récupération', {
                    type: 'error',
                    autoClose: 2000,
                    position: toast.POSITION.TOP_CENTER,
                });
            });
    };

    const directories = [
        {
            name: 'Directory 1',
            ouvertures: '1. e4 e5 2. Nc3  (2. d4 exd4 3. e5 Nc6 4. Nf3 )  (2. f4 exf4 3. g3 fxg3 4. hxg3 ) Nf6 3. Nf3 Nc6  \',',
            nb_tests: 1,
            nb_success: 1,
            color: 0,
        },
        {
            name: 'Directory 2',
            ouvertures: '1. e4 e5  (d5 2. exd5 e5  (Qxd5 3. Nc3 Qe5+  (Qe6+ 4. Be2 Nc6 ) 4. Be2 ) 3. dxe6 Bxe6 4. d4 Bb4+ 5. Bd2 ) \',',
            nb_tests: 2,
            nb_success: 1,
            color: 1,
        },
        {
            name: 'Directory 3',
            ouvertures: '1. f3 f5 2. Nc3 Nf6 3. e4 fxe4 4. fxe4 e5 5. Nf3 Nc6 6. d3 Bc5 7. d4 Bxd4 8. Nxd4 exd4\',',
            nb_tests: 3,
            nb_success: 1,
            color: 0,
        },
        {
            name: 'Directory 4',
            ouvertures: '1. f3 f5 2. Nc3 Nf6 3. e4 fxe4 4. fxe4 e5 5. Nf3 Nc6 6. d3 Bc5 7. d4 Bxd4 8. Nxd4 exd4\',',
            nb_tests: 4,
            nb_success: 0,
            color: 1,
        },
        {
            name: 'Directory 5',
            ouvertures: '1. f3 f5 2. Nc3 Nf6 3. e4 fxe4 4. fxe4 e5 5. Nf3 Nc6 6. d3 Bc5 7. d4 Bxd4 8. Nxd4 exd4\',',
            nb_tests: 4,
            nb_success: 0,
            color: 0,
        }
    ];


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


    const handleDelete = (directoryId) => {
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userid: currentUser.id, idrep: directoryId,action: 3}),
        }
        fetch(path + 'manage_directories.php', requestOption).then(response => response.json()).then(data => {
            console.log("data");
            console.log(data);
            if (data.status === "success") {
                toast('Répertoire supprimé', {type: 'success', autoClose: 2000, position: toast.POSITION.TOP_CENTER});
                setUserDirectories(userDirectories.filter(directory => directory.id !== directoryId));
            } else
                toast('Erreur de supression...', {
                    type: 'error',
                    autoClose: 2000,
                    position: toast.POSITION.TOP_CENTER
                });
        }).catch(error => {
            toast('Erreur de supression', {type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER});
        });
    }


    return (
        <div>
            <h1>Directories de {currentUser.login}</h1>
            <button
                className="text-white bg-custom-yellow hover:bg-custom-yellow-dark focus:ring-4 focus:ring-custom-yellow-light font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-custom-yellow-dark dark:hover:bg-custom-yellow focus:outline-none dark:focus:ring-custom-yellow"
                onClick={ () => setModalOpen(true)}
            > Ajouter un répertoire
            </button>
            <div className="directories-container">
                {directories.map((directory, index) => (

                    <Card
                        key={index}
                        className="directory-card"
                    >

                        <CardContent  style={{
                            backgroundColor: '#f5f5f5'
                        }}>
                            <IconButton
                                onClick={() => {
                                    handleDelete(directory.id);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                            <Typography variant="h5">{directory.name}</Typography>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mt={2}

                            >
                                <div
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        backgroundColor: directory.color,
                                        borderRadius: '50%',
                                        marginRight: '8px',
                                    }}
                                ></div>
                                <Typography>
                                    {Number.isInteger(directory.nb_success / directory.nb_tests)
                                        ? `${(directory.nb_success / directory.nb_tests) * 100}% de réussite`
                                        : `${((directory.nb_success / directory.nb_tests) * 100).toFixed(2)}% de réussite`}
                                </Typography>
                            </Box>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mt={2}

                            >
                                <Typography variant="caption" align="right">
                                    {directory.nb_tests} tests
                                </Typography>
                            </Box>
                            <Link
                                to={`/directoriesboard/${directory.ouvertures}${directory.color}&id=${directory.id}`}
                            >
                                <button
                                    className="text-white bg-custom-yellow hover:bg-custom-yellow-dark focus:ring-4 focus:ring-custom-yellow-light font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-custom-yellow-dark dark:hover:bg-custom-yellow focus:outline-none dark:focus:ring-custom-yellow"
                                >
                                    Se tester
                                </button>

                            </Link>
                        </CardContent>
                    </Card>

                ))}
                { userDirectories.map((directory, index) => (

                    <Card
                        key={index}
                        className="directory-card"
                    >

                        <CardContent  style={{
                            backgroundColor: '#f5f5f5'
                        }}>
                            <IconButton
                                onClick={() => {
                                    handleDelete(directory.id);
                                } }
                            >
                                <DeleteIcon />
                            </IconButton>
                            <Typography variant="h5">{directory.nom}</Typography>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mt={2}

                            >
                                <div
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        backgroundColor: directory.couleur === "0" ? 'white' : 'black',
                                        borderRadius: '50%',
                                        marginRight: '8px',
                                    }}
                                ></div>


                                {
                                    directory.nb_tests === "0" ? <Typography>
                                            0% de réussite
                                        </Typography> :
                                        <Typography>
                                            {Number.isInteger(directory.nb_success / directory.nb_tests)
                                                ? `${(directory.nb_success / directory.nb_tests) * 100}% de réussite`
                                                : `${((directory.nb_success / directory.nb_tests) * 100).toFixed(2)}% de réussite`}
                                        </Typography>
                                }

                            </Box>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mt={2}

                            >
                                <Typography variant="caption" align="right">
                                    {directory.nb_tests} tests
                                </Typography>
                            </Box>
                            <Link
                                to={`/directoriesboard/${directory.ouverture}${directory.couleur}&id=${directory.id}`}
                            >
                                <button
                                    className="text-white bg-custom-yellow hover:bg-custom-yellow-dark focus:ring-4 focus:ring-custom-yellow-light font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-custom-yellow-dark dark:hover:bg-custom-yellow focus:outline-none dark:focus:ring-custom-yellow"
                                >
                                    Se tester
                                </button>

                            </Link>
                        </CardContent>
                    </Card>
                ))

                }
            </div>
            <DirectoryForm
                userId={currentUser.id}
                isOpen={modalOpen}
                closeModal={closeModal}
            />
            {/*<Modal
                isOpen={modalOpen}
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
                                value={pgn}
                                onChange={(e) => setPgn(e.target.value)}
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
            </Modal>*/}
        </div>
    );
}

export default Directories;