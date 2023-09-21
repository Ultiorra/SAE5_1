import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import {Chess} from 'chess.js';

const MyChessboard = () => {
    const [chess] = useState(new Chess());

    const handleDrop = (sourceSquare, targetSquare) => {
        const move = chess.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        });

        if (move === null) return;

        // make random legal move for black
        window.setTimeout(() => {
            const moves = chess.moves();
            const move = moves[Math.floor(Math.random() * moves.length)];
            chess.move(move);
        }, 500);
    };

    return (
        <Chessboard
            position={chess.fen()}
            onDrop={(sourceSquare, targetSquare) => handleDrop(sourceSquare, targetSquare)}
        />
    );
};

export default MyChessboard;
