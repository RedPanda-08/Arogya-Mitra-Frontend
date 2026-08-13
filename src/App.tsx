import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login'; 
import Signup from './Signup';
import Home from './Home';
import Dashboard from './Components/Dashboard'; 
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Set Home as the default landing page */}
        <Route path="/" element={<Home />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path ="/forgot-password" element={<ForgotPassword />} />
        <Route path ="/reset-password" element={<ResetPassword />} />


        
        {/* Protected/App routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Catch-all route to redirect unknown URLs back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;