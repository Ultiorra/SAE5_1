import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Button } from "@mui/material";
import { useLocation } from 'react-router-dom';


const DirectoriesBoard = (props) => {
    const [chess, setChess] = useState(new Chess());
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);

    const [pgn, setPgn] = useState("");

    const [tree, setTree] = useState([]);

    const [chessHistory, setChessHistory] = useState([new Chess()]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [pgn_tree, setPgn_tree] = useState("");
    const [pgnHistory, setPgnHistory] = useState([new Chess().pgn()]);
    const [firstreturn, setFirstreturn] = useState(true);


    useEffect(() => {
        // Access the selected directory from props.location.state
        const selectedDirectory = props.location?.state?.directory;

        // Check if selectedDirectory is defined before proceeding
        if (selectedDirectory) {
            // Set the initial position based on the PGN
            console.log(selectedDirectory.pgn)
            setChess(new Chess(selectedDirectory.pgn));
            setIsPlayerTurn(selectedDirectory.color === 'white');
        }
    }, [props.location?.state]);

    console.log(props)

    useEffect(() => {
        // Check if it's the computer's turn and play its move
        if (!isPlayerTurn) {
            const computerMove = getComputerMove();
            playMove(computerMove);
        }
    }, [isPlayerTurn]);

    const playMove = (move) => {
        const updatedChess = new Chess(chess.fen());
        const chessMove = updatedChess.move(move);

        if (chessMove !== null) {
            setChess(updatedChess);
            setIsPlayerTurn(!isPlayerTurn); // Switch turns
        }
    };

    const handleDrop = (sourceSquare, targetSquare) => {
        try {
            const updatedChess = new Chess(chess.fen());
            const move = updatedChess.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q',
            });

            if (move === null) return 'snapback'; // Reset the move if it's invalid

            const selectedDirectory = props.location?.state?.directory;

            // Check if it's the player's turn and the move respects the PGN
            if (isPlayerTurn && move.san === selectedDirectory.pgn.split(' ')[currentMoveIndex]) {
                const updatedHistory = chessHistory.slice(0, currentMoveIndex + 1);
                updatedHistory.push(updatedChess);
                setChessHistory(updatedHistory);
                setCurrentMoveIndex(currentMoveIndex + 1);

                const updatedPgnHistory = pgnHistory.slice(0, currentMoveIndex + 1);
                updatedPgnHistory.push(updatedChess.pgn());
                setPgnHistory(updatedPgnHistory);

                setPgn(chess.pgn());

                if (isPlayerTurn) {
                    // Switch turns only if it's the player's turn
                    setIsPlayerTurn(!isPlayerTurn);
                }

                tree.addMove(move);
                setPgn_tree(tree.exportPgn());

                setFirstreturn(true);

                return;
            }

            // Reset the move if it doesn't respect the PGN
            return 'snapback';
        } catch (e) {
            console.error(e);
            return 'snapback'; // Reset the move in case of an error
        }
    };



    const getComputerMove = () => {
        // Implement your logic to generate the computer's move here
        // For simplicity, let's just make a random move
        const legalMoves = chess.ugly_moves();
        const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        return randomMove;
    };

    return (
        <div>
            <div className="board">
                <Chessboard
                    position={chess.fen()}
                    onPieceDrop={(sourceSquare, targetSquare, piece) => handleDrop(sourceSquare, targetSquare, piece)}
                />
            </div>
            <Button onClick={() => setChess(new Chess())}>Reset</Button>
        </div>
    );
};

export default DirectoriesBoard;
