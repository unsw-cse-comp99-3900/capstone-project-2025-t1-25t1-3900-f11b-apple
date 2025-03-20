import { useRef, useState, useEffect } from "react";

export const Highlight = (containerRef, pageNumber) => {
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

  const handleMouseDown = (e) => {
    setHighlights([]);
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

  const handleMouseUp = () => {
    isDrawing.current = false;

    if (!currentHighlight || currentHighlight.width < 5 || currentHighlight.height < 5) {
      setCurrentHighlight(null);
      setHighlightedBoxes([]);
      return;
    }

    const { text, boxes } = extractWordsAndBoxes(currentHighlight);
    const newHighlight = { ...currentHighlight, text, boxes };

    setHighlights([newHighlight]);
    setCurrentHighlight(null);
    setHighlightedBoxes([]);
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
      if (!text) return;

      const words = text.split(/\s+/);
      let wordStartIndex = 0;

      words.forEach((word) => {
        const trimmedWord = word.trim();
        if (!trimmedWord) return;

        const wordIndex = text.indexOf(trimmedWord, wordStartIndex);
        if (wordIndex === -1 || !el.firstChild) return;

        try {
          const range = document.createRange();
          range.setStart(el.firstChild, wordIndex);
          range.setEnd(el.firstChild, wordIndex + trimmedWord.length);
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

          wordStartIndex = wordIndex + trimmedWord.length;
        } catch (err) {
          console.error(err);
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
  };
};
