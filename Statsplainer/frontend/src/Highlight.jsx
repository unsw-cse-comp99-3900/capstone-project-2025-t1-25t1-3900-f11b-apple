import { useRef, useState, useEffect } from "react";
import html2canvas from 'html2canvas';

export const Highlight = (containerRef, pageNumber, snipHighlightSwitch, scale, pageRef ) => {
  // Needed for handleMouseDown to keep in down state
  const isDrawing = useRef(false);
  // Tracks start of highlight box drag point
  const startPoint = useRef({ x: 0, y: 0 });
  // Interim highlight state keeps track of most recent highlight information, needed for mouseUp to extract desired info
  const [currentHighlight, setCurrentHighlight] = useState(null);
  // Highlight information used for extracting info and sending back to PdfUplaod
  const [highlights, setHighlights] = useState([]);
  // Needed for pdf information extraction
  const [textLayerElements, setTextLayerElements] = useState([]);
  // Keeps track of words to be highlighted within Highlighting box
  const [highlightedBoxes, setHighlightedBoxes] = useState([]);
  // Used for highlight cleaning when transitioning to different page states
  const highlightReset = () => {
    setCurrentHighlight(null);
    setHighlightedBoxes([]);
    setHighlights([]);
  }

  const handleMouseDown = (e) => {
    highlightReset();
    const containerRect = containerRef.current.getBoundingClientRect();
    isDrawing.current = true;
    const x = e.clientX - containerRect.left + containerRef.current.scrollLeft;
    const y = e.clientY - containerRect.top + containerRef.current.scrollTop;
    startPoint.current = { x, y };
    setCurrentHighlight({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - containerRect.left + containerRef.current.scrollLeft;
    const currentY = e.clientY - containerRect.top + containerRef.current.scrollTop;

    const width = currentX - startPoint.current.x;
    const height = currentY - startPoint.current.y;

    if (Math.abs(width) == 1 || Math.abs(height) == 1) return;

    const newHighlight = {
      x: Math.min(startPoint.current.x, currentX),
      y: Math.min(startPoint.current.y, currentY),
      width: Math.abs(width),
      height: Math.abs(height),
    };
    const { boxes } = extractWordsAndBoxes(newHighlight);
    setHighlightedBoxes(boxes);
    setCurrentHighlight(newHighlight);
  };

  const handleMouseUp = async () => {
    isDrawing.current = false;

    if (!currentHighlight || currentHighlight.width < 5 || currentHighlight.height < 5) {
      setCurrentHighlight(null);
      setHighlightedBoxes([]);
      return;
    }

    if (snipHighlightSwitch === "Highlight") {
      const { text, boxes } = extractWordsAndBoxes(currentHighlight);
      const newHighlight = { ...currentHighlight, text, boxes };
      setHighlights([newHighlight]);
    }

    const finalHighlightRect = { ...currentHighlight };

    if (snipHighlightSwitch === "Snip") {
      if (!pageRef || !pageRef.current || !containerRef.current) {
         setHighlights([]);
         return;
      }

      try {
        const targetPageElement = pageRef.current;

        if (!targetPageElement) {
             setHighlights([]);
             return;
        }

        const cropX = finalHighlightRect.x - targetPageElement.offsetLeft;
        const cropY = finalHighlightRect.y - targetPageElement.offsetTop;
        const cropWidth = finalHighlightRect.width;
        const cropHeight = finalHighlightRect.height;

        const pageCanvas = await html2canvas(targetPageElement, {
          useCORS: true,
          logging: true,
          scale: scale,
          scrollX: 0,
          scrollY: 0,
          windowWidth: targetPageElement.scrollWidth,
          windowHeight: targetPageElement.scrollHeight,
          backgroundColor: '#ffffff'
        });

        const croppedCanvas = document.createElement('canvas');

        croppedCanvas.width = Math.max(1, cropWidth * scale);
        croppedCanvas.height = Math.max(1, cropHeight * scale);

        const ctx = croppedCanvas.getContext('2d');
        if (!ctx) {
            setHighlights([]);
            return;
        }

         const sourceX = Math.max(0, cropX * scale);
         const sourceY = Math.max(0, cropY * scale);
         const sourceWidth = Math.max(0, Math.min(cropWidth * scale, pageCanvas.width - sourceX));
         const sourceHeight = Math.max(0, Math.min(cropHeight * scale, pageCanvas.height - sourceY));

         croppedCanvas.width = sourceWidth;
         croppedCanvas.height = sourceHeight;

        // Checks valid dimension then generates image
        if (sourceWidth > 0 && sourceHeight > 0) {
            ctx.drawImage(
                pageCanvas,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                0,
                0,
                sourceWidth,
                sourceHeight
            );

            const snippedImageDataUrl = croppedCanvas.toDataURL('image/png');
            console.log(snippedImageDataUrl)

            const newHighlightData = {
                x: finalHighlightRect.x,
                y: finalHighlightRect.y,
                width: finalHighlightRect.width,
                height: finalHighlightRect.height,
                snippedImageDataUrl
            };
            setHighlights([newHighlightData]);
        } else {
             setHighlights([]);
        }
      } catch (error) {
        console.log(error);
        setHighlights([]);
      }
    }
    
    setCurrentHighlight(null);
  };
  
  /*
    Gets all span information from page in pdf: text within, location, etc
    splits words to be used for exact word capturing and their information
    Used for inner word highlighting and text exctraction
  */
  const extractWordsAndBoxes = (highlight) => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const extractedWords = [];
    const wordBoxes = [];
  
    textLayerElements.forEach((el) => {
      const text = el.textContent;
      const textNode = el.firstChild;
  
      if (!text || !textNode || textNode.nodeType !== Node.TEXT_NODE) return;
  
      const fullText = textNode.textContent;
      const maxOffset = fullText.length;
  
      const words = text.split(/\s+/);
      let searchStart = 0;
  
      words.forEach((word) => {
        const trimmedWord = word.trim();
        if (!trimmedWord) return;
  
        const wordIndex = fullText.indexOf(trimmedWord, searchStart);
        if (wordIndex === -1 || wordIndex >= maxOffset) return;
  
        try {
          const range = document.createRange();
  
          // Ensure start and end offsets are within bounds
          const startOffset = Math.max(0, Math.min(wordIndex, maxOffset));
          const endOffset = Math.max(0, Math.min(wordIndex + trimmedWord.length, maxOffset));
  
          // Only proceed if the range is valid
          if (startOffset < endOffset) {
            range.setStart(textNode, startOffset);
            range.setEnd(textNode, endOffset);
  
            const wordRect = range.getBoundingClientRect();
  
            const wordLeft = wordRect.left + containerRef.current.scrollLeft - containerRect.left;
            const wordTop = wordRect.top + containerRef.current.scrollTop - containerRect.top;
            const wordRight = wordLeft + wordRect.width;
            const wordBottom = wordTop + wordRect.height;
  
            const isOverlapping =
              wordRight > highlight.x &&
              wordLeft < highlight.x + highlight.width &&
              wordBottom > highlight.y &&
              wordTop < highlight.y + highlight.height;
  
            if (isOverlapping) {
              extractedWords.push(trimmedWord);
              wordBoxes.push({
                text: trimmedWord,
                x: wordLeft,
                y: wordTop,
                width: wordRect.width,
                height: wordRect.height,
              });
            }
          }
  
          // Advance search start index so we don't re-match same word
          searchStart = wordIndex + trimmedWord.length;
        } catch (err) {
          console.warn("Range error:", err.message);
        }
      });
    });
  
    return {
      text: extractedWords.join(" ").trim(),
      boxes: wordBoxes,
    };
  };
      

  useEffect(() => {
    const interval = setInterval(() => {
      const elements = Array.from(
        containerRef.current?.querySelectorAll(".react-pdf__Page__textContent span") || []
      );
      setTextLayerElements(elements);
    }, 500);
    return () => clearInterval(interval);
  }, [containerRef, pageNumber]);

  return {
    highlights,
    currentHighlight,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    highlightedBoxes,
    highlightReset
  };
};

