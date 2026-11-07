
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../services/userService";
import "./UserList.css";

function UserList() {
    const location = useLocation();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");

const [createSuccessMessage, setCreateSuccessMessage] = useState(
    location.state?.successMessage || ""
);

    useEffect(() => {
    let isMounted = true;

        const loadUsers = async () => {
            try {
                const data = await getUsers();

                if (isMounted) {
                    setUsers(data);
                }
            } catch (error) {
                console.error("Error fetching users:", error);

                if (isMounted) {
                    setError("Unable to load users. Please try again.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadUsers();

        return () => {
            isMounted = false;
        };
    }, []);

    //Handle Try
    const handleRetry = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Unable to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Delete user
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) return;

        try {
            await deleteUser(id);

            setUsers((previousUsers) =>
                previousUsers.filter((user) => user.id !== id)
            );

            setDeleteSuccessMessage("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user:", error);
            setError("Unable to delete user. Please try again.");
        }
    };

    return (
        <div className="user-list-container">
            <div className="list-header">
                <h2>User Directory</h2>
                <Link to="/" className="add-button">
                    + Add User
                </Link>
            </div>

            {createSuccessMessage && (
                <div className="success-message">
                    {createSuccessMessage}
                    <button onClick={() => setCreateSuccessMessage("")}>
                        ×
                    </button>
                </div>
            )}

            {deleteSuccessMessage && (
                <div className="success-message">
                    {deleteSuccessMessage}
                    <button onClick={() => setDeleteSuccessMessage("")}>
                        ×
                    </button>
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={handleRetry}>Retry</button>
                </div>
            )}

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading users...</p>
                </div>
            ) : error ? (
                <div className="empty-message">
                    Unable to display users.
                </div>
            ) : users.length === 0 ? (
                <div className="empty-message">
                    No users found. Please add a user.
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Pincode</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.age}</td>
                                    <td>{user.city}</td>
                                    <td>{user.state}</td>
                                    <td>{user.pincode}</td>
                                    <td>
                                        <button
                                                className="edit-button" onClick={() => navigate(`/edit/${user.id}`)}
                                            >
                                                Edit
                                            </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default UserList;
