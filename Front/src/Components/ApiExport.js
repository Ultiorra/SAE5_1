import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Typography, Button, Container, Card, CardContent} from '@mui/material';
import {toast} from "react-toastify";

const ApiExportPage = (user ) => {
    const path = "http://localhost/my-app/prochess/";
    const navigate = useNavigate();
    const [editedUser, setEditedUser] = useState(user);
    useEffect(() => {
        //console.log('\n' + user + '\n');
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            console.log("editedUser :" + loggedInUser)
            console.log(JSON.parse(loggedInUser))
            setEditedUser(JSON.parse(loggedInUser));
        }
    } , [])
    const pushDirectory = (directoryName, pgn, directoryColor) => {

        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userid: editedUser.id, nom: directoryName, ouverture: pgn, couleur: directoryColor == "white" ? 0 : 1, action: 1}),
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
    const [bool, setBool] =useState(true);
    const isMounted = useRef(true);
    const [parsedGames, setGamesData] = useState([]);
    useEffect(() => {
        const fetchGames = async () => {
            const loggedInUser = localStorage.getItem("user");
            if (loggedInUser) {
                console.log("editedUser 2222 :" + loggedInUser)
                console.log(JSON.parse(loggedInUser))
                setEditedUser(JSON.parse(loggedInUser));
            }
            const username = JSON.parse(loggedInUser).lichess_name ? JSON.parse(loggedInUser).lichess_name :  null
                //user.user.lichess_name ? user.user.lichess_name : '';
            console.log("ici" + editedUser.lichess_name)
            const maxGames = 10;

            if (!username) {
                toast('Erreur de récupération verifier vote nom lichess sur la page profil', {type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER});
                return;
            }
            const response = await fetch(`https://lichess.org/api/games/user/${username}?max=${maxGames}`, {
                headers: {
                    Authorization: 'Bearer lip_L42O6q9qHzfcXl9VZjWQ',
                },
            });

            if (response) {
                const data = await response.text();
                const games = data.split('\n\n\n');
                console.log(games);
                const parsedGames = games.map(game => {
                    const lines = game.split('\n');
                    if (lines.length < 10) return null;
                    console.log(lines);
                    const whitePlayer = lines[3].substring(lines[3].indexOf('"') + 1, lines[3].lastIndexOf('"'));
                    const pgn = lines[17]
                    const color = username === whitePlayer ? 'white' : 'black';
                    const ennemy = color === 'white' ? lines[4].substring(lines[4].indexOf('"') + 1, lines[4].lastIndexOf('"')) : whitePlayer;
                    const date = lines[2].substring(lines[2].indexOf('"') + 1, lines[2].lastIndexOf('"'));
                    const dateFormated = date.substring(8,10) + '/' + date.substring(5, 7) + '/' + date.substring(0, 4) ;
                    return { pgn, color , ennemy, dateFormated };
                });

                setGamesData(parsedGames);
            } else {
                console.error('Failed to fetch games:', response.statusText);
            }
        };
        if (bool && isMounted.current) {
            fetchGames();
            setBool(false);
        }
        return () => {
            isMounted.current = false;
        };

    } , [editedUser]);

    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                Bienvenue sur l'historique de vos parties lichess
            </Typography>
            <div className="parsed-games-container">
                {parsedGames.map((game, index) => (
                    game ?
                    <Card key={index} className="parsed-game-card">
                        <CardContent style={{ backgroundColor: '#f5f5f5' }}>
                            <div
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: game.color === "white" ? 'white' : 'black',
                                    borderRadius: '50%',
                                    marginRight: '8px',
                                }}
                            ></div>
                            <pre>{'Partie du ' + game.dateFormated + ' contre ' + game.ennemy}</pre>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => pushDirectory('Partie du ' + game.dateFormated + ' contre ' + game.ennemy, game.pgn, game.color)}
                            >
                                Sauvegarder
                            </Button>
                            <Link
                                to={`/directoriesboard/${game.pgn}`}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                >
                                    Rejouer
                                </Button>

                            </Link>
                        </CardContent>
                    </Card> : null
                ))}
            </div>
        </Container>
    );
};

export default ApiExportPage;
