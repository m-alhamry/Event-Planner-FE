import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css'

// Public Pages
import Home from './pages/Home';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';

// Protected Pages
import Profile from './pages/Profile';

function App() {

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={
          <div className="empty-state">
            <h2>Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" className="btn btn-primary">Go Home</a>
          </div>
        } />
      </Routes>
    </Layout>
  )
}

export default App
