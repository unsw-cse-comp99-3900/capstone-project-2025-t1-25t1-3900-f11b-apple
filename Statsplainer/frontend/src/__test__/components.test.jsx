import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { NavBar } from '../Navbar.jsx'
import { BrowserRouter } from 'react-router-dom';
// Import the components we want to test
import Sidebar from '../Sidebar';
import Tooltips from '../Tooltips';


// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();


// Mock react-router-dom
vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
}));


// Mock Material-UI components
vi.mock('@mui/material', () => ({
    Box: ({ children }) => <div data-testid="mui-box">{children}</div>,
    Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
    TextField: ({ placeholder }) => <input placeholder={placeholder} />,
    IconButton: ({ children, onClick, 'aria-label': ariaLabel }) => (
        <button onClick={onClick} aria-label={ariaLabel}>
            {children}
        </button>
    ),
    Paper: ({ children }) => <div>{children}</div>,
    Grid: ({ children }) => <div>{children}</div>,
    Grid2: ({ children }) => <div>{children}</div>,
    AppBar: ({ children }) => <div data-testid="mui-appbar">{children}</div>,
    Backdrop: ({ children, open }) => open ? <div data-testid="mui-backdrop">{children}</div> : null,
    Snackbar: ({ children, open }) => open ? <div data-testid="mui-snackbar">{children}</div> : null,
    Slide: ({ children }) => <div>{children}</div>,
    Typography: ({ children }) => <div>{children}</div>,
    Toolbar: ({ children }) => <div data-testid="mui-toolbar">{children}</div>,
}));


// Mock Material-UI icons
vi.mock('@mui/icons-material/HelpOutline', () => ({
    default: () => <span data-testid="HelpOutlineIcon">HelpIcon</span>
}));


vi.mock('@mui/icons-material/Send', () => ({
    default: () => <span>SendIcon</span>
}));


vi.mock('@mui/icons-material/Close', () => ({
    default: () => <span>CloseIcon</span>
}));


vi.mock('@mui/icons-material/ArrowForward', () => ({
    default: () => <span>ArrowForwardIcon</span>
}));


// Mock NavBar specific icons
vi.mock('@mui/icons-material/HistoryRounded', () => ({
    default: () => <span>HistoryIcon</span>
}));


vi.mock('@mui/icons-material/AddRounded', () => ({
    default: () => <span>AddIcon</span>
}));


// Mock other dependencies
vi.mock('../apiCalls', () => ({
    apiCallPost: vi.fn(),
}));


vi.mock('../elements/helpers/createElement', () => ({
    createElement: vi.fn(),
}));


afterEach(() => {
    vi.clearAllMocks();
});


// Component test for Navbar
describe('<NavBar>', () => {
    it('renders on landing page', () => {
        render(
            <BrowserRouter>
                <NavBar pdfUploaded={false} setPdfUploaded={vi.fn()} setUploadedFile={vi.fn()} page={'/'}/>
            </BrowserRouter>
        );


        // Check if Add New button is not present
        expect(screen.queryByRole('button', { name: /add new/i })).not.toBeInTheDocument();
        // Check if View History button is present
        expect(screen.getByRole('button', { name: /view history/i })).toBeInTheDocument();
    });


    it('renders on pdf page', () => {
        render(
            <BrowserRouter>
                <NavBar pdfUploaded={true} setPdfUploaded={vi.fn()} setUploadedFile={vi.fn()} page={'/'}/>
            </BrowserRouter>
        );


        // Check if both buttons are present
        expect(screen.getByRole('button', { name: /add new/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /view history/i })).toBeInTheDocument();
    });


    it('renders on history page', () => {
        render(
            <BrowserRouter>
                <NavBar pdfUploaded={false} setPdfUploaded={vi.fn()} setUploadedFile={vi.fn()} page={'/history'}/>
            </BrowserRouter>
        );


        // Check if Add New button is present and View History is not
        expect(screen.getByRole('button', { name: /add new/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /view history/i })).not.toBeInTheDocument();
    });
});


// Component test for Sidebar
describe('<Sidebar>', () => {

    //create mock states for all the parameter 
    const mockSetChatType = vi.fn();
    const mockSetMessageDefinition = vi.fn();
    const mockSetMessageRealWorldAnalogy = vi.fn();
    const mockSetMessageELI5 = vi.fn();
    const mockSetIsLoading = vi.fn();


    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        vi.clearAllMocks();
    });


    it('renders with default state', () => {
        render(
            <Sidebar
                setChatType={mockSetChatType}
                activePdfFilename="test.pdf"
                messageDefinition={[]}
                setMessageDefinition={mockSetMessageDefinition}
                messageRealWorldAnalogy={[]}
                setMessageRealWorldAnalogy={mockSetMessageRealWorldAnalogy}
                messageELI5={[]}
                setMessageELI5={mockSetMessageELI5}
                isLoading={false}
                setIsLoading={mockSetIsLoading}
            />
        );


        // Check if main chat modes are present
        expect(screen.getByText('Defintion')).toBeInTheDocument();
        expect(screen.getByText('Real world analogy')).toBeInTheDocument();
        expect(screen.getByText('ELI5')).toBeInTheDocument();
       
        // Check if help icon is present
        expect(screen.getByTestId('HelpOutlineIcon')).toBeInTheDocument();
       
        // Check if chat input is present
        expect(screen.getByPlaceholderText('Ask Anything')).toBeInTheDocument();
    });


    it('shows tooltip on first visit', async () => {
        // Mock localStorage using vi.stubGlobal
        vi.stubGlobal('localStorage', {
            getItem: vi.fn().mockReturnValue('false'),
            setItem: vi.fn(),
            clear: vi.fn()
        });
       
        render(
            <Sidebar
                setChatType={mockSetChatType}
                activePdfFilename="test.pdf"
                messageDefinition={[]}
                setMessageDefinition={mockSetMessageDefinition}
                messageRealWorldAnalogy={[]}
                setMessageRealWorldAnalogy={mockSetMessageRealWorldAnalogy}
                messageELI5={[]}
                setMessageELI5={mockSetMessageELI5}
                isLoading={false}
                setIsLoading={mockSetIsLoading}
            />
        );


        // Wait for the tooltip to appear
        await vi.waitFor(() => {
            expect(screen.getByText('Dismiss')).toBeInTheDocument();
            expect(screen.getByText('Next')).toBeInTheDocument();
        });


        // Restore localStorage
        vi.unstubAllGlobals();
    });


    it('changes chat mode when clicking different options', async () => {
        const user = userEvent.setup();
       
        render(
            <Sidebar
                setChatType={mockSetChatType}
                activePdfFilename="test.pdf"
                messageDefinition={[]}
                setMessageDefinition={mockSetMessageDefinition}
                messageRealWorldAnalogy={[]}
                setMessageRealWorldAnalogy={mockSetMessageRealWorldAnalogy}
                messageELI5={[]}
                setMessageELI5={mockSetMessageELI5}
                isLoading={false}
                setIsLoading={mockSetIsLoading}
            />
        );


        // Click ELI5 button
        await user.click(screen.getByText('ELI5'));
       
        // Verify setChatType was called with 'ELI5'
        expect(mockSetChatType).toHaveBeenCalledWith('ELI5');
    });


    it('displays loading state correctly', () => {
        render(
            <Sidebar
                setChatType={mockSetChatType}
                activePdfFilename="test.pdf"
                messageDefinition={[]}
                setMessageDefinition={mockSetMessageDefinition}
                messageRealWorldAnalogy={[]}
                setMessageRealWorldAnalogy={mockSetMessageRealWorldAnalogy}
                messageELI5={[]}
                setMessageELI5={mockSetMessageELI5}
                isLoading={true}
                setIsLoading={mockSetIsLoading}
            />
        );


        // Check if loading state is reflected in the UI
        const loadingBoxes = screen.getAllByTestId('mui-box');
        expect(loadingBoxes.length).toBeGreaterThan(0);
    });


    it('displays messages correctly for each chat type', () => {
        const testMessages = [
            { sender: 'user', text: 'User message' },
            { sender: 'AI', text: 'Assistant response' }
        ];


        render(
            <Sidebar
                setChatType={mockSetChatType}
                activePdfFilename="test.pdf"
                messageDefinition={testMessages}
                setMessageDefinition={mockSetMessageDefinition}
                messageRealWorldAnalogy={testMessages}
                setMessageRealWorldAnalogy={mockSetMessageRealWorldAnalogy}
                messageELI5={testMessages}
                setMessageELI5={mockSetMessageELI5}
                isLoading={false}
                setIsLoading={mockSetIsLoading}
            />
        );


        // Check if messages are displayed
        const papers = screen.getAllByRole('generic');
        expect(papers.length).toBeGreaterThan(0);
    });


    it('renders image messages correctly', () => {

        //create test image data
        const imageMessages = [
            {
                sender: 'AI',
                type: 'image',
                imageUrl: 'test-image.jpg',
                text: 'Image description'
            }
        ];


        render(
            <Sidebar
                setChatType={mockSetChatType}
                activePdfFilename="test.pdf"
                messageDefinition={imageMessages}
                setMessageDefinition={mockSetMessageDefinition}
                messageRealWorldAnalogy={[]}
                setMessageRealWorldAnalogy={mockSetMessageRealWorldAnalogy}
                messageELI5={[]}
                setMessageELI5={mockSetMessageELI5}
                isLoading={false}
                setIsLoading={mockSetIsLoading}
            />
        );

        //grab image element
        const image = screen.getByRole('img');
        //test is image
        expect(image).toHaveAttribute('src', 'test-image.jpg');
        expect(image).toHaveAttribute('alt', 'Snipped Content');
    });


    it('shows loading dots when isLoading is true', () => {
        render(
            <Sidebar
                setChatType={mockSetChatType}
                activePdfFilename="test.pdf"
                messageDefinition={[]}
                setMessageDefinition={mockSetMessageDefinition}
                messageRealWorldAnalogy={[]}
                setMessageRealWorldAnalogy={mockSetMessageRealWorldAnalogy}
                messageELI5={[]}
                setMessageELI5={mockSetMessageELI5}
                isLoading={true}
                setIsLoading={mockSetIsLoading}
            />
        );


        // grab loading dots element
        const loadingBoxes = screen.getAllByTestId('mui-box');
        //check loading is showing
        expect(loadingBoxes.length).toBeGreaterThan(0);
    });


    it('handles tooltip interactions', async () => {
        const user = userEvent.setup();
       
        render(
            <Sidebar
                setChatType={mockSetChatType}
                activePdfFilename="test.pdf"
                messageDefinition={[]}
                setMessageDefinition={mockSetMessageDefinition}
                messageRealWorldAnalogy={[]}
                setMessageRealWorldAnalogy={mockSetMessageRealWorldAnalogy}
                messageELI5={[]}
                setMessageELI5={mockSetMessageELI5}
                isLoading={false}
                setIsLoading={mockSetIsLoading}
            />
        );


        // Click help icon (question mark) to open tooltip
        const helpIcon = screen.getByTestId('HelpOutlineIcon');
        await user.click(helpIcon);
       
        // Check if tooltip is shown in the screen
        expect(screen.getByText('Dismiss')).toBeInTheDocument();
       
        // Click dismiss button
        await user.click(screen.getByText('Dismiss'));
       
        // Check if tooltip is closed and removed from the screen
        expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
    });


    it('handles different chat type selections', async () => {
        const user = userEvent.setup();
       
        render(
            <Sidebar
                setChatType={mockSetChatType}
                activePdfFilename="test.pdf"
                messageDefinition={[]}
                setMessageDefinition={mockSetMessageDefinition}
                messageRealWorldAnalogy={[]}
                setMessageRealWorldAnalogy={mockSetMessageRealWorldAnalogy}
                messageELI5={[]}
                setMessageELI5={mockSetMessageELI5}
                isLoading={false}
                setIsLoading={mockSetIsLoading}
            />
        );

        //check if prompt button selector is working as expected

        // Test Real World Analogy selection
        await user.click(screen.getByText('Real world analogy'));
        expect(mockSetChatType).toHaveBeenCalledWith('Real world analogy');
       
        // Test ELI5 selection
        await user.click(screen.getByText('ELI5'));
        expect(mockSetChatType).toHaveBeenCalledWith('ELI5');
       
        // Test Definition selection
        await user.click(screen.getByText('Defintion'));
        expect(mockSetChatType).toHaveBeenCalledWith('Definition');
    });


    it('check Chat input functionality', () => {
        render(
            <Sidebar
                setChatType={mockSetChatType}
                activePdfFilename=""
                messageDefinition={[]}
                setMessageDefinition={mockSetMessageDefinition}
                messageRealWorldAnalogy={[]}
                setMessageRealWorldAnalogy={mockSetMessageRealWorldAnalogy}
                messageELI5={[]}
                setMessageELI5={mockSetMessageELI5}
                isLoading={false}
                setIsLoading={mockSetIsLoading}
            />
        );


        // Check if chat input is present
        const input = screen.getByPlaceholderText('Ask Anything');
        expect(input).toBeInTheDocument();
    });
});


// Component test for Tooltips
describe('<Tooltips>', () => {
    const mockHandleClose = vi.fn();


    it('renders with tour guide state', () => {
        render(
            <Tooltips
                state="tour"
                open={true}
                handleClose={mockHandleClose}
            />
        );


        // Check if backdrop is present
        expect(screen.getByTestId('mui-backdrop')).toBeInTheDocument();
       
        // Check if first step content is present
        expect(screen.getByText(/To the left is the PDF section/)).toBeInTheDocument();
       
        // Check if navigation buttons are present
        expect(screen.getByText('Dismiss')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });


    it('renders with highlight state', () => {
        render(
            <Tooltips
                state="highlight"
                open={true}
                handleClose={mockHandleClose}
            />
        );


        // Check if backdrop is present
        expect(screen.getByTestId('mui-backdrop')).toBeInTheDocument();
       
        // Check if highlight step content is present
        expect(screen.getByText(/you can select between highlighting and image-snip/)).toBeInTheDocument();
       
        // Check if navigation buttons are present
        expect(screen.getByText('Dismiss')).toBeInTheDocument();
        expect(screen.getByText('Finish')).toBeInTheDocument();
    });


    it('calls handleClose when dismiss button is clicked', async () => {
        const user = userEvent.setup();
       
        render(
            <Tooltips
                state="tour"
                open={true}
                handleClose={mockHandleClose}
            />
        );


        // Click dismiss button
        await user.click(screen.getByText('Dismiss'));
       
        // Verify handleClose was called
        expect(mockHandleClose).toHaveBeenCalled();
    });


    it('progresses through steps when next button is clicked', async () => {
        const user = userEvent.setup();
       
        render(
            <Tooltips
                state="tour"
                open={true}
                handleClose={mockHandleClose}
            />
        );


        // Click next button
        await user.click(screen.getByText('Next'));
       
        // Verify second step content is shown
        expect(screen.getByText(/You can switch between highlighting text/)).toBeInTheDocument();
    });


    it('shows finish button on last step', async () => {
        const user = userEvent.setup();
       
        render(
            <Tooltips
                state="highlight"
                open={true}
                handleClose={mockHandleClose}
            />
        );


        // Verify finish button is shown (highlight state only has one step)
        expect(screen.getByText('Finish')).toBeInTheDocument();
       
        // Click finish button
        await user.click(screen.getByText('Finish'));
       
        // Verify handleClose was called
        expect(mockHandleClose).toHaveBeenCalled();
    });
});



