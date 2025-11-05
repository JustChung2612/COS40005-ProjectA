import React, { useMemo, useState } from "react";
import { motion } from "framer-motion"; // Thư viện animation 
import "./loginPage.scss"; 
import { useUserStore } from "../../stores/useUserStore";

// Validation rules 
// kiểm tra định dạng email chuẩn
const emailRegex =
  /^(?:[a-zA-Z0-9_'^&/+-])+(?:\.(?:[a-zA-Z0-9_'^&/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;


export default function LoginPage() {

  const [showPassword, setShowPassword] = useState(false); // Bật/tắt hiển thị mật khẩu
  const [touched, setTouched] = useState({ email: false, password: false }); // Đã “chạm” vào input hay chưa
  

  // ✅ Unified sign-up data object
  const [logInData, setLogInData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = logInData;

  // Kiểm tra lỗi email
  const emailError = useMemo(() => {
    if (!touched.email) return "";
    if (!email) return "Please enter email.";
    if (!emailRegex.test(email)) return "Invalid email.";
    return "";
  }, [email, touched.email]);

  // Kiểm tra lỗi mật khẩu
  const passErrors = useMemo(() => {
  if (!touched.password) return [];
  if (!password) return ["Password required"];
  return [];
}, [password, touched.password]);

  const allValid =
    emailRegex.test(email) && passErrors.length === 0 && password.length > 0;

  // ✅ UPDATED add handleChange
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLogInData(prev => ({...prev, [name]: value }))
  }

  // ✅ Call the Zustand hook
  const { login, loading } = useUserStore();

  //  Gửi form đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault(); // Chặn reload trang
    setTouched({ email: true, password: true }); // Đánh dấu đã chạm vào cả hai input
    if (!allValid) return; // Nếu chưa hợp lệ thì ngừng
   
    try {
      await login(logInData);   
      setLogInData({email: "", password: ""});
    } catch(error){
      console.error("Error in Handle Submit:",error.message);
    }
  };


  // Đăng nhập bằng Google (demo)
  const googleSignIn = () => {
    alert("Google OAuth");
  };
  //sau sẽ thay đổi liên kết thật


  return (
    <div className="login-container">
      <div className="background-glow" />
      <AnimatedOrbs />
      <div className="login-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="login-card-wrapper"
        >
          <motion.div
            className="login-card"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            <GlowBorder />
            <div className="login-header">
              <h1>LOGIN</h1>
            </div>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    name="email"                // ✅ add this
                    type="email"
                    value={email}
                    onChange={handleChange}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, email: true }))
                    }
                    placeholder="abcxyz@example.com"
                    className={emailError ? "error" : ""}
                  />
                  <StatusDot
                    ok={!emailError && email.length > 0}
                    bad={!!emailError}
                  />
                </div>
                {emailError && <p className="error-text">{emailError}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    name="password"             // ✅ add this
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handleChange}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, password: true }))
                    }
                    placeholder="••••••••"
                    className={
                      passErrors.length && touched.password ? "error" : ""
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="show-password-btn"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                  <StatusDot
                    ok={
                      touched.password &&
                      passErrors.length === 0 &&
                      password.length > 0
                    }
                    bad={touched.password && passErrors.length > 0}
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={loading} className="login-btn" whileTap={{ scale: 0.98 }}
              >
                {loading ? <Spinner /> : "LOGIN"}
              </motion.button>

              <div className="divider">
                <span>OR</span>
              </div>

              <motion.button
                type="button"
                onClick={googleSignIn}
                className="google-btn"
                whileTap={{ scale: 0.98 }}
              >
                <GoogleIcon />
                <span>Sign in with Google</span>
              </motion.button>
            </form>
          
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}


// Hiển thị chấm tròn xanh or đỏ
function StatusDot({ ok, bad }) {
  return (
    <span className={`status-dot ${ok ? "ok" : bad ? "bad" : ""}`}></span>
  );
}

// Hiển thị vòng quay load
function Spinner() {
  return <div className="spinner"></div>;
}

// Biểu tượng Google
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 533.5 544.3">
      <path
        fill="#4285F4"
        d="M533.5 278.4c0-18.5-1.7-36.3-5-53.6H272.1v101.5h147c-6.3 34-25.1 62.7-53.6 81.9v68.1h86.6c50.7-46.7 81.4-115.5 81.4-198z"
      />
      <path
        fill="#34A853"
        d="M272.1 544.3c73.6 0 135.3-24.4 180.4-66.2l-86.6-68.1c-24.1 16.2-54.9 25.9-93.8 25.9-71.9 0-132.8-48.5-154.5-113.6H28.4v71.2c45 89.2 137.5 150.8 243.7 150.8z"
      />
      <path
        fill="#FBBC05"
        d="M117.6 322.3c-10.5-31.4-10.5-65.5 0-96.9V154.2H28.4c-39.3 78.6-39.3 171.4 0 250l89.2-81.9z"
      />
      <path
        fill="#EA4335"
        d="M272.1 106.1c39.9-0.6 77.2 14.8 105.9 42.9l78.9-78.9C407.3 24.5 345.8-0.1 272.1 0 165.9 0 73.4 61.6 28.4 150.8l89.2 71.2c21.7-65.1 82.6-115.9 154.5-115.9z"
      />
    </svg>
  );
}

// Viền quanh card
function GlowBorder() {
  return <div className="glow-border"></div>;
}

// animation di chuyển nền
function AnimatedOrbs() {
  return (
    <div className="animated-orbs">
      {[...Array(8)].map((_, i) => (
        <motion.span
          key={i}
          className="orb"
          animate={{ x: [0, 100, -100, 0], y: [0, 80, -80, 0] }}
          transition={{
            duration: 15 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
