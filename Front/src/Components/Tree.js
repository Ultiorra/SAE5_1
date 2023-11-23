import Node from "./Node";
import { Chess } from "chess.js";

export default class Tree {
    constructor(pgn, racine){
        if (racine)
            this.game = new Chess(racine.fen)
        else
            this.game = new Chess()
        this.pgn = pgn;
        this.racine = racine;
        this.buildBranch(this.racine, 0)
    } 

    findNode(fenMove){
        function visit(r, array = []){
            // console.log("je teste : ", r.fen)
            if( r.fen == fenMove )
                return r
            if( r && r.enfants.length > 0 ){

                    for (let i = 1; i<r.enfants.length; i++){
                        const racineVariation = r.enfants[i]
                        const variationArray = [racineVariation]
                        return visit(racineVariation, variationArray)
    
                    }
                    return visit(r.enfants[0], array)
            }
        }
        return visit(this.racine)
    }
    get array(){
        return [this.racine, ...this.visit()]
    }
    visit(r = this.racine, array = []){
        if( r && r.enfants.length > 0 ){
                array.push(r.enfants[0])
                for (let i = 1; i<r.enfants.length; i++){
                    // console.log("nouvelle branche : ", this.visit(r.enfants[i], []))
                    const racineVariation = r.enfants[i]
                    const variationArray = [racineVariation]
                    this.visit(racineVariation, variationArray)

                    array.push(variationArray)
                }
                this.visit(r.enfants[0], array)
        }

            // for (let enfant of r.enfants) {
            //     this.visit(enfant)
            // }
        return array 
    }

    exportPgn(){
        function flatDeep(arr, exportString) {
            arr.forEach( node => {
                    if( Array.isArray(node) ){
                        let variationString = " (" // + (node[0].turn == 'b' ? ". " : "... ") 
                        exportString += variationString  + flatDeep(node, "") 
                        exportString += ") "
                    }
                    else {
                        if(node.turn === 'b' && node.move !== "Racine")
                            exportString += node.moveNbr+0.5 + ". " + node.move + " "
                        else if(node.turn === 'w')
                            exportString += node.move + " "
                        if ( node.comment )
                            exportString += "{ " + node.comment + " } "
                    }
                }
                )
            return exportString
         };
         
         
         return flatDeep(this.array, "")
         
    }
    

    buildBranch(racine, startIndex) {
        let courant = racine;
        let oldIndex = startIndex, currentIndex = startIndex;
        let numCoup = 1;
        while (this.pgn.charAt(currentIndex) === ' '){
            currentIndex ++
            oldIndex ++
        }
        if(this.pgn.charAt(currentIndex) === '{'){
            oldIndex ++ 
            while(this.pgn.charAt(currentIndex) !== '}')
                currentIndex ++ 
            currentIndex += 2
            courant.comment =  this.pgn.substring(oldIndex+1, currentIndex-2);
        } 

        while( this.pgn.length > currentIndex ) {

            if(this.pgn.charAt(currentIndex) === '{'){
                oldIndex ++ 
                while(this.pgn.charAt(currentIndex) !== '}')
                    currentIndex ++ 
                currentIndex +=2
                courant.comment =  this.pgn.substring(oldIndex+1, currentIndex-2);
            }
            if(this.pgn.charAt(currentIndex) == ' ')
            currentIndex++
            oldIndex = currentIndex

            if(this.pgn.charAt(currentIndex) === ')' || this.pgn.charAt(currentIndex) === '*'){
                return currentIndex;
            }
            //On entre dans une sous branche
            if(this.pgn.charAt(currentIndex)==='(') {
                let endOfMainFen = this.game.fen()
                this.game.undo()
                let testIndex = this.buildBranch(courant.parent, currentIndex + 1);
                this.game.load(endOfMainFen)
                currentIndex = testIndex+1;
                while (this.pgn.charAt(currentIndex) === '.' || this.pgn.charAt(currentIndex) === ' ') {
                    currentIndex++;
                }
                oldIndex = currentIndex;
            }
            //Sinon, on lit le prochain coup
            else {
                currentIndex = this.litEntree(currentIndex);
                let entree = this.pgn.substring(oldIndex, currentIndex);
                //Si l'entrée est un numéro
                if (entree.match("^\\d+$")) {
                    numCoup = parseInt(entree);
                    //on passe
                    while (this.pgn.charAt(currentIndex) === '.' || this.pgn.charAt(currentIndex) === ' ') {
                        currentIndex++;
                    }

                } else {
                    courant = this.ajouteCoup(courant, entree, numCoup);
                }
                //On cherche le prochain coup 
                let souspgn = this.pgn.substring(oldIndex, currentIndex)
                while ( this.pgn.charAt(currentIndex) === ' '
                        || this.pgn.charAt(currentIndex) === '.'
                        || souspgn.match("^\\d+$")
                ) {
                    currentIndex++;
                }
                oldIndex = currentIndex;
            }
        }

    }
    litEntree(currentIndex){
        while (this.pgn.charAt(currentIndex) !== '.'
                && this.pgn.charAt(currentIndex) !== ' '
                && this.pgn.charAt(currentIndex) !== ')') {
            currentIndex++;
        }

        return currentIndex;
    }
    ajouteCoup(parent, coupJoue, moveNb){
        const fen = parent.fen;
        this.game.load(fen, true)
        this.game.move(coupJoue)
        let nouveau = new Node(coupJoue, parent, this.game.fen(), moveNb, "");
        parent.addEnfant(nouveau);
        return nouveau;

    }

    findLastCommonNode(moves){
        let currentNode = this.racine.enfants[0]
        // console.log("on compare ", moves[0], " et ", currentNode.move)
        let compteur = 0
        while(moves[0] == currentNode.move){
            compteur++
            const ouDansLesEnfants = currentNode.enfants.findIndex(m=> {
                // console.log("comparons ", moves[1], " et ", m.move)
                return m.move == moves[1]
            })
            if(ouDansLesEnfants == -1)
                return [currentNode.fen, compteur]
            currentNode = currentNode.enfants[ouDansLesEnfants]
            moves.shift()
        }
        return [currentNode.fen, compteur]

    }

}
