import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../../pages/homePage";
import SignUpPage from "../../pages/signupPage";
import LoginPage from "../../pages/loginPage";
import AdminDashboardPage from "../../pages/adminDashboardPage";
import CategoryPage from "../../pages/CategoryPage";
import CartPage from "../../pages/cartPage";
import PurchaseSuccessPage from "../../pages/PurchaseSuccessPage";
import PurchaseCancelPage from "../../pages/PurchaseCancelPage";
import ProductDetailPage from "../../pages/ProductDetailPage";
import { getUserData } from "../../utils/getUserData.js";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import { useCartStore } from "../../stores/useCartStore.js";
import ProfilePage from "../../pages/profile/index.jsx";
import Footer from "../footer/Footer.jsx";
import AnunciarPage from "../../pages/anunciar/index.jsx";
import VerifyEmailPage from "../../pages/verifiy/VerifyEmail.jsx";

const AppRoutes = () => {
  const { user, checkAuth, checkingAuth } = getUserData();
  const { getCartItems } = useCartStore();
  const location = useLocation();
 
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
 
  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [getCartItems, user]);
 
  if (checkingAuth) return <LoadingSpinner />;
  
  // Páginas que NÃO devem mostrar o footer
  const pagesWithoutFooter = ['/login', '/signup'];
  const shouldShowFooter = !pagesWithoutFooter.includes(location.pathname);
  
  return (
    <div
      className="py-24 min-h-screen bg-black text-white relative overflow-hidden"
      style={{
        backgroundImage: `url('/funsdo.gif')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        padding: '0 20px',
        boxSizing: 'border-box',
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route
          path="/signup"
          element={!user ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to={"/"} />}
        />
       
        <Route
          path="/admin-dashboard"
          element={
            user?.role?.includes("vendor") ? (
              <AdminDashboardPage />
            ) : (
              <Navigate to={user ? "/" : "/login"} />
            )
          }
        />
       
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/produto/:id" element={<ProductDetailPage />} />
       
        <Route
          path="/cart"
          element={user ? <CartPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/purchase-success"
          element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/purchase-cancel"
          element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/anunciar" element={<AnunciarPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>
     
      {shouldShowFooter && <Footer />}
    </div>
  );
};

// ✅ ADICIONE ESTA LINHA
export default AppRoutes;