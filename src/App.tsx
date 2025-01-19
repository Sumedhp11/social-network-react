import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import Loader from "./components/ui/Loader";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
const Login = lazy(() => import("@/components/pages/auth/Login"));
const Register = lazy(() => import("@/components/pages/auth/Register"));
const AuthLayout = lazy(() => import("@/components/layouts/AuthLayout"));
const AppLayout = lazy(() => import("@/components/layouts/AppLayout"));
const Home = lazy(() => import("@/components/pages/main/Home"));
const App = () => {
  return (
    <Router>
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
            <Route path="/" element={<AppLayout component={<Home />} />} />
          </Routes>
        </ProtectedRoute>
      </Suspense>
    </Router>
  );
};

export default App;
