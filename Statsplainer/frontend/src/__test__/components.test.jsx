import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { NavBar } from '../Navbar.jsx'
import { FinalPopUp } from "../FinalPopUp.jsx";
import { BrowserRouter } from 'react-router-dom';

vi.mock('../apiCalls', () => ({
    apiCallPost: vi.fn(),
}));

vi.mock('react-pdf', () => ({
    Document: vi.fn(function MockDocument({ onLoadSuccess, children }) {
        globalThis.mockOnLoadSuccess = onLoadSuccess;
        return <div data-testid="mock-document">{children}</div>;
    }),
    Page: vi.fn(({ pageNumber, scale, width }) => {
        return <div data-testid={`mock-page-${pageNumber}`} data-scale={scale} data-width={width}>Page {pageNumber}</div>;
    }),
    pdfjs: {
        GlobalWorkerOptions: { workerPort: null },
    },
}));
vi.mock('pdfjs-dist/build/pdf.worker?worker', () => ({ default: vi.fn() })); // Keep worker mock

afterEach(() => {
    vi.clearAllMocks();
});

const setFeedbackButton = vi.fn();
const setPdfUploaded = vi.fn();
const setUploadedFile = vi.fn();
const setPopUpDisplay = vi.fn();


describe('<NavBar>', () => {
    const user = userEvent.setup();
    it('renders feedback button', async () => {
        render(
            <BrowserRouter>
                <NavBar
                    pdfUploaded={false}
                    setPdfUploaded={setPdfUploaded}
                    setUploadedFile={setUploadedFile}
                    page={'/'}
                    feedBackButton={true}
                    setPopUpDisplay={setPopUpDisplay}
                />
            </BrowserRouter>
        );

        const feedbackButton = screen.getByRole('button', { name: /feedback/i });
        expect(feedbackButton).toBeInTheDocument();

        await user.click(feedbackButton);

        expect(setPopUpDisplay).toHaveBeenCalledTimes(1);
        expect(setPopUpDisplay).toHaveBeenCalledWith(true);
    });

    it('renders on pdf page and resets on add click', async () => {
        render(
            <BrowserRouter>
                <NavBar
                    pdfUploaded={true}
                    setPdfUploaded={setPdfUploaded}
                    setUploadedFile={setUploadedFile}
                    page={'/'}
                    setPopUpDisplay={setPopUpDisplay}
                    feedBackButton={false}
                 />
            </BrowserRouter>
        );

        const addNewButton = screen.getByRole('link', { name: /add new/i });
        expect(addNewButton).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /view history/i })).toBeInTheDocument();

        await user.click(addNewButton);

        expect(setPdfUploaded).toHaveBeenCalledTimes(1);
        expect(setPdfUploaded).toHaveBeenCalledWith(false);
        expect(setUploadedFile).toHaveBeenCalledTimes(1);
        expect(setUploadedFile).toHaveBeenCalledWith(null);
    });

    it('renders on history page and resets on add click', async () => {
        render(
            <BrowserRouter>
                <NavBar
                    pdfUploaded={false}
                    setPdfUploaded={setPdfUploaded}
                    setUploadedFile={setUploadedFile}
                    page={'/history'}
                    setPopUpDisplay={setPopUpDisplay}
                    feedBackButton={false}
                />
            </BrowserRouter>
        );

        const addNewButton = screen.getByRole('link', { name: /add new/i });
        expect(addNewButton).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /view history/i })).not.toBeInTheDocument();

        await user.click(addNewButton);

        expect(setPdfUploaded).toHaveBeenCalledTimes(1);
        expect(setPdfUploaded).toHaveBeenCalledWith(false);
        expect(setUploadedFile).toHaveBeenCalledTimes(1);
        expect(setUploadedFile).toHaveBeenCalledWith(null);
    });
});



describe('<FinalPopUp>', () => {
    const user = userEvent.setup(); // Setup userEvent for this suite
    const renderComponent = () => {
        return render(
            <FinalPopUp
                setPopUpDisplay={setPopUpDisplay}
                setFeedbackButton={setFeedbackButton}
            />
        );
    };
    // ... (rest of FinalPopUp tests remain the same) ...
    it('should render initial elements correctly and have submit button disabled', () => {
        renderComponent();

        expect(screen.getByRole('heading', { name: /how was your experience/i })).toBeInTheDocument();

        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Tell us what you think...')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /complete later/i })).toBeInTheDocument();
        const submitButton = screen.getByRole('button', { name: /submit feedback/i });
        expect(submitButton).toBeInTheDocument();

        expect(submitButton).toBeDisabled();
    });

    it('should update email and feedback inputs on user typing', async () => {
        renderComponent();

        const emailInput = screen.getByPlaceholderText('Email');
        const feedbackInput = screen.getByPlaceholderText('Tell us what you think...');

        await user.type(emailInput, 'test@example.com');
        expect(emailInput).toHaveValue('test@example.com');

        await user.type(feedbackInput, 'This is my feedback.');
        expect(feedbackInput).toHaveValue('This is my feedback.');
    });

    it('should enable submit button only when rating, valid email, and feedback are provided', async () => {
        renderComponent();

        const submitButton = screen.getByRole('button', { name: /submit feedback/i });
        const emailInput = screen.getByPlaceholderText('Email');
        const feedbackInput = screen.getByPlaceholderText('Tell us what you think...');
        const ratingOption4 = screen.getByRole('radio', { name: '4 Stars' });

        expect(submitButton).toBeDisabled();

        await user.click(ratingOption4);
        expect(submitButton).toBeDisabled();

        await user.type(feedbackInput, 'Some text');
        expect(submitButton).toBeDisabled();

        await user.type(emailInput, 'test@invalid');
        expect(submitButton).toBeDisabled();

        await user.clear(emailInput);
        await user.type(emailInput, 'test@valid.com');
        expect(submitButton).toBeEnabled();

        await user.clear(feedbackInput);
        expect(submitButton).toBeDisabled();

        await user.type(feedbackInput, 'Some text again');
        expect(submitButton).toBeEnabled();

        await user.clear(emailInput);
        expect(submitButton).toBeDisabled();

        await user.type(emailInput, 'test@valid.com');
        expect(submitButton).toBeEnabled();
    });

    it('should call reset, close popup, and set feedback button true on "Complete Later" click', async () => {
        renderComponent();

        const completeLaterButton = screen.getByRole('button', { name: /complete later/i });
        const emailInput = screen.getByPlaceholderText('Email');
        const feedbackInput = screen.getByPlaceholderText('Tell us what you think...');
        const ratingOption3 = screen.getByRole('radio', { name: '3 Stars' });

        await user.click(ratingOption3);
        await user.type(emailInput, 'temporary@test.com');
        await user.type(feedbackInput, 'will complete later');

        await user.click(completeLaterButton);

        expect(setPopUpDisplay).toHaveBeenCalledTimes(1);
        expect(setPopUpDisplay).toHaveBeenCalledWith(false);

        expect(setFeedbackButton).toHaveBeenCalledTimes(1);
        expect(setFeedbackButton).toHaveBeenCalledWith(true);

        expect(emailInput).toHaveValue('');
        expect(feedbackInput).toHaveValue('');

        const submitButton = screen.getByRole('button', { name: /submit feedback/i });
        expect(submitButton).toBeDisabled();
        expect(ratingOption3).not.toBeChecked();
    });

    it('should call submit logic, close popup, reset form, and set feedback button false on "Submit Feedback" click', async () => {
        renderComponent();

        const submitButton = screen.getByRole('button', { name: /submit feedback/i });
        const emailInput = screen.getByPlaceholderText('Email');
        const feedbackInput = screen.getByPlaceholderText('Tell us what you think...');
        const ratingOption5 = screen.getByRole('radio', { name: '5 Stars' });

        await user.click(ratingOption5);
        await user.type(emailInput, 'submit@test.co');
        await user.type(feedbackInput, 'Submit this');
        expect(submitButton).toBeEnabled();

        await user.click(submitButton);

        expect(setFeedbackButton).toHaveBeenCalledTimes(1);
        expect(setFeedbackButton).toHaveBeenCalledWith(false);
        expect(setPopUpDisplay).toHaveBeenCalledTimes(1);
        expect(setPopUpDisplay).toHaveBeenCalledWith(false);

        expect(emailInput).toHaveValue('');
        expect(feedbackInput).toHaveValue('');
        expect(ratingOption5).not.toBeChecked();

        expect(submitButton).toBeDisabled();
    });
});