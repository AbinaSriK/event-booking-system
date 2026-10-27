import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "../src/components/Navbar";

jest.mock("next/link", () => {
    return function MockLink({ children, href, ...props }) {
        return (
            <a href={href} {...props}>
                {children}
            </a>
        );
    };
});

describe("Navbar", () => {

    beforeEach(() => {
        localStorage.clear();
    });

    test("shows Login and Register for unauthenticated user", async () => {
        render(<Navbar />);

        await waitFor(() => {
            expect(screen.getByText("Home")).toBeInTheDocument();
        });

        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByText("Register")).toBeInTheDocument();

        expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
        expect(screen.queryByText("Logout")).not.toBeInTheDocument();
    });


    test("shows user navigation for normal user", async () => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem("role", "USER");

        render(<Navbar />);

        await waitFor(() => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });

        expect(screen.getByText("Events")).toBeInTheDocument();
        expect(screen.getByText("My Bookings")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();

        expect(screen.queryByText("Manage Events")).not.toBeInTheDocument();
        expect(screen.queryByText("Manage Users")).not.toBeInTheDocument();

        expect(screen.queryByText("Login")).not.toBeInTheDocument();
        expect(screen.queryByText("Register")).not.toBeInTheDocument();
    });


    test("shows admin navigation for admin user", async () => {
        localStorage.setItem("token", "admin-token");
        localStorage.setItem("role", "ADMIN");

        render(<Navbar />);

        await waitFor(() => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });

        expect(screen.getByText("Manage Events")).toBeInTheDocument();
        expect(screen.getByText("Manage Users")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();

        expect(screen.queryByText("Events")).not.toBeInTheDocument();
        expect(screen.queryByText("My Bookings")).not.toBeInTheDocument();

        expect(screen.queryByText("Login")).not.toBeInTheDocument();
        expect(screen.queryByText("Register")).not.toBeInTheDocument();
    });


    test("updates navbar when auth-change event is dispatched", async () => {
        render(<Navbar />);

        await waitFor(() => {
            expect(screen.getByText("Login")).toBeInTheDocument();
        });

        localStorage.setItem("token", "test-token");
        localStorage.setItem("role", "USER");

        window.dispatchEvent(new Event("auth-change"));

        await waitFor(() => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });

        expect(screen.getByText("Events")).toBeInTheDocument();
        expect(screen.getByText("My Bookings")).toBeInTheDocument();
    });


    test("logout clears authentication data", async () => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem("userId", "1");
        localStorage.setItem("email", "test@test.com");
        localStorage.setItem("role", "USER");

        render(<Navbar />);

        const logoutButton = await screen.findByText("Logout");

        const originalLocation = window.location;

        try {
            delete window.location;

            window.location = {
                href: "",
            };

            await userEvent.click(logoutButton);

            expect(localStorage.getItem("token")).toBeNull();
            expect(localStorage.getItem("userId")).toBeNull();
            expect(localStorage.getItem("email")).toBeNull();
            expect(localStorage.getItem("role")).toBeNull();

        } finally {
            window.location = originalLocation;
        }
    });
});