import React, { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";

const DirectoriesBoard = () => {
    const { value } = useParams();

    const [tempChess, setTempChess] = useState(new Chess());

    const [pgn, setPgn] = useState("");
    const [chess, setChess] = useState(new Chess());
    const [chessHistory, setChessHistory] = useState([new Chess()]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [updatedChess, setUpdatedChess] = useState(new Chess());
    const [updatedChessCopy, setUpdatedChessCopy] = useState(new Chess());

    // Fonction pour gérer le déplacement des pièces
    const handleDrop = (sourceSquare, targetSquare) => {
        try {
            // Copie de l'état actuel de l'échiquier pour effectuer des modifications sans altérer l'état actuel
            const updatedChessCopy = new Chess(chess.fen());
            setUpdatedChessCopy(updatedChessCopy);

            // Tentative de réaliser le mouvement sur l'échiquier copié
            const move = updatedChessCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q"
            });

            const newChess = new Chess();
            newChess.loadPgn(pgn, { newlineChar: ':' });
            newChess.move(move);
            setTempChess(newChess);

            console.log("tempChess");
            console.log(tempChess);
            console.log(tempChess.pgn());

            if (move !== null) {
                // Vérification si le PGN reçu en paramètre inclut la position mise à jour

            } else {
                // Le mouvement est invalide
                console.log("Invalid move");
                return;
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (value.includes(tempChess.pgn())) {
            // Le mouvement est valide

            // Mise à jour de l'historique des mouvements
            const updatedChessHistory = chessHistory.slice(0, currentMoveIndex + 1);
            updatedChessHistory.push(updatedChessCopy);

            // Mise à jour de l'état actuel de l'échiquier

            setPgn(tempChess.pgn());
            setChess(updatedChessCopy);
            /*setPgn(updatedChessCopy.pgn());*/

            // Mise à jour de l'historique des échiquiers et de l'index du mouvement actuel
            setChessHistory(updatedChessHistory);
            setCurrentMoveIndex(currentMoveIndex + 1);
        } else {
            // Le mouvement n'est pas valide par rapport au PGN reçu
            console.log("Invalid position");
            return;
        }
    } , [tempChess]);

    return (
        <div>
            <Chessboard
                position={chess.fen()}
                onPieceDrop={(sourceSquare, targetSquare) => handleDrop(sourceSquare, targetSquare)}
            />
            <p>PGN</p>
            <p>{pgn}</p>
            <p>VALUE</p>
            <p>{value}</p>
            {/*<p>temp pgn</p>
            <p>{tempChess.pgn()}</p>*/}
        </div>
    );
};

export default DirectoriesBoard;
