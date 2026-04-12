 function Navbar() {
  return (
    <div>
      {/* Top Bar */}
      <div className="top-bar">
        <span>Development version — features and content may change</span>
        <span className="resources">View resources</span>
      </div>

      {/* Main Navbar */}
      <div className="nav-bar">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-box">BS</div>
            <div>
              <strong>Booking System</strong>
              <p className="subtitle">Secure resource booking</p>
            </div>
          </div>

          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/form">Form</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;