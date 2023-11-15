import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import {Chess} from 'chess.js';
import '../css/ChessBoard.css';
import {Button} from "@mui/material";

const MyChessboard = () => {

   const [pgn, setPgn] = useState("");

    const [tree, setTree] = useState([]);

    const [chess, setChess] = useState(new Chess());
    const [chessHistory, setChessHistory] = useState([new Chess()]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [pgn_tree, setPgn_tree] = useState("");
    const [pgnHistory, setPgnHistory] = useState([new Chess().pgn()]);
    const [firstreturn, setFirstreturn] = useState(true);



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


            setFirstreturn(true);

            console.log(chess.history({ verbose: true }));



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
            <p className="pgn">{pgn}</p>
            <p>{chess.history()}</p>
        </div>
    );
};
export default MyChessboard;