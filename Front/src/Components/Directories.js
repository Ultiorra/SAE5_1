import {Button, Link} from "@mui/material";
import MyChessboard from "./ChessBoard";


const Directories = () => {
    return (
        <div>
            <h1>Directories</h1>
            <Button component={Link} to="/chessboard" color="inherit">
                New Directory
            </Button>
        </div>
    )
}

export default Directories;