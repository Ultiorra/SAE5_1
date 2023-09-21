import logo from './logo.svg';
import './App.css';
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import MyChessBoard from './ChessBoard';

function App() {
  const chess = new Chess();
  return (
    <MyChessBoard />
  );
}

export default App;
