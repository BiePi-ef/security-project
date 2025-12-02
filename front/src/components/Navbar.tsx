import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Navbar component for "JDR BDD".
 * - Click app name -> /welcome
 * - All Community Objects -> /browse
 * - Create Object -> /createObject
 * - Profile -> /profile (only when logged in)
 * - Logout button when logged in
 * - Login / Sign in buttons when NOT logged in -> /login, /register
 *
 * Logged-in state is derived from localStorage token/user presence.
 * Adjust storage key(s) and logout behavior to fit your auth implementation.
 */

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    Boolean(localStorage.getItem("token") || localStorage.getItem("user"))
  );

  useEffect(() => {
    // Listen for storage changes from other tabs
    const onStorage = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token") || localStorage.getItem("user")));
    };
    
    // Also listen for custom event fired in current tab after login
    const onLoginEvent = () => {
      setIsLoggedIn(true);
    };
    
    const onLogoutEvent = () => {
      setIsLoggedIn(false);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:login", onLoginEvent);
    window.addEventListener("auth:logout", onLogoutEvent);
    
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:login", onLoginEvent);
      window.removeEventListener("auth:logout", onLogoutEvent);
    };
  }, []);
  
  const handleLogout = async () => {
    let token = localStorage.getItem("token");

    const res = await fetch('http://localhost:3001/auth/logout', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ "token": token }),
    })
    
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || 'Logout failed');
      return;
    }
   
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("auth:logout"));
    
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={{ ...styles.brand, textDecoration: "none" }}>
          JDR BDD
        </Link>
        <Link to="/browse" style={styles.link}>
          All_Community_Objects
        </Link>
        <Link to="/createObject" style={styles.link}>
          Create_Object
        </Link>
      </div>

      <div style={styles.right}>
        {isLoggedIn ? (
          <>
            <Link to="/profile" style={styles.link}>
              Profile
            </Link>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} style={styles.button}>
              Login
            </button>
            <button onClick={() => navigate("/register")} style={{ ...styles.button, marginLeft: 8 }}>
              Sign in
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles: { [k: string]: React.CSSProperties } = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    background: "#646464ff",
    color: "#fff",
  },
  brand: { fontWeight: 700, fontSize: 18, color: "#fff" },
  link: { color: "#ddd", marginLeft: 8, textDecoration: "none" },
  button: { 
    background: "#444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 4,
    cursor: "pointer",
  },
};

export default Navbar;