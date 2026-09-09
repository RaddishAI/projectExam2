import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VenueDetails from "./pages/VenueDetails";
import CreateVenue from "./pages/CreateVenue";
import EditVenue from "./pages/EditVenue";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venues/:id" element={<VenueDetails />} />
        <Route path="/venues/:id/edit" element={<EditVenue />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/venues/create" element={<CreateVenue />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
