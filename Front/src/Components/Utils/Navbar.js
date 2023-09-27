import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const NavBar = (isConnected) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'white' }}>
                    ProChess
                </Typography>
                <div style={{ flexGrow: 1 }}></div>
                {
                    !isConnected ?
                        <Button component={Link} to="/" color="inherit">
                            Connexion
                        </Button>
                        :
                        <Button component={Link} to="/" color="inherit" onClick={() => { isConnected(false) }}>
                            Déconnexion
                        </Button>
                }

                <Button component={Link} to="/chessboard" color="inherit">
                    Chessboard
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
