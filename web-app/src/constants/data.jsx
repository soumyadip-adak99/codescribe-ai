import { assets } from "../assets/assets";
import { RiDashboardLine, RiUserLine } from "react-icons/ri";
import { TbLogs } from "react-icons/tb";
import { IoMdMore } from "react-icons/io";
import { IoCreateOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { GoHome } from "react-icons/go";

export const features = [
    {
        title: "Lightning Fast Creation",
        description: "Create polished blog posts in minutes. Our AI adapts to your unique tone and style for fast, seamless results.",
        icon: "⚡",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        title: "Intelligent Content",
        description: "Our AI reviews content for SEO, tone, and readability—detecting errors, slang, and unsafe language to ensure quality.",
        icon: "🧠",
        gradient: "from-blue-500 to-indigo-600"
    },
    {
        title: "Privacy First",
        description: "We prioritize your privacy—no personal data is saved or shared. Your content remains secure and fully confidential.",
        icon: "🔒",
        gradient: "from-emerald-500 to-teal-600"
    },
    {
        title: "Developer Friendly",
        description: "Seamless integration into your development tools and stack makes our platform easy to use and fully customizable.",
        icon: "💻",
        gradient: "from-amber-500 to-orange-500"
    },
    {
        title: "Community Driven",
        description: "Join thousands of creators who rely on CodeScribe AI to produce consistent, engaging content at a professional level.",
        icon: "👥",
        gradient: "from-rose-500 to-pink-600"
    },
    {
        title: "Professional Quality",
        description: "Every output meets high professional standards with correct formatting, structure and clean language usage.",
        icon: "🏆",
        gradient: "from-violet-500 to-purple-600"
    }
];



export const stats = [
    { value: "50K+", label: "Active Users", icon: "👥" },
    { value: "99.9%", label: "Uptime", icon: "⏱️" },
    { value: "1M+", label: "Blogs Created", icon: "✍️" },
    { value: "24/7", label: "Support", icon: "🛟" }
];



export const teamMembers = [
    {
        name: "Soumita Paul",
        role: "Backend Enginner",
        image: assets.shoumitaPaulImage,
        gitHub: 'https://github.com/soumita-paul-90',
        linkdin: 'https://www.linkedin.com/in/soumita-paul-a5b5b2292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    },
    {
        name: "Arindom Pal",
        role: "Backend Enginner",
        image: assets.arindomPaulImage,
        gitHub: 'https://github.com/MrPal28',
        linkdin: 'https://www.linkedin.com/in/arindam-pal-977318291',
    },
    {
        name: "Soumyadip Adak",
        role: "Full Stack Developer",
        image: assets.soumyadipAdakImage,
        gitHub: 'https://github.com/soumyadip-adak99',
        linkdin: 'https://www.linkedin.com/in/soumyadip-adak-a19b03281/',
    },
    {
        name: "Aritra Das",
        role: "Backend Engineer",
        image: assets.aritraDasImage,
        gitHub: 'https://github.com/Aritra7636',
        linkdin: 'https://www.linkedin.com/in/aritra-das-a69897212?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    },
    {
        name: "Aritra Naskar",
        role: "Backend Enginner",
        image: assets.aritraNaskarImage,
        gitHub: 'https://guthub.com',
        linkdin: 'https://linkedin.com',
    }
];


export const adminNavItems = [
    {
        icon: <RiDashboardLine className="text-xl" />,
        label: "Dashboard",
        path: "/admin/dashboard"
    },
    {
        icon: <RiUserLine className="text-xl" />,
        label: "Users",
        path: "/admin/users"
    },
    {
        icon: <TbLogs className="text-xl" />,
        label: "Blogs",
        path: "/admin/blogs"
    },
    {
        icon: <IoMdMore className="text-xl" />,
        label: "More",
        path: "/admin/more"
    },
];

export const userNavItems = [
    {
        icon: <GoHome className="text-xl" />,
        label: "Home",
        path: "/user/home"
    },
    {
        icon: <CiSearch className="text-xl" />,
        label: "Search",
        //path: "/admin/users"
    },
    {
        icon: <IoCreateOutline className="text-xl" />,
        label: "Create",
        path: "/user/create-blogs"
    },
];


