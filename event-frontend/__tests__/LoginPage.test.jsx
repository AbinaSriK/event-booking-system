import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../src/app/login/page";
import api from "../src/lib/api";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

jest.mock("next/link", () => {
    return function MockLink({ children, href, ...props }) {
        return (
            <a href={href} {...props}>
                {children}
            </a>
        );
    };
});

jest.mock("../src/lib/api", () => ({
    post: jest.fn(),
}));

describe("LoginPage", () => {

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test("renders login form correctly", () => {
        render(<LoginPage />);

        expect(
            screen.getByRole("heading", { name: "Welcome back" })
        ).toBeInTheDocument();

        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Login" })
        ).toBeInTheDocument();

        expect(screen.getByText("Register")).toBeInTheDocument();
        expect(screen.getByText("← Back to Home")).toBeInTheDocument();
    });

    test("allows user to enter email and password", async () => {
        const user = userEvent.setup();

        render(<LoginPage />);

        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");

        await user.type(emailInput, "test@test.com");
        await user.type(passwordInput, "password123");

        expect(emailInput).toHaveValue("test@test.com");
        expect(passwordInput).toHaveValue("password123");
    });

    test("logs in successfully and redirects to dashboard", async () => {
        const user = userEvent.setup();

        const payload = {
            role: "USER",
        };

        const encodedPayload = btoa(JSON.stringify(payload));

        const token = `header.${encodedPayload}.signature`;

        api.post.mockResolvedValue({
            data: {
                token: token,
                userId: 1,
                email: "test@test.com",
            },
        });

        const dispatchSpy = jest.spyOn(window, "dispatchEvent");

        render(<LoginPage />);

        await user.type(
            screen.getByLabelText("Email"),
            "test@test.com"
        );

        await user.type(
            screen.getByLabelText("Password"),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: "Login" })
        );

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                "/api/users/login",
                {
                    email: "test@test.com",
                    password: "password123",
                }
            );
        });

        expect(localStorage.getItem("token")).toBe(token);
        expect(localStorage.getItem("userId")).toBe("1");
        expect(localStorage.getItem("email")).toBe("test@test.com");
        expect(localStorage.getItem("role")).toBe("USER");

        expect(dispatchSpy).toHaveBeenCalled();

        expect(mockPush).toHaveBeenCalledWith("/dashboard");

        dispatchSpy.mockRestore();
    });

    test("shows error message when login fails", async () => {
        const user = userEvent.setup();

        api.post.mockRejectedValue(new Error("Login failed"));

        render(<LoginPage />);

        await user.type(
            screen.getByLabelText("Email"),
            "wrong@test.com"
        );

        await user.type(
            screen.getByLabelText("Password"),
            "wrongpassword"
        );

        await user.click(
            screen.getByRole("button", { name: "Login" })
        );

        expect(
            await screen.findByText("Invalid email or password.")
        ).toBeInTheDocument();

        expect(mockPush).not.toHaveBeenCalled();
    });

    test("shows loading state while login is in progress", async () => {
        const user = userEvent.setup();

        let resolveLogin;

        api.post.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveLogin = resolve;
                })
        );

        render(<LoginPage />);

        await user.type(
            screen.getByLabelText("Email"),
            "test@test.com"
        );

        await user.type(
            screen.getByLabelText("Password"),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: "Login" })
        );

        expect(
            screen.getByRole("button", { name: "Logging in..." })
        ).toBeDisabled();

        resolveLogin({
            data: {
                token: "header.payload.signature",
                userId: 1,
                email: "test@test.com",
            },
        });

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Login" })
            ).toBeInTheDocument();
        });
    });
});