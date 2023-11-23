import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {toast} from "react-toastify";
const path = "http://localhost/my-app/prochess/";


function NavBar({isConnected, setConnected}) {
    const navigate = useNavigate();
    const handleLogout = async (e) => {
        e.preventDefault();

        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        }
        fetch(path + 'logout.php', requestOption).then(response => {
            console.log(response.status)
            if (response.status === 200){
                toast('Déconnexion réussie', {type: 'success', autoClose: 2000, position: toast.POSITION.TOP_CENTER});
                navigate('/');
                setConnected(false);
            }
            else
                toast('Erreur de déconnexion', {type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER});
        })
            .catch(error => {

                toast('Erreur de déconnexion...', {type: 'error', autoClose: 2000, position: toast.POSITION.TOP_CENTER});

            });

    };
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" style={{textDecoration: 'none', color: 'white'}}>
                    ProChess
                </Typography>
                <div style={{flexGrow: 1}}></div>
                {
                    !isConnected ?
                        <Button component={Link} to="/" color="inherit">
                            Connexion
                        </Button>
                        :
                        <Button component={Link} to="/" color="inherit" onClick={handleLogout}>
                            Déconnexion
                        </Button>
                }

                <Button component={Link} to="/chessboard" color="inherit">
                    Chessboard
                </Button>
                <Button component={Link} to="/directories" color="inherit">
                    Directories
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
