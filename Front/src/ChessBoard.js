import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import {Chess} from 'chess.js';
const MyChessboard = () => {

    const [chess, setChess] = useState(new Chess());

    const handleDrop = (sourceSquare, targetSquare) => {
        try{
            const move = chess.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q"
            });

            if (move === null) return;

            setChess(new Chess(chess.fen()));
        }catch(e){
            console.log(e);
        }

    };

    return (
        <Chessboard
            position={chess.fen()}
            onPieceDrop={(sourceSquare, targetSquare) => handleDrop(sourceSquare, targetSquare)}
        />
    );
};
export default MyChessboard;