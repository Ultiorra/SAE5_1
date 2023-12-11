import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Container } from '@mui/material';

const NotFoundPage = () => {
    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                Page non trouvée
            </Typography>
            <Typography variant="body1" paragraph>
                La page que vous recherchez n'existe pas.
            </Typography>
            <Button variant="contained" component={Link} to="/" color="primary">
                Retour à la page d'accueil
            </Button>
        </Container>
    );
};

export default NotFoundPage;
