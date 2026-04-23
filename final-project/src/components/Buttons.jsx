function Buttons() {
  return (
    <div style={{ marginTop: "15px" }}>
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#e11d48",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginRight: "10px"
        }}
      >
        Register
      </button>

      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#e5e7eb",
          border: "1px solid #ccc",
          borderRadius: "5px"
        }}
      >
        Sign in
      </button>
    </div>
  );
}

export default Buttons;