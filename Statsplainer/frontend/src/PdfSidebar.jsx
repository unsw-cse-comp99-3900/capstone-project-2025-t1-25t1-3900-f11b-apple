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

  const highlightCompletionFunc = () => {
    setHighlightCompletion(highlightCompletion + 1);
    setModeCompletion(false);
    setChatTaskArray([chatType]);
  }

  // tracks if user has gone into every mode
  const [chatTaskArray, setChatTaskArray] = useState([chatType]);

  useEffect(() => {
    console.log(highlightCompletion)
    if (!chatTaskArray.includes(chatType)) {
      setChatTaskArray(prevArray => [...prevArray, chatType]);
    } else if (chatTaskArray.length === 3 && highlightCompletion !== 2) {
      setModeCompletion(true);
    } else if (chatTaskArray.length === 3) {
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
  const getAddMessageFunc = () => {
    if (chatType === "Definition") return setMessageDefinition;
    if (chatType === "Real world analogy") return setMessageRealWorldAnalogy;
    if (chatType === "ELI5") return setMessageELI5;
    return setMessageDefinition; // Default
  };

  let containerHeight = '92vh';

  return (
    <>
      {!sideBarTriggered ? (
        <Box sx={{ width: '100vw', height: containerHeight }}>
          <PdfUpload file={file} setSideBarTriggered={setSideBarTriggered} currentMode={chatType} addMessage={getAddMessageFunc()} setIsLoading={setIsLoading} highlightCompletionFunc={highlightCompletionFunc} modeCompletion={modeCompletion}/>
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
              <PdfUpload file={file} setSideBarTriggered={setSideBarTriggered} currentMode={chatType} addMessage={getAddMessageFunc()} setIsLoading={setIsLoading} highlightCompletionFunc={highlightCompletionFunc} modeCompletion={modeCompletion}/>
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
