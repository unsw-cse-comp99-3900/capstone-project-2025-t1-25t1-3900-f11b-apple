import Grid from '@mui/material/Grid2';
import {useState} from "react";

// Sidebar Function

const NAVBAR_HEIGHT = 60;

export default function Sidebar() {

    return (
        <Grid
            container
        sx={{
            position: "fixed",
            right:30,
            top: NAVBAR_HEIGHT,
            height:"90vh",
            width: 400,
            borderRadius: "20px",
            backgroundColor: "#464646",
            flexDirection: "column",
        }}
        >


        </Grid>
    )
};

