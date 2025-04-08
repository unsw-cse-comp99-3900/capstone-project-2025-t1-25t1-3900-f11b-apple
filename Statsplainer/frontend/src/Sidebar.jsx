import { Box, Button, Paper, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {useState, useRef, useEffect} from "react";

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

    // Store which chat is currently selected (default Definition)
    // This state remains local to Sidebar as it controls UI selection here
    const [selectedChat, setSelectedChat] = useState("Definition");

    // Remove the useEffect that depended on the old 'message' prop
    // AI responses will now be added directly via the setters passed down


    return (
        <Grid
            container
            sx={{
                height:"92vh",
                width: "30vw",
                backgroundColor: "#37383C",
                flexDirection: "column",
                p: 2,
            }}
            spacing={2}
        >

        {/* Toggleable AI prompt Button */}
        <PromptButtonSelector selectedChat={selectedChat} setSelectedChat={setSelectedChat} setChatType={setChatType}/>

        {/* response section */}
        <ChatResponseSection 
            messages={
            selectedChat === "Definition" ? messageDefinition :
            selectedChat === "Real world analogy" ? messageRealWorldAnalogy : messageELI5  
            } />
        

        {/* chat box input section */}
        <ChatMessageInput
            selectedChat={selectedChat}
            activePdfFilename={activePdfFilename}
            addMessage={ // Pass the correct setter based on selected chat
              selectedChat === "Definition" ? setMessageDefinition :
              selectedChat === "Real world analogy" ? setMessageRealWorldAnalogy : setMessageELI5
            }
        />
        
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
                backgroundColor: "#4B4C50",
                borderRadius : "10px",
            }}>            
            <TextField
                fullWidth
                placeholder="Ask Anything"
                variant="outlined"
                color='#26252C'
                value={userMessageInput}
                onChange={(e) => setUserMessageInput(e.target.value)}
                onKeyDown={checkEnterKey}


            />
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
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-Between",
                gap: 2,
              }}
        >
           <Button 
                onClick={() => { setSelectedChat("Definition"); setChatType("Definition"); }}
                sx={buttonStyle("Definition")}
            >
              Defintion
           </Button>

           <Button  
                onClick={() => { setSelectedChat("Real world analogy"); setChatType("Real world analogy"); }}
                sx={buttonStyle("Real world analogy")}
            >
              Real world analogy
           </Button>

           <Button 
                onClick={() => { setSelectedChat("ELI5"); setChatType("ELI5"); }}
                sx={buttonStyle("ELI5")}
            >
              ELI5
           </Button>
            
        </Box>
    )
}
