
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AddUser from "./AddUser";
import { createUser } from "../services/userService";

// Mock the API service
vi.mock("../services/userService", () => ({
    createUser: vi.fn()
}));

// Mock Auth0
vi.mock("@auth0/auth0-react", () => ({
    useAuth0: () => ({
        getAccessTokenSilently: vi.fn().mockResolvedValue("fake-access-token")
    })
}));

// Helper function to render the component
const renderAddUser = () => {
    return render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<AddUser />} />
                <Route
                    path="/list"
                    element={<h2>User List Page</h2>}
                />
            </Routes>
        </MemoryRouter>
    );
};

describe("AddUser Component Tests", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // Test 1: Check whether Add User page renders
    it("should render the Add User page", () => {
        renderAddUser();

        expect(
            screen.getByRole("heading", { name: "Add New User" })
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Enter name")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Save User" })
        ).toBeInTheDocument();
    });

    // Test 2: Check empty form validation
    it("should display validation errors when form is empty", async () => {
        const user = userEvent.setup();

        renderAddUser();

        await user.click(
            screen.getByRole("button", { name: "Save User" })
        );

        expect(screen.getByText("Name is required")).toBeInTheDocument();
        expect(screen.getByText("Please enter a valid age")).toBeInTheDocument();
        expect(screen.getByText("City is required")).toBeInTheDocument();
        expect(screen.getByText("State is required")).toBeInTheDocument();
        expect(screen.getByText("Pincode is required")).toBeInTheDocument();

        expect(createUser).not.toHaveBeenCalled();
    });

    // Test 3: Check successful user creation
    it("should create user successfully and navigate to list page", async () => {
        const user = userEvent.setup();

        createUser.mockResolvedValue({
            id: 1,
            name: "Raj",
            age: 30,
            city: "Chennai",
            state: "Tamil Nadu",
            pincode: "600001"
        });

        renderAddUser();

        await user.type(screen.getByPlaceholderText("Enter name"), "Raj");
        await user.type(screen.getByPlaceholderText("Enter age"), "30");
        await user.type(screen.getByPlaceholderText("Enter city"), "Chennai");
        await user.type(screen.getByPlaceholderText("Enter state"), "Tamil Nadu");
        await user.type(screen.getByPlaceholderText("Enter pincode"), "600001");

        await user.click(
            screen.getByRole("button", { name: "Save User" })
        );

        await waitFor(() => {
            expect(createUser).toHaveBeenCalledWith({
                name: "Raj",
                age: 30,
                city: "Chennai",
                state: "Tamil Nadu",
                pincode: "600001"
            },
            "fake-access-token"
            );
        });

        expect(
            await screen.findByRole("heading", { name: "User List Page" })
        ).toBeInTheDocument();
    });

    // Test 4: Check API failure handling
    it("should display an alert when API creation fails", async () => {
        const user = userEvent.setup();

        const alertSpy = vi.spyOn(window, "alert")
            .mockImplementation(() => {});

        vi.spyOn(console, "error")
            .mockImplementation(() => {});

        createUser.mockRejectedValue(new Error("API failed"));

        renderAddUser();

        await user.type(screen.getByPlaceholderText("Enter name"), "Raj");
        await user.type(screen.getByPlaceholderText("Enter age"), "30");
        await user.type(screen.getByPlaceholderText("Enter city"), "Chennai");
        await user.type(screen.getByPlaceholderText("Enter state"), "Tamil Nadu");
        await user.type(screen.getByPlaceholderText("Enter pincode"), "600001");

        await user.click(
            screen.getByRole("button", { name: "Save User" })
        );

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
                "Unable to create user. Please try again."
            );
        });

        expect(
            screen.getByRole("heading", { name: "Add New User" })
        ).toBeInTheDocument();
    });
});
