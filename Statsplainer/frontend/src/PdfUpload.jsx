import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Typography, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import worker from "pdfjs-dist/build/pdf.worker?worker";
pdfjs.GlobalWorkerOptions.workerPort = new worker();

export const PdfUpload = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const pdfRef = useRef(null);

  const [pageScale, setPageScale] = useState(1);

  const onDocumentLoadSuccess = ({ numPages, pdf }) => {
    console.log(file)
    setNumPages(numPages);
    pdfRef.current = pdf;
  };

  let width = 53;
  let height = 82;

  let containerWidth = width + 'vw';
  let containerHeight = height + 'vh';
  let ButtonWidth = width - 10 +'vw';
  let ButtonHeight = '3vh';

  let windowWidth = window.innerWidth / 2.05;

  return (
    <Grid sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 7, width: containerWidth, height: containerHeight}}>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'scroll', width: '95%', height: '95%'}}>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => console.error("PDF load error:", err)}
          
        >
          <Page pageNumber={pageNumber}  scale={pageScale} width={windowWidth}/>
        </Document>
      </Box>

      <Box sx={{ position: 'absolute', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: ButtonWidth, height: ButtonHeight, zIndex: '10', top: '20px', right: '20px'}}>
        <button onClick={() => setPageScale((p) => Math.max(p - 0.1, 0.5))} disabled={pageScale <= 0.5}>
          Zoom out
        </button>
        <button onClick={() => setPageScale((p) => Math.min(p + 0.1, 2))} disabled={pageScale >= 2}>
          Zoom in
        </button>
      </Box>
      <Box sx={{ position: 'absolute', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: ButtonWidth, height: ButtonHeight, zIndex: '10', bottom: '20px', }}>
        <button onClick={() => setPageNumber((p) => Math.max(p - 1, 1))} disabled={pageNumber <= 1}>
          Previous
        </button>
        <button onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))} disabled={pageNumber >= numPages}>
          Next
        </button>
      </Box>
    </Grid>
  );
};
