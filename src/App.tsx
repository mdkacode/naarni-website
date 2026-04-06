import {BrowserRouter as Router,Routes,Route, useLocation} from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";
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
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { theme } = useTheme();

  return (
    <ConfigProvider
      key={theme} // Force remount when theme changes to ensure proper update
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorBgContainer: theme === 'dark' ? '#1f2937' : '#ffffff',
          colorBgElevated: theme === 'dark' ? '#111827' : '#ffffff',
          colorBorder: theme === 'dark' ? '#374151' : '#d1d5db',
          colorText: theme === 'dark' ? '#f3f4f6' : '#111827',
          colorTextHeading: theme === 'dark' ? '#ffffff' : '#111827',
        },
        components: {
          Table: {
            headerBg: theme === 'dark' ? '#111827' : '#f9fafb',
            headerColor: theme === 'dark' ? '#f3f4f6' : '#111827',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            rowHoverBg: theme === 'dark' ? '#374151' : '#f9fafb',
            colorBgContainer: theme === 'dark' ? '#1f2937' : '#ffffff',
          },
          Card: {
            headerBg: theme === 'dark' ? '#111827' : '#f9fafb',
            colorBorder: theme === 'dark' ? '#374151' : '#e5e7eb',
            colorBgContainer: theme === 'dark' ? '#1f2937' : '#ffffff',
          },
          Input: {
            colorBgContainer: theme === 'dark' ? '#1f2937' : '#ffffff',
            colorBorder: theme === 'dark' ? '#374151' : '#d1d5db',
            colorText: theme === 'dark' ? '#f3f4f6' : '#111827',
          },
          Select: {
            colorBgContainer: theme === 'dark' ? '#1f2937' : '#ffffff',
            colorBorder: theme === 'dark' ? '#374151' : '#d1d5db',
            colorText: theme === 'dark' ? '#f3f4f6' : '#111827',
          },
          Button: {
            colorBgContainer: theme === 'dark' ? '#1f2937' : '#ffffff',
          },
          Modal: {
            contentBg: theme === 'dark' ? '#1f2937' : '#ffffff',
            headerBg: theme === 'dark' ? '#111827' : '#ffffff',
          },
          Form: {
            labelColor: theme === 'dark' ? '#f3f4f6' : '#111827',
          },
        },
      }}
    >
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
    </ConfigProvider>
  );
};

const App=()=>{
  return(
    <ThemeProvider>
      <Router>
        <AppContent/>
      </Router>
    </ThemeProvider>
  )
}
export default App;