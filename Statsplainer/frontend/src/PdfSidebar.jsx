import { PdfUpload } from "./PdfUpload";
import Sidebar from './Sidebar';

import { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';


export const PdfSidebar = ({ file }) => {
  const [sideBarTriggered, setSideBarTriggered] = useState(false);
  const [chatType, setChatType] = useState("Definition"); // Mode selected

  // Lifted state for chat messages
  const [messageDefinition, setMessageDefinition] = useState([]);
  const [messageRealWorldAnalogy, setMessageRealWorldAnalogy] = useState([]);
  const [messageELI5, setMessageELI5] = useState([]);

  // Function to get the correct setter based on chatType
  const getAddMessageFunc = () => {
    if (chatType === "Definition") return setMessageDefinition;
    if (chatType === "Real world analogy") return setMessageRealWorldAnalogy;
    if (chatType === "ELI5") return setMessageELI5;
    return setMessageDefinition; // Default
  };

  return (
    <>
      {!sideBarTriggered ? (
        <>
          <PdfUpload file={file} setSideBarTriggered={setSideBarTriggered} currentMode={chatType} addMessage={getAddMessageFunc()} />
        </>
      ) : (
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box sx={{ flex: 1}}>
            <PdfUpload file={file} setSideBarTriggered={setSideBarTriggered} currentMode={chatType} addMessage={getAddMessageFunc()} />
          </Box>
          <Box>
            <Sidebar
              setChatType={setChatType}
              activePdfFilename={file?.name}
              // Pass down state arrays and setters
              messageDefinition={messageDefinition}
              setMessageDefinition={setMessageDefinition}
              messageRealWorldAnalogy={messageRealWorldAnalogy}
              setMessageRealWorldAnalogy={setMessageRealWorldAnalogy}
              messageELI5={messageELI5}
              setMessageELI5={setMessageELI5}
            />
          </Box>
        </Grid>
      )}
    </>
  );
};
