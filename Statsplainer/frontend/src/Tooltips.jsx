import { Box, Button, Paper, TextField, Snackbar, Slide, Typography } from '@mui/material';
import {useState, useRef, useEffect} from "react";

// tooltip bubble function that create a rectangular bubble with a
// dismiss button to guide through the user what each component does and how to interact with.
// takes in three parameter to manage the state of the tooltips whether we open it or close it. and assign a target component to it
export default function Tooltip ({targetRef, open, onClose}) {
    onClose = false
    return (
        <Snackbar
            open={open}
            onClose={onClose}
            anchorOrigin={{vertical:"top", horizontal: "right"}}
            message={
                <Box
                >
                    <Typography>
                        tooltip message !!!!
                    </Typography>

                </Box>
            }
        >
            

        </Snackbar>
    )
}