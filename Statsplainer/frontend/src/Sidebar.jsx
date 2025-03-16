import { Box, Button, Paper, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {useState, useRef, useEffect} from "react";

// Sidebar Function

//update here where the border of the side bar starts
const NAVBAR_HEIGHT = 60;

export default function Sidebar() {


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

    
    return (
        <Grid
            container
            sx={{
                height:"82vh",
                width: "30vw",
                borderRadius: "20px",
                backgroundColor: "#37383C",
                flexDirection: "column",
                p: 2,
            }}
            spacing={2}
        >

        {/* Toggleable AI prompt Button */}
        <PromptButtonSelector selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>

        {/* response section */}
        <ChatResponseSection 
            messages={
            selectedChat === "Definition" ? messageDefinition :
            selectedChat === "Real world analogy" ? messageRealWorldAnalogy : messageELI5  
            } />
        

        {/* chat box input section */}
        <ChatMessageInput 
            addMessage={
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
            item
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
            
            sx={{
                display: "flex",
                justifyContent: "space-Between",
                gap: 2,
              }}
        >
           <Button 
                onClick={() => setSelectedChat("Definition")}
                sx={{color: "#35343E", backgroundColor: "#D9D9D9", opacity: selectedChat === "Definition" ? 1:0.6, flexGrow: 1}}
            >
              Defintion
           </Button>

           <Button  
                onClick={() => setSelectedChat("Real world analogy")}
                sx={{color: "#35343E", backgroundColor: "#D9D9D9", opacity: selectedChat === "Real world analogy" ? 1:0.6, flexGrow: 2}}
            >
              Real world analogy
           </Button>

           <Button 
                onClick={() => setSelectedChat("ELI5")}
                sx={{color: "#35343E", backgroundColor: "#D9D9D9", opacity: selectedChat === "ELI5" ? 1:0.6, flexGrow: 1}}
            >
              ELI5
           </Button>
            
        </Box>
    )
}