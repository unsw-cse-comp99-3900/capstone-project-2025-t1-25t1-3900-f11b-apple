import { PDFHighlighter } from "./PDFHighlighter";
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

export const PdfSidebar = ({ file }) => {
  return (
    <Grid
      sx={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <PDFHighlighter file={file} />
      </Box>
    </Grid>
  );
};

export default PdfSidebar;
