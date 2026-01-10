import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import AOS from "aos";
import 'aos/dist/aos.css';
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";

import RootRoute from "./router/RootRoute";
import PublicRoute from "./router/PublicRoute";
import RequireAuth from "./router/RequireAuth";

import Login from './components/Login';
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";

import AdminLayout from "./pages/admin/Admin";
import Dashboard from "./pages/admin/admin_componets/Dashboard";
import UserManagement from "./pages/admin/admin_componets/UserManagement";
import BlogManagement from "./pages/admin/admin_componets/BlogManagement";

import UserLayout from "./pages/home/Home";
import UserHome from "./pages/home/home_componets/UserHome";
import Profile from "./pages/home/home_componets/Profile";
import UserProfile from "./pages/home/home_componets/UserProfile";
import Connection from "./api/connection";

function ScrollController() {
    const { pathname, key } = useLocation();
    const isInitialLoad = useRef(true);

    const scrollToTop = useCallback((behavior = 'auto') => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior
        });
    }, []);

    useEffect(() => {
        if (key !== 'default') {
            scrollToTop('instant');
        }
    }, [pathname, key, scrollToTop]);

    useEffect(() => {
        if (isInitialLoad.current) {
            const timer = setTimeout(() => {
                scrollToTop('smooth');
                isInitialLoad.current = false;
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [scrollToTop]);

    return null;
}

function App() {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <Router>
            <AuthProvider>
                <Toaster position="top-center" reverseOrder={false} />
                <ScrollController />
                <Connection />

                <Routes>
                    {/* Public landing */}
                    <Route path="/" element={<RootRoute />} />

                    {/* Auth routes */}
                    <Route path="/auth">
                        <Route path="sing-in" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                    </Route>

                    {/* Admin routes */}
                    <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="blogs" element={<BlogManagement />} />
                    </Route>

                    {/* User routes */}
                    <Route path="/user" element={<RequireAuth><UserLayout /></RequireAuth>}>
                        <Route index element={<Navigate to="home" replace />} />
                        <Route path="home" element={<UserHome />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="profile/:id" element={<UserProfile />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={
                        <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center flex-col">
                            <h1 className="text-2xl mb-4">404 - Route Not Found</h1>
                            <Navigate to="/" replace />
                        </div>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;