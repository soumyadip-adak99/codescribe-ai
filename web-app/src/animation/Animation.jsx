import { useState, useEffect } from "react";

function Animation() {
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const x = clientX / window.innerWidth;
            const y = clientY / window.innerHeight;

            setMousePos({ x, y });

            document.documentElement.style.setProperty('--mouse-x', x);
            document.documentElement.style.setProperty('--mouse-y', y);

            const cursorFollower = document.querySelector('.cursor-follower');
            if (cursorFollower) {
                cursorFollower.style.transform = `translate(${clientX - 128}px, ${clientY - 128}px)`;
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <div className="cursor-follower fixed w-64 h-64 rounded-full pointer-events-none transition-transform duration-300 ease-out z-0"
                style={{
                    background: 'radial-gradient(circle, rgba(219,2,172,0.08) 0%, rgba(219,2,172,0.02) 50%, transparent 70%)',
                    filter: 'blur(40px)'
                }} />

            <div className="fixed inset-0 pointer-events-none opacity-8 animate-pulse"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    animationDuration: '4s'
                }} />

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-out"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(219,2,172,0.06) 0%, rgba(219,2,172,0.02) 40%, transparent 70%)`
                    }}
                />
                <div
                    className="absolute top-0 left-0 w-full h-full transition-all duration-1200 ease-out"
                    style={{
                        background: `radial-gradient(circle at ${(1 - mousePos.x) * 100}% ${(1 - mousePos.y) * 100}%, rgba(1,26,189,0.04) 0%, rgba(67,56,202,0.02) 40%, transparent 70%)`
                    }}
                />
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-8 transition-all duration-2000 ease-out"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)`
                    }}
                />
            </div>
        </>
    )
}

export default Animation