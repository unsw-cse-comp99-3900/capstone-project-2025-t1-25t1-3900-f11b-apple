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
            right:0,
            top: NAVBAR_HEIGHT,
            height:"100vh",
            width: 400,
            borderLeft: "2px solid #ddd",
            backgroundColor: "#fff",
            flexDirection: "column",
        }}
        >


        </Grid>
    )
};

