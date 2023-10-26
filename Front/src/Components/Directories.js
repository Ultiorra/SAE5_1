import { Card, CardContent, Typography, Box } from "@mui/material";
import '../css/Directories.css';
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton} from "@mui/material";
const Directories = () => {
    const directories = [
        {
            name: 'directory1',
            ouvertures: 'ouvertures1',
            nb_tests: 1,
            nb_success: 1,
            color: 'white',
        },
        {
            name: 'directory2',
            ouvertures: 'ouvertures2',
            nb_tests: 2,
            nb_success: 1,
            color: 'black',
        },
        {
            name: 'directory3',
            ouvertures: 'ouvertures3',
            nb_tests: 3,
            nb_success: 1,
            color: 'white',
        },
        {
            name: 'directory4',
            ouvertures: 'ouvertures4',
            nb_tests: 4,
            nb_success: 0,
            color: 'black',
        },
        {
            name: 'directory5',
            ouvertures: 'ouvertures4',
            nb_tests: 4,
            nb_success: 0,
            color: 'white',
        }
    ];

    return (
        <div>
            <h1>Directories</h1>
            <div className="directories-container">
                {directories.map((directory, index) => (
                    <Card
                        key={index}
                        className="directory-card"
                    >

                        <CardContent  style={{
                            backgroundColor: '#f5f5f5'
                        }}>
                            <IconButton
                                className="delete-button"
                                onClick={() => console.log('delete')}
                            >
                                <DeleteIcon />
                            </IconButton>
                            <Typography variant="h5">{directory.name}</Typography>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mt={2}

                            >
                                <div
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        backgroundColor: directory.color,
                                        borderRadius: '50%',
                                        marginRight: '8px',
                                    }}
                                ></div>
                                <Typography>
                                    {Number.isInteger(directory.nb_success / directory.nb_tests)
                                        ? `${(directory.nb_success / directory.nb_tests) * 100}% de réussite`
                                        : `${((directory.nb_success / directory.nb_tests) * 100).toFixed(2)}% de réussite`}
                                </Typography>
                            </Box>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mt={2}

                            >
                            <Typography variant="caption" align="left">
                                {directory.ouvertures}
                            </Typography>
                            <Typography variant="caption" align="right">
                                {directory.nb_tests} tests
                            </Typography>
                            </Box>

                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default Directories;
