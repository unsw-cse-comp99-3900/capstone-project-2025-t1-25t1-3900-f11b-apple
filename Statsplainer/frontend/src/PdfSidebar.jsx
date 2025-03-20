import { PdfUpload } from "./PdfUpload";
import Sidebar from './Sidebar';

import { useEffect, useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';


export const PdfSidebar = ({ file }) => {
  const [aiTriggered, setAiTriggered] = useState(false);
  const [text, setText] = useState();
  const [chatType, setChatType] = useState("Definition");
  const [sendMessage, setSendMessage] = useState({});
  
  useEffect(() => {
    if (text) {
      setSendMessage({"chat" : chatType, "text" : text})
    }
    setText();
  }, [chatType, text])

  return (
    <>
      {!aiTriggered ? (
        <>
          <PdfUpload file={file} setText={setText}/>
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
            <PdfUpload file={file} setText={setText} />
          </Box>
          <Box>
            <Sidebar message={sendMessage} setChatType={setChatType}/>
          </Box>
        </Grid>
      )}
    </>
  );
};