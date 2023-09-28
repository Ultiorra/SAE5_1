import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import {Chess} from 'chess.js';
import Tree from "./Tree";
import '../css/ChessBoard.css';
import {Button} from "@mui/material";

const MyChessboard = () => {

   const [pgn, setPgn] = useState("");

    const [tree, setTree] = useState([]);

    const [chess, setChess] = useState(new Chess());

    const handleDrop = (sourceSquare, targetSquare) => {

        try{
            let move = chess.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q"
            });
            if (chess.turn() !== "w") {
                const moves = chess.moves()
                move = moves[Math.floor(Math.random() * moves.length)]
                chess.move(move);


            }
            else {
                move = chess.move({
                    from: sourceSquare,
                    to: targetSquare,
                    promotion: "q"
                });
            }

            if (move === null) return;

            setPgn(chess.pgn());

            tree.addMove(move);

            setChess(new Chess(chess.fen()));

        }catch(e){
            console.log(e);
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
            <p className="pgn">{pgn}</p>
        </div>
    );
};
export default MyChessboard;