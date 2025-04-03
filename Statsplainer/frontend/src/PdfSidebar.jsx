import { PdfUpload } from "./PdfUpload";
import Sidebar from './Sidebar';

import { useEffect, useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';


export const PdfSidebar = ({ file }) => {
  const [aiTriggered, setAiTriggered] = useState(false);
  const [highlightData, setHighlightData] = useState({}); // Stores { text: '...', filename: '...' }
  const [chatType, setChatType] = useState("Definition");
  const [sendMessage, setSendMessage] = useState({});
  
  useEffect(() => {
    if (highlightData && highlightData.text && highlightData.filename && chatType) {
      console.log(`Making API call for type: ${chatType}, file: ${highlightData.filename}`); // Debug log

      const requestBody = {
        highlighted_text: highlightData.text,
        filename: highlightData.filename,
        prompt_type: chatType
      };

      // Optional: Set a loading message
      setSendMessage({ chat: chatType, text: `Getting ${chatType} explanation...` });

      fetch(`http://localhost:5000/explain-highlight`, { // Adjust URL/port if needed
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error || `HTTP error! status: ${response.status}`) });
        }
        return response.json();
      })
      .then(data => {
        if (data.explanation) {
          setSendMessage({ chat: chatType, text: data.explanation });
        } else {
          console.error("Error from backend:", data.error);
          setSendMessage({ chat: chatType, text: `Error: ${data.error || 'Could not get explanation'}` });
        }
      })
      .catch(error => {
        console.error("API Call Failed:", error);
        setSendMessage({ chat: chatType, text: `Error: ${error.message || 'Could not reach backend.'}` });
      })
      .finally(() => {
         // Reset highlightData to prevent re-triggering
         setHighlightData({});
      });
    }
  }, [highlightData, chatType]); // Dependencies for the effect

  return (
    <>
      {!aiTriggered ? (
        <>
          <PdfUpload file={file} onTextHighlighted={setHighlightData} />
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
            <PdfUpload file={file} onTextHighlighted={setHighlightData} />
          </Box>
          <Box>
            <Sidebar message={sendMessage} setChatType={setChatType}/>
          </Box>
        </Grid>
      )}
    </>
  );
};
