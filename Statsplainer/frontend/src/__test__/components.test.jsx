import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { NavBar } from '../Navbar.jsx'
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';
import  Tooltip  from '../Tooltips';
import { Typography } from "@mui/material";

//  Checks if function existing in files being tested are called
vi.mock('../apiCalls', () => ({
    apiCallPost: vi.fn(),
}));

vi.mock("@mui/material", ()=> ({
    ...vi.importActual('react-router-dom'),
    BrowserRouter: ({ children}) => <div>{children}</div>,
    Link: ({children, to}) => <a href={to}>{children}</a>,
}));


vi.mock('../elements/helpers/createElement', () => ({
    createElement: vi.fn(),
}));

Element.prototype.scrollIntoView = vi.fn();

vi.mock('@mui/material', () => ({
    Box: ({ children}) => <div data-testid="mui-box">{children}</div>,
    Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
    TextField: ({ placeholder }) => <input placeholder={placeholder} />,
    IconButton: ({ children, onClick, 'aria-label' : ariaLabel }) => (
        <button onClick={onClick} aria-label={ariaLabel}>
            {children}
        </button>
    ),
    Paper: ({ children }) => <div>{children}</div>,
    Grid: ({ children }) => <div>{children}</div>,
    Grid2: ({ children }) => <div>{children}</div>,
    AppBar: ({children}) => <div data-testid="mnui-appbar">{children}</div>,
    Backdrop: ({ children,open}) => open ? <div data-testid="mui-backdrop">{children}</div> : null,
    Snackbar: ({children,open}) => open ? <div data-testid="mui-snackbar">{children}</div> : null,
    Slide: ({children}) => <div>{children}</div>,
    Typography: ({ children}) => <div>{children}</div>,
    Toolbar: ({children}) => <div data-testi="mui-toolbar">{children}</div>,
}));

vi.mock("@mui/icons-material/HelpOutline", () => ({
    default: () => <span data-testid="HelpOutlineIcon">HelpIcon</span>
}));

vi.mock("@mui/icons-material/Send", () => ({
    default: () => <span>SendIcon</span>
}));

vi.mock("@mui/icons-material/Close", () => ({
    default: () => <span>CloseIcon</span> 
}));

vi.mock("@mui/icons-material/ArrowForward", () => ({
    default: () => <span>ArrowForwardIcon</span> 
}));

vi.mock("@mui/icons-material/HistoryRounded", () => ({
    default: () => <span>HistoryIcon</span>
}));

vi.mock("@mui/icons-material/AddRounded", () => ({
    default: () => <span>AddIcon</span>
}));

afterEach(() => {
    vi.clearAllMocks();
    userEvent
});

// Component test for Navbar
describe('<NavBar>', () => {
    it('renders on landing page', () => {
        render(
            <BrowserRouter>
                <NavBar pdfUploaded={false} setPdfUploaded={vi.fn()} setUploadedFile={vi.fn()} page={'/'}/>
            </BrowserRouter>
        );

        expect(screen.queryByRole('button', {name: /add new/i })).not.toBeInTheDocument();
        expect(screen.getByRole('button', {name: /view history/i })).toBeInTheDocument();
    });

    it('renders on pdf page', () => {
        render(
            <BrowserRouter>
                <NavBar pdfUploaded={true} setPdfUploaded={vi.fn()} setUploadedFile={vi.fn()} page={'/'}/>
            </BrowserRouter>
        );

        expect(screen.getByRole('button', {name: /add new/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /view history/i})).toBeInTheDocument();
    });

    it('renders on history page', () => {
        render(
            <BrowserRouter>
                <NavBar pdfUploaded={false} setPdfUploaded={vi.fn()} setUploadedFile={vi.fn()} page={'/history'}/>
            </BrowserRouter>
        );

        expect(screen.getByRole('button', {name : /add new/i})).toBeInTheDocument();
        expect(screen.queryByRole('button', {name: /view history/i})).not.toBeInTheDocument();
    });
});




// Component test for Sidebar
describe('<Sidebar>', ()=> {

    beforeEach(() => {
        // Clear LocalStorage before testing
        localStorage.clear();
    })

    it("renders with default state", () => {
        render(
            // assign all parameter empty list or false
            // assign each state to the vi.fn()
            <Sidebar 
                setChatType={vi.fn()}
                activePdfFilename={"test.pdf"}
                messageDefinition={[]}
                setMessageDefinition={vi.fn()}
                messageRealWorldAnalogy={[]}
                setMessageRealWorldAnalogy={vi.fn()}
                messageELI5={[]}
                setMessageELI5={vi.fn()}
                isLoading={false}
                mockSetIsLoading={vi.fn()}
            
            />
        );

        //check if prompt button selectors are present
        expect(screen.getByRole('button', {name : "Defintion"})).toBeInTheDocument();
        expect(screen.getByRole('button', {name : "ELI5"})).toBeInTheDocument();
        expect(screen.getByRole('button', {name : "Real world analogy"})).toBeInTheDocument();

        //check if help icon is present for tooltips
        expect(screen.getByRole('button', {name : "HelpIcon"})).toBeInTheDocument();

        //check if chat input section is present
        expect(screen.getByPlaceholderText("Ask Anything")).toBeInTheDocument();
        expect(screen.getByRole('button', {name : "SendIcon"})).toBeInTheDocument();
    })
});

// Component test for Tooltip
describe('<Tooltip>', () => {
    const mockHandleClose = vi.fn();
    it("renders with tour guide state", ()=> {
        render(
            <Tooltip
                state="tour"
                open={true}
                handleClose={vi.fn()}
            />
        );

        expect(screen.getByTestId('mui-backdrop')).toBeInTheDocument();

        expect(screen.getByText(/To the left is the PDF section/)).toBeInTheDocument();

        expect(screen.getByText("Dismiss")).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();

    });

    it("renders with highlight state", ()=> {
        render(
            <Tooltip 
                state="highlight"
                open={true}
                handleClose={vi.fn()}
            
            />
        );

        expect(screen.getByTestId('mui-backdrop')).toBeInTheDocument();
        expect(screen.getByText(/you can select between highlighting and image-snip/)).toBeInTheDocument();

        expect(screen.getByText('Dismiss')).toBeInTheDocument();
        expect(screen.getByText('Finish')).toBeInTheDocument();
    });

    it("calls handleClose when dismiss button is clicked", async() => {
        const user = userEvent.setup();

        render(
            <Tooltip 
                state="tour"
                open={true}
                handleClose={mockHandleClose}
            />
        );

        await user.click(screen.getByText("Dismiss"));

        expect(mockHandleClose).toHaveBeenCalled();
    });

    it("progresses through steps when next button is clicked", async() => {
        const user = userEvent.setup();

        render(
            <Tooltip 
                state="tour"
                open={true}
                handleClose={vi.fn()}
            
            />
        );

        await user.click(screen.getByText('Next'));

        expect(screen.getByText(/You can switch between highlighting text/)).toBeInTheDocument();
    });

    it("shows finish button on last step", async() => {
        const user = userEvent.setup();

        render(
            <Tooltip 
                state="highlight"
                open={true}
                handleClose={mockHandleClose}
            />
        );

        expect(screen.getByText('Finish')).toBeInTheDocument();

        await user.click(screen.getByText("Finish"));

        expect(mockHandleClose).toHaveBeenCalled();
    });
    
})