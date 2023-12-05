import React, {useEffect, useState} from 'react';
import {Chessboard} from 'react-chessboard';
import {Chess} from 'chess.js';
import '../css/ChessBoard.css';
import createDirectory from "./Directories";
import Modal from 'react-modal';
import {toast} from "react-toastify";
import { Button, Card, CardContent, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Tree from "./Tree";
import Node from "./Node";
import { Grid } from '@mui/material';

const MyChessboard = ( user , isConnected) => {

    const [node, setNode] = useState([]);
    const path = "http://localhost/my-app/prochess/";
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [pgn, setPgn] = useState("");
    const [tree, setTree] = useState(new Tree ("", new Node(  "Racine" , null , "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")));
    const [finalPgn, setFinalPgn] = useState("");
    const [chess, setChess] = useState(new Chess());
    const [chessHistory, setChessHistory] = useState([new Chess()]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [pgn_tree, setPgn_tree] = useState("");
    const [pgnHistory, setPgnHistory] = useState([new Chess().pgn()]);
    const [firstreturn, setFirstreturn] = useState(true);
    const [directoryName, setDirectoryName] = useState("");
    const [directoryColor, setDirectoryColor] = useState("");
    const openModal = () => {
        setModalIsOpen(true);
    };

    // Fonction pour fermer la modal
    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        console.log("user chessboard");
        console.log(user);
    } , [user]);
    const handleDrop = (sourceSquare, targetSquare) => {

        try {
            const updatedChess = new Chess(chess.fen());
            const move = chess.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q"
            });

            if (move === null) return;

            const newNode = new Node (move.san , node , chess.fen());
            const updatedPgn = updatedChess.pgn();
            setPgn(updatedPgn);
            setFinalPgn(finalPgn + " " + updatedPgn);
            const updatedHistory = chessHistory.slice(0, currentMoveIndex + 1);
            updatedHistory.push(updatedChess);
            setChessHistory(updatedHistory);
            setCurrentMoveIndex(currentMoveIndex + 1);

            const updatedPgnHistory = pgnHistory.slice(0, currentMoveIndex + 1);
            updatedPgnHistory.push(updatedChess.pgn());
            setPgnHistory(updatedPgnHistory);
            console.log(chess.fen());
            setNode(tree.ajouteCoup(node , move.san, node.moveNbr +1 ));
            setPgn(chess.pgn());

            setFirstreturn(true);

            console.log(chess.history({ verbose: true }));
            console.log(node.moveNbr);
            console.log(tree.exportPgn()    );


        } catch (e) {
            console.log(e);
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

    const getAllDirectories = () => {
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userid: user.id, action: 2}),
        }
        fetch(path + 'manage_directories.php', requestOption).then(response => {
            console.log(response.status)
            if (response.status === 200)
                toast('Récupération des répertoires réussie', {
                    type: 'success',
                    autoClose: 2000,
                    position: toast.POSITION.TOP_CENTER
                });
            else
                toast('Erreur de récupération...', {type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER});
        })
            .catch(error => {
                toast('Erreur de récupération', {type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER});
            });
    }

    const previousMove = () => {
        if (firstreturn) {
            if (currentMoveIndex > 0) {
                const newIndex = currentMoveIndex;
                setCurrentMoveIndex(newIndex);
                setChess(chessHistory[newIndex]);
                setPgn(pgnHistory[newIndex]);
                setNode(node.parent);
            }
            setFirstreturn(false);
        } else {
            if (currentMoveIndex > 0) {
                setNode(node.parent);
                const newIndex = currentMoveIndex - 1;
                setCurrentMoveIndex(newIndex);
                setChess(chessHistory[newIndex]);
                setPgn(pgnHistory[newIndex]);
            }
        }
    };

    const nextMove = () => {
        if (currentMoveIndex < chessHistory.length - 1) {
            setNode(node.children[0]);
            const newIndex = currentMoveIndex + 1;
            setCurrentMoveIndex(newIndex);
            setChess(chessHistory[newIndex]);
            setPgn(pgnHistory[newIndex]);
        }
    }

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

    useEffect(() => {
        setNode(tree.racine);
    } , []);
    return (
        <Grid container spacing={2}>
            <Grid item xs={5.7}>

                    <Chessboard
                        position={chess.fen()}
                        onPieceDrop={(sourceSquare, targetSquare) => handleDrop(sourceSquare, targetSquare)}
                    />
            </Grid>
            <Grid item xs={6.3} style={{ backgroundColor: 'lightgray', marginTop:'1%', borderRadius: '8px' }}>
                <Button onClick={() => setChess(new Chess())}
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '10px' }}>Reset</Button>
                <Button onClick={() => previousMove()}
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '10px' }}
                >{'<'}
                </Button>
                <Button onClick={() => nextMove()}
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '10px' }}
                >{'>'}
                </Button>
                <Button onClick={() => openModal()}
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '10px' }}
                >Create Directory
                </Button>
                <p className="pgn">PGN actuel : {pgn}</p>
                {/*<p>{chess.history()}</p>*/}
            </Grid>
            <Modal
                isOpen={modalIsOpen}
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
                                value={tree.exportPgn()}
                                readOnly
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
        </Grid>
    );
};
export default MyChessboard;