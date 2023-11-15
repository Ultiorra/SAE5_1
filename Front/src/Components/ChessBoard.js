import React, {useState} from 'react';
import {Chessboard} from 'react-chessboard';
import {Chess} from 'chess.js';
import '../css/ChessBoard.css';
import {Button} from "@mui/material";
import createDirectory from "./Directories";
import Modal from 'react-modal';
import {toast} from "react-toastify";

const MyChessboard = () => {

    const path = "http://localhost/my-app/prochess/";

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [pgn, setPgn] = useState("");

    const [tree, setTree] = useState([]);

    const [chess, setChess] = useState(new Chess());
    const [chessHistory, setChessHistory] = useState([new Chess()]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [pgn_tree, setPgn_tree] = useState("");
    const [pgnHistory, setPgnHistory] = useState([new Chess().pgn()]);
    const [firstreturn, setFirstreturn] = useState(true);
    const [directoryName, setDirectoryName] = useState("");
    const [directoryColor, setDirectoryColor] = useState(0);


    const openModal = () => {
        setModalIsOpen(true);
    };

    // Fonction pour fermer la modal
    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleDrop = (sourceSquare, targetSquare) => {

        try {
            const updatedChess = new Chess(chess.fen());
            const move = chess.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q"
            });

            if (move === null) return;

            const updatedHistory = chessHistory.slice(0, currentMoveIndex + 1);
            updatedHistory.push(updatedChess);
            setChessHistory(updatedHistory);
            setCurrentMoveIndex(currentMoveIndex + 1);

            const updatedPgnHistory = pgnHistory.slice(0, currentMoveIndex + 1);
            updatedPgnHistory.push(updatedChess.pgn());
            setPgnHistory(updatedPgnHistory);

            setPgn(chess.pgn());


            tree.addMove(move);

            setPgn_tree(tree.exportPgn());

            setFirstreturn(true);


        } catch (e) {
            console.log(e);
        }

    };

    const pushDirectory = async (e) => {
        //e.preventDefault();

        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({nom: directoryName, ouverture: pgn, couleur: directoryColor, action: 1}),
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


    const previousMove = () => {
        if (firstreturn) {
            if (currentMoveIndex > 0) {
                const newIndex = currentMoveIndex;
                setCurrentMoveIndex(newIndex);
                setChess(chessHistory[newIndex]);
                setPgn(pgnHistory[newIndex]);
            }
            setFirstreturn(false);
        } else {
            if (currentMoveIndex > 0) {
                const newIndex = currentMoveIndex - 1;
                setCurrentMoveIndex(newIndex);
                setChess(chessHistory[newIndex]);
                setPgn(pgnHistory[newIndex]);
            }
        }
    };

    const nextMove = () => {
        if (currentMoveIndex < chessHistory.length - 1) {
            const newIndex = currentMoveIndex + 1;
            setCurrentMoveIndex(newIndex);
            setChess(chessHistory[newIndex]);
            setPgn(pgnHistory[newIndex]);
        }
    }

    const addDirectory = () => {
        if (pgn.length > 0) {
            // Appel à la fonction createDirectory avec les informations fournies
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
            pushDirectory().then(r => console.log(r));
            closeModal(); // Fermer la modal après l'ajout du répertoire
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
            maxWidth: '300px',
            width: '100%',
            textAlign: 'center'
        }
    };

    return (
        <div>
            <div className="board">
                <Chessboard
                    position={chess.fen()}
                    onPieceDrop={(sourceSquare, targetSquare) => handleDrop(sourceSquare, targetSquare)}
                />
            </div>
            <Button onClick={() => setChess(new Chess())}>Reset</Button>
            <Button onClick={() => previousMove()}>{'<'}</Button>
            <Button onClick={() => nextMove()}>{'>'}</Button>
            <Button onClick={() => openModal()}>Create Directory</Button>
            <p className="pgn">{pgn}</p>
            <p>{chess.history()}</p>
            {/* Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Modal"
                style={customStyles}
            >
                <h2 style={{marginBottom: '20px'}}>Entrez les informations du répertoire</h2>
                <input
                    type="text"
                    placeholder="Nom du répertoire"
                    value={directoryName}
                    onChange={(e) => setDirectoryName(e.target.value)}
                    style={{marginBottom: '10px', padding: '5px'}}
                />
                <div style={{marginBottom: '20px'}}>
                    <label style={{marginRight: '10px'}}>
                        <input
                            type="radio"
                            value="black"
                            checked={directoryColor === "black"}
                            onChange={() => setDirectoryColor(1)}
                        />
                        Noir
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="white"
                            checked={directoryColor === "white"}
                            onChange={() => setDirectoryColor(0)}
                        />
                        Blanc
                    </label>
                </div>
                <button onClick={addDirectory} style={{marginRight: '10px'}}>Ajouter Répertoire</button>
                <button onClick={closeModal}>Annuler</button>
            </Modal>
        </div>
    );
};
export default MyChessboard;