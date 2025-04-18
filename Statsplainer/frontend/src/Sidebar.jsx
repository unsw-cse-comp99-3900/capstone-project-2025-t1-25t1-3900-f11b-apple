import { Box, Button, Paper, TextField, IconButton, keyframes, Menu, MenuItem, collapseClasses } from '@mui/material'; // Added keyframes
import Grid from '@mui/material/Grid2';
import React, {useState, useRef, useEffect} from "react";
import Tooltip from './Tooltips';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SendIcon from "@mui/icons-material/Send";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import TranslateIcon from '@mui/icons-material/Translate';
import LanguageIcon from '@mui/icons-material/Language'

// Sidebar Function

//update here where the border of the side bar starts
const NAVBAR_HEIGHT = 60;

export default function Sidebar({
  setChatType,
  activePdfFilename,
  // Receive state and setters from parent
  messageDefinition = [],
  setMessageDefinition,
  messageRealWorldAnalogy,
  setMessageRealWorldAnalogy,
  messageELI5,
  setMessageELI5,
  // Add loading state props
  isLoading,
  setIsLoading
}) {
    // intialised the state of hasSeenTour
    localStorage.setItem("hasSeenTour", "false");
    // Store which chat is currently selected (default Definition)
    const [selectedChat, setSelectedChat] = useState("Definition");
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

    const handleTranslate = async (LanguageCode) => {
        const currentMessages = selectedChat === "Definition" ? messageDefinition :
                                selectedChat === "Real world analogy" ? messageRealWorldAnalogy : messageELI5;
        
        const setCurrentMessages = selectedChat === "Definition" ? setMessageDefinition :
                                selectedChat === "Real world analogy" ? setMessageRealWorldAnalogy : setMessageELI5;

        const translatedMessages = [...currentMessages];
        try {
            console.log("start translate");
            for (let i = 0; i < translatedMessages.length; i++) {
                const message = translatedMessages[i];
                if (message.sender === "AI" && message.text && !message.image) {
                    let response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${LanguageCode}&dt=t&q=${encodeURIComponent(message.text)}`);
                    const data = await response.json();
                    const translatedText = data[0].map(item => item[0]).join('');
                    translatedMessages[i] = {
                        ...message,
                        text: translatedText,
                    };
                }
            }
            
        } catch (error) {
            console.error("Translation error:", error);
        }

        setCurrentMessages(translatedMessages);

        

    };

    return (
        
        <Grid
            container
            sx={{
                display: 'flex',
                height:"92vh",
                width: "100%",
                //borderRadius: "20px",
                backgroundColor: "#37383C",
                flexDirection:"column",
                p:1,
                position:"relative",
                background: `linear-gradient(135deg, transparent 48% rgba(30,32,40,0.95) 0%, rgba(20,22,30,0.95) 100%)`
            }}
            spacing={2}
        >

        

        {/* Toggleable AI prompt Button */}
        <Box 
            id="sidebar-buttons"
            sx={{
                width:"100%",
                display: "flex",
                alignItems: "center",
                position: "relative",
                zIndex:4,
            }}
        
        >
            <PromptButtonSelector selectedChat={selectedChat} setSelectedChat={setSelectedChat} setChatType={setChatType}/>

            <IconButton
                onClick={handleOpenTooltip}
                sx={{
                    color: "white",
                    "&:hover": {
                        backgroundColor : `rgba(255,255,255,0.1)`,
                    }
                }}
            >
                <HelpOutlineIcon />
            </IconButton>
        </Box>
            

        {/* response section */}
        <Box 
            id="message-response"
            sx={{
                flex: 1,
                overflowY: "auto",
                position:"relative",
                zIndex:2,
            }}    
        >
        <ChatResponseSection 
            messages={
            selectedChat === "Definition" ? messageDefinition :
            selectedChat === "Real world analogy" ? messageRealWorldAnalogy : messageELI5
            }
            isLoading={isLoading} // Pass isLoading down
           />
        </Box>

        {/* chat box input section */}

        <Box 
            id="chat-input"
            sx={{
                width: "100%",
                marginTop: "auto",
                position:"relative",
                zIndex:2,
            }}
        >
        <ChatMessageInput 
            selectedChat={selectedChat}
            activePdfFilename={activePdfFilename}
            addMessage={// Pass the correct setter based on selected chat
            selectedChat === "Definition" ? setMessageDefinition :
            selectedChat === "Real world analogy" ? setMessageRealWorldAnalogy : setMessageELI5
            }
            setIsLoading={setIsLoading} // Pass setIsLoading down 
            onTranslateClick={handleTranslate} // Pass down handle translate
        />
        </Box>
        
        <Tooltip state= "sidebar" open={open} handleClose={handleCloseTooltip}/>
        </Grid>
    )
};


// Chat message container function
const ChatResponseSection = ({ messages, isLoading }) => { // Add isLoading prop
    // interaction to be complete
    const messagesEndRef = useRef(null);


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    },[messages]);
    

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                borderRadius: "20px",
                height: "calc(100% - 40px)",
                padding: "16px",
                position: "relative",
                backgroundColor: `rgba(75,76,80,0.6)`,
                backdropFilter: `blur(8px)`,
                border: `1px solid rgba(255,255,255,0.1)`,
                boxShadow: `0 4px 30px rgba(0,0,0,0.1)`,
            }}
        >

        {/* Render messages from AI and User */}
        {messages.map((message, index) => (
            <Box 
                key={index}
                sx={{
                    display:"flex",
                    flexDirection:"column",
                    alignItems: message.sender === "AI" ? "flex-start" : "flex-end",
                    margineBottom :" 16px",
                    padding: "8px",
                    wordBreak: 'break-word',
                }}
            >

                {/* User Icon + AI Icon section To be implemented */}



                {/* Message Section*/}
                <Paper
                    key={index}
                    sx={{
                        marginBtoom: "10px",
                        maxWidth: "75%",
                        borderRadius: message.sender === "AI" ? "12px 12px 12px 4px" : "12px 12px 4px 12px",
                        padding: '12px 16px',
                        backgroundColor: message.sender === "AI" ? `rgba(240,240,240,0.9)` : `rgba(147, 197, 253, 0.9)`,
                        backdropFilter: `blur(8px)`,
                        boxShadow: message.sender === "AI" ? `0 2px 8px rgba(0,0,0,0.1)` : `0 4px 15px rgba(147,197,253, 0.3)`,
                        border: message.sender ==="AI" ? `1px solid rgba(255,255,255, 0.1)` : `1px solid rgba(255,255,255,0.2)`,
                        color: message.sender === "AI" ? "#000000" : "#ffffff",
                        position: "relative",
                        "&::before": message.sender === "AI" ? {} : {
                            content: `""`,
                            position: "absolute",
                            right: "-2px",
                            bottom: "-2px",
                            width: "8px",
                            height: "8px",
                            backgroundColor: `rgba(147,197,253,0.9)`,
                            borderRadius: "50%",
                            boxShadow: `0 0 10px rgba(147,197,253, 0.5)`,
                            display:"flex",
                            flexDirection:"column",
                        },

                    }}
                >
                    {/* Conditionally render image or text */}
                    {message.type === 'image' && message.imageUrl ? (
                      <img
                        src={message.imageUrl}
                        alt="Snipped Content"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '300px', // Adjust max height as needed
                          borderRadius: '8px', // Match paper border radius
                          display: 'block' // Ensure image behaves like a block element
                        }}
                      />
                    ) : (
                      message.text // Render text if not an image or imageUrl is missing
                    )}
                    
                </Paper>

                 
            </Box>
        ))}
        {/* Render loading indicator if loading */}
        {isLoading && <LoadingDots />}
        <div ref={messagesEndRef} />

        </Box>
        
    );
};

// Helper component for the loading dots animation (using MUI)
const LoadingDots = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', p: 1, width: '100%' }}>
    <Paper sx={{ display: 'flex', gap: '8px', p: '12px 16px', borderRadius: '12px 12px 12px 4px', backgroundColor: 'rgba(240,240,240,0.9)', maxWidth: '75%' }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'grey.500', // Use theme color
            animation: `bounce 1.4s infinite ease-in-out both`,
            animationDelay: `${i * 0.16}s`,
            '@keyframes bounce': { // Define keyframes directly within sx prop (MUI v5+)
              '0%, 80%, 100%': {
                transform: 'scale(0)',
              },
              '40%': {
                transform: 'scale(1.0)',
              },
            },
          }}
        />
      ))}
    </Paper>
  </Box>
);

// chat messageInputFunction

const ChatMessageInput = ({addMessage, onTranslateClick, selectedChat, activePdfFilename, setIsLoading}) => { // Add setIsLoading prop

    // store current input inside the message box
    const [userMessageInput, setUserMessageInput] = useState("");

    const [isListening,setIsListening] = useState(false);

    const recognitionRef = useRef(null);


    // check which language is selected
    const [anchorEl, setAnchorEl] = useState(null);

    // check the state of whether the translate button is being pressed
    const [isTranslating, setIsTranslating] = useState(false);


    // language code array
    // add more desired langauge here
    const languages = [
        { code: "zh", name: "Chinese" },
        { code: "en", name: "English" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
        { code: "it", name: "Italian" },
        { code: "ja", name: "Japanese" },
        { code: "ko", name: "Korean" },
        { code: "pt", name: "Portuguese" },
        { code: "ru", name: "Russian" },
        { code: "es", name: "Spanish" }
      ];

    const handleTranslateClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageSelect = (LanguageCode) => {
        onTranslateClick(LanguageCode);
        handleClose();
    }


    useEffect(() => {

        if ("webkitSpeechRecognition" in window) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = "en-US";

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setUserMessageInput(prev => prev + (prev ? " ":"") + transcript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            console.error("speech recognition not supported");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };
    // send message function
    const sendMessage = () => {
        // if message is not empty then we send the message
        if (userMessageInput.trim()) {
            //append message to the end of the message array
            addMessage(prevMessages => [...prevMessages, {text: userMessageInput, sender: "user"}]);
            

            //clear send message section once user send the message by pressing enter key
            setUserMessageInput("");
            setIsLoading(true); // Set loading before fetch

            fetch("http://localhost:5000/explain-highlight", {
                method: "post",
                credentials: 'include',
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({highlighted_text : userMessageInput, mode: selectedChat, filename: activePdfFilename})
            })
            .then(response => response.json())
            .then(data => {
              addMessage(prevMessages =>[...prevMessages, {sender: "AI", text: data.explanation}]);
              setIsLoading(false); // Clear loading on success
            })
            .catch(error => {
              console.error("Error:", error);
              addMessage(prevMessages => [...prevMessages, {sender: "AI", text: "Sorry, an error occurred."}]); // Add error message to chat
              setIsLoading(false); // Clear loading on error
            });

        }
    };

    // checkEnterKey is pressed

    const checkEnterKey = (event) => {
        // if user pressed enter key we send the message 
        if (event.key === "Enter") {
            sendMessage();

           // update message storage  
        }
    };



    return (
        <Grid item 
            sx={{
                display:"flex",
                width:"100%",
                backgroundColor: `rgba(75,76,80,0.6)`,
                borderRadius: "20px",
                padding:"8px",
                backdropFilter:`blur(10px)`,
                border:`1px solid rgba(255,255,255,0.1)`,
                boxShadow: `0 4px 30px rgba(0,0,0,0.1)`,
                alignItems: "center",
                gap: 1,
            }}>            
            <TextField
                fullWidth
                placeholder="Ask Anything"
                variant="outlined"
                value={userMessageInput}
                onChange={(e) => setUserMessageInput(e.target.value)}
                onKeyDown={checkEnterKey}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        color:"#ffffff",
                        "& fieldset" : {
                            borderColor: `rgba(255,255,255, 0.1)`,
                            borderRadius:"12px",
                        },
                        "& hover fieldset": {
                            borderColor: `rgba(255,255,255,0.2)`,
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: `rgba(147, 197,253,0.5)`,
                        },
                    },
                    "& .MuiInputBase-input": {
                        padding: "12px 16px",
                        fontSize: "14px",
                    },
                    "& .MuiInputLabel-root": {
                        color: `rgba(255,255,255,0.7)`,
                    },
                    "& .MuiInputBase-Input::placeholder": {
                        color: `rgba(255,255,255,0.5)`,
                        opacity:1,
                    },
                }}


            />
            <IconButton
                onClick={toggleListening}
                sx={{
                    color: isListening ? `rgba(255,0,0,0.9)` : `rgba(147,197,253,0.9)`,
                    backgroundColor: isListening ? `rgba(2, 1, 1, 0.1) `: `rgba(147,197,253,0.1)`,
                    borderRadius: "12px",
                    padding: "8px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        backgroundColor: isListening ? `rgba(255,0,0,0.25)` : `rgba(147,197,253,0.2)`,
                        transform: `scale(1.05)`,
                    },
                    "&:active": {
                        transform: `scale(0.95)`,
                    },
                    animation : isListening ? `${keyframes`
                            0% {transform: scale(1);}
                            50% {transform: scale(1.1);}
                            100% {transform: scale(1);}
                            
                        `} 1.5s infinite` : "none",
                    
                }}
            >
                {isListening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
            {/* translate button located on the top right corner of the response section */}
            <IconButton
                            
                            onClick={handleTranslateClick}
                            disabled={isTranslating}
                            sx={{
                                color: isTranslating ? `rgba(0,0,0,0.3)` : `rgba(147,197,253,0.9)`,
                                backgroundColor: isTranslating? `rgba(2,1,1,0.1)` : `rgba(147,197,253,0.1)`,
                                borderRadius: "12px",
                                padding: "8px",
                                transition: "all 0.3s ease",
                                "&:hover" : {
                                    color: isTranslating ? `rgba(0,0,0,0.3)` : `rgba(0,0,0,0.5)`,
                                    transform: `scale(0.95)`,
                                },
                            }}
                        >
                            <TranslateIcon  />
                </IconButton>   
            <IconButton
                onClick={sendMessage}
                disabled={!userMessageInput.trim()}
                sx={{
                    color: userMessageInput.trim() ? `rgba(147,197,253,0.9)` : `rgba(255,255,255, 0.3)`,
                    backgroundColor: userMessageInput.trim() ? `rgba(147,197,253,0.1)` : "transparent",
                    borderRadius: "12px",
                    padding:"8px",
                    transitionL : "all 0.3s ease",
                    "&.hover": {
                        backgroundColor: userMessageInput.trim() ? `rgba(147, 197, 253, 0.2)` : "transparent",
                        transform: `scale(1.05)`,
                    },
                    "&.active": {
                        transform: `scale(0.95)`,
                    },
                    
                }}
            >
                <SendIcon />
            </IconButton>


        {/* drop down menu to select between different language */}
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
                "& .MuiPaper-root": {
                    backgroundColor: `rgba(55,56,60,0.9)`,
                    backdropFilter: `blur(8px)`,
                }
            }}
        >
            {languages.map((Language) => (
                <MenuItem
                    key={Language.code}
                    onClick={() => handleLanguageSelect(Language.code)}
                    disabled={isTranslating}
                    sx={{
                        color: isTranslating ? `rgba(255,255,255,0.5)` : `white`,
                        "&:hover" : {
                            backgroundColor: `rgba(255,255,255,0.1)`,
                        },
                    }}
                >
                    <LanguageIcon sx={{ mr:1}} />
                    {Language.name}
                </MenuItem>
            ))}

        </Menu>
        </Grid>
    )
}


// Toggleable AI Prompt Button 

const PromptButtonSelector = ({ selectedChat, setSelectedChat, setChatType }) => {
    const buttonStyle = (label) => ({
        color: "#35343E",
        backgroundColor: "#D9D9D9",
        opacity: selectedChat === label ? 1 : 0.6,
        flexGrow: 1,
        padding: "6px 1px",
        textAlign: "center",
        whiteSpace: "normal",
        overflowWrap: "break-word",
        fontSize: "clamp(0.65rem, 1.5vw, 0.85rem)",
        minHeight: "48px",
        minWidth: '80px',
        maxWidth: '160px',
    });

    return (
        <Grid

            sx={{
                width:"100%",
                height:"auto",
                display:"flex",
                flexDirection:"row",
                gap:1,
              }}
        >
           <Button 

                onClick={() => {setSelectedChat("Definition"); setChatType("Definition");}}
                fullWidth
                sx={{
                    color: "#ffffff",
                    backgroundColor: selectedChat === "Definition" ? `rgba(217,217,217, 0.8)`: `rgba(217,217,217, 0.4)`,
                    width: "33.33%",
                    display: "inherit",
                    minWidth: 10,
                    fontsize: "12px",
                    height: "50px",
                    textTransform: "none",
                    borderRadius: "10px",
                    transition: "all 0,3s ease",
                    boxShadow: selectedChat === "Definition" ? `0 4px 20px rgba(217,217,217, 0.3), 0 0 0 1px rgba(255,255,255, 0.1)` : `0 2px 10px rgba(217,217,217, 0.1)`,
                    backdropFilter: `blur(8px)`,
                    border: `1px solid rgba(255, 255,255,0.1)`,
                    whiteSpace:"normal",
                    lineHeight: "1.2",
                    padding: "8px 4px",
                    "&:hover": {
                        backgroundColor: `rgba(217,217,217,0.6)`,
                        transform: `translateY(-2px)`,
                        boxShadow: `0 6px 25px rgba(217,217,217,0.4), 0 0 0 1px rgba(255,255,255, 0.2)`,
                    },
                }}

            >
              Defintion
           </Button>

           <Button  
                onClick={() => {setSelectedChat("Real world analogy"); setChatType("Real world analogy");}}
                fullWidth
                sx={{
                    color: "#ffffff",
                    backgroundColor: selectedChat === "Real world analogy" ? `rgba(217,217,217, 0.8)`: `rgba(217,217,217, 0.4)`,
                    width: "33.33%",
                    display: "inherit",
                    minWidth: 10,
                    fontsize: "12px",
                    height: "50px",
                    textTransform: "none",
                    borderRadius: "10px",
                    transition: "all 0,3s ease",
                    boxShadow: selectedChat === "Real world analogy" ? `0 4px 20px rgba(217,217,217, 0.3), 0 0 0 1px rgba(255,255,255, 0.1)` : `0 2px 10px rgba(217,217,217, 0.1)`,
                    backdropFilter: `blur(8px)`,
                    border: `1px solid rgba(255, 255,255,0.1)`,
                    whiteSpace:"normal",
                    lineHeight: "1.2",
                    padding: "8px 4px",
                    "&:hover": {
                        backgroundColor: `rgba(217,217,217,0.6)`,
                        transform: `translateY(-2px)`,
                        boxShadow: `0 6px 25px rgba(217,217,217,0.4), 0 0 0 1px rgba(255,255,255, 0.2)`,
                    },
                }}
                >
                Real world analogy
            </Button>

            <Button 
                onClick={() => {setSelectedChat("ELI5"); setChatType("ELI5");}}
                fullWidth
                sx={{
                    color: "#ffffff",
                    backgroundColor: selectedChat === "ELI5" ? `rgba(217,217,217, 0.8)`: `rgba(217,217,217, 0.4)`,
                    width: "33.33%",
                    display: "inherit",
                    minWidth: 10,
                    fontsize: "12px",
                    height: "50px",
                    textTransform: "none",
                    borderRadius: "10px",
                    transition: "all 0,3s ease",
                    boxShadow: selectedChat === "ELI5" ? `0 4px 20px rgba(217,217,217, 0.3), 0 0 0 1px rgba(255,255,255, 0.1)` : `0 2px 10px rgba(217,217,217, 0.1)`,
                    backdropFilter: `blur(8px)`,
                    border: `1px solid rgba(255, 255,255,0.1)`,
                    whiteSpace:"normal",
                    lineHeight: "1.2",
                    padding: "8px 4px",
                    "&:hover": {
                        backgroundColor: `rgba(217,217,217,0.6)`,
                        transform: `translateY(-2px)`,
                        boxShadow: `0 6px 25px rgba(217,217,217,0.4), 0 0 0 1px rgba(255,255,255, 0.2)`,
                    },
                }}
                >
                ELI5
            </Button>

            
        </Grid>
    )
}

