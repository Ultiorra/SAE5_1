import React, { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";

const DirectoriesBoard = () => {
    function parsePgn(pgn) {
        const moves = pgn.split(/\s+\d+\.\s+/).filter((move) => move.trim() !== '');
        const parsedMoves = [];

        for (let i = 0; i < moves.length; i++) {
            let currentMove = (i === 0) ? moves[i] : `1. ${moves.slice(0, i + 1).join(' ')}`;

            if (Array.isArray(currentMove)) {
                for (let j = 0; j < currentMove.length; j++) {
                    const move = currentMove[j];
                    parsedMoves.push(move);
                }
            } else {
                parsedMoves.push(currentMove);
            }
        }

        return parsedMoves;
    }


    const { value } = useParams();
    const { userColor } = "w";

    const [tempChess, setTempChess] = useState(new Chess());
    const [pgn, setPgn] = useState("");
    const [chess, setChess] = useState(new Chess());
    const [chessHistory, setChessHistory] = useState([new Chess()]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [updatedChess, setUpdatedChess] = useState(new Chess());
    const [updatedChessCopy, setUpdatedChessCopy] = useState(new Chess());

    const parsedMoves = parsePgn(value);

    const handleDrop = (sourceSquare, targetSquare) => {
        try {
            const updatedChessCopy = new Chess(chess.fen());
            setUpdatedChessCopy(updatedChessCopy);

            const move = updatedChessCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q"
            });

            let newChess = new Chess();
            newChess.loadPgn(pgn, { newlineChar: ':' });
            newChess.move(move);
            setTempChess(newChess);

            if (move !== null) {
                const currentMove = parsedMoves[chess.moveNumber() - 1];
                if (!currentMove.includes(move.san)) {
                    console.log("Coup invalide");
                    return;
                }

                let updatedChessHistory = chessHistory.slice(0, currentMoveIndex + 1);
                updatedChessHistory.push(newChess);
                setPgn(newChess.pgn());
                setChess(newChess);
                setChessHistory(updatedChessHistory);
                setCurrentMoveIndex(currentMoveIndex + 1);


                const opponentMove = parsedMoves[chess.moveNumber() - 1];
                console.log("opponentMove")
                console.log(opponentMove);
                console.log("chess.moveNumber()")
                newChess = new Chess();
                newChess.loadPgn(opponentMove);
                updatedChessHistory = chessHistory.slice(0, currentMoveIndex + 1);
                updatedChessHistory.push(newChess);
                setTempChess(newChess);
                setPgn(newChess.pgn());
                setChess(newChess);
                setChessHistory(updatedChessHistory);
                setCurrentMoveIndex(currentMoveIndex + 1);


            } else {
                console.log("Coup invalide");
                return;
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            <div className="board">
                <Chessboard
                    position={chess.fen()}
                    onPieceDrop={(sourceSquare, targetSquare) => handleDrop(sourceSquare, targetSquare)}
                />
            </div>
            <p>PGN</p>
            <p>{pgn}</p>
            <p>VALUE</p>
            <p>{value}</p>
        </div>
    );
};

export default DirectoriesBoard;