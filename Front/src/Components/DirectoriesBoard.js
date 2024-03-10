import React, { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import { useParams } from "react-router-dom";
import {etEE} from "@mui/material/locale";

const DirectoriesBoard = () => {

    function updateDirectory(){}
    function parsedMove(pgn) {
        let parsedPgn = [];
        let pgnArray = pgn.split(" ");
        let stageVisited = [];

        for (let i = 0; i < pgnArray.length; i++) {
            if (pgnArray[i] === "") {
                pgnArray.splice(i, 1);
            }
        }

        for (let i = 0; i < pgnArray.length; i++) {
            if (pgnArray[i].includes(".")) {
                if (!stageVisited.includes(pgnArray[i].replace(/\(|\)/g, ""))) {
                    stageVisited.push(pgnArray[i].replace(/\(|\)/g, ""));
                }
            }
        }


        parsedPgn.push([pgnArray[0] + " " + pgnArray[1] + " " + pgnArray[2] + " "]);

        for (let i = 0; i < stageVisited.length - 1; i++) {
            parsedPgn.push([]);
        }

        for (let i = 1; i < stageVisited.length; i++) {
            let previousMove = pgnArray[2];
            let oldouvert;
            for (let j = 3; j < pgnArray.length; j++) {

                if (pgnArray[j].includes("(")) {
                    oldouvert = true;
                }
                if (pgnArray[j].includes(")")) {
                    oldouvert = false;
                }

                if(!(pgnArray[j].includes("(")) && !(pgnArray[j].includes(")")) && !(pgnArray[j].includes("."))) {
                    //vérifier que pgnArray[j] est inclue dans parsePgn(i-1)
                    for (let k = 0; k < parsedPgn[i - 1].length; k++) {
                        if (parsedPgn[i - 1][k].includes(pgnArray[j])) {
                            previousMove = pgnArray[j];
                        }
                    }
                }
                let move = [];
                if (pgnArray[j].includes(stageVisited[i])) {
                    let ouvert = false;
                    let h = j;
                    move.push(pgnArray[j+1]);
                    while (move.length < 2 && h+1 !== pgnArray.length) {
                        ++h;
                        if(oldouvert && pgnArray[h].includes(")") && ouvert == false) {
                            h = pgnArray.length - 1;
                        }
                        else {
                            if (!pgnArray[j].includes("(") && !pgnArray[h].includes(".") && !pgnArray[h].includes(")") && !pgnArray[h].includes("(") && ouvert == false) {
                                if(!(pgnArray[h] === move[0])) {
                                    move.push(pgnArray[h]);
                                }

                            }
                            else if (pgnArray[j].includes("(")) {

                                if(!(pgnArray[h] === move[0])) {
                                    move.push(pgnArray[h]);
                                }

                            }

                            if (pgnArray[h].includes("(")) {
                                ouvert = true;
                            }
                            if (pgnArray[h].includes(")")) {
                                ouvert = false;
                            }
                        }


                    }
                    if (i !== 0) {
                        for (let k = 0; k < parsedPgn[i - 1].length; k++) {
                            if (parsedPgn[i - 1][k].includes(previousMove)) {
                                let res = parsedPgn[i - 1][k] + pgnArray[j] + " " + move.join(" ") + " ";
                                res = res.replace(/\(|\)/g, "");
                                parsedPgn[i].push(res);
                                k = parsedPgn[i - 1].length;
                            }
                        }
                    }

                }

            }
        }

        return parsedPgn;
    }

    function parsedMove_noir(pgn) {
        let parsedPgn = [];
        let pgnArray = pgn.split(" ");
        let stageVisited = [];

        for (let i = 0; i < pgnArray.length; i++) {
            if (pgnArray[i] == "") {
                pgnArray.splice(i, 1);
            }
        }

        for (let i = 0; i < pgnArray.length; i++) {
            if (pgnArray[i].includes(".")) {
                if (!stageVisited.includes(pgnArray[i].replace(/\(|\)/g, ""))) {
                    stageVisited.push(pgnArray[i].replace(/\(|\)/g, ""));
                }
            }
        }

        for (let i = 0; i < stageVisited.length; i++) {
            parsedPgn.push([]);
        }

        for (let i = 0; i < stageVisited.length; i++) {
            let previousMove = pgnArray[2];
            let previousMoveP;
            let oldouvert;
            for (let j = 0; j < pgnArray.length; j++) {
                if (pgnArray[j].includes("(")) {
                    oldouvert = true;
                }
                if (pgnArray[j].includes(")")) {
                    oldouvert = false;
                }

                if (!(pgnArray[j].includes("(")) && !(pgnArray[j].includes(")")) && !(pgnArray[j].includes(".")) && i !== 0) {
                    for (let k = 0; k < parsedPgn[i - 1].length; k++) {
                        if (parsedPgn[i - 1][k].includes(pgnArray[j])) {
                            previousMove = pgnArray[j];
                        }
                    }
                }
                let moves = [];
                let move = [];

                previousMove = pgnArray[j - 1];





                if (pgnArray[j].includes(stageVisited[i])) {
                    if (j !== 0) {
                        if (pgnArray[j - 1] !== ")") {
                            previousMove = pgnArray[j - 1];
                            if (pgnArray[j - 1].includes("(")) {
                                previousMoveP = pgnArray[j - 2];
                            }
                        }
                    }
                    let ouvert_n = 0;
                    let h = j + 1;
                    let allfind = false;
                    let base = pgnArray[j] + " " + pgnArray[j + 1] + " ";



                    while (allfind === false && h + 1 !== pgnArray.length) {
                        /*console.log(moves);*/
                        ++h;
                        if (moves.length === 0) {
                            move.push(base + pgnArray[h] + " ");
                            moves.push(move);
                            move = [];
                        }

                        if (oldouvert && pgnArray[h].includes(")") && ouvert_n === 0) {
                            h = pgnArray.length - 1;
                        } else {
                            if (pgnArray[h].includes("(") && ouvert_n === 0) {
                                move.push(base + pgnArray[h] + " ");
                                moves.push(move);
                                move = [];
                            }
                        }
                        if (pgnArray[h].includes("(")) {
                            ouvert_n++;
                        }
                        if (pgnArray[h].includes(")")) {
                            ouvert_n--;
                        }
                    }
                    let prevmove = "";
                    if (j !== 0) {
                        if (pgnArray[j - 1].includes(")")) {
                            prevmove = previousMoveP;
                        } else {
                            prevmove = previousMove;
                        }
                        prevmove = prevmove.replace(/\(|\)/g, "");
                    }


                    if (i !== 0) {
                        for (let k = 0; k < parsedPgn[i - 1].length; k++) {
                            if (parsedPgn[i - 1][k].includes(prevmove)) {
                                for (let l = 0; l < moves.length; l++) {
                                    let res = parsedPgn[i - 1][k] + " " + moves[l].join(" ") + " ";
                                    res = res.replace(/\(|\)/g, "");
                                    res = res.replace(/\s+/g, ' ');
                                    parsedPgn[i].push(res);
                                }
                            }

                        }
                    }
                    else {
                        for (let l = 0; l < moves.length; l++) {
                            let resu = moves[l].join(" ") + " ";
                            parsedPgn[i].push(resu.replace(/\(|\)/g, ""));
                        }
                    }
                }
            }
        }
        return(parsedPgn);
    }



    function removeLastMove(pgn) {
        let pgnArray = pgn.trim().split(" ");

        // Vérifiez si le tableau a plus d'un élément avant de procéder à la suppression
        if (pgnArray.length > 1) {
            pgnArray.pop(); // Supprimez le dernier élément du tableau
        }

        return pgnArray.join(" ");
    }


    const {value} = useParams();
    const [value2 , setValue2] = useState(value.slice(0, -2));

    let userColor = value.slice(-1);

    if (userColor === "1") {
        userColor = "b";
    }
    else {
        userColor = "w";
    }



    /*setValue2(value2.slice(0, -2));*/

    console.log("value 2 : " + value2);

    console.log("userColor : " + userColor);

    let etat = 0;

    const [erreur, setErreur] = useState(0);
    const [pgn, setPgn] = useState("");
    const [chess, setChess] = useState(new Chess());
    const [chessHistory, setChessHistory] = useState([new Chess()]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [updatedChessCopy, setUpdatedChessCopy] = useState(new Chess());
    const [open, setOpen] = useState(false);

    let parsedMoves;

    if(userColor === "b") {
        parsedMoves = parsedMove_noir(value2);
        console.log("noir")
    }
    else {
        parsedMoves = parsedMove(value2);
    }

    console.log(parsedMoves);


    //si la couleur est noir alors charger sur le board removeLastMove(parsedMoves[0][0])
    if (userColor === "b" && chess.pgn() === "") {
        chess.loadPgn(removeLastMove(parsedMoves[0][0]));
        setPgn(removeLastMove(parsedMoves[0][0]));
    }
    const handleDrop = (sourceSquare, targetSquare) => {
        try {
            const updatedChessCopy = new Chess();
            updatedChessCopy.loadPgn(chess.pgn(), {newlineChar: ':'});
            setUpdatedChessCopy(updatedChessCopy);
            const move = updatedChessCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q"
            });


            if (move !== null) {
                const currentMove = parsedMoves[chess.moveNumber() - 1];
                let newPgn = "";
                for (let i = 0; i < parsedMoves[currentMoveIndex].length; i++) {
                    if (parsedMoves[currentMoveIndex][i].includes(updatedChessCopy.pgn())) {

                        if(currentMoveIndex+1 === parsedMoves.length) {

                            etat = 1;
                            setOpen(true);
                        }
                        else {
                            let suite = false;
                            for (let j = 0; j < parsedMoves[currentMoveIndex+1].length; j++) {
                                if (parsedMoves[currentMoveIndex+1][j].includes(updatedChessCopy.pgn())) {
                                    suite = true;
                                }
                            }
                            if (suite === false) {
                                etat = 1;
                                setOpen(true);
                                console.log("fini")
                            }
                        }

                    }

                    if (parsedMoves[currentMoveIndex][i].includes(updatedChessCopy.pgn()) && etat === 0) {
                        console.log("on passe ici")
                        if (userColor === "w") {
                            newPgn = parsedMoves[currentMoveIndex][i];
                        } else {
                            for (let j = 0; j < parsedMoves[currentMoveIndex + 1].length; j++) {
                                console.log("parsedMoves[currentMoveIndex+1][j] : " + parsedMoves[currentMoveIndex+1][j])
                                console.log("parsedMoves[currentMoveIndex][i] : " + parsedMoves[currentMoveIndex][i])
                                let pgn_temp = parsedMoves[currentMoveIndex][i].replace(/\s+$/, '')
                                if (parsedMoves[currentMoveIndex + 1][j].includes(pgn_temp)) {
                                    console.log("on passe ici 2" + parsedMoves[currentMoveIndex + 1][j])
                                    console.log("on passe ici 3" + removeLastMove(parsedMoves[currentMoveIndex + 1][j]))
                                    newPgn = removeLastMove(parsedMoves[currentMoveIndex + 1][j]);
                                }
                            }
                            /*console.log("newPgn : " + newPgn)
                            console.log(parsedMoves[currentMoveIndex])*/
                        }

                    }
                }
                console.log(etat)
                if (newPgn === "" && etat === 0) {
                    console.log("Coup invalide");
                    console.log("newPgn : " + newPgn)
                    setErreur(erreur + 1);
                    updateDirectory();
                    return;
                }
                updatedChessCopy.loadPgn(newPgn);
                console.log("newPgn new : " + newPgn)


                let updatedChessHistory = chessHistory.slice(0, currentMoveIndex + 1);
                setChess(updatedChessCopy);
                setChessHistory(updatedChessHistory);
                setCurrentMoveIndex(currentMoveIndex + 1);
                setPgn(updatedChessCopy.pgn());




            } else {
                console.log("Coup invalide");
                setErreur(erreur + 1);
                updateDirectory();
                return;
            }
        }catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (etat === 1) {
            setOpen(true);
        }
    }, [etat]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleRedirectDirectories = () => {
        window.location.href = "/directories";
    }


    return (
        <div>
            <div className="board">
                <Chessboard
                    position={chess.fen()}
                    onPieceDrop={(sourceSquare, targetSquare) => handleDrop(sourceSquare, targetSquare)}
                />
            </div>
            <p>Erreur : {erreur}</p>
            <p>PGN : </p>
            <p>{pgn}</p>
            <p>PGN de l'ouverture : </p>
            <p>{value2}</p>

            <Dialog
                open={open}
                shouldCloseOnOverlayClick={false}
            >
                <DialogTitle>{"Bravo ! L'ouverture est terminé !"}</DialogTitle>
                <DialogContent>
                    <p>Vous avez terminer votre ouverture avec {erreur} erreurs.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRedirectDirectories} color="primary">
                        Retourner à vos répertoires
                    </Button>
                    <Button onClick={handleRefresh} color="primary">
                        Rejouer l'ouverture
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DirectoriesBoard;