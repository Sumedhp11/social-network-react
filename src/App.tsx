import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import AuthLayout from "./components/layouts/AuthLayout";
import { TokenProvider } from "./contexts/AuthContext";
import Loader from "./components/ui/Loader";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
const Login = lazy(() => import("@/components/pages/auth/Login"));
const Register = lazy(() => import("@/components/pages/auth/Register"));
const App = () => {
  return (
    <Router>
      <TokenProvider>
        <Suspense fallback={<Loader />}>
          <ProtectedRoute>
            <Routes>
              <Route
                path="/login"
                element={<AuthLayout component={<Login />} />}
              />
              <Route
                path="/register"
                element={<AuthLayout component={<Register />} />}
              />
            </Routes>
          </ProtectedRoute>
        </Suspense>
      </TokenProvider>
    </Router>
  );
};

export default App;
