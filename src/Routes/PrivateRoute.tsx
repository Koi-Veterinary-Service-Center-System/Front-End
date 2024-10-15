import { ReactNode, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlertIcon } from "lucide-react";

interface UserData {
  userName: string;
  role: string;
  firstName?: string;
  lastName?: string;
  gender?: boolean;
  email?: string;
}

interface PrivateRouteProps {
  children: ReactNode;
  requiredRoles?: string[]; // Array of allowed roles
}

const getUserData = (): UserData | null => {
  const token = localStorage.getItem("token");
  return token ? jwtDecode<UserData>(token) : null;
};

function PrivateRoute({ children, requiredRoles }: PrivateRouteProps) {
  const [showAlert, setShowAlert] = useState(false);
  const userData = getUserData();

  useEffect(() => {
    if (requiredRoles && userData && !requiredRoles.includes(userData.role)) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
    }
  }, [userData, requiredRoles]);

  if (!userData) {
    return <Navigate to="/login" />;
  }

  if (showAlert) {
    return (
      <Alert variant="destructive">
        <TriangleAlertIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>
    );
  }

  if (requiredRoles && !requiredRoles.includes(userData.role)) {
    return <Navigate to="/" />; // Redirect if user does not have one of the required roles
  }

  return <>{children}</>;
}

export default PrivateRoute;
