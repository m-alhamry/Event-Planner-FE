import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signin } from '../../services/authAPI';

const Login = () => {
  const [formData, setFormData] = useState({
    username_or_email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await signin(formData);
      if (user) {
        // Redirect with a full page load
        window.location.href = '/dashboard';
      } else {
        setError('Login failed: no user data returned');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Login failed');
      } else {
        setError('Login failed');
      }
    }

    setLoading(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title text-center">Login</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username_or_email" className="form-label">
            Username or Email
          </label>
          <input
            type="text"
            id="username_or_email"
            name="username_or_email"
            value={formData.username_or_email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="text-center mt-2">
        <p>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#667eea' }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;