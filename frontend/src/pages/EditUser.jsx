
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../services/userService";

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        age: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await getUserById(id);
                setUser({
                    name: data.name,
                    age: data.age,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode
                });
            } catch (error) {
                console.error("Error loading user:", error);
                setError("Unable to load user details.");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setUser((previousUser) => ({
            ...previousUser,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            await updateUser(id, {
                ...user,
                age: Number(user.age)
            });

            navigate("/list", {
                state: {
                    updateSuccessMessage: "User updated successfully!"
                }
            });
        } catch (error) {
            console.error("Error updating user:", error);
            setError("Unable to update user. Please try again.");
        }
    };

    if (loading) {
        return <p>Loading user details...</p>;
    }

    if (error && !user.name) {
        return <p>{error}</p>;
    }

    return (
        <div className="edit-user-container">
    <h2>Edit User</h2>

            {error && <p>{error}</p>}

            <form className="edit-user-form" onSubmit={handleSubmit}>
                <input
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                />

                <input
                    name="age"
                    type="number"
                    value={user.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                />

                <input
                    name="city"
                    value={user.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                />

                <input
                    name="state"
                    value={user.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                />

                <input
                    name="pincode"
                    value={user.pincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                />

                <button type="submit">Update User</button>

                <button
                    type="button"
                    className="cancel-button"
                    onClick={() => navigate("/list")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditUser;
