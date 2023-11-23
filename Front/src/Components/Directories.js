import { Card, CardContent, Typography, Box } from "@mui/material";
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
            name: 'directory1',
            ouvertures: '1. f3 f5 2. Nc3 Nf6 3. e4 fxe4 4. fxe4 e5 5. Nf3 Nc6 6. d3 Bc5 7. d4 Bxd4 8. Nxd4 exd4\',',
            nb_tests: 1,
            nb_success: 1,
            color: 'white',
        },
        {
            name: 'directory2',
            ouvertures: '1. f3 f5 2. Nc3 Nf6 3. e4 fxe4 4. fxe4 e5 5. Nf3 Nc6 6. d3 Bc5 7. d4 Bxd4 8. Nxd4 exd4 9. Nd5 O-O\',',
            nb_tests: 2,
            nb_success: 1,
            color: 'black',
        },
        {
            name: 'directory3',
            ouvertures: '1. f3 f5 2. Nc3 Nf6 3. e4 fxe4 4. fxe4 e5 5. Nf3 Nc6 6. d3 Bc5 7. d4 Bxd4 8. Nxd4 exd4 9. Nd5 O-O\',',
            nb_tests: 3,
            nb_success: 1,
            color: 'white',
        },
        {
            name: 'directory4',
            ouvertures: '1. f3 f5 2. Nc3 Nf6 3. e4 fxe4 4. fxe4 e5 5. Nf3 Nc6 6. d3 Bc5 7. d4 Bxd4 8. Nxd4 exd4 9. Nd5 O-O\',',
            nb_tests: 4,
            nb_success: 0,
            color: 'black',
        },
        {
            name: 'directory5',
            ouvertures: '1. f3 f5 2. Nc3 Nf6 3. e4 fxe4 4. fxe4 e5 5. Nf3 Nc6 6. d3 Bc5 7. d4 Bxd4 8. Nxd4 exd4 9. Nd5 O-O\',',
            nb_tests: 4,
            nb_success: 0,
            color: 'white',
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

    return (
        <div>
            <h1>Directories</h1>
            <div className="directories-container">
                {directories.map((directory, index) => (
                    <Link
                        to={`/directoriesboard/${directory.ouvertures}`}
                    >
                        <Card
                            key={index}
                            className="directory-card"
                        >

                            <CardContent  style={{
                                backgroundColor: '#f5f5f5'
                            }}>
                                <IconButton
                                    className="delete-button"
                                    onClick={() => console.log('delete')}
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

                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Directories;
