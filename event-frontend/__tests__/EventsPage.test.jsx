import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventsPage from "../src/app/events/page";
import api from "../src/lib/api";

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
    get: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));

import { useQuery } from "@tanstack/react-query";

const mockEvents = {
    content: [
        {
            id: 1,
            title: "AI Conference 2026",
            location: "Chennai",
            eventDate: "2026-11-15",
            ticketPrice: 500,
            availableSeats: 50,
        },
        {
            id: 2,
            title: "Technology Summit",
            location: "Bangalore",
            eventDate: "2026-12-10",
            ticketPrice: 750,
            availableSeats: 30,
        },
    ],
    totalPages: 2,
    number: 0,
    totalElements: 2,
};

describe("EventsPage", () => {

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();

        localStorage.setItem("token", "test-token");

        useQuery.mockReturnValue({
            data: mockEvents,
            isLoading: false,
            isError: false,
        });
    });

    test("shows loading state when user is not authenticated", () => {
        localStorage.removeItem("token");

        render(<EventsPage />);

        expect(
            screen.getByText("Loading...")
        ).toBeInTheDocument();
    });

    test("renders events correctly", async () => {
        render(<EventsPage />);

        expect(
            await screen.findByRole("heading", {
                name: "Upcoming Events",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText("AI Conference 2026")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Technology Summit")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Chennai")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Bangalore")
        ).toBeInTheDocument();

        expect(
            screen.getByText("₹500")
        ).toBeInTheDocument();

        expect(
            screen.getByText("₹750")
        ).toBeInTheDocument();

        expect(
            screen.getByText("50 seats left")
        ).toBeInTheDocument();

        expect(
            screen.getByText("30 seats left")
        ).toBeInTheDocument();

        expect(
            screen.getAllByRole("link", {
                name: "View Event",
            })
        ).toHaveLength(2);
    });

    test("shows loading events state", () => {
        useQuery.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
        });

        render(<EventsPage />);

        expect(
            screen.getByText("Loading events...")
        ).toBeInTheDocument();
    });

    test("shows error state when events fail to load", () => {
        useQuery.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        });

        render(<EventsPage />);

        expect(
            screen.getByText(
                "Failed to load events. Please try again."
            )
        ).toBeInTheDocument();
    });

    test("shows no events message when result is empty", () => {
        useQuery.mockReturnValue({
            data: {
                content: [],
                totalPages: 0,
                number: 0,
                totalElements: 0,
            },
            isLoading: false,
            isError: false,
        });

        render(<EventsPage />);

        expect(
            screen.getByText("No events found")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Try changing your search or filter."
            )
        ).toBeInTheDocument();
    });

    test("allows user to enter search filters", async () => {
        const user = userEvent.setup();

        render(<EventsPage />);

        const titleInput =
            screen.getByPlaceholderText(
                "Search by title"
            );

        const locationInput =
            screen.getByPlaceholderText(
                "Search by location"
            );

        await user.type(
            titleInput,
            "AI Conference"
        );

        await user.type(
            locationInput,
            "Chennai"
        );

        expect(titleInput).toHaveValue(
            "AI Conference"
        );

        expect(locationInput).toHaveValue(
            "Chennai"
        );
    });

    test("updates filters when Search is clicked", async () => {
        const user = userEvent.setup();

        render(<EventsPage />);

        await user.type(
            screen.getByPlaceholderText(
                "Search by title"
            ),
            "AI Conference"
        );

        await user.type(
            screen.getByPlaceholderText(
                "Search by location"
            ),
            "Chennai"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Search",
            })
        );

        await waitFor(() => {
            expect(useQuery).toHaveBeenCalled();
        });

        const lastCall =
            useQuery.mock.calls[
                useQuery.mock.calls.length - 1
            ][0];

        expect(lastCall.queryKey).toEqual([
            "events",
            0,
            6,
            "AI Conference",
            "Chennai",
            "id",
        ]);
    });

    test("clears search filters", async () => {
    const user = userEvent.setup();

    render(<EventsPage />);

    const titleInput =
        screen.getByPlaceholderText("Search by title");

    const locationInput =
        screen.getByPlaceholderText("Search by location");

    await user.type(
        titleInput,
        "AI Conference"
    );

    await user.type(
        locationInput,
        "Chennai"
    );

    await user.click(
        screen.getByRole("button", {
            name: "Clear",
        })
    );

    expect(titleInput).toHaveValue("");
    expect(locationInput).toHaveValue("");

    // Sort By should be reset to "id"
    const selects = screen.getAllByRole("combobox");

    expect(selects[0]).toHaveValue("id");

    // Events Per Page should remain 6
    expect(selects[1]).toHaveValue("6");
});

    test("changes sorting option", async () => {
    const user = userEvent.setup();

    render(<EventsPage />);

    const selects = screen.getAllByRole("combobox");

    // First select = Sort By
    const sortSelect = selects[0];

    expect(sortSelect).toHaveValue("id");

    await user.selectOptions(
        sortSelect,
        "title"
    );

    expect(sortSelect).toHaveValue("title");

    await waitFor(() => {
        expect(useQuery).toHaveBeenCalled();
    });
});

    test("changes events per page", async () => {
        const user = userEvent.setup();

        render(<EventsPage />);

        const sizeSelect =
            screen.getByDisplayValue("6");

        await user.selectOptions(
            sizeSelect,
            "9"
        );

        expect(sizeSelect).toHaveValue("9");

        await waitFor(() => {
            expect(useQuery).toHaveBeenCalled();
        });
    });

    test("displays pagination controls when multiple pages exist", () => {
        render(<EventsPage />);

        expect(
            screen.getByRole("button", {
                name: "Previous",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Next",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "1",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "2",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText("Page 1 of 2")
        ).toBeInTheDocument();
    });

    test("disables Previous button on first page", () => {
        render(<EventsPage />);

        expect(
            screen.getByRole("button", {
                name: "Previous",
            })
        ).toBeDisabled();
    });

    test("View Event links point to correct event pages", () => {
        render(<EventsPage />);

        const links =
            screen.getAllByRole("link", {
                name: "View Event",
            });

        expect(links[0]).toHaveAttribute(
            "href",
            "/events/1"
        );

        expect(links[1]).toHaveAttribute(
            "href",
            "/events/2"
        );
    });
});