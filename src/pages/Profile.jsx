import { useState } from 'react';
import { updateProfile, updatePassword, deleteAccount } from '../services/authAPI';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const [activeTab, setActiveTab] = useState('profile');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState('');

    // Profile form state
    const [profileData, setProfileData] = useState({
        first_name: user ? user.first_name : '',
        last_name: user ? user.last_name : '',
        phone: user ? user.phone : '',
    });
    const [profileErrors, setProfileErrors] = useState({});
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState('');

    // Password form state
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirm: '',
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileErrors({});
        setProfileSuccess('');

        try {
            await updateProfile(profileData);
            setProfileSuccess('Profile updated successfully!');
            setProfileErrors({});
        } catch (error) {
            if (error.response && error.response.data) {
                setProfileErrors(error.response.data);
            } else {
                setProfileErrors({ non_field_errors: 'Failed to update profile' });
            }
        }

        setProfileLoading(false);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordErrors({});
        setPasswordSuccess('');

        // Client-side validation
        if (passwordData.new_password !== passwordData.new_password_confirm) {
            setPasswordErrors({ new_password_confirm: "New passwords don't match" });
            setPasswordLoading(false);
            return;
        }

        try {
            await updatePassword(passwordData);
            setPasswordSuccess('Password updated successfully!');
            setPasswordData({
                current_password: '',
                new_password: '',
                new_password_confirm: '',
            });
            setPasswordErrors({});
        } catch (error) {
            if (error.response && error.response.data) {
                setPasswordErrors(error.response.data);
            } else {
                setPasswordErrors({ non_field_errors: 'Failed to update password' });
            }
        }

        setPasswordLoading(false);
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        setDeleteLoading(true);
        setDeleteError('');
        setDeleteSuccess('');

        try {
            await deleteAccount();
            setDeleteSuccess('Account deleted successfully.');
        } catch (error) {
            if (error.response && error.response.data) {
                setDeleteError(error.response.data.detail || 'Failed to delete account');
            } else {
                setDeleteError('Failed to delete account');
            }
            setDeleteLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card-header">
                <h1 className="card-title">Profile Settings</h1>
                <p style={{ color: '#666' }}>Manage your account information</p>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid #eee' }}>
                <button
                    onClick={() => setActiveTab('profile')}
                    style={{
                        padding: '1rem 2rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'profile' ? '2px solid #667eea' : 'none',
                        color: activeTab === 'profile' ? '#667eea' : '#666',
                        fontWeight: activeTab === 'profile' ? 'bold' : 'normal',
                    }}
                >
                    Profile Information
                </button>
                <button
                    onClick={() => setActiveTab('password')}
                    style={{
                        padding: '1rem 2rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'password' ? '2px solid #667eea' : 'none',
                        color: activeTab === 'password' ? '#667eea' : '#666',
                        fontWeight: activeTab === 'password' ? 'bold' : 'normal',
                    }}
                >
                    Change Password
                </button>
            </div>

            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Profile Information</h3>
                    </div>

                    <form onSubmit={handleProfileSubmit}>
                        <div className="form-group">
                            <label htmlFor="user_name" className="form-label">
                                User_name
                            </label>
                            <input
                                type="text"
                                id="user_name"
                                name="user_name"
                                value={user ? user.username : ""}
                                className="form-input"
                                disabled
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label htmlFor="first_name" className="form-label">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={profileData.first_name}
                                    onChange={handleProfileChange}
                                    className="form-input"
                                />
                                {profileErrors.first_name && (
                                    <div className="error-message">{profileErrors.first_name}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="last_name" className="form-label">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={profileData.last_name}
                                    onChange={handleProfileChange}
                                    className="form-input"
                                />
                                {profileErrors.last_name && (
                                    <div className="error-message">{profileErrors.last_name}</div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user ? user.email : ""}
                                className="form-input"
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleProfileChange}
                                className="form-input"
                            />
                            {profileErrors.phone && (
                                <div className="error-message">{profileErrors.phone}</div>
                            )}
                        </div>

                        {profileSuccess && (
                            <div className="success-message">{profileSuccess}</div>
                        )}

                        {profileErrors.non_field_errors && (
                            <div className="error-message">{profileErrors.non_field_errors}</div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={profileLoading}
                            style={{ width: '100%' }}
                        >
                            {profileLoading ? 'Updating Profile...' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Change Password</h3>
                    </div>

                    <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                            <label htmlFor="current_password" className="form-label">
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="current_password"
                                name="current_password"
                                value={passwordData.current_password}
                                onChange={handlePasswordChange}
                                className="form-input"
                                required
                            />
                            {passwordErrors.current_password && (
                                <div className="error-message">{passwordErrors.current_password}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_password" className="form-label">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new_password"
                                name="new_password"
                                value={passwordData.new_password}
                                onChange={handlePasswordChange}
                                className="form-input"
                                required
                            />
                            {passwordErrors.new_password && (
                                <div className="error-message">{passwordErrors.new_password}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_password_confirm" className="form-label">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="new_password_confirm"
                                name="new_password_confirm"
                                value={passwordData.new_password_confirm}
                                onChange={handlePasswordChange}
                                className="form-input"
                                required
                            />
                            {passwordErrors.new_password_confirm && (
                                <div className="error-message">{passwordErrors.new_password_confirm}</div>
                            )}
                        </div>

                        {passwordSuccess && (
                            <div className="success-message">{passwordSuccess}</div>
                        )}

                        {passwordErrors.non_field_errors && (
                            <div className="error-message">{passwordErrors.non_field_errors}</div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={passwordLoading}
                            style={{ width: '100%' }}
                        >
                            {passwordLoading ? 'Updating Password...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            )}

            {/* Delete Account Section */}
            <div className="card" style={{ marginTop: '2rem' }}>
                <div className="card-header">
                    <h3 className="card-title">Delete Account</h3>
                    <p style={{ color: '#666' }}>
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                </div>
                <div className="card-body">
                    {deleteSuccess && (
                        <div className="success-message">{deleteSuccess}</div>
                    )}
                    {deleteError && (
                        <div className="error-message">{deleteError}</div>
                    )}
                    <button
                        onClick={handleDeleteAccount}
                        className="btn btn-danger"
                        disabled={deleteLoading}
                        style={{ width: '100%' }}
                    >
                        {deleteLoading ? 'Deleting Account...' : 'Delete Account'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;