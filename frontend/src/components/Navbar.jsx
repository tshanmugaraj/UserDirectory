
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {
    const {
        loginWithRedirect,
        logout,
        isAuthenticated,
        isLoading,
        user
    } = useAuth0();

    const handleLogin = async () => {
        console.log("Login button clicked");

        try {
            await loginWithRedirect();
        } catch (error) {
            console.error("Auth0 Login Error:", error);
        }
    };

    return (
        <nav className="navbar">
            <h2>User Directory</h2>

            <div className="nav-links">
                <Link to="/">Add User</Link>
                <Link to="/list">User List</Link>

                {!isLoading && (
                    <>
                        {isAuthenticated ? (
                            <>
                                <span>
                                    Welcome, {user?.name}
                                </span>

                                <button
                                    onClick={() =>
                                        logout({
                                            logoutParams: {
                                                returnTo: window.location.origin
                                            }
                                        })
                                    }
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            // <button onClick={() => loginWithRedirect()}>
                            //     Login
                            // </button>
                            <button onClick={handleLogin}>
                                Login
                            </button>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
