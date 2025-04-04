import { Box, Button, Paper, TextField, } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, {useState, useRef, useEffect} from "react";
import Tooltip from './Tooltips';

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
    const [open,setOpen] = useState(true);
    const targetRef = React.useRef(null);

    //handle open/close tooltip
    const handleOpenTooltip = () => setOpen(true);
    const handleCloseTooltip = () => setOpen(false);



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
                p: 2,
            }}
            spacing={2}
        >

        

        {/* Toggleable AI prompt Button */}
        <PromptButtonSelector ref={targetRef} selectedChat={selectedChat} setSelectedChat={setSelectedChat} setChatType={setChatType}/>
        
            

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
        
        <Tooltip targetRef={targetRef} open={open} handleClose={handleCloseTooltip}/>
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
                height:"10%",
                display:"inherit",
                gap:1,
              }}
        >
           <Button 
                onClick={() => {setSelectedChat("Definition"); setChatType("Definition");}}
                fullWidth
                sx={{color: "#35343E", backgroundColor: "#D9D9D9", opacity: selectedChat === "Definition" ? 1:0.6, width:"100%", display:'inherit', minWidth: 10,fontSize:"10px"}}
            >
              Defintion
           </Button>

           <Button  
                onClick={() => {setSelectedChat("Real world analogy"); setChatType("Real world analogy");}}
                fullWidth
                sx={{color: "#35343E", backgroundColor: "#D9D9D9", opacity: selectedChat === "Real world analogy" ? 1:0.6, width:"100%", display:'inherit', minWidth: 10,fontSize:"10px"}}
                >
                Real world analogy
            </Button>

            <Button 
                onClick={() => {setSelectedChat("ELI5"); setChatType("ELI5");}}
                fullWidth
                sx={{color: "#35343E", backgroundColor: "#D9D9D9", opacity: selectedChat === "ELI5" ? 1:0.6, width:"100%", display:'inherit', minWidth: 10,fontSize:"10px"}}
                >
                ELI5
            </Button>

            
        </Grid>
    )
}

/*

*/