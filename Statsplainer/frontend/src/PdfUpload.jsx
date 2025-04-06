import { useState, useRef, useEffect } from "react";
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
import { apiCallPostText, apiCallPost } from "./ApiCalls";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import HighlightAltRoundedIcon from '@mui/icons-material/HighlightAltRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';

import worker from "pdfjs-dist/build/pdf.worker?worker";
pdfjs.GlobalWorkerOptions.workerPort = new worker();

export const PdfUpload = ({ file, setText, setSideBarTriggered }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageScale, setPageScale] = useState(1);
  const [lastHighlightPoint, setlastHighlightPoint] = useState(null);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [snipHighlightSwitch, setSnipHighlightSwitch] = useState("Highlight");
  const containerRef = useRef(null);

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
  } = Highlight(containerRef, pageNumber, snipHighlightSwitch, pageScale);

  // turn this into an onclick on popup to conrfirm
  // useEffect(() => {
  //   if (highlights.length > 0) {
  //     const result = async () => {try { const explanation = await apiCallPostText("explain-highlight", { 'highlighted_text': highlights[0].text, 'filename': file.name }); setText(explanation.explanation); } catch (error) { console.log(error);}};
  //     setText(highlights[0].text);
  //     result()
  //   }
  // }, [file.name, highlights, setText]);

  useEffect(() => {
    if (highlights.length > 0) {
      if (snipHighlightSwitch === "Snip") {
        console.log(highlights)
        setConfirmPopup(true);
      } else if (highlights[0].boxes.length > 0) {
        console.log(highlights)
        setConfirmPopup(true);
      }
    } else {
      setConfirmPopup(false);
    }
  }, [highlights]);

  useEffect(() => {
    highlightReset();
  }, [pageScale, numPages, snipHighlightSwitch])
  
  let width = 53;
  let height = 82;
  let containerWidth = width + 'vw';
  let containerHeight = height + 'vh';
  let ButtonWidth = width - 10 +'vw';
  let ButtonHeight = '3vh';
  let windowWidth = window.innerWidth / 2.05;

  return (
    <Grid sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 7, width: containerWidth, height: containerHeight}}>

      <Box 
        sx={{ display: 'flex', position: 'relative', flexDirection: 'column', alignItems: 'center', overflow: 'scroll', width: '95%', height: '95%', userSelect: "none",}}
        onMouseDown={(e) => {setConfirmPopup(false); handleMouseDown(e);}}
        onMouseMove={handleMouseMove}
        onMouseUp={(e) => {setConfirmPopup(false); setlastHighlightPoint(currentHighlight); handleMouseUp(e);}}
        onScroll={highlightReset}
        ref={containerRef}
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => console.error("PDF load error:", err)}
        >
          <Page pageNumber={pageNumber}  scale={pageScale} width={windowWidth}/>
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

      {confirmPopup && (highlights.length > 0 || snipHighlightSwitch === "Snip") && (
        <Box
          sx={{
            position: "absolute",
            border: "2px solid rgba(0, 0, 0, 0.5)",
            borderRadius: 2,
            backgroundColor: "rgb(80, 80, 80)",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            top: lastHighlightPoint.y - containerRef.scrollTop + lastHighlightPoint.height -  + 5,
            left: lastHighlightPoint.x - containerRef.scrollLeft + (lastHighlightPoint.width / 2 - (8 * window.innerWidth) / 200),
            width: "8vw",
            height: "5vh",
            zIndex: 1000
          }}
        >
          <IconButton 
            sx={{backgroundColor: "green"}}
            onMouseDown={(e) => e.stopPropagation()} // Stop all mouse events from reaching container
            onMouseUp={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
          >
            <CheckRoundedIcon onClick={(e) => {
              e.stopPropagation(); 
              console.log('check'); 
              setConfirmPopup(false); 
              setSideBarTriggered(true);
              setText(highlights[0].text);
              result(highlights, file, setText)
            }}/>
          </IconButton>
        </Box>
      )}

      <Box sx={{ position: 'absolute', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: ButtonWidth, height: ButtonHeight, zIndex: '10', top: '20px', left: '20px'}}>
        <IconButton onClick={() => {setSnipHighlightSwitch("Highlight");}} disabled={snipHighlightSwitch === "Highlight"}>
          <HighlightAltRoundedIcon />
        </IconButton>
        <IconButton onClick={() => {setSnipHighlightSwitch("Snip");}} disabled={snipHighlightSwitch === "Snip"}>
          <PhotoCameraRoundedIcon />
        </IconButton>
      </Box>

      <Box sx={{ position: 'absolute', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: ButtonWidth, height: ButtonHeight, zIndex: '10', top: '20px', right: '20px'}}>
        <IconButton onClick={() => setPageScale((p) => Math.min(p + 0.1, 2))} disabled={pageScale >= 2}>
          <ZoomInRoundedIcon />
        </IconButton>
        <IconButton onClick={() => setPageScale((p) => Math.max(p - 0.1, 0.5))} disabled={pageScale <= 0.5}>
          <ZoomOutRoundedIcon />
        </IconButton>
      </Box>
      <Box sx={{ position: 'absolute', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: ButtonWidth, height: ButtonHeight, zIndex: '10', bottom: '20px', }}>
        <IconButton onClick={() => setPageNumber((p) => Math.max(p - 1, 1))} disabled={pageNumber <= 1}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <IconButton onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))} disabled={pageNumber >= numPages}>
          <ArrowForwardRoundedIcon />
        </IconButton>
      </Box>
    </Grid>
  );
};

const result = async (highlights, file, setText, snipHighlightSwitch) => {
  try { 
    if (snipHighlightSwitch === "Highlight") {
      const explanation = await apiCallPostText("explain-highlight", { 'highlighted_text': highlights[0].text, 'filename': file.name }); 
      setText(explanation.explanation); 
    } else if (snipHighlightSwitch === "Snip") {
      const explanation = await apiCallPost('upload-PDF', highlights[0].snippedImageDataUrl);
      setText(explanation.explanation); 
    }
  } 
  catch (error) { console.log(error);}
};
              