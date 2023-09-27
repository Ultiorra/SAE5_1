import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Link } from "react-router-dom";
import { Routes } from "react-router-dom";
import ConnectionForm from "./Components/connectionForm";
import MyChessboard from "./Components/ChessBoard";
import NavBar from "./Components/Utils/Navbar";
import * as app from "react";

function App() {
    const  [isRegistration, setRegistration] = React.useState(false);
    const [isConnected, setConnected] = React.useState(false);
    return (
        <Router>
            <div>
                < NavBar />
                <Routes>
                    <Route path="/" element={<ConnectionForm isRegistration={isRegistration} setRegistration={setRegistration} isConnected={isConnected} setConnected={setConnected} />} />
                    <Route path="/chessboard" element={<MyChessboard />} />
                </Routes>
            </div>
        </Router>


    );
}

export default App;
