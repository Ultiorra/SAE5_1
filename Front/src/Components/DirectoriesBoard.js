import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Button } from "@mui/material";
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const DirectoriesBoard = () => {
    const { value } = useParams();



    const [pgn, setPgn] = useState("");
    const [tree, setTree] = useState([]);
    const [chess, setChess] = useState(new Chess());
    const [chessHistory, setChessHistory] = useState([new Chess()]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [pgn_tree, setPgn_tree] = useState("");
    const [pgnHistory, setPgnHistory] = useState([new Chess().pgn()]);

    const handleDrop = (sourceSquare, targetSquare) => {
        try{
            const updatedChess = new Chess(chess.fen());
            const move = chess.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q"
            });

            if (move === null) return;

            console.log("pgn")
            console.log(pgn);
            console.log("pgn")
            console.log(value);

            /*if (chess.pgn() != value) return;*/

            const temp_updatedHistory = chessHistory;
            const temp_updatedPgnHistory = pgnHistory;


            const updatedHistory = chessHistory.slice(0, currentMoveIndex + 1);
            updatedHistory.push(updatedChess);
            setChessHistory(updatedHistory);
            setCurrentMoveIndex(currentMoveIndex + 1);

            const updatedPgnHistory = pgnHistory.slice(0, currentMoveIndex + 1);
            updatedPgnHistory.push(updatedChess.pgn());
            setPgnHistory(updatedPgnHistory);




            setPgn(chess.pgn());


            console.log("Chesspgn",chess.pgn())

            if (value.contains(chess.pgn())){
                return;
            }
            else{
                setChessHistory(temp_updatedHistory);
                setCurrentMoveIndex(currentMoveIndex - 1);
                setPgnHistory(temp_updatedPgnHistory);
            }



        }catch(e){
            console.log(e);
        }
    }



    return (
        <div>
            <Chessboard
                position={chess.fen()}
                onPieceDrop={(sourceSquare, targetSquare) => handleDrop(sourceSquare, targetSquare)}
            />
        </div>
    );
};

export default DirectoriesBoard;
