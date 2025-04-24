import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { NavBar } from '../Navbar.jsx'
import { BrowserRouter } from 'react-router-dom';

//  Checks if function existing in files being tested are called
vi.mock('../apiCalls', () => ({
    apiCallPost: vi.fn(),
}));

vi.mock('../elements/helpers/createElement', () => ({
    createElement: vi.fn(),
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

        expect(screen.queryByRole('link', { name: /add new/i })).not.toBeInTheDocument();
        expect(screen.getByRole('link', { name: /view history/i })).toBeInTheDocument();
    });

    it('renders on pdf page', () => {
        render(
            <BrowserRouter>
                <NavBar pdfUploaded={true} setPdfUploaded={vi.fn()} setUploadedFile={vi.fn()} page={'/'}/>
            </BrowserRouter>
        );

        expect(screen.getByRole('link', { name: /add new/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /view history/i })).toBeInTheDocument();
    });

    it('renders on history page', () => {
        render(
            <BrowserRouter>
                <NavBar pdfUploaded={false} setPdfUploaded={vi.fn()} setUploadedFile={vi.fn()} page={'/history'}/>
            </BrowserRouter>
        );

        expect(screen.getByRole('link', { name: /add new/i })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /view history/i })).not.toBeInTheDocument();
    });
});