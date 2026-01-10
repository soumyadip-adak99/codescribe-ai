import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './admin_componets/Navbar';
import { useAuth } from '../../context/AuthContext';
import { Outlet, useLocation } from 'react-router-dom';

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

    return null; // Don't return ScrollRestoration here
}

function Admin() {
    const [activeItem, setActiveItem] = useState('Dashboard');
    const { user, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/').pop();
        const activeMap = {
            'dashboard': 'Dashboard',
            'users': 'Users',
            'analytics': 'Analytics',
            'reports': 'Reports',
            'security': 'Security',
            'settings': 'Settings'
        };

        if (!path || path === 'admin') {
            setActiveItem('Dashboard');
        } else if (activeMap[path]) {
            setActiveItem(activeMap[path]);
        }
    }, [location]);

    const userEmail = user?.email;

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.log('Error while logging out from admin page: ', err);
        }
    }

    return (
        <div className='min-h-screen bg-gray-900'>
            <ScrollController />
            <Navbar activeItem={activeItem} setActiveItem={setActiveItem} email={userEmail} logout={handleLogout} />
            <main className="md:ml-64 min-h-screen pt-16 md:pt-0 transition-all duration-300">
                <div className="p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default Admin;
