import { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Typography, Button, Box, IconButton  } from '@mui/material';
import Grid from '@mui/material/Grid2';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Highlight } from "./Highlight";
import { apiCallPostText } from "./ApiCalls";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import HighlightAltRoundedIcon from '@mui/icons-material/HighlightAltRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';

import worker from "pdfjs-dist/build/pdf.worker?worker";
pdfjs.GlobalWorkerOptions.workerPort = new worker();

export const PdfUpload = ({ file, setSideBarTriggered, currentMode, addMessage }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageScale, setPageScale] = useState(1);
  const [lastHighlightPoint, setlastHighlightPoint] = useState(null);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [snipHighlightSwitch, setSnipHighlightSwitch] = useState("Highlight");
  const containerRef = useRef(null);
  const pageRef = useRef(null);
  const [isHorizontallyOverflowing, setIsHorizontallyOverflowing] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  
  const {
    highlights,
    currentHighlight,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    highlightedBoxes,
    highlightReset
  } = Highlight(containerRef, pageNumber, snipHighlightSwitch, pageScale, pageRef);

  useEffect(() => {
    if (highlights.length > 0) {
      if (snipHighlightSwitch === "Snip") {
        setConfirmPopup(true);
      } else if (highlights[0].boxes.length > 0) {
        setConfirmPopup(true);
      }
      setlastHighlightPoint({
        x: highlights[0].x,
        y: highlights[0].y,
        width: highlights[0].width,
        height: highlights[0].height
      });
    } else {
      setConfirmPopup(false);
    }
  }, [highlights]);

  useEffect(() => {
    highlightReset();
  }, [pageScale, numPages, snipHighlightSwitch])

  let width = 70;
  let height = 92;
  let containerWidth = width + 'vw';
  let containerHeight = height + 'vh';
  let windowWidth = window.innerWidth * (width / 100) * 0.9;

  const changePage = (newPageNumber) => {
    if (newPageNumber >= 1 && newPageNumber <= numPages) {
      setPageNumber(newPageNumber);
    }
  };
  const goToPreviousPage = () => changePage(pageNumber - 1);
  const goToNextPage = () => changePage(pageNumber + 1);

  const changeZoom = (delta) => {
      setPageScale((prevScale) => Math.max(0.5, Math.min(prevScale + delta, 3.0)));
  };
  const zoomIn = () => changeZoom(0.1);
  const zoomOut = () => changeZoom(-0.1);

  // Fix's zoom bug
  const onPageRenderSuccess = useCallback(() => {
    if (pageRef.current && containerRef.current) {
      const pageElementWidth = pageRef.current.clientWidth;
      const containerElementWidth = containerRef.current.clientWidth;
      const overflows = pageElementWidth > containerElementWidth + 1;
      // Only update state if it changes to prevent potential loops
      setIsHorizontallyOverflowing(prev => overflows !== prev ? overflows : prev);
    }
  }, []);

  return (
    <Grid sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightgrey', width: containerWidth, height: containerHeight}}>

      <Box 
        sx={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          alignItems: isHorizontallyOverflowing ? 'flex-start' : 'center',
          overflow: 'auto',
          width: '100%',
          height: '100%',
          userSelect: "none",
          padding: '1vh 0'
        }}
        onMouseDown={(e) => {setConfirmPopup(false); handleMouseDown(e);}}
        onMouseMove={handleMouseMove}
        onMouseUp={(e) => {setConfirmPopup(false); handleMouseUp(e);}}
        onScroll={highlightReset}
        ref={containerRef}
      >

        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          sx={{ display: 'flex', position: 'relative', flexDirection: 'column', alignItems: 'center', overflow: 'auto', width: '100%', height: '100%', userSelect: "none",}}
        >
          {numPages && (
            <Box
              key={`page_container_${pageNumber}`}
              ref={pageRef}
              sx={{ position: 'relative', boxShadow: '0px 4px 8px rgba(0,0,0,0.2)' }}
            >
              <Page
                pageNumber={pageNumber}
                scale={pageScale}
                width={windowWidth}
                onRenderSuccess={onPageRenderSuccess}
              />
             </Box>
          )}
        </Document>

        {currentHighlight && (
          <Box
            sx={{
              position: "absolute",
              border: "2px dashed rgba(0, 0, 255, 0.5)",
              borderRadius: 2,
              backgroundColor: "rgba(60, 60, 255, 0.1)",
              top: currentHighlight.y,
              left: currentHighlight.x,
              width: currentHighlight.width,
              height: currentHighlight.height,
            }}
          />
        )}

        {snipHighlightSwitch === "Highlight" && (//  This creates highlighting effect using element creation at word area. MUST be absolute
          highlightedBoxes.map((box, idx) => (
            <Box
              key={`highlighted-box-${idx}`}
              sx={{
                position: "absolute",
                top: box.y,
                left: box.x,
                width: box.width + (box.height * 0.1),
                height: box.height,
                backgroundColor: "rgba(0, 0, 255, 0.3)",
                borderRadius: 1,
              }}
            />))
        )}

      </Box>

      {confirmPopup && lastHighlightPoint && (
        <Box
          sx={{
            position: "absolute",
            border: "1px solid grey",
            borderRadius: 1,
            backgroundColor: "rgb(240, 240, 240)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: '4px',
            top: `${lastHighlightPoint.y - (containerRef.current?.scrollTop || 0) + lastHighlightPoint.height + 5}px`,
            left: `${lastHighlightPoint.x - (containerRef.current?.scrollLeft || 0) + lastHighlightPoint.width / 2 - 24}px`,
            zIndex: 100,
            boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
          }}
        >
          <IconButton
            size="small"
            sx={{ backgroundColor: "lightgreen", '&:hover': { backgroundColor: 'darkgreen'}}}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            onClick={() => {
              setConfirmPopup(false); 
              setSideBarTriggered(true);
              // Call result function, passing addMessage instead of setText
              result(highlights, file, addMessage, snipHighlightSwitch, currentMode);
            }}
          >
            <CheckRoundedIcon fontSize="small" sx={{ color: 'black'}}/>
          </IconButton>
        </Box>
      )}

      <Box sx={{ position: 'absolute', display: 'flex', gap: 1, zIndex: '10', top: '10px', left: '10px', backgroundColor: 'rgba(255,255,255,0.8)', padding: '4px', borderRadius: 1 }}>
         <IconButton size="small" onClick={() => setSnipHighlightSwitch("Highlight")} disabled={snipHighlightSwitch === "Highlight"} title="Highlight Text">
           <HighlightAltRoundedIcon color={snipHighlightSwitch === "Highlight" ? "primary" : "action"} />
         </IconButton>
         <IconButton size="small" onClick={() => setSnipHighlightSwitch("Snip")} disabled={snipHighlightSwitch === "Snip"} title="Snip Image">
           <PhotoCameraRoundedIcon color={snipHighlightSwitch === "Snip" ? "primary" : "action"} />
         </IconButton>
      </Box>
       <Box sx={{ position: 'absolute', display: 'flex', gap: 1, zIndex: '10', top: '10px', right: '10px', backgroundColor: 'rgba(255,255,255,0.8)', padding: '4px', borderRadius: 1 }}>
         <IconButton size="small" onClick={zoomIn} disabled={pageScale >= 3} title="Zoom In">
           <ZoomInRoundedIcon />
         </IconButton>
         <IconButton size="small" onClick={zoomOut} disabled={pageScale <= 0.5} title="Zoom Out">
           <ZoomOutRoundedIcon />
         </IconButton>
      </Box>

      {numPages && numPages > 1 && (
        <Box sx={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, width: 'auto', zIndex: '10', bottom: '10px', backgroundColor: 'rgba(255,255,255,0.8)', padding: '4px 8px', borderRadius: 1 }}>
          <IconButton size="small" onClick={goToPreviousPage} disabled={pageNumber <= 1} title="Previous Page">
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography variant="body2" sx={{ userSelect: 'none' }}>
            Page {pageNumber} of {numPages}
          </Typography>
          <IconButton size="small" onClick={goToNextPage} disabled={pageNumber >= numPages} title="Next Page">
            <ArrowForwardRoundedIcon />
          </IconButton>
        </Box>
      )}
    </Grid>
  );
};

// Update function signature to use addMessage
const result = async (highlights, file, addMessage, snipHighlightSwitch, currentMode) => {
  try {
    if (snipHighlightSwitch === "Highlight" && highlights.length > 0 && highlights[0].text) {
      const userText = highlights[0].text;
      const payload = {
        'highlighted_text': userText,
        'filename': file.name,
        'mode': currentMode
      };

      // 1. Add user's highlighted text to chat
      addMessage(prevMessages => [...prevMessages, { text: userText, sender: "user" }]);

      // 2. Call API for explanation
      apiCallPostText("explain-highlight", payload)
        .then(res => {
          // 3. Add AI's response to chat
          if (res && res.explanation) {
            addMessage(prevMessages => [...prevMessages, { text: res.explanation, sender: "AI" }]);
          } else {
            // Handle cases where explanation might be missing
             addMessage(prevMessages => [...prevMessages, { text: "Sorry, I couldn't get an explanation.", sender: "AI" }]);
          }
        })
        .catch(error => {
          console.error("API call failed:", error);
          // Add error message to chat
          addMessage(prevMessages => [...prevMessages, { text: "Error fetching explanation.", sender: "AI" }]);
        });

    } else if (snipHighlightSwitch === "Snip" && highlights.length > 0 && highlights[0].snippedImageDataUrl) {
      const imageUrl = highlights[0].snippedImageDataUrl;
      const base64String = imageUrl.split(',')[1];

      // Add the snipped image to the chat immediately
      addMessage(prevMessages => [...prevMessages, { sender: "user", type: "image", imageUrl: imageUrl }]);
      
      // Optional: Add a placeholder for the image snipping action if desired
      // addMessage(prevMessages => [...prevMessages, { text: "[Image Snipped]", sender: "user" }]);

      const payload = {
        'highlighted_text': 'image',
        'filename': file.name,
        'mode': currentMode,
        'image_base64': base64String
      };

      // Call API for image explanation (assuming '/explain-image' endpoint exists and works similarly)
      // NOTE: This part assumes an endpoint like 'explain-image' exists and accepts mode/filename if needed.
      // Adjust the endpoint and payload as necessary based on backend implementation for images.
      apiCallPostText("explain-highlight", payload) // Might need to change endpoint/payload
         .then(res => {
           if (res && res.explanation) {
             addMessage(prevMessages => [...prevMessages, { text: res.explanation, sender: "AI" }]);
           } else {
             addMessage(prevMessages => [...prevMessages, { text: "Sorry, I couldn't explain the image.", sender: "AI" }]);
           }
         })
         .catch(error => {
           console.error("Image API call failed:", error);
           addMessage(prevMessages => [...prevMessages, { text: "Error explaining image.", sender: "AI" }]);
         });
    }
  }
  catch (error) { console.error("Error in result function:", error); }
};
