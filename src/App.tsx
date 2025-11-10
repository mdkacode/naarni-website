import {BrowserRouter as Router,Routes,Route, useLocation} from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import TrackRecord from './pages/TrackRecord';
import Careers from './pages/Careers';
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Organizations from "./pages/Organizations";
import Devices from "./pages/Devices";
import Vehicles from "./pages/Vehicles";
import Users from "./pages/Users";
import RoutesPage from "./pages/Routes";
import Cities from "./pages/Cities";

import Navbar from './components/Navbar';
import ScrollToTop from "./components/ScrollToTop";
import BackToTopButton from "./components/BackToTopButton";

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop/>
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/track-record" element={<TrackRecord/>}/>
        <Route path="/careers" element={<Careers/>}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
        <Route path="/terms" element={<TermsOfService/>}/>
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/organizations" element={<Organizations/>}/>
        <Route path="/admin/devices" element={<Devices/>}/>
        <Route path="/admin/vehicles" element={<Vehicles/>}/>
        <Route path="/admin/users" element={<Users/>}/>
        <Route path="/admin/routes" element={<RoutesPage/>}/>
        <Route path="/admin/cities" element={<Cities/>}/>
      </Routes>
      {!isAdminRoute && <BackToTopButton/>}
    </>
  );
};

const App=()=>{
  return(
    <Router>
      <AppContent/>
    </Router>
  )
}
export default App;