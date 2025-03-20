import { PdfUpload } from "./PdfUpload";
import Sidebar from './Sidebar';

import { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';


export const PdfSidebar = ({ file }) => {
  const [aiTriggered, setAiTriggered] = useState(false);

  return (
    <>
      {!aiTriggered ? (
        <>
          <PdfUpload file={file} />
          <Button onClick={() => setAiTriggered(true)}>
              click
          </Button>
        </>
      ) : (
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box sx={{ flex: 1, paddingRight: '3vw' }}>
            <PdfUpload file={file} />
          </Box>
          <Box>
            <Sidebar message={{"Chat" : "Definition", "text" : "hello"}} />
          </Box>
        </Grid>
      )}
    </>
  );
};