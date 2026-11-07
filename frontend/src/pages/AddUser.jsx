import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userService";
import "./AddUser.css";

function AddUser() {

    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    const [user, setUser] = useState({
        name: "",
        age: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setUser({
            ...user,
            [name]: value
        });
    };

    const validateForm = () => {

        const newErrors = {};

        if (!user.name.trim()) {
            newErrors.name = "Name is required";
        }
        else if (user.name.trim().length < 2 ||
                 user.name.trim().length > 100) {
            newErrors.name = "Name must be between 2 and 100 characters";
        }

        if (user.age === "" || !Number.isInteger(Number(user.age))) {
            newErrors.age = "Please enter a valid age";
        }
        else if (Number(user.age) < 0 || Number(user.age) > 120) {
            newErrors.age = "Age must be between 0 and 120";
        }

        if (!user.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!user.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!user.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
        }
        else if (user.pincode.trim().length < 4 ||
                 user.pincode.trim().length > 10) {
            newErrors.pincode = "Pincode must be between 4 and 10 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {

            setLoading(true);

            const newUser = {
                ...user,
                name: user.name.trim(),
                age: Number(user.age),
                city: user.city.trim(),
                state: user.state.trim(),
                pincode: user.pincode.trim()
            };

            const token = await getAccessTokenSilently();

            await createUser(newUser, token);

            navigate("/list", {
                state: {
                    successMessage: "User created successfully!"
                }
            });

        }
        catch (error) {

            console.error("Error creating user:", error);

            if (
                error.error === "login_required" ||
                error.error === "consent_required" ||
                error.error === "interaction_required"
            ) {
                alert("Please log in to create a user.");
            }
            else if (error.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
            }
            else {
                alert(
                    error.response?.data?.title ||
                    "Unable to create user. Please try again."
                );
            }

        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">

            <h2>Add New User</h2>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        placeholder="Enter name"
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={user.age}
                        onChange={handleChange}
                        placeholder="Enter age"
                    />
                    {errors.age && <span className="error">{errors.age}</span>}
                </div>

                <div className="form-group">
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        value={user.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                    />
                    {errors.city && <span className="error">{errors.city}</span>}
                </div>

                <div className="form-group">
                    <label>State</label>
                    <input
                        type="text"
                        name="state"
                        value={user.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                    />
                    {errors.state && <span className="error">{errors.state}</span>}
                </div>

                <div className="form-group">
                    <label>Pincode</label>
                    <input
                        type="text"
                        name="pincode"
                        value={user.pincode}
                        onChange={handleChange}
                        placeholder="Enter pincode"
                    />
                    {errors.pincode && <span className="error">{errors.pincode}</span>}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save User"}
                </button>

            </form>

        </div>
    );
}

export default AddUser;