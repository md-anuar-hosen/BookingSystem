 import { useState } from "react";
import { z } from "zod";
import Navbar from "../components/Navbar";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  age: z.string().min(1, "Age is required"),
});

function FormPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
  });

  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  return (
    <>
      <Navbar />

      <div className="container">
        
        {/* LEFT SIDE (TEXT) */}
        <div className="hero">
          <span className="badge">Form Submission</span>
          <h1>Submit Your Information Securely</h1>
          <p className="description">
            This form allows users to safely submit personal details. Data is
            validated and sent securely to the server.
          </p>
        </div>

        {/* RIGHT SIDE (FORM CARD) */}
        <div className="card">
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Submit Information
          </h2>

          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-input"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
              {errors.age && <p className="error">{errors.age}</p>}
            </div>

            <button type="submit" className="btn-primary">
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>

          {response && (
            <div className="response-box">
              <h3>Server Response</h3>
              <pre>{JSON.stringify(response.json, null, 2)}</pre>
            </div>
          )}
        </div>

      </div>
    </>
  );
}

export default FormPage;