import React, {useEffect} from 'react';
import {BrowserRouter as Router, Navigate, Route} from 'react-router-dom';
import { Link } from "react-router-dom";
import { Routes } from "react-router-dom";
import ConnectionForm from "./Components/connectionForm";
import Directories from "./Components/Directories";
import MyChessboard from "./Components/ChessBoard";
import NavBar from "./Components/Utils/Navbar";
import * as app from "react";
import { ToastContainer } from 'react-toastify';
import DirectoriesBoard from "./Components/DirectoriesBoard";
import NotFoundPage from "./Components/NotFound";
import ApiExport from "./Components/ApiExport";
import ProfilEditPage from "./Components/ProfilEditPage";
import './index.css';

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
        },
        lichess_name: '',
    });

    useEffect(() => {
        console.log(user);
        console.log("test" + isConnected);
        const loggedInUser = localStorage.getItem("user");
        console.log('loggedInUser from App : ' + loggedInUser);
        if (loggedInUser) {
            user.id = JSON.parse(loggedInUser).id;
            user.login = JSON.parse(loggedInUser).login;
            user.email = JSON.parse(loggedInUser).email;
            user.password = JSON.parse(loggedInUser).password;
            console.log('user dans app : ' + user.login + ' ' + user.password + ' ' + user.id + ' ' + user.email);
            setConnected(true);
            //console.log('loggedInUser from App : ' + JSON.parse(loggedInUser.login))
        }
    } , [user]);
    return (
        <Router>
            <div>
                <ToastContainer />
                < NavBar isConnected={isConnected} setConnected={setConnected} />
                <Routes>
                    <Route
                        path="/"
                        element={
                            isConnected ? (
                                <Navigate to="/directories" />
                            ) : (
                                <ConnectionForm isRegistration={isRegistration} setRegistration={setRegistration} isConnected={isConnected} setConnected={setConnected} setUser={setUser} user={user} />
                            )
                        }
                    />
                    <Route path="/" element={<ConnectionForm isRegistration={isRegistration} setRegistration={setRegistration} isConnected={isConnected} setConnected={setConnected} setUser={setUser} user={user} />} />
                    <Route path="/chessboard" element={<MyChessboard isConnected={isConnected} user={user} />} />
                    <Route path="/directories" element={<Directories user={user} isConnected={isConnected} />} />
                    <Route path="/directoriesboard/:value" element={<DirectoriesBoard />} />
                    <Route path="/api/export" element={<ApiExport />} user={user} />
                    <Route path="/profile/edit" element={<ProfilEditPage user={user} />} />
                    <Route path={"*"} element={<NotFoundPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
