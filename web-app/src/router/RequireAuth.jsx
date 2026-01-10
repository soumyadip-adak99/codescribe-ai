import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router"

export default function RequireAuth({ children }) {
    const { isAuthenticated } = useAuth()

    return isAuthenticated() ? children : <Navigate to="/" replace />
}
