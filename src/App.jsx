import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css'

// Public Pages
import Home from './pages/Home';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Events from './pages/Events/Events';
import MyEvents from './pages/Events/MyEvents';
import CreateEvent from './pages/Events/CreateEvent';
import EditEvent from './pages/Events/EditEvent';
import EventDetail from './pages/Events/EventDetail';
import AttendingEvents from './pages/Events/AttendingEvents';

function App() {

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path='/events' element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        } />
        <Route path="/my-events" element={
          <ProtectedRoute>
            <MyEvents />
          </ProtectedRoute>
        } />
        <Route path='/create-event' element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        } />
        <Route path="/events/:id/edit" element={
          <ProtectedRoute>
            <EditEvent />
          </ProtectedRoute>
        } />
        <Route path="/events/:id" element={
          <ProtectedRoute>
            <EventDetail />
          </ProtectedRoute>
        } />
        <Route path="/attending" element={
          <ProtectedRoute>
            <AttendingEvents />
          </ProtectedRoute>
        } />

        {/* Page Not Found Route */}
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
