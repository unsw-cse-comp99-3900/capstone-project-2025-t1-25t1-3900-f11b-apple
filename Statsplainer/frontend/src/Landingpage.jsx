import { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { PdfUpload } from "./PdfUpload";

export const LandingPage = ({ setPdfUploaded }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setPdfUploaded(true);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {!uploadedFile ? (
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '30vh',
            flex: 1,
            minWidth: '70vh',
            bgcolor: '#1F2023',
            margin: '20vh',
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='40' ry='40' stroke='%23fff' stroke-width='4' stroke-dasharray='10%2c 20' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
            borderRadius: '40px',
            textAlign: 'center',
            padding: '2rem',
            gap: 2,
          }}
        >
          
          <Typography color="white">
            Upload PDF
          </Typography>
          <Typography color="gray">
            Drag and drop or choose a file to upload
          </Typography>

          <Button variant="outlined" onClick={triggerFileInput} sx={{ color: 'white', borderColor: 'white' }}>
            Choose PDF File
          </Button>

          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </Grid>
      ) : (
        <PdfUpload file={uploadedFile} />
      )}
    </>
  );
};
