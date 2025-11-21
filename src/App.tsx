import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";

/* Public pages */
import Home from "./pages/Home";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import ServicesPage from "./pages/Services";
import TrainingsPage from "./pages/Trainings";
import DesignBuildPage from "./pages/services/DesignBuild";
import PrintShopPage from "./pages/services/PrintShop";
import TechTrainingPage from "./pages/services/TechTraining";

/* Admin pages */
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCourses from "./pages/admin/Courses";
import AdminMessages from "./pages/admin/Messages";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/PageNotFound";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public routes – keep Header/Footer */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route
                  path="/services/design-build"
                  element={<DesignBuildPage />}
                />
                <Route
                  path="/services/print-shop"
                  element={<PrintShopPage />}
                />
                <Route
                  path="/services/tech-training"
                  element={<TechTrainingPage />}
                />
                <Route path="/trainings" element={<TrainingsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </>
          }
        />

        {/* Admin login – no layout */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin area – single guard + layout */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout children={undefined} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="messages" element={<AdminMessages />} />
          {/* Future admin routes go here */}
        </Route>

        {/* Public payment‑success page */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  );
}
export default App;
