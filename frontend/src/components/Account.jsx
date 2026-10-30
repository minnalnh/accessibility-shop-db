import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { CartContext } from "./CartContext";

const Account = ({
  isBoxVisible,
  toggleBoxVisibility,
  handleCloseButtonClick,
  closeBox,
}) => {
  const { user, sessionExpired, login, register, logout } =
    useContext(AuthContext);
  const { notice } = useContext(CartContext);
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const accountRef = useRef(null);
  const accountButtonRef = useRef(null);

  useEffect(() => {
    if (!isBoxVisible) return;

    const handleOutsideClick = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target) &&
        accountButtonRef.current &&
        !accountButtonRef.current.contains(event.target)
      ) {
        handleCloseButtonClick();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isBoxVisible, handleCloseButtonClick]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "register") {
        await register(username, email, password);
      } else {
        await login(email, password);
      }

      setUsername("");
      setEmail("");
      setPassword("");
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
    <section className="account">
      <button
        ref={accountButtonRef}
        className="header-btn account-btn"
        onClick={() => toggleBoxVisibility("account")}
      >
        <img
          src="icons/user-solid.svg"
          alt="Account"
          className="icon account-btn"
        ></img>
        <span className="account-btn"> {user ? user.username : "Log in"}</span>
      </button>

      {isBoxVisible && (
        <section ref={accountRef} className="account-box pop-up">
          <section className="flex-container">
            <h3 className="account-title">
              {user
                ? "Your account"
                : mode === "register"
                  ? "Register"
                  : "Log in"}
            </h3>
            <button
              className="close-btn close-btn-layout"
              onClick={handleCloseButtonClick}
            >
              <img
                src="icons/xmark-solid.svg"
                alt="X Mark"
                className="icon close-btn"
              ></img>
              <span className="close-btn"> Close</span>
            </button>
          </section>

          {notice?.type === "login" && !user && (
            <p role="status" className="cart-notice">
              {notice.message}
            </p>
          )}

          {sessionExpired && !user && (
            <p role="status" className="auth-message">
              Your session has expired. Please log in again.
            </p>
          )}

          {user ? (
            <article className="auth-form">
              <p>
                Logged in as <b>{user.username}</b>
              </p>
              <button className="auth-submit" onClick={handleLogout}>
                <span>Log out</span>
              </button>
            </article>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "register" && (
                <>
                  <label htmlFor="auth-username">Username</label>
                  <input
                    id="auth-username"
                    type="text"
                    autoComplete="username"
                    minLength={3}
                    maxLength={30}
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </>
              )}

              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                autoComplete={
                  mode === "register" ? "new-password" : "current-password"
                }
                minLength={mode === "register" ? 8 : undefined}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {mode === "register" && <small>At least 8 characters</small>}

              {error && (
                <p role="alert" className="auth-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={submitting}
              >
                <span>
                  {submitting
                    ? "Please wait..."
                    : mode === "register"
                      ? "Register"
                      : "Log in"}
                </span>
              </button>

              <button
                type="button"
                className="auth-switch"
                onClick={() =>
                  switchMode(mode === "register" ? "login" : "register")
                }
              >
                {mode === "register"
                  ? "Already have an account? Log in"
                  : "No account? Register"}
              </button>
            </form>
          )}
        </section>
      )}
    </section>
  );
};

export default Account;
