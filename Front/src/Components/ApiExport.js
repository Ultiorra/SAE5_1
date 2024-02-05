import React, {useEffect, useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import {Typography, Button, Container, Card, CardContent} from '@mui/material';

const ApiExportPage = () => {
    const headers = {
    Authorization: 'Bearer lip_L42O6q9qHzfcXl9VZjWQ',
};

    const [bool, setBool] =useState(true);
    const isMounted = useRef(true);
    const [parsedGames, setGamesData] = useState([]);
    useEffect(() => {
        const fetchGames = async () => {
            const username = 'german11'; // Replace with the desired username
            const maxGames = 10; // Set the max number of games

            const response = await fetch(`https://lichess.org/api/games/user/${username}?max=${maxGames}`, {
                headers: {
                    Authorization: 'Bearer lip_L42O6q9qHzfcXl9VZjWQ',
                },
            });

            if (response) {
                const data = await response.text(); // Parse JSON response
                const games = data.split('\n\n\n');
                console.log(games);
                const parsedGames = games.map(game => {
                    const lines = game.split('\n');
                    if (lines.length < 10) return null; // Skip games with missing data (e.g. aborted games
                    console.log(lines);
                    const whitePlayer = lines[4].substring(lines[4].indexOf('"') + 1, lines[4].lastIndexOf('"'));
                    const pgn = lines[17]
                    const color = username === whitePlayer ? 'white' : 'black'; // Determine player color

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
