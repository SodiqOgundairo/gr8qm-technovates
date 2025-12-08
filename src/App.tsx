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
import PortfolioPage from "./pages/Portfolio";
import DesignBuildPage from "./pages/services/DesignBuild";
import PrintShopPage from "./pages/services/PrintShop";
import TechTrainingPage from "./pages/services/TechTraining";
import PublicForm from "./pages/PublicForm";
import FormSuccess from "./pages/FormSuccess";

/* Admin pages */
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminForms from "./pages/admin/Forms";
import FormBuilder from "./pages/admin/FormBuilder";
import FormResponses from "./pages/admin/FormResponses";
import FormAnalytics from "./pages/admin/FormAnalytics";
import AdminCourses from "./pages/admin/Courses";
import AdminMessages from "./pages/admin/Messages";
import AdminApplications from "./pages/admin/Applications";
import AdminServiceRequests from "./pages/admin/ServiceRequests";
import AdminInvoices from "./pages/admin/Invoices";
import AdminPortfolio from "./pages/admin/Portfolio";
import AdminTransactions from "./pages/admin/Transactions";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PaymentSuccess from "./pages/PaymentSuccess";
import PayInvoice from "./pages/PayInvoice";
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
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/forms/:shortCode" element={<PublicForm />} />
                <Route
                  path="/forms/:shortCode/success"
                  element={<FormSuccess />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </>
          }
        />

        {/* Admin login – no layout */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin area – protected routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="forms" element={<AdminForms />} />
                <Route path="forms/create" element={<FormBuilder />} />
                <Route path="forms/:id/edit" element={<FormBuilder />} />
                <Route
                  path="forms/:formId/responses"
                  element={<FormResponses />}
                />
                <Route
                  path="forms/:formId/analytics"
                  element={<FormAnalytics />}
                />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="applications" element={<AdminApplications />} />
                <Route
                  path="service-requests"
                  element={<AdminServiceRequests />}
                />
                <Route path="invoices" element={<AdminInvoices />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="portfolio" element={<AdminPortfolio />} />
                <Route path="transactions" element={<AdminTransactions />} />
                {/* Future admin routes go here */}
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Public payment‑success page */}
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Public invoice payment page */}
        <Route path="/pay-invoice/:invoiceNumber" element={<PayInvoice />} />
      </Routes>
    </Router>
  );
}
export default App;
