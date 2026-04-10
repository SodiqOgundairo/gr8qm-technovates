import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HeaderOld from "./components/layout/HeaderOld";
import FooterOld from "./components/layout/FooterOld";
import ScrollToTop from "./components/layout/ScrollToTop";
import DarkLayout from "./components/layout/DarkLayout";

/* Old design pages */
import HomeOld from "./pages/HomeOld";
import AboutOld from "./pages/AboutOld";
import ContactOld from "./pages/ContactOld";
import ServicesOld from "./pages/ServicesOld";
import TrainingsOld from "./pages/TrainingsOld";
import PortfolioOld from "./pages/PortfolioOld";
import CareersOld from "./pages/CareersOld";
import DesignBuildOld from "./pages/services/DesignBuildOld";
import PrintShopOld from "./pages/services/PrintShopOld";
import TechTrainingOld from "./pages/services/TechTrainingOld";
import BlogIndexOld from "./pages/Blog/BlogIndexOld";
import BlogPostOld from "./pages/Blog/BlogPostOld";
import NotFoundOld from "./pages/PageNotFoundOld";

/* Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Trainings from "./pages/Trainings";
import Portfolio from "./pages/Portfolio";
import Careers from "./pages/Careers";
import DesignBuild from "./pages/services/DesignBuild";
import PrintShop from "./pages/services/PrintShop";
import TechTraining from "./pages/services/TechTraining";
import BlogIndex from "./pages/Blog/BlogIndex";
import BlogPost from "./pages/Blog/BlogPost";
import PublicForm from "./pages/PublicForm";
import FormSuccess from "./pages/FormSuccess";
import Cohort4 from "./pages/Cohort4";
import NotFound from "./pages/NotFound";

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
        {/* ═══ OLD DESIGN ROUTES ═══ */}
        <Route
          path="/old/*"
          element={
            <>
              <HeaderOld />
              <Routes>
                <Route path="/" element={<HomeOld />} />
                <Route path="/about" element={<AboutOld />} />
                <Route path="/services" element={<ServicesOld />} />
                <Route path="/services/design-build" element={<DesignBuildOld />} />
                <Route path="/services/print-shop" element={<PrintShopOld />} />
                <Route path="/services/tech-training" element={<TechTrainingOld />} />
                <Route path="/trainings" element={<TrainingsOld />} />
                <Route path="/portfolio" element={<PortfolioOld />} />
                <Route path="/careers" element={<CareersOld />} />
                <Route path="/contact" element={<ContactOld />} />
                <Route path="/forms/:shortCode" element={<PublicForm />} />
                <Route path="/forms/:shortCode/success" element={<FormSuccess />} />
                <Route path="/blog" element={<BlogIndexOld />} />
                <Route path="/blog/:slug" element={<BlogPostOld />} />
                <Route path="*" element={<NotFoundOld />} />
              </Routes>
              <FooterOld />
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

        {/* ═══ MAIN ROUTES (dark design) — catch-all last ═══ */}
        <Route
          path="/*"
          element={
            <DarkLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/design-build" element={<DesignBuild />} />
                <Route path="/services/print-shop" element={<PrintShop />} />
                <Route path="/services/tech-training" element={<TechTraining />} />
                <Route path="/trainings" element={<Trainings />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/forms/:shortCode" element={<PublicForm />} />
                <Route path="/forms/:shortCode/success" element={<FormSuccess />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DarkLayout>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
