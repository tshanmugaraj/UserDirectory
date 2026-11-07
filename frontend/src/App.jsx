import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import UserList from "./pages/UserList";

import "./App.css";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>
                <Route path="/" element={<AddUser />} />
                <Route path="/edit/:id" element={<EditUser />} />
                <Route path="/list" element={<UserList />} />
            </Routes>

        </BrowserRouter>
    );
}

export default App;