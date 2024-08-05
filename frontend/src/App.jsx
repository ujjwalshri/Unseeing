import RightPanel from "./components/svgs/common/RightPanel";
import Sidebar from "./components/svgs/common/SideBar";
import About from "./pages/about/About";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import { Routes, Route, Navigate } from "react-router-dom";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/svgs/common/LoadingSpinner";
import Report from "./components/svgs/common/Report";
function App() {
  const { data: authUser, isLoading } = useQuery({
    // we use query key to give unique name to our queries and then refer to it later in the code to get the data
    queryKey: ["Auth user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(
          `Error in the auth user query: ${"blaa blaa"} ${error}`
        );
      }
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="flex max-w-6xl mx-auto">
        
        {authUser && <Sidebar />}
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          /> 
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/notifications"
            element={
              authUser ? <NotificationPage /> : <Navigate to={"/login"} />
            }
          />
          <Route
            path="/profile/:id"
            element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
          />
        </Routes>

        {authUser && <RightPanel /> }
      
        <Toaster />
      </div>
    </>
  );
}

export default App;
