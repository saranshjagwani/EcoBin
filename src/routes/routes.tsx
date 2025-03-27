import { Navigate } from "react-router-dom";
import myContext from "@/Context/data/myContext";

export const ProtectedRoutes = ({ children }) => {
    if (localStorage.getItem('user')) {
      return children; // If user is logged in, render children
    }
    return <Navigate to="/login" />; // Redirect to login page if not logged in
  };
  
  // Protected route for admin users
  export const ProtectedRoutesForAdmin = ({ children }) => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const admin = JSON.parse(user);
        if (admin.user.email === 'sj1@gmail.com') {
          return children; // If user is admin, render children (dashboard, add product)
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return <Navigate to="/login" />; // Redirect to login if user is not admin or no user found
  };
  
