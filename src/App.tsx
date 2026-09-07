import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { CustomCursor } from './components/common/CustomCursor';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MessageSellerModal } from './components/common/MessageSellerModal';
import { Toast } from './components/common/Toast';
import { ScrollToTop } from './components/common/ScrollToTop';

// Pages
import { Home } from './pages/Home';
import { Books } from './pages/Books';
import { BookDetails } from './pages/BookDetails';
import { SellBook } from './pages/SellBook';
import { Branches } from './pages/Branches';
import { HowItWorksPage } from './pages/HowItWorks';
import { About } from './pages/About';
import { Login } from './pages/account/Login';
import { Register } from './pages/account/Register';
import { ProjectDetails } from './pages/ProjectDetails';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/Dashboard';
import { ManageBooks } from './pages/admin/ManageBooks';
import { ManageUsers } from './pages/admin/ManageUsers';
import { AdminReports } from './pages/admin/Reports';
import { DataManagement } from './pages/admin/DataManagement';
import { ManageColleges } from './pages/admin/ManageColleges';
import { StorageCleanup } from './pages/admin/StorageCleanup';
import { AdminSettings } from './pages/admin/Settings';
import { AdminInquiries } from './pages/admin/Inquiries';
import { ManageProjects } from './pages/admin/ManageProjects';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdminLoggedIn } = useMarketplace();
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const { messageModalBook, setMessageModalBook } = useMarketplace();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      <ScrollToTop />
      <CustomCursor />
      <Toast />
      <MessageSellerModal
        book={messageModalBook}
        onClose={() => setMessageModalBook(null)}
      />

      {/* Conditionally render public Navbar & Footer */}
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Marketplace Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/sell-book" element={<SellBook />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />

          {/* User Account / Auth UI Prototype Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Moderation Panel Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <ProtectedAdminRoute>
                <ManageBooks />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/colleges"
            element={
              <ProtectedAdminRoute>
                <ManageColleges />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedAdminRoute>
                <ManageUsers />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedAdminRoute>
                <AdminReports />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/data-management"
            element={
              <ProtectedAdminRoute>
                <DataManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/storage-cleanup"
            element={
              <ProtectedAdminRoute>
                <StorageCleanup />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedAdminRoute>
                <AdminSettings />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <ProtectedAdminRoute>
                <AdminInquiries />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedAdminRoute>
                <ManageProjects />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <Router>
        <AppContent />
      </Router>
    </MarketplaceProvider>
  );
}
