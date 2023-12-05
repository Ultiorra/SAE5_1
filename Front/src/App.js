import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Link } from "react-router-dom";
import { Routes } from "react-router-dom";
import ConnectionForm from "./Components/connectionForm";
import Directories from "./Components/Directories";
import MyChessboard from "./Components/ChessBoard";
import NavBar from "./Components/Utils/Navbar";
import * as app from "react";
import { ToastContainer } from 'react-toastify';
import DirectoriesBoard from "./Components/DirectoriesBoard";

function App() {
    const  [isRegistration, setRegistration] = React.useState(false);
    const [isConnected, setConnected] = React.useState(false);
    const [user, setUser] = React.useState({
        login: '',
        id: '',
        email: '',
        directories: {
            id: '',
            name: '',
            ouvertures: '',
            nb_tests: '',
            nb_success: '',
            color: '',
        }
    });

    useEffect(() => {
        console.log(user);
        console.log("test" + isConnected);
    } , [user]);
    return (
        <Router>
            <div>
                <ToastContainer />
                < NavBar isConnected={isConnected} setConnected={setConnected} />
                <Routes>
                    <Route path="/" element={<ConnectionForm isRegistration={isRegistration} setRegistration={setRegistration} isConnected={isConnected} setConnected={setConnected} setUser={setUser} user={user} />} />
                    <Route path="/chessboard" element={<MyChessboard isConnected={isConnected} user={user} />} />
                    <Route path="/directories" element={<Directories user={user} isConnected={isConnected} />} />
                    <Route path="/directoriesboard/:value" element={<DirectoriesBoard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
