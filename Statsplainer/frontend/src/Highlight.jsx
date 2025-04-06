import { useRef, useState, useEffect } from "react";

export const Highlight = (containerRef, pageNumber, snipHighlightSwitch, scale) => {
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
  // Keeps track of canvas layer to snip images
  const [canvasLayerElements, setCanvasLayerElements] = useState();
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

    console.log(currentHighlight)

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

    if (snipHighlightSwitch === "Snip") {
      const canvas = canvasLayerElements;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      // Calculate scale based on canvas intrinsic bitmap vs displayed size
      // Use canvasRect dimensions for potentially more accurate displayed size
      const scaleX = canvas.width / canvasRect.width;
      const scaleY = canvas.height / canvasRect.height;

      const { x: highlightX_container, y: highlightY_container, width: layoutWidth, height: layoutHeight } = currentHighlight;

      // Calculate the canvas's offset within the container's scrollable content box
      const canvasOffsetX = canvasRect.left - containerRect.left + containerRef.current.scrollLeft;
      const canvasOffsetY = canvasRect.top - containerRect.top + containerRef.current.scrollTop;

      // Calculate the highlight's position relative to the canvas's displayed top-left corner
      const highlightX_canvas = highlightX_container - canvasOffsetX;
      const highlightY_canvas = highlightY_container - canvasOffsetY;

      // Convert highlight coordinates from canvas display coordinates to canvas bitmap coordinates
      const bitmapX = highlightX_canvas * scaleX;
      const bitmapY = highlightY_canvas * scaleY;
      const bitmapWidth = layoutWidth * scaleX; // Width/Height are based on the selection size in the displayed coordinate system
      const bitmapHeight = layoutHeight * scaleY;

      // Create temp canvas with the calculated bitmap dimensions
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = Math.max(1, bitmapWidth); // Ensure minimum 1px dimension
      tempCanvas.height = Math.max(1, bitmapHeight);

      const tempCtx = tempCanvas.getContext('2d');

      // Ensure source coordinates/dimensions for drawImage are valid and within canvas bounds
      const sx = Math.max(0, bitmapX);
      const sy = Math.max(0, bitmapY);
      // Clamp source width/height to not exceed canvas boundaries from the start point
      const sw = Math.max(0, Math.min(bitmapWidth, canvas.width - sx));
      const sh = Math.max(0, Math.min(bitmapHeight, canvas.height - sy));

      // if sh gets too large then taking snip of whole screen cuts off
      const dh = Math.min(1000, Math.min(bitmapHeight, canvas.height - sy))

      if (sw > 0 && sh > 0) {
          tempCtx.drawImage(
              canvas,
              sx, sy, sw, sh, // Source rectangle (from bitmap)
              0, 0, sw, dh   // Destination rectangle (on temp canvas, starting at 0,0)
          );
          const snippedImageDataUrl = tempCanvas.toDataURL('image/png');
          const newHighlight = { ...currentHighlight, snippedImageDataUrl };
          setHighlights([newHighlight]);
          console.log("Snipped Image Data URL:", snippedImageDataUrl);
      } else {
          console.warn("Calculated snipping area resulted in zero width or height. sx, sy, sw, sh:", sx, sy, sw, sh);
          setHighlights([]); // Clear highlights if snip failed due to invalid dimensions
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
      setCanvasLayerElements(containerRef.current?.querySelector(".react-pdf__Page__canvas"))
      //console.log(containerRef.current?.querySelector(".react-pdf__Page__canvas").width, containerRef.current?.querySelector(".react-pdf__Page__canvas").height)
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

