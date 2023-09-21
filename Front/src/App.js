import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Link } from "react-router-dom";
import { Routes } from "react-router-dom";
import ConnectionForm from "./Components/connectionForm";
import MyChessboard from "./ChessBoard";
import NavBar from "./Components/Utils/Navbar";

function App() {
    return (
        <Router>
            <div>
                < NavBar />
                <Routes>
                    <Route path="/" element={<ConnectionForm />} />
                    <Route path="/chessboard" element={<MyChessboard />} />
                </Routes>
            </div>
        </Router>


    );
}

export default App;
