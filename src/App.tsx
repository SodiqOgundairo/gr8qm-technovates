import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/PageNotFound";
import ScrollToTop from "./components/layout/ScrollToTop";
import AboutPage from "./pages/About";
import AdminMessages from "./pages/AdminMessages";
import ContactPage from "./pages/Contact";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
