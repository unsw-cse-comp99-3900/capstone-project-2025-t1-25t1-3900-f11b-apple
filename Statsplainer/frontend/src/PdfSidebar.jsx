import { PdfUpload } from "./PdfUpload";
import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Tooltip from './Tooltips';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { apiCallPostText } from './ApiCalls'; // Import API call function

export const PdfSidebar = ({ file, setTaskCompletion }) => {
  const [sideBarTriggered, setSideBarTriggered] = useState(false);
  const [chatType, setChatType] = useState("Definition"); // Mode selected
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  // Lifted state for chat messages
  const [messageDefinition, setMessageDefinition] = useState([]);
  const [messageRealWorldAnalogy, setMessageRealWorldAnalogy] = useState([]);
  const [messageELI5, setMessageELI5] = useState([]);

  // used for tracking between
  const [modeCompletion, setModeCompletion] = useState(false);
  const [highlightCompletion, setHighlightCompletion] = useState(1);

  // passed into pdfupload to execute when something is highlighted
  const highlightCompletionFunc = () => {
    setHighlightCompletion(highlightCompletion + 1);
    setModeCompletion(false);
    setChatTaskArray([chatType]);
  }

  // tracks if user has gone into every mode
  const [chatTaskArray, setChatTaskArray] = useState([chatType]);

  // 1 highlight, all modes have been checked, another highlight, all modes checked again
  // passes true value back to route file to render feedback popup
  useEffect(() => {
    var temp = chatTaskArray.length;
    if (!chatTaskArray.includes(chatType)) {
      setChatTaskArray(prevArray => [...prevArray, chatType]);
      temp += 1;
    } 
    if (temp === 3 && highlightCompletion !== 2) {
      setModeCompletion(true);
    } else if (temp === 3) {
      setTaskCompletion(true);
    }
  }, [chatType]);

  localStorage.setItem("hasSeenTour", "false");

  //set tooltips state
  const [open,setOpen] = useState(false);

  //handle open/close tooltip
  const handleOpenTooltip = () => setOpen(true);
  const handleCloseTooltip = () => setOpen(false);

  useEffect (() => {
      const hasSeenTour = localStorage.getItem("hasSeenTour");
      console.log(hasSeenTour);
      if (hasSeenTour === "false") {
          handleOpenTooltip();
          localStorage.setItem("hasSeenTour", "true");
      }
  }, []);

  // Function to get the correct setter based on chatType
  // const getAddMessageFunc = () => {
  //   if (chatType === "Definition") return setMessageDefinition;
  //   if (chatType === "Real world analogy") return setMessageRealWorldAnalogy;
  //   if (chatType === "ELI5") return setMessageELI5;
  //   return setMessageDefinition; // Default
  // };

  // Function to handle PDF highlight/snip and send to all modes
  const handlePdfHighlight = async (highlightData) => {
    if (!file || !file.name) {
      console.error("No active file to send highlight from.");
      return;
    }

    let userMessage;
    let basePayload = { filename: file.name };
    let isImage = false;

    if (highlightData.type === 'text' && highlightData.text) {
      console.log("Handling PDF Text Highlight:", highlightData.text);
      userMessage = { text: highlightData.text, sender: "user" };
      basePayload.highlighted_text = highlightData.text;
    } else if (highlightData.type === 'image' && highlightData.imageUrl) {
      console.log("Handling PDF Image Snip");
      isImage = true;
      userMessage = { sender: "user", type: "image", imageUrl: highlightData.imageUrl };
      basePayload.highlighted_text = 'image'; // Indicate image type
      basePayload.image_base64 = highlightData.imageUrl.split(',')[1]; // Extract base64
    } else {
      console.error("Invalid highlight data received:", highlightData);
      return; // Exit if data is not usable
    }

    // Add user message to all chat states immediately
    setMessageDefinition(prev => [...prev, userMessage]);
    setMessageRealWorldAnalogy(prev => [...prev, userMessage]);
    setMessageELI5(prev => [...prev, userMessage]);

    setIsLoading(true);

    const modes = ["Definition", "Real world analogy", "ELI5"];
    const setters = [setMessageDefinition, setMessageRealWorldAnalogy, setMessageELI5];

    const requests = modes.map(mode => {
      const payload = { ...basePayload, mode: mode };
      // Use the same endpoint for now, assuming backend handles 'image' text
      return apiCallPostText("explain-highlight", payload);
    });

    try {
      const results = await Promise.all(requests);
      results.forEach((res, index) => {
        const aiMessage = { sender: "AI", text: res?.explanation || (isImage ? "Sorry, I couldn't explain the image." : "Sorry, I couldn't get an explanation.") };
        setters[index](prevMessages => [...prevMessages, aiMessage]);
      });
    } catch (error) {
      console.error("Error fetching explanations for PDF highlight:", error);
      const errorMessage = { sender: "AI", text: "Sorry, an error occurred fetching explanations." };
      setMessageDefinition(prev => [...prev, errorMessage]);
      setMessageRealWorldAnalogy(prev => [...prev, errorMessage]);
      setMessageELI5(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  let containerHeight = '92vh';

  return (
    <>
      {!sideBarTriggered ? (
        <Box sx={{ width: '100vw', height: containerHeight }}>
          {/* Pass handlePdfHighlight even when sidebar isn't triggered yet,
              though the confirmation button won't appear until highlight */}
          {/* <PdfUpload file={file} setSideBarTriggered={setSideBarTriggered} onHighlightConfirm={handlePdfHighlight} setIsLoading={setIsLoading} /> */}
          <PdfUpload file={file} setSideBarTriggered={setSideBarTriggered} onHighlightConfirm={handlePdfHighlight} setIsLoading={setIsLoading} highlightCompletionFunc={highlightCompletionFunc} modeCompletion={modeCompletion}/>
        </Box>
      ) : (
        <Box sx={{ width: '100vw', height: containerHeight }}>
          <PanelGroup direction="horizontal">
            <Panel
              defaultSize={70}
              minSize={30}
              order={1}
              style={{ overflow: 'hidden' }}
            >
              {/* Pass handlePdfHighlight here as well */}
              <PdfUpload file={file} setSideBarTriggered={setSideBarTriggered} onHighlightConfirm={handlePdfHighlight} setIsLoading={setIsLoading} highlightCompletionFunc={highlightCompletionFunc} modeCompletion={modeCompletion}/>
            </Panel>

            <PanelResizeHandle
              style={{ width: '6px', background: '#e0e0e0', cursor: 'col-resize', borderLeft: '1px solid #bdbdbd', borderRight: '1px solid #bdbdbd' }}
            />

            <Panel
              defaultSize={30}
              minSize={20}
              maxSize={50}
              order={2}
              style={{ overflow: 'hidden' }}
            >
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
                  // Pass loading state and setter
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
          </Panel>
          </PanelGroup>
        </Box>
      )}
      <Tooltip state= "highlight" open={open} handleClose={handleCloseTooltip}/>
    </>
  );
};
