import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';

const Account = ({ isBox4Visible, toggleBoxVisibility, handleCloseButtonClick, closeBox }) => {
    const { user, sessionExpired, login, register, logout } = useContext(AuthContext);
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const switchMode = (newMode) => {
        setMode(newMode);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            if (mode === 'register') {
                await register(username, email, password);
            } else {
                await login(email, password);
            }

            setUsername('');
            setEmail('');
            setPassword('');
            closeBox();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        logout();
        closeBox();
    };

    return (
        <div className="account">
            <button className="header-btn account-btn" onClick={toggleBoxVisibility}><img src="icons/user-solid.svg" alt="Account" className="icon account-btn"></img><span className="account-btn"> {user ? user.username : 'Log in'}</span></button>

            {isBox4Visible && (
                <div className="account-box pop-up">
                    <div className="flex-container">
                        <h3 className="account-title">{user ? 'Your account' : mode === 'register' ? 'Register' : 'Log in'}</h3>
                        <button className="close-btn close-btn-layout" onClick={handleCloseButtonClick}><img src="icons/xmark-solid.svg" alt="X Mark" className="icon close-btn"></img><span className="close-btn"> Close</span></button>
                    </div>

                    {sessionExpired && !user && (
                        <p role="status" className="auth-message">Your session has expired. Please log in again.</p>
                    )}

                    {user ? (
                        <div className="auth-form">
                            <p>Logged in as <b>{user.username}</b></p>
                            <button className="auth-submit" onClick={handleLogout}><span>Log out</span></button>
                        </div>
                    ) : (
                        <form className="auth-form" onSubmit={handleSubmit}>
                            {mode === 'register' && (
                                <>
                                    <label htmlFor="auth-username">Username</label>
                                    <input id="auth-username" type="text" autoComplete="username" minLength={3} maxLength={30} required value={username} onChange={(event) => setUsername(event.target.value)} />
                                </>
                            )}

                            <label htmlFor="auth-email">Email</label>
                            <input id="auth-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />

                            <label htmlFor="auth-password">Password</label>
                            <input id="auth-password" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={mode === 'register' ? 8 : undefined} required value={password} onChange={(event) => setPassword(event.target.value)} />
                            {mode === 'register' && <small>At least 8 characters</small>}

                            {error && <p role="alert" className="auth-error">{error}</p>}

                            <button type="submit" className="auth-submit" disabled={submitting}><span>{submitting ? 'Please wait...' : mode === 'register' ? 'Register' : 'Log in'}</span></button>

                            <button type="button" className="auth-switch" onClick={() => switchMode(mode === 'register' ? 'login' : 'register')}>
                                {mode === 'register' ? 'Already have an account? Log in' : 'No account? Register'}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default Account;
