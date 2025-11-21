import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/PageNotFound";
import ScrollToTop from "./components/layout/ScrollToTop";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import ServicesPage from "./pages/Services";
import TrainingsPage from "./pages/Trainings";
import DesignBuildPage from "./pages/services/DesignBuild";
import PrintShopPage from "./pages/services/PrintShop";
import TechTrainingPage from "./pages/services/TechTraining";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCourses from "./pages/admin/Courses";
import AdminMessages from "./pages/admin/Messages";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Public Routes with Header/Footer */}
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

        {/* Admin Login (No Header/Footer) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes (No Header/Footer) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute>
              <AdminCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <AdminMessages />
            </ProtectedRoute>
          }
        />
        {/* Add more protected admin routes as you create them */}
      </Routes>
    </Router>
  );
}

export default App;
