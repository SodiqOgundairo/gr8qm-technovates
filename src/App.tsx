import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import DarkLayout from "./components/layout/DarkLayout";

/* Public pages (original) */
import Home from "./pages/Home";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import ServicesPage from "./pages/Services";
import TrainingsPage from "./pages/Trainings";
import PortfolioPage from "./pages/Portfolio";
import CareersPage from "./pages/Careers";
import DesignBuildPage from "./pages/services/DesignBuild";
import PrintShopPage from "./pages/services/PrintShop";
import TechTrainingPage from "./pages/services/TechTraining";
import PublicForm from "./pages/PublicForm";
import FormSuccess from "./pages/FormSuccess";
import Cohort4 from "./pages/Cohort4";
import BlogIndex from "./pages/Blog/BlogIndex";
import BlogPost from "./pages/Blog/BlogPost";

/* New design pages */
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
import NotFound from "./pages/PageNotFound";
import NotFoundNew from "./pages/NotFoundNew";
import CursorTrail from "./components/animations/CursorTrail";

import ChatWidget from "./components/common/ChatWidget";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CursorTrail />
      <ChatWidget />
      <Routes>
        {/* ═══ NEW DESIGN ROUTES (permanent dark) ═══ */}
        <Route
          path="/new/*"
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
                <Route path="*" element={<NotFoundNew />} />
              </Routes>
            </DarkLayout>
          }
        />

        {/* ═══ ORIGINAL DESIGN ROUTES ═══ */}
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
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/forms/:shortCode" element={<PublicForm />} />
                <Route
                  path="/forms/:shortCode/success"
                  element={<FormSuccess />}
                />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </>
          }
        />

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
      </Routes>
    </Router>
  );
}
export default App;
