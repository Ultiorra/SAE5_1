import React, {useEffect, useState} from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Button, Card, CardContent, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import '../css/ChessBoard.css';
import Tree from "./Tree";
const MyChessboard = () => {

   const [pgn, setPgn] = useState("");
    const tree = new Tree("", {fen: new Chess().fen(), move: null, enfants: []});
    const [chess, setChess] = useState(new Chess());
    const [chessHistory, setChessHistory] = useState([new Chess()]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [pgn_tree, setPgn_tree] = useState("");
    const [pgnHistory, setPgnHistory] = useState([new Chess().pgn()]);
    const [firstreturn, setFirstreturn] = useState(true);
    const [directoryName, setDirectoryName] = useState("");
    const [directoryColor, setDirectoryColor] = useState("white");

    const handleDirectorySubmit = (event) => {
        event.preventDefault();
        // Ici, vous pouvez traiter la soumission du formulaire,
        // comme enregistrer les informations dans une base de données
        // ou les utiliser pour afficher des informations dans votre application.
    };


    const handleDrop = (sourceSquare, targetSquare) => {

        try{
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


            tree.ajouteCoup(move);

            setPgn_tree(tree.exportPgn());

            setFirstreturn(true);



        }catch(e){
            console.log(e);
        }

    };

    const previousMove = () => {
        if (firstreturn){
            if (currentMoveIndex > 0) {
                const newIndex = currentMoveIndex;
                setCurrentMoveIndex(newIndex);
                setChess(chessHistory[newIndex]);
                setPgn(pgnHistory[newIndex]);
            }
            setFirstreturn(false);
        }
        else{
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


    return (
        <div className="board-container">
            <div className="board">
                <Chessboard
                    position={chess.fen()}
                    onPieceDrop={(sourceSquare, targetSquare) => handleDrop(sourceSquare, targetSquare)}
                />
            </div>
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
                <Card className="directory-card">
                    <CardContent>
                        <form onSubmit={handleDirectorySubmit}>
                            <TextField
                                label="Nom du répertoire"
                                variant="outlined"
                                value={directoryName}
                                onChange={(e) => setDirectoryName(e.target.value)}
                                required
                            />
                            <TextField
                                label="PGN actuel"
                                variant="outlined"
                                value={pgn_tree}
                                readOnly
                            />
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel>Couleur du répertoire</InputLabel>
                                <Select
                                    value={directoryColor}
                                    onChange={(e) => setDirectoryColor(e.target.value)}
                                    label="Couleur du répertoire"
                                >
                                    <MenuItem value="white">Blanc</MenuItem>
                                    <MenuItem value="black">Noir</MenuItem>
                                </Select>
                            </FormControl>
                            <Button type="submit" variant="contained" color="primary">
                                Enregistrer Répertoire
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <div className="buttons-container">
                    <Button className="centre " onClick={() => setChess(new Chess())}>Reset</Button>
                    <Button className="demi-cercle gauche" onClick={() => previousMove()}>{'<'}</Button>
                    <Button className="demi-cercle droite" onClick={() => nextMove()}>{'>'}</Button>
                </div>
                <p className="pgn">{pgn}</p>
                <p>{chess.history()}</p>

            </div>
        </div>
    );
};
export default MyChessboard;