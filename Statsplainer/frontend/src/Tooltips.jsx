import { Box, Button, Paper, TextField, Snackbar, Slide, Typography } from '@mui/material';
import {useState, useRef, useEffect} from "react";
import Grid from '@mui/material/Grid2';

// tooltip bubble function that create a rectangular bubble with a
// dismiss button to guide through the user what each component does and how to interact with.
// takes in three parameter to manage the state of the tooltips whether we open it or close it. and assign a target component to it
export default function Tooltip ({targetRef, open, handleClose}) {
    return (
        <Snackbar
            open={open}
            onClose={handleClose}
            anchorOrigin={{vertical:"top", horizontal: "left"}}


            sx={{
                backgroundColor: "grey",
                borderRadius: "10px",
                minHeight: "10vh",
                width: "25vw",
                p:2,
                boxShadow:10,
            }}          
        >
        <Slide in={open} direction="down">
            <Grid 
                sx={{
                    minWidth: "auto",
                    minHeight: "auto",
                    alignItems: "flex-start",
                }}
            
            >
                {/* arrow pointing to the component*/}
                

                {/* tooltips message */}
                <Typography 
                    sx={{
                        wordBreak: 'break-word',
                        pb:1,
                    }}
                >
                    tooltip message !!!! will change to a variabledwa dawd ad wdw wdaiodaoidkioa dwaidjoawd
                </Typography>

                {/* Dismiss button */}
                <Button
                    size="small"
                    onClick={handleClose}
                    
                    sx={{
                        backgroundColor:"lightblue",
                        alignSelf:"flex-end",
                        }}
                >
                    Dismiss

                </Button>
                
            </Grid>
            </Slide>
        </Snackbar>
    )
}