import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";
import DarkLayout from "./components/layout/DarkLayout";

/* Pages */
import HomeNew from "./pages/HomeNew";
import AboutNew from "./pages/AboutNew";
import ContactNew from "./pages/ContactNew";
import ServicesNew from "./pages/ServicesNew";
import TrainingsNew from "./pages/TrainingsNew";
import PortfolioNew from "./pages/PortfolioNew";
import CareersNew from "./pages/CareersNew";
import DesignBuildNew from "./pages/services/DesignBuildNew";
import PrintShopNew from "./pages/services/PrintShopNew";
import TechTrainingNew from "./pages/services/TechTrainingNew";
import BlogIndexNew from "./pages/Blog/BlogIndexNew";
import BlogPostNew from "./pages/Blog/BlogPostNew";
import PublicForm from "./pages/PublicForm";
import FormSuccess from "./pages/FormSuccess";
import Cohort4 from "./pages/Cohort4";
import NotFoundNew from "./pages/NotFoundNew";

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
import AdminJobPostings from "./pages/admin/JobPostings";
import JobPostingForm from "./pages/admin/JobPostingForm";
import AdminBlogList from "./pages/admin/Blog/BlogList";
import AdminBlogEditor from "./pages/admin/Blog/BlogEditor";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PaymentSuccess from "./pages/PaymentSuccess";
import PayInvoice from "./pages/PayInvoice";
import CursorTrail from "./components/animations/CursorTrail";

import ChatWidget from "./components/common/ChatWidget";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CursorTrail />
      <ChatWidget />
      <Routes>
        {/* Standalone Pages */}
        <Route path="/cohort4" element={<Cohort4 />} />

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
                <Route path="jobs" element={<AdminJobPostings />} />
                <Route path="jobs/create" element={<JobPostingForm />} />
                <Route path="jobs/:id/edit" element={<JobPostingForm />} />
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
                <Route path="blog" element={<AdminBlogList />} />
                <Route path="blog/create" element={<AdminBlogEditor />} />
                <Route path="blog/:id/edit" element={<AdminBlogEditor />} />
                {/* Future admin routes go here */}
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Public payment‑success page */}
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Public invoice payment page */}
        <Route path="/pay-invoice/:invoiceNumber" element={<PayInvoice />} />

        {/* ═══ MAIN ROUTES (dark design) — catch-all last ═══ */}
        <Route
          path="/*"
          element={
            <DarkLayout>
              <Routes>
                <Route path="/" element={<HomeNew />} />
                <Route path="/about" element={<AboutNew />} />
                <Route path="/services" element={<ServicesNew />} />
                <Route path="/services/design-build" element={<DesignBuildNew />} />
                <Route path="/services/print-shop" element={<PrintShopNew />} />
                <Route path="/services/tech-training" element={<TechTrainingNew />} />
                <Route path="/trainings" element={<TrainingsNew />} />
                <Route path="/portfolio" element={<PortfolioNew />} />
                <Route path="/careers" element={<CareersNew />} />
                <Route path="/contact" element={<ContactNew />} />
                <Route path="/blog" element={<BlogIndexNew />} />
                <Route path="/blog/:slug" element={<BlogPostNew />} />
                <Route path="/forms/:shortCode" element={<PublicForm />} />
                <Route path="/forms/:shortCode/success" element={<FormSuccess />} />
                <Route path="*" element={<NotFoundNew />} />
              </Routes>
            </DarkLayout>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
