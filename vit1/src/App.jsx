import { useState } from "react";

const API = "http://localhost:3000";

export default function App() {
  const [page, setPage]       = useState("login");
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);

  const [regName, setRegName]   = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass]   = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass]   = useState("");

  // ── Register ──────────────────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res  = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPass }),
        credentials: "include"   // sends/receives cookies
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registered! Now login.");
        setPage("login");
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      setMessage("Cannot reach server. Is it running?");
    }
  }

  // ── Login ─────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
        credentials: "include"   // cookie is saved by browser silently
      });

      // No res.json() here — response body is blank intentionally
      if (res.ok) {
        setMessage("");
        setPage("me");
      } else {
        const data = await res.json();
        setMessage(data.message || "Login failed.");
      }
    } catch (err) {
      setMessage("Cannot reach server. Is it running?");
    }
  }

  // ── /me ───────────────────────────────────────────────────
  async function handleGetMe() {
    setMessage("");
    try {
      const res  = await fetch(`${API}/me`, {
        method: "GET",
        credentials: "include"   // browser sends cookie automatically
      });
      const data = await res.json();
      if (res.ok) {
        setUserData(data);
      } else {
        setMessage(data.message || "Could not fetch user.");
        setPage("login");
      }
    } catch (err) {
      setMessage("Cannot reach server. Is it running?");
    }
  }

  // ── Logout ────────────────────────────────────────────────
  async function handleLogout() {
    await fetch(`${API}/logout`, {
      method: "POST",
      credentials: "include"   // server clears the cookie
    });
    setUserData(null);
    setMessage("");
    setPage("login");
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 400, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h2>Celume Studios — Auth</h2>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => { setPage("login");    setMessage(""); }}>Login</button>
        {" "}
        <button onClick={() => { setPage("register"); setMessage(""); }}>Register</button>
        {" "}
        {page === "me" && <button onClick={() => { setPage("me"); setMessage(""); }}>My Profile</button>}
        {" "}
        {page === "me" && <button onClick={handleLogout}>Logout</button>}
      </div>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {/* Register */}
      {page === "register" && (
        <form onSubmit={handleRegister}>
          <h3>Register</h3>
          <label>Name</label><br />
          <input value={regName} onChange={e => setRegName(e.target.value)} required /><br /><br />
          <label>Email</label><br />
          <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required /><br /><br />
          <label>Password</label><br />
          <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)} required /><br /><br />
          <button type="submit">Register</button>
        </form>
      )}

      {/* Login */}
      {page === "login" && (
        <form onSubmit={handleLogin}>
          <h3>Login</h3>
          <label>Email</label><br />
          <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required /><br /><br />
          <label>Password</label><br />
          <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} required /><br /><br />
          <button type="submit">Login</button>
        </form>
      )}

      {/* Me */}
      {page === "me" && (
        <div>
          <h3>My Profile</h3>
          <button onClick={handleGetMe}>Load My Data</button>
          {userData && (
            <div style={{ marginTop: 16 }}>
              <p><strong>Name:</strong>  {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}