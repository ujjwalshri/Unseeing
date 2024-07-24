import RightPanel from "./components/svgs/common/RightPanel"
import Sidebar from "./components/svgs/common/SideBar"
import About from "./pages/about/About"
import LoginPage from "./pages/auth/login/LoginPage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import HomePage from "./pages/home/HomePage"
import { Routes, Route } from "react-router-dom"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"
import { Toaster } from "react-hot-toast"

function App() {

  return (
    <>
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar/>
    <Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
        <Route path='/about' element={<About />} />
        <Route path='/notifications' element={<NotificationPage/>} />
        <Route path='/profile/:id' element={<ProfilePage/>} />
			</Routes>

      <RightPanel/>
      <Toaster/>
    </div>
    </>
  )
}

export default App
