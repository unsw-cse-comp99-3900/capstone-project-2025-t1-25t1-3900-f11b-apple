import { Box, Button, Paper, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {useState} from "react";

// Sidebar Function

//update here where the border of the side bar starts
const NAVBAR_HEIGHT = 60;

export default function Sidebar() {


    /*const test = [
        {text: "hello", sender:"user"},
        {text: "Hi this is AI", sender: "AI"}    
    ];
    */

    const [messages, setMessages] = useState([]);

    const addMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    }
    
    
    return (
        <Grid
            container
            sx={{
                position: "fixed",
                right:30,
                top: NAVBAR_HEIGHT,
                height:"90vh",
                width: 400,
                borderRadius: "20px",
                backgroundColor: "#37383C",
                flexDirection: "column",
                p: 2,
            }}
            spacing={2}
        >

        {/* Toggleable AI prompt Button */}
        <PromptButtonSelector />

        {/* response section */}

        <ChatResponseSection messages={messages} />
        

        {/* chat box input section */}
        <ChatMessageInput 
            addMessage={addMessage}
        />
        


        </Grid>
    )
};


// Chat message container function
const ChatResponseSection = ({ messages }) => {
    // interaction to be complete
    
    return (
        <Box
            item
            sx={{
                flex: 1,
                overflowY: "auto",
                borderRadius: "inherit",
                height: "inherit",
                padding: "10px",
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
            addMessage({text: userMessageInput, sender: "user"});

            //clear send message section once user send the message by pressing enter key
            setUserMessageInput("");
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

const PromptButtonSelector = ({ selectedChat, setSelectedChat }) => {
    return (
        <Box
            container
            sx={{
                display: "flex",
                justifyContent: "space-Between",
                gap: 2,
              }}
        >
           <Button 
                variant={selectedChat === "Definition" ? "contained" : "outlined"}
                onClick={() => setSelectedChat("Definition")}
                sx={{color: "#35343E", backgroundColor: "#D9D9D9", opacity: selectedChat === "Definition" ? 1:0.6}}
            >
              Defintion
           </Button>

           <Button 
                variant={selectedChat === "Real world analogy" ? "contained" : "outlined"}
                onClick={() => setSelectedChat("Real world analogy")}
                sx={{color: "#35343E", backgroundColor: "#D9D9D9", opacity: selectedChat === "Real world analogy" ? 1:0.6}}
            >
              Real world analogy
           </Button>

           <Button 
                variant={selectedChat === "ELI5" ? "contained" : "outlined"}
                onClick={() => setSelectedChat("ELI5")}
                sx={{color: "#35343E", backgroundColor: "#D9D9D9", opacity: selectedChat === "ELI5" ? 1:0.6}}
            >
              ELI5
           </Button>
            
        </Box>
    )
}