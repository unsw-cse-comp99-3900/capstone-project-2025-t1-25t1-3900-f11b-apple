import { Box, Button, Paper, TextField, Snackbar, Slide, Typography } from '@mui/material';
import {useState, useRef, useEffect} from "react";

// tooltip bubble function that create a rectangular bubble with a
// dismiss button to guide through the user what each component does and how to interact with.
// takes in three parameter to manage the state of the tooltips whether we open it or close it. and assign a target component to it
const Tooltip = ({targetRef, open, onCLose}) => {


    return (
        <Snackbar>
            <Typography>
                tooltip message !!!!
            </Typography>

        </Snackbar>
    )
}