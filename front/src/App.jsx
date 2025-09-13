import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./myComponent/Login";
import AdminDashboard from "./myComponent/AdminDashboard";
import Home from "./myComponent/Home";
import UserList from "./myComponent/Users";
import UserForm from "./myComponent/UserForm";
import ChangeMyPass from "./myComponent/changeMyPass";
import DoctorList from "./myComponent/DoctorList";
import DoctorForm from "./myComponent/DoctorForm";
import BookAppointment from "./myComponent/BookAppointment";
import ServiceList from "./myComponent/ServicesList";
import ServicesForm from "./myComponent/ServicesForm";
import DoctorDashboard from "./myComponent/DoctorDashboard";
import Profile from "./myComponent/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/home" element={<Home />} />

        <Route path="/users" element={<UserList />} />
        <Route path="/user-add" element={<UserForm />} />
        <Route path="/user-edit/:id" element={<UserForm />} />

        <Route path="/change-pass" element={<ChangeMyPass />} />

        <Route path="/doctors" element={<DoctorList />} />

        <Route path="/doctor-add" element={<DoctorForm />} />
        <Route path="/doctor-edit/:id" element={<DoctorForm />} />

        <Route path="/services" element={<ServiceList />} />
        <Route path="/services-add" element={<ServicesForm />} />
        <Route path="/services-edit/:id" element={<ServicesForm />} />
        <Route path="/book-appointment" element={<BookAppointment />} />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
