import React, {useEffect, useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import {Typography, Button, Container, Card, CardContent} from '@mui/material';
import {toast} from "react-toastify";
const ApiExportPage = (user ) => {
    useEffect(() => {
        if (!user.isConnected) {
            navigate('/');
        }
    }, []);
    const [bool, setBool] =useState(true);
    const isMounted = useRef(true);
    const [parsedGames, setGamesData] = useState([]);
    useEffect(() => {
        const fetchGames = async () => {
            const username = user.user.lichess_name ? user.user.lichess_name : '';
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
                    const whitePlayer = lines[4].substring(lines[4].indexOf('"') + 1, lines[4].lastIndexOf('"'));
                    const pgn = lines[17]
                    const color = username === whitePlayer ? 'white' : 'black';

                    return { pgn, color };
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

    } , []);

    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                Bienvenue sur la page d'exportation de l'API
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
                            <pre>PGN: {game.pgn}</pre>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => console.log('Save directory')}
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
