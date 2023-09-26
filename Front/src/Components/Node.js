export default class Node {
    constructor(move, parent, fen = " ", moveNb = 0, comment = ""){
        this.move = move;
        this.moveNb = moveNb;
        this.parent = parent;
        this.enfants = []
        this.fen = fen
        this.comment = comment
        this.annotation = ""
        this.tryNb = 0; // Aller chercher dans le pgn quand on récupère un noeud 
        this.successNb = 0; 
    }
    

    addEnfant(enfant){
        this.enfants.push(enfant);
    }

    hasSiblings(){
        return this.parent.enfants.length > 1
    }

    get movementNbr(){
        let c = 0
        let parent = this.parent
        while (parent){
            c ++ 
            parent = parent.parent
        }
        return c
    }

    get turn(){
        return this.fen.charAt(this.fen.indexOf(' ')+1)

    }
    get moveNbr(){
        if(this.turn === 'w')
            return (this.movementNbr+1) / 2
        return this.movementNbr/2
    }

}
