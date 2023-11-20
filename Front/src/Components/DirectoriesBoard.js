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
            const currentMove = (i === 0) ? moves[i] : `1. ${moves.slice(0, i + 1).join(' ')}`;
            parsedMoves.push(currentMove);
        }

        return parsedMoves;
    }

    const { value } = useParams();

    const {userColor} = "w";

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



            /*if (updatedChessCopy.turn() === "b") {
                console.log(updatedChessCopy.moveNumber());
                const newChess = new Chess();
                newChess.loadPgn(parsedMoves[updatedChessCopy.moveNumber() - 1], { newlineChar: ':' });
                console.log(parsedMoves[updatedChessCopy.moveNumber() - 1]);
                setUpdatedChessCopy(newChess);
                setTempChess(newChess);
                return;
            }*/

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
                if (parsedMoves[chess.moveNumber() - 1].includes(move.san)) {
                    console.log(chess.moveNumber());
                    const newChess = new Chess();
                    newChess.loadPgn(parsedMoves[chess.moveNumber() - 1], {newlineChar: ':'});
                    console.log(parsedMoves[chess.moveNumber() - 1]);
                    setUpdatedChessCopy(newChess);
                    setTempChess(newChess);
                    return;
                }

            } else {
                console.log("Invalid move");
                return;
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (value.includes(tempChess.pgn())) {
            const updatedChessHistory = chessHistory.slice(0, currentMoveIndex + 1);
            updatedChessHistory.push(updatedChessCopy);

            setPgn(tempChess.pgn());
            setChess(updatedChessCopy);

            setChessHistory(updatedChessHistory);
            setCurrentMoveIndex(currentMoveIndex + 1);
        } else {
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
        </div>
    );
};

export default DirectoriesBoard;
