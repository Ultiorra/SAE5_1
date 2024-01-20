import {Card, CardContent, Typography, Box, Button} from "@mui/material";
import '../css/Directories.css';
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {toast} from "react-toastify";

const path = "http://localhost/my-app/prochess/";

const Directories = (user, isConnected) => {
    const [selectedDirectory, setSelectedDirectory] = useState(null);
    const navigate = useNavigate();
    const [userDirectories, setUserDirectories] = useState([]);
    useEffect(() => {
        console.log(user);
        console.log(user.isConnected);
        if (!user.isConnected) {

            navigate('/');

        }
        else {
            var requestOption = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userid: user.user.id, action: 2}),
            }
            fetch(path + 'manage_directories.php', requestOption).then(response => response.json()).then(data => {
                console.log("data");
                console.log(data);
                if (data.status === "success") {
                    console.log(data);
                    setUserDirectories(data.repertoires);
                } else
                    toast('Erreur de récupération...', {
                        type: 'error',
                        autoClose: 2000,
                        position: toast.POSITION.TOP_CENTER
                    });
            }).catch(error => {
                toast('Erreur de récupération', {type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER});
            });
        }


    } , []);

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


    const createDirectory = (name, ouvertures, nb_tests, nb_success, color) => {
        return {
            name,
            ouvertures,
            nb_tests,
            nb_success,
            color
        };
    };

    const handleDelete = (directoryId) => {
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userid: user.user.id, idrep: directoryId,action: 3}),
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
            <h1>Directories</h1>
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
                                    to={`/directoriesboard/${directory.ouvertures}${directory.color}`}
                                >
                                    <Button
                                    variant="contained"
                                    color="primary"
                                    >
                                        Se tester
                                    </Button>

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
                                    to={`/directoriesboard/${directory.ouverture}`}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                    >
                                        Se tester
                                    </Button>

                                </Link>
                            </CardContent>
                        </Card>
                ))

                }
            </div>
        </div>
    );
}

export default Directories;
