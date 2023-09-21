import React, { useState } from "react";
import { Chess } from "chess.js";
import {Chessboard} from "react-chessboard";

export default function MyChessboard() {
    const [game, setGame] = useState(new Chess());

    function onDrop({ sourceSquare, targetSquare }) {
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
        });

        if (move === null) {
            return;
        }

        setGame(new Chess(game.fen()));
    }

    return (
        <div>
            <Chessboard position={game.fen()} onPieceDrop={onDrop} />
        </div>
    );
}
