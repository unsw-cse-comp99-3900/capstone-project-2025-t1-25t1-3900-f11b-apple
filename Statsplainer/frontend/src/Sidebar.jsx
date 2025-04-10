import { Box, Button, Paper, TextField, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, {useState, useRef, useEffect} from "react";
import Tooltip from './Tooltips';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SendIcon from "@mui/icons-material/Send"

// Sidebar Function

//update here where the border of the side bar starts
const NAVBAR_HEIGHT = 60;

export default function Sidebar({
  setChatType,
  activePdfFilename,
  // Receive state and setters from parent
  messageDefinition,
  setMessageDefinition,
  messageRealWorldAnalogy,
  setMessageRealWorldAnalogy,
  messageELI5,
  setMessageELI5
}) {

    /*const test = [
        {text: "hello", sender:"user"},
        {text: "Hi this is AI", sender: "AI"}    
    ];
    */
    // intialised the state of hasSeenTour
    localStorage.setItem("hasSeenTour", "false");
    // Store which chat is currently selected (default Definition)
    // This state remains local to Sidebar as it controls UI selection here
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



    return (
        
        <Grid
            container
            sx={{

                height:"82vh",
                width:"30vw",
                borderRadius: "20px",
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
            } />
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
        /> 
        </Box>
        
        <Tooltip state= "sidebar" open={open} handleClose={handleCloseTooltip}/>
        </Grid>
    )
};


// Chat message container function
const ChatResponseSection = ({ messages }) => {
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
                        },

                    }}
                >
                    {message.text}
                </Paper>

            </Box>
        ))}
        <div ref={messagesEndRef} />
        </Box>
        
    )
}


// chat messageInputFunction

const ChatMessageInput = ({addMessage, selectedChat, activePdfFilename}) => {

    // store current input inside the message box
    const [userMessageInput, setUserMessageInput] = useState("");

    // send message function
    const sendMessage = () => {
        // if message is not empty then we send the message
        if (userMessageInput.trim()) {
            //append message to the end of the message array
            addMessage(prevMessages => [...prevMessages, {text: userMessageInput, sender: "user"}]);
            

            //clear send message section once user send the message by pressing enter key
            setUserMessageInput("");

            fetch("http://localhost:5000/explain-highlight", {
                method: "post",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({highlighted_text : userMessageInput, mode: selectedChat, filename: activePdfFilename})
            })
            .then(response => response.json())
            .then(data => addMessage(prevMessages =>[...prevMessages, {sender: "AI", text: data.explanation}]))
            .catch(error => console.error("Error:", error));

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

