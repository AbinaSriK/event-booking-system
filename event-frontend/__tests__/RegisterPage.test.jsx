import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "../src/app/register/page";
import api from "../src/lib/api";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

jest.mock("../src/lib/api", () => ({
    post: jest.fn(),
}));

describe("RegisterPage", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders registration form correctly", () => {
        render(<RegisterPage />);

        expect(
            screen.getByRole("heading", { name: "Register" })
        ).toBeInTheDocument();

        expect(screen.getByLabelText("Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Register" })
        ).toBeInTheDocument();
    });

    test("allows user to enter registration details", async () => {
        const user = userEvent.setup();

        render(<RegisterPage />);

        const nameInput = screen.getByLabelText("Name");
        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");

        await user.type(nameInput, "Abina");
        await user.type(emailInput, "abina@test.com");
        await user.type(passwordInput, "password123");

        expect(nameInput).toHaveValue("Abina");
        expect(emailInput).toHaveValue("abina@test.com");
        expect(passwordInput).toHaveValue("password123");
    });

    test("registers successfully and redirects to login", async () => {
        const user = userEvent.setup();

        api.post.mockResolvedValue({
            data: {
                id: 1,
                name: "Abina",
                email: "abina@test.com",
            },
        });


        render(<RegisterPage />);

        await user.type(
            screen.getByLabelText("Name"),
            "Abina"
        );

        await user.type(
            screen.getByLabelText("Email"),
            "abina@test.com"
        );

        await user.type(
            screen.getByLabelText("Password"),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: "Register" })
        );

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                "/api/users",
                {
                    name: "Abina",
                    email: "abina@test.com",
                    password: "password123",
                }
            );
        });

        expect(
            screen.getByText("Registration successful")
        ).toBeInTheDocument();

    await waitFor(
        () => {
            expect(mockPush).toHaveBeenCalledWith("/login");
        },
        {
            timeout: 3000,
        }
    );
    });

    test("shows error message when registration fails", async () => {
        const user = userEvent.setup();

        api.post.mockRejectedValue(
            new Error("Registration failed")
        );

        render(<RegisterPage />);

        await user.type(
            screen.getByLabelText("Name"),
            "Abina"
        );

        await user.type(
            screen.getByLabelText("Email"),
            "abina@test.com"
        );

        await user.type(
            screen.getByLabelText("Password"),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: "Register" })
        );

        expect(
            await screen.findByText("Registration failed")
        ).toBeInTheDocument();

        expect(mockPush).not.toHaveBeenCalled();
    });

    test("clears previous messages when submitting again", async () => {
        const user = userEvent.setup();

        api.post
            .mockRejectedValueOnce(new Error("Registration failed"))
            .mockResolvedValueOnce({
                data: {
                    id: 1,
                    name: "Abina",
                    email: "abina@test.com",
                },
            });

        render(<RegisterPage />);

        await user.type(
            screen.getByLabelText("Name"),
            "Abina"
        );

        await user.type(
            screen.getByLabelText("Email"),
            "abina@test.com"
        );

        await user.type(
            screen.getByLabelText("Password"),
            "password123"
        );

        const registerButton = screen.getByRole(
            "button",
            { name: "Register" }
        );

        await user.click(registerButton);

        expect(
            await screen.findByText("Registration failed")
        ).toBeInTheDocument();

        await user.click(registerButton);

        await waitFor(() => {
            expect(
                screen.getByText("Registration successful")
            ).toBeInTheDocument();
        });

        expect(
            screen.queryByText("Registration failed")
        ).not.toBeInTheDocument();
    });
});