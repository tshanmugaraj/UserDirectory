
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from "vitest";

import {
    render,
    screen,
    waitFor
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { MemoryRouter } from "react-router-dom";

import UserList from "./UserList";

import {
    getUsers,
    deleteUser
} from "../services/userService";

// Mock API service
vi.mock("../services/userService", () => ({
    getUsers: vi.fn(),
    deleteUser: vi.fn()
}));

// Sample user data
const sampleUsers = [
    {
        id: 1,
        name: "Raj",
        age: 30,
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600001"
    },
    {
        id: 2,
        name: "Kumar",
        age: 28,
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001"
    }
];

// Helper function
const renderUserList = () => {
    return render(
        <MemoryRouter>
            <UserList />
        </MemoryRouter>
    );
};

describe("UserList Component Tests", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // Test 1: Display users
    it("should display all users successfully", async () => {

        getUsers.mockResolvedValue(sampleUsers);

        renderUserList();

        expect(
            await screen.findByText("Raj")
        ).toBeInTheDocument();

        expect(screen.getByText("Kumar")).toBeInTheDocument();

        expect(screen.getByText("Chennai")).toBeInTheDocument();

        expect(screen.getByText("Bangalore")).toBeInTheDocument();
    });

    // Test 2: Display loading spinner
    it("should display loading spinner while fetching users", () => {

        getUsers.mockReturnValue(new Promise(() => {}));

        const { container } = renderUserList();

        expect(screen.getByText("Loading users..."))
            .toBeInTheDocument();

        expect(container.querySelector(".spinner"))
            .toBeInTheDocument();
    });

    // Test 3: Display error when API fails
    it("should display error message when API fails", async () => {

        vi.spyOn(console, "error").mockImplementation(() => {});

        getUsers.mockRejectedValue(new Error("API failed"));

        renderUserList();

        expect(
            await screen.findByText(
                "Unable to load users. Please try again."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText("Unable to display users.")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Retry" })
        ).toBeInTheDocument();
    });

    // Test 4: Display empty state
    it("should display message when no users are available", async () => {

        getUsers.mockResolvedValue([]);

        renderUserList();

        expect(
            await screen.findByText(
                "No users found. Please add a user."
            )
        ).toBeInTheDocument();
    });

    // Test 5: Delete user successfully
    it("should delete user successfully", async () => {

        const user = userEvent.setup();

        getUsers.mockResolvedValue(sampleUsers);

        deleteUser.mockResolvedValue(undefined);

        const confirmSpy = vi
            .spyOn(window, "confirm")
            .mockReturnValue(true);

        renderUserList();

        await screen.findByText("Raj");

        await user.click(
            screen.getAllByRole("button", { name: "Delete" })[0]
        );

        expect(confirmSpy).toHaveBeenCalledWith(
            "Are you sure you want to delete this user?"
        );

        await waitFor(() => {
            expect(deleteUser).toHaveBeenCalledWith(1);
        });

        expect(
            await screen.findByText("User deleted successfully!")
        ).toBeInTheDocument();

        expect(screen.queryByText("Raj")).not.toBeInTheDocument();
    });

    // Test 6: Cancel delete confirmation
    it("should not delete user when confirmation is cancelled", async () => {

        const user = userEvent.setup();

        getUsers.mockResolvedValue(sampleUsers);

        vi.spyOn(window, "confirm").mockReturnValue(false);

        renderUserList();

        await screen.findByText("Raj");

        await user.click(
            screen.getAllByRole("button", { name: "Delete" })[0]
        );

        expect(deleteUser).not.toHaveBeenCalled();

        expect(screen.getByText("Raj")).toBeInTheDocument();
    });

});
