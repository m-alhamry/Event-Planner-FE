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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <div className="card">
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

                <div>
                    <div className="form-group">
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
                        {errors.first_name && <div className="error-message">{errors.first_name}</div>}
                    </div>

                    <div className="form-group">
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
                        />
                    </div>
                </div>
                {errors.last_name && <div className="error-message">{errors.last_name}</div>}
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
                {errors.phone && <div className="error-message">{errors.phone}</div>}

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
                    {errors.password_confirm && <div className="error-message">{errors.password_confirm}</div>}
                </div>
                {errors.non_field_errors && <div className="error-message">{errors.non_field_errors}</div>}

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>
            </form>
            <div className="text-center mt-2">
                <p>
                    Already have an account?
                    <Link to="/login" className="link"> Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;