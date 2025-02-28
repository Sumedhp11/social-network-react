import AuthLayout from "@/components/layouts/AuthLayout";
import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import Loader from "./components/ui/Loader";
// import { StremSocketProvider } from "./contexts/LiveStreamSocketContext";
// import StreamLayout from "./components/layouts/StreamLayout";
// import StartStream from "./components/pages/StartStream";

const Login = lazy(() => import("@/components/pages/auth/Login"));
const ResetPassword = lazy(
  () => import("@/components/pages/auth/ForgetPassword")
);
const Register = lazy(() => import("@/components/pages/auth/Register"));
const ForgetPassword = lazy(
  () => import("@/components/pages/auth/ForgetPassword")
);
const Verify = lazy(() => import("@/components/pages/auth/Verify"));

const AppLayout = lazy(() => import("@/components/layouts/AppLayout"));
const Home = lazy(() => import("@/components/pages/main/Home"));
const UserProfile = lazy(() => import("@/components/pages/main/UserProfile"));
// const StartStream = lazy(() => import("@/components/pages/StartStream"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <ProtectedRoute>
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/forget-password"
              element={<AuthLayout component={<ForgetPassword />} />}
            />
            <Route
              path="/login"
              element={<AuthLayout component={<Login />} />}
            />
            <Route
              path="/register"
              element={<AuthLayout component={<Register />} />}
            />
            <Route
              path="/verify"
              element={<AuthLayout component={<Verify />} />}
            />
            <Route
              path="/"
              index
              element={<AppLayout component={<Home />} />}
            />
            {/* <Route
              path="/start-stream"
              index
              element={
                <AppLayout
                  component={
                    <StremSocketProvider>
                      <StreamLayout />
                    </StremSocketProvider>
                  }
                />
              }
            /> */}
            <Route
              path="/profile/:userId"
              element={<AppLayout component={<UserProfile />} />}
            />
          </Routes>
        </ProtectedRoute>
      </Suspense>
    </Router>
  );
};

export default App;
