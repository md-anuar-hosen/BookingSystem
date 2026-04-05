 function AuthCard() {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Welcome!</h2>
        <span className="guest">Guest</span>
      </div>

      <p>
        Sign in to manage your reservations and view booking owners.
      </p>

      <p>
        Administrators get extended rights and access to the admin dashboard.
      </p>

      <p>
        Don’t have an account yet? Register to get started.
      </p>

      <div className="buttons">
        <button className="btn-secondary">Sign in</button>
        <button className="btn-primary">Register</button>
      </div>
    </div>
  );
}

export default AuthCard;