
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import UserRegister from './Pages/Users/UserRegister';
import UserLogin from './Pages/Users/UserLogin';
import ForgotPassword from './Pages/Users/ForgotPassword';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/forgot-password" element={<ForgotPassword />} />
      {/* Add more routes as needed */}
    </Routes>
  )
  
}

export default App
