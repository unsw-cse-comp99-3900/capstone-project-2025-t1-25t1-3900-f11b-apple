import { AppBar, Toolbar, Button, Box, Typography, IconButton, TextField, Input, InputAdornment, FormControl, Rating, InputLabel, Backdrop } from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import { useState, useEffect } from "react";

export const FinalPopUp = ({ setPopUpDisplay, setFeedbackButton }) => {
  const [submissionReady, setSubmissionReady] = useState(false);
  const [rating, setRating] = useState(false);
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  const reset = () => {
    setRating(false);
    setEmail('');
    setFeedback('');
    setPopUpDisplay(false);
  }

  useEffect(() => {
    if (rating != false && RegExp(/^.+@.+\..+$/).test(email) && feedback.length > 0) {
      setSubmissionReady(true);
    } else {
      setSubmissionReady(false);
    }
  }, [rating, email, feedback]);

  const handleSubmit = () => {
    const feedbackData = {
        rating: rating,
        email: email,
        feedback: feedback,
    };

    setFeedbackButton(false);
    reset();
    console.log("Submitting Feedback:", feedbackData);
  };

  return (
    <>
    <Backdrop
        open={true}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: 99,
          position:"fixed",
          top:0,
          left:0,
          right:0,
          bottom:0,
        }}
      />

    <Box 
      sx={{ 
        display: 'flex', 
        gap: 2, 
        flexDirection: 'column', 
        justifyContent: 'centre', 
        position: 'fixed', 
        top: '50%', 
        left: '50%', 
        transform: `translate(-50%,-50%)`, 
        backgroundColor: 'rgb(233, 233, 233)', 
        borderRadius: 2, 
        zIndex: 100, 
        width: '30vw',
        padding: '4vh 6vw'
      }}>

      <Typography variant="h5" component="h2" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.6rem'}}>
        How was your experience?
      </Typography >

      <Box sx={{ width: '100%',  display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Rating 
          size="large" 
          precision={0.5}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          sx={{ fontSize: '3rem' }}
        />
      </Box>

      <FormControl variant="standard">
        <Input
          id="feedback-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <EmailRoundedIcon fontSize="small" />
            </InputAdornment>
          }
        />
      </FormControl>

      <Input
        id="feedback"
        placeholder='Tell us what you think...'
        multiline
        rows={4}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />


      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 1, mt: 2 }}>
        <Button variant="contained" onClick={() => {reset(); setFeedbackButton(true);}} >
            Complete Later
        </Button>
        <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!submissionReady}
        >
            Submit Feedback
        </Button>
      </Box>
    </Box>
    </>
  );
}
