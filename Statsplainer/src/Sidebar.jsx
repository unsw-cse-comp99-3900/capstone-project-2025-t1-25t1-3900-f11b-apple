import { Paper, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {useState} from "react";

// Sidebar Function

//update here where the border of the side bar starts
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
                p: 2,
            }}
            spacing={2}
        >
        {/* response section */}

        <Grid
            item
            sx={{
                flex: 1,
                overflowY: "auto",
                backgroundColor: '#464646',
                borderRadius: "inherit",
                height: "inherit",
                
            }}
        >
            <Paper 
                sx={{
                    height: "inherit"
                }}>
                
                response section ...
            </Paper>

        </Grid>

        {/* chat box input section */}
        <Grid item 
            sx={{
                backgroundColor: "#ddd",
                borderRadius : "10px",
            }}>            
            <TextField
                fullWidth
                placeholder="Ask Anything"
                variant="outlined"
            />
        </Grid>


        </Grid>
    )
};

