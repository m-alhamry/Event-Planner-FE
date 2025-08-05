import { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../../services/authAPI";

const Signup = () => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
        phone: '',
    });
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState({
        minLength: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    const validatePassword = (password) => {
        setPasswordValidity({
            minLength: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~]/.test(password),
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'password') {
            validatePassword(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        if (formData.password !== formData.password_confirm) {
            setErrors("Passwords do not match.");
            setLoading(false);
            return;
        }
        try {
            const newUser = await signup(formData);
            if (newUser) {
                // Redirect with a full page reload
                window.location.href = "/dashboard";
            } else {
                setErrors({ non_field_errors: "Signup failed" });
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                setErrors({ non_field_errors: "An unexpected error occurred. Please try again later." });
            }
        }
        setLoading(false);
    };

    return (
        <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
            <div className="card-header">
                <h2 className="card-title text-center">Sign Up</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username" className="form-label">
                        Username *
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                    {errors.username && <div className="error-message">{errors.username}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label htmlFor="first_name" className="form-label">
                            First Name *
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group" style={{ flex: 1 }}>
                        <label htmlFor="last_name" className="form-label">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        Password *
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
                    {errors.password && <div className="error-message">{errors.password}</div>}
                </div>

                <div style={{ marginTop: '-0.5rem', marginBottom: '1rem', fontSize: '0.8rem' }}>
                    <p style={{ color: passwordValidity.minLength ? 'green' : 'red', margin: '0.2rem 0' }}>
                        {passwordValidity.minLength ? '✓' : '✗'} Minimum 8 characters
                    </p>
                    <p style={{ color: passwordValidity.uppercase ? 'green' : 'red', margin: '0.2rem 0' }}>
                        {passwordValidity.uppercase ? '✓' : '✗'} At least one capital letter
                    </p>
                    <p style={{ color: passwordValidity.lowercase ? 'green' : 'red', margin: '0.2rem 0' }}>
                        {passwordValidity.lowercase ? '✓' : '✗'} At least one small letter
                    </p>
                    <p style={{ color: passwordValidity.number ? 'green' : 'red', margin: '0.2rem 0' }}>
                        {passwordValidity.number ? '✓' : '✗'} At least one number
                    </p>
                    <p style={{ color: passwordValidity.specialChar ? 'green' : 'red', margin: '0.2rem 0' }}>
                        {passwordValidity.specialChar ? '✓' : '✗'} At least one special character
                    </p>
                </div>
                

                <div className="form-group">
                    <label htmlFor="password_confirm" className="form-label">
                        Confirm Password *
                    </label>
                    <input
                        type="password"
                        id="password_confirm"
                        name="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                    {errors.password_confirm && (
                        <div className="error-message">{errors.password_confirm}</div>
                    )}
                </div>

                {errors.non_field_errors && (
                    <div className="error-message">{errors.non_field_errors}</div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            <div className="text-center mt-2">
                <p>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#667eea' }}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;