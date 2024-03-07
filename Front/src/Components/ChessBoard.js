import React, {useEffect, useState} from 'react';
import {Chessboard} from 'react-chessboard';
import {Chess} from 'chess.js';
import DirectoryForm from './DirectoryForm';
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
    const [modalOpen, setModalOpen] = useState(false);
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


    // Fonction pour fermer la modal
    const closeModal = () => {
        setModalOpen(false);
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
            const existingChild = node.enfants.find(child => child.move === move.san);
            if (existingChild) {
                const childIndex = node.enfants.indexOf(existingChild);
                nextMove(childIndex);
                return;
            }
            console.log(chess.fen());
            setNode(tree.ajouteCoup(node , move.san, node.moveNbr +1 ));
            setPgn(tree.exportPgn());

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
        if (node.parent) {
            setNode(node.parent);
            setChess(new Chess(node.parent.fen));
            setPgn(tree.exportPgn());
        }/*
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
        }*/
    };
/*
    const nextMove = () => {
        if (currentMoveIndex < chessHistory.length - 1) {
            console.log(node);
            setNode(node.enfants[0]);
            const newIndex = currentMoveIndex + 1;
            setCurrentMoveIndex(newIndex);
            setChess(chessHistory[newIndex]);
            setPgn(pgnHistory[newIndex]);
        }
    }*/

    const nextMove = ( childIndex) => {
        console.log("childIndex : " + childIndex);
        console.log( node.enfants);
        if (node.enfants && node.enfants[childIndex]) {
            const childNode = node.enfants[childIndex];
            setNode(childNode);
            setChess(new Chess(childNode.fen));
            setPgn(tree.exportPgn());
        }
        /*
        if (currentMoveIndex < chessHistory.length - 1) {
            console.log(node);
            setNode(node.enfants[childIndex]);
            const newIndex = currentMoveIndex + 1;
            setCurrentMoveIndex(newIndex);
            setChess(chessHistory[newIndex]);
            setPgn(pgnHistory[newIndex]);
        }*/
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

    const reset = () => {
        console.log("reset")
        setChess(new Chess());
        setPgn("");
        setFinalPgn("");
        setChessHistory([new Chess()]);
        setCurrentMoveIndex(0);
        setPgnHistory([new Chess().pgn()]);
        setNode(tree.racine);
    }

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
            <Grid item xs={6.3} className="right-grid">
                <br></br>
                <Button onClick={reset}
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '10px' }}>Reset</Button>
                <Button onClick={() => previousMove()}
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '10px' }}
                >{'<'}
                </Button>
                { /*
                <Button onClick={() => nextMove()}
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '10px' }}
                >{'>'}  </Button>*/}
                    {
                        node.enfants?.map((child, index) => (
                            <Button onClick={() => nextMove(index)}
                                    variant="contained"
                                    color="primary"
                                    style={{ marginRight: '10px' }}
                            >{child.move}
                            </Button>
                        ))

                    }

                <Button onClick={() => setModalOpen(true)}
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '10px' }}
                >Create Directory
                </Button>
                <p className="pgn">PGN actuel : {pgn}</p>
                {/*<p>{chess.history()}</p>*/}
            </Grid>
            <DirectoryForm
                user={user}
                isOpen={modalOpen}
                closeModal={closeModal}
                initPgn={pgn}
            />
        </Grid>
    );
};
export default MyChessboard;