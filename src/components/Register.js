import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slice/authSlice";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaIdCard,
  FaCalendar,
} from "react-icons/fa";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    userId: "",
    email: "",
    dob: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const result = await dispatch(registerUser(form));

    if (registerUser.fulfilled.match(result)) {
      alert("Registered successfully ✅");
      navigate("/");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>

        <div className="input-box">
          <FaUser className="input-icon" />
          <input name="name" placeholder="Full Name" onChange={handleChange} />
        </div>

        <div className="input-box">
          <FaIdCard className="input-icon" />
          <input name="userId" placeholder="User ID" onChange={handleChange} />
        </div>

        <div className="input-box">
          <FaEnvelope className="input-icon" />
          <input name="email" placeholder="Email" onChange={handleChange} />
        </div>

        <div className="input-box">
          <FaCalendar className="input-icon" />
          <input name="dob" type="date" onChange={handleChange} />
        </div>

        <div className="input-box">
          <FaLock className="input-icon" />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>

        <button
          className="register-btn"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p className="register-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}