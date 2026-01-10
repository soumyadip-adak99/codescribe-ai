import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './home_componets/Navbar';
import { Outlet, useLocation } from 'react-router-dom';

function Home({ children }) {
    const { user, fetchUserDetails, logout } = useAuth();
    const [activeItem, setActiveItem] = useState('Home');
    const location = useLocation();

    useEffect(() => {
        fetchUserDetails();
    }, []);

    useEffect(() => {
        const path = location.pathname.split('/').pop();
        const activeMap = {
            'home': 'Home',
            'search': 'Search',
            'create-blog': 'Create',
            'profile': 'Profile'
        };

        if (!path || path === 'user') {
            setActiveItem('Home');
        } else if (activeMap[path]) {
            setActiveItem(activeMap[path]);
        }
    }, [location]);

    // Check if current route is profile to adjust layout
    const isProfileRoute = /^\/user\/profile(\/[^/]*)?$/.test(location.pathname);

    return (
        <div className="min-h-screen bg-gray-950">
            <Navbar
                userId={user?.id}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                email={user?.email}
                logout={logout}
            />

            <main
                className={`transition-all duration-300 ${isProfileRoute
                    ? 'pt-16 md:pt-0 md:ml-60 pb-14 md:pb-0'
                    : 'pt-10 md:pt-0 md:ml-60 pb-14 md:pb-0'
                    }`}
            >
                {children || <Outlet />}
            </main>
        </div>
    );
}

export default Home;