import { Box, Button, Paper, TextField, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, {useState, useRef, useEffect} from "react";
import Tooltip from './Tooltips';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Sidebar Function

//update here where the border of the side bar starts
const NAVBAR_HEIGHT = 60;

export default function Sidebar({message, setChatType}) {

    /*const test = [
        {text: "hello", sender:"user"},
        {text: "Hi this is AI", sender: "AI"}    
    ];
    */

    //store messages for definition
    const [messageDefinition, setMessageDefinition] = useState([]);

    //store message for real world analogy
    const [messageRealWorldAnalogy, setMessageRealWorldAnalogy] = useState([]);

    //store message for ELI5
    const [messageELI5, setMessageELI5] = useState([]);

    // store which chat is currently selected  (default Defintion)
    const [selectedChat, setSelectedChat] = useState("Definition"); 

    //set tooltips state
    const [open,setOpen] = useState(false);
    const targetRef = React.useRef(null);

    //handle open/close tooltip
    const handleOpenTooltip = () => setOpen(true);
    const handleCloseTooltip = () => setOpen(false);

    useEffect (() => {
        const hasSeenTour = localStorage.getItem("hasSeenTour");
        if (!hasSeenTour) {
            handleOpenTooltip();
            localStorage.setItem("hasSeemTour", "true");
        }
    }, []);

    useEffect (() => {
        if (message.chat === "Definition") {
            setMessageDefinition(prevMessages =>[...prevMessages, {sender: "AI", text: message.text}])
        } else if (message.chat === "Real world analogy") {
            setMessageRealWorldAnalogy(prevMessages =>[...prevMessages, {sender: "AI", text: message.text}])
        } else if (message.chat === "ELI5") {
            setMessageELI5(prevMessages =>[...prevMessages, {sender: "AI", text: message.text}])
        };
        message = {};
    }, [message]);




    return (
        
        <Grid
            container
            sx={{
                display:"flex",
                height:"82vh",
                width: "30vw",
                borderRadius: "20px",
                backgroundColor: "#37383C",
                flexDirection: "column",
                p: 1,
                position: "relative",
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
            }}
        >
        <ChatMessageInput 
            addMessage={
            selectedChat === "Definition" ? setMessageDefinition :
            selectedChat === "Real world analogy" ? setMessageRealWorldAnalogy : setMessageELI5
            }
        /> 
        </Box>
        
        <Tooltip open={open} handleClose={handleCloseTooltip}/>
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
                borderRadius: "inherit",
                height: "inherit",
                padding: "10px",
                position: "relative",
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
                    margineBottom :" 10px",
                    padding: "5px",
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
                        borderRadius: '5px',
                        padding: '10px',
                        backgroundColor: message.sender === "AI" ? "#f0f0f0" : "#d1e7ff",

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

const ChatMessageInput = ({addMessage}) => {

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
                body: JSON.stringify({highlighted_text : userMessageInput})
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
                display:"inherit",
                width:"100%",
                backgroundColor: "#4B4C50",
                borderRadius : "10px",
                    fontSize:{
                        xs: "8px",
                        sm: "10px",
                        md: "12px",
                        lg: "14px",
                        xl: "16px",
                    }
            }}>            
            <TextField
                fullWidth
                placeholder="Ask Anything"
                variant="outlined"
                color='#26252C'
                value={userMessageInput}
                onChange={(e) => setUserMessageInput(e.target.value)}
                onKeyDown={checkEnterKey}
                sx={{
                    width:"100%",
                    display:"inherit",
                }}


            />
        </Grid>
    )
}


// Toggleable AI Prompt Button 

const PromptButtonSelector = ({ selectedChat, setSelectedChat, setChatType }) => {
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

/*

*/