import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Typography, Box, IconButton, CircularProgress } from '@mui/material';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

import worker from "pdfjs-dist/build/pdf.worker?worker";
pdfjs.GlobalWorkerOptions.workerPort = new worker();

// Fetch function to send highlighted text to backend
const sendHighlightToAI = async (highlightedText, pdfText) => {
  try {
    const response = await fetch('http://localhost:5000/explain-highlight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        highlighted_text: highlightedText,
        full_text: pdfText
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.explanation;
  } catch (error) {
    console.error("Error sending highlight to AI:", error);
    return "Sorry, there was an error processing your highlight.";
  }
};

// Extract text from PDF page
const extractTextFromPage = async (pdf, pageNum) => {
  try {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    return textContent.items.map(item => item.str).join(' ');
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "";
  }
};

// Extract text from entire PDF
const extractFullPDFText = async (pdf) => {
  try {
    const numPages = pdf.numPages;
    let fullText = "";
    
    for (let i = 1; i <= numPages; i++) {
      const pageText = await extractTextFromPage(pdf, i);
      fullText += pageText + " ";
    }
    
    return fullText.trim();
  } catch (error) {
    console.error("Error extracting full PDF text:", error);
    return "";
  }
};

export const PDFHighlighter = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageScale, setPageScale] = useState(1);
  const [pdfText, setPdfText] = useState("");
  const [highlightedText, setHighlightedText] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState("");
  const pdfRef = useRef(null);
  const containerRef = useRef(null);

  // Handle PDF load success
  const onDocumentLoadSuccess = async ({ numPages, pdf }) => {
    setNumPages(numPages);
    pdfRef.current = pdf;
    
    // Extract full PDF text for context
    const fullText = await extractFullPDFText(pdf);
    setPdfText(fullText);
  };

  // Handle text selection/highlighting
  const handleTextSelection = async () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && selectedText.length > 0) {
      setHighlightedText(selectedText);
      setIsExplaining(true);
      
      // Get explanation from AI
      const aiExplanation = await sendHighlightToAI(selectedText, pdfText);
      
      setExplanation(aiExplanation);
      setIsExplaining(false);
    }
  };

  // Add event listener for mouse up (text selection)
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseup', handleTextSelection);
      
      return () => {
        container.removeEventListener('mouseup', handleTextSelection);
      };
    }
  }, [pdfText]);

  // Calculate container dimensions
  const containerWidth = "53vw";
  const containerHeight = "82vh";
  const windowWidth = window.innerWidth / 2.05;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      {/* PDF Viewer */}
      <Box 
        ref={containerRef}
        sx={{ 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: 'white', 
          borderRadius: 7, 
          width: containerWidth, 
          height: containerHeight
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          overflow: 'scroll', 
          width: '95%', 
          height: '95%',
          position: 'relative'
        }}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => console.error("PDF load error:", err)}
          >
            <Page 
              pageNumber={pageNumber} 
              scale={pageScale} 
              width={windowWidth}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
          
          {/* Highlight instructional overlay - subtle hint at bottom */}
          {!highlightedText && (
            <Box 
              sx={{
                position: 'absolute',
                bottom: '60px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(31, 32, 35, 0.85)',
                padding: '6px 14px',
                borderRadius: '16px',
                color: 'white',
                zIndex: 5,
                pointerEvents: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                Highlight text for AI explanation
              </Typography>
            </Box>
          )}
        </Box>

        {/* Zoom Controls */}
        <Box sx={{ 
          position: 'absolute', 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'flex-end', 
          zIndex: 10, 
          top: '20px', 
          right: '20px',
          backgroundColor: 'rgba(31, 32, 35, 0.7)',
          borderRadius: '8px',
          padding: '2px'
        }}>
          <IconButton 
            onClick={() => setPageScale((p) => Math.max(p - 0.1, 0.5))} 
            disabled={pageScale <= 0.5}
            size="small"
            sx={{ color: 'white', m: 0.5 }}
          >
            <ZoomOutRoundedIcon />
          </IconButton>
          <IconButton 
            onClick={() => setPageScale((p) => Math.min(p + 0.1, 2))} 
            disabled={pageScale >= 2}
            size="small"
            sx={{ color: 'white', m: 0.5 }}
          >
            <ZoomInRoundedIcon />
          </IconButton>
        </Box>
        
        {/* Page Navigation */}
        <Box sx={{ 
          position: 'absolute', 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'center', 
          alignItems: 'center',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10, 
          bottom: '20px',
          backgroundColor: 'rgba(31, 32, 35, 0.8)',
          borderRadius: '20px',
          padding: '4px 12px'
        }}>
          <IconButton 
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))} 
            disabled={pageNumber <= 1}
            size="small"
            sx={{ color: 'white', mx: 1 }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography variant="body2" sx={{ color: 'white', mx: 2 }}>
            {pageNumber} / {numPages || '?'}
          </Typography>
          <IconButton 
            onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))} 
            disabled={pageNumber >= numPages}
            size="small"
            sx={{ color: 'white', mx: 1 }}
          >
            <ArrowForwardRoundedIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Explanation Panel - Always visible with improved typography */}
      <Box 
        sx={{ 
          width: '30vw',
          backgroundColor: '#37383C',
          borderRadius: '20px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          height: containerHeight,
          color: 'white',
          overflow: 'hidden'
        }}
      >
        {!highlightedText ? (
          // Default state - no selection yet
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            textAlign: 'center',
            padding: '0 20px'
          }}>
            <Typography variant="h5" sx={{ 
              mb: 3, 
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}>
              AI Explanation
            </Typography>
            <Typography variant="body1" sx={{ 
              mb: 4, 
              opacity: 0.8,
              lineHeight: 1.6,
              fontWeight: 300
            }}>
              Highlight any text in the document to receive a concise explanation
            </Typography>
            <Box sx={{ 
              width: '40%', 
              height: '1px', 
              backgroundColor: 'rgba(255,255,255,0.2)',
              mb: 4
            }} />
            <Typography variant="body2" sx={{ 
              opacity: 0.6,
              maxWidth: '80%',
              lineHeight: 1.5
            }}>
              The AI will analyze your selection within the context of the full document
            </Typography>
          </Box>
        ) : (
          // Selected text and explanation
          <>
            <Typography variant="h6" sx={{ 
              mb: 2,
              fontWeight: 600,
              letterSpacing: '0.3px'
            }}>
              Selected Text
            </Typography>
            
            <Box 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '12px 16px',
                borderRadius: '10px',
                mb: 3,
                borderLeft: '3px solid #0A85FF'
              }}
            >
              <Typography variant="body1" sx={{
                fontFamily: "'Roboto', sans-serif",
                fontStyle: 'italic',
                lineHeight: 1.5
              }}>
                "{highlightedText}"
              </Typography>
            </Box>
            
            <Typography variant="h6" sx={{ 
              mb: 2,
              fontWeight: 600,
              letterSpacing: '0.3px'
            }}>
              Explanation
            </Typography>
            
            <Box 
              sx={{ 
                flex: 1,
                backgroundColor: '#4B4C50',
                borderRadius: '10px',
                padding: '16px 20px',
                overflow: 'auto'
              }}
            >
              {isExplaining ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress color="inherit" size={30} thickness={4} />
                  <Typography variant="body1" sx={{ ml: 2, fontWeight: 300 }}>
                    Generating explanation...
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body1" sx={{
                  lineHeight: 1.7,
                  fontWeight: 300,
                  letterSpacing: '0.2px'
                }}>
                  {explanation}
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default PDFHighlighter;
