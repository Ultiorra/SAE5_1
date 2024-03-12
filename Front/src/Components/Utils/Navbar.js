import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {toast} from "react-toastify";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
const path = "http://localhost/my-app/prochess/";


function NavBar({isConnected, setConnected}) {
    const navigate = useNavigate();
    const handleLogout = async (e) => {
        localStorage.clear();
        e.preventDefault();

        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        }
        fetch(path + 'logout.php', requestOption).then(response => {
            console.log(response.status)
            if (response.status === 200) {
                toast('Déconnexion réussie', {type: 'success', autoClose: 2000, position: toast.POSITION.TOP_CENTER});
                navigate('/');
                setConnected(false);
            } else
                toast('Erreur de déconnexion', {type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER});
        })
            .catch(error => {

                toast('Erreur de déconnexion...', {
                    type: 'error',
                    autoClose: 2000,
                    position: toast.POSITION.TOP_CENTER
                });

            });

    };
    return (
        <nav className="border-gray-200 bg-teal-900 dark:border-gray-700">

        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">ProChess</span>
                </a>
                <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none " aria-controls="navbar-solid-bg" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5  text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                    {
                        !isConnected ?
                            <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                                <li>
                                    <a href="/" className="block py-2 px-3 md:p-0 text-white rounded md:bg-transparent md:dark:bg-transparent" aria-current="page">Connexion</a>
                                </li>
                            </ul>
                            :
                            <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                                <li>
                                    <a href="/chessboard"
                                       className="block py-2 px-3 md:p-0 text-white rounded md:bg-transparent md:dark:bg-transparent"
                                       aria-current="page"><DashboardIcon/>Chessboard</a>
                                </li>
                                <li>
                                    <a href="/directories"
                                       className="block py-2 px-3 md:p-0 text-white rounded md:bg-transparent md:dark:bg-transparent"
                                       aria-current="page"><FolderIcon/>Directories</a>
                                </li>
                                <li>
                                    <a href="/api/export"
                                       className="block py-2 px-3 md:p-0 text-white rounded md:bg-transparent md:dark:bg-transparent"
                                       aria-current="page"><HistoryIcon/>Lichess history</a>
                                </li>
                                <li>
                                    <a href="/profile/edit"
                                       className="block py-2 px-3 md:p-0 text-white rounded md:bg-transparent md:dark:bg-transparent"
                                       aria-current="page"><AccountBoxIcon/>Profile</a>
                                </li>
                                <li>
                                    <a href="/"
                                       className="block py-2 px-3 md:p-0 text-white rounded md:bg-transparent md:dark:bg-transparent"
                                       aria-current="page"><LogoutIcon onClick={handleLogout}/>Logout</a>
                                </li>
                            </ul>
                    }
                </div>
        </div>
        </nav>
    );
};

export default NavBar;