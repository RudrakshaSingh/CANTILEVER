
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import UserRegister from './pages/UserRegister'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import UserLogin from './pages/UserLogin'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/login" element={<UserLogin />} />


    </Routes>
  )
}

export default App
