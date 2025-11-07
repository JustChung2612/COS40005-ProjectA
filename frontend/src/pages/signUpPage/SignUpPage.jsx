import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import "./signupPage.scss";
import { useUserStore } from "../../stores/useUserStore";
import { toast } from "react-hot-toast";

const emailRegex = /^(?:[a-zA-Z0-9_'^&/+-])+(?:\.(?:[a-zA-Z0-9_'^&/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
const passwordRules = [
  { id: "len",   test: (v) => v.length >= 8,        label: "Minimum 8 characters" },
  { id: "num",   test: (v) => /\d/.test(v),         label: "There is at least 1 number" },
  { id: "alpha", test: (v) => /[A-Za-z]/.test(v),   label: "Has at least 1 letter" },
];

export default function SignupPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [touched, setTouched] = useState({ 
    username:false, email:false, password:false, 
    confirm:false, department:false, lop: false,
    maSinhVien: false,
  }); 

  // ✅ Unified sign-up data object
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    department: "",
    lop: "",
    maSinhVien: "",
  });

  const departments_option = [ 
      "Y khoa/Y sĩ đa khoa", "Răng Hàm Mặt ", 
      "Y tế công cộng", "Y học Cổ truyền", 
      "Y học dự phòng", "Điều dưỡng", "Phục hồi chức năng"
  ];

  const { username, email, password, confirm, department, lop, maSinhVien } = signUpData;
  
  const usernameError = useMemo(() => {
    if (!touched.username) return "";
    if (!username.trim()) return "Please enter username.";
    if (username.trim().length < 3) return "Username must be at least 3 characters.";
    return "";
  }, [username, touched.username]);

  const emailError = useMemo(() => {
    if (!touched.email) return "";
    if (!email) return "Please enter email.";
    if (!emailRegex.test(email)) return "Invalid email.";
    return "";
  }, [email, touched.email]);

  const passErrors = useMemo(() => {
    if (!touched.password) return [];
    return passwordRules.filter((r) => !r.test(password));
  }, [password, touched.password]);

  const confirmError = useMemo(() => {
    if (!touched.confirm) return "";
    if (!confirm) return "Please confirm password.";
    if (confirm !== password) return "Confirmation password does not match.";
    return "";
  }, [confirm, password, touched.confirm]);

  const departmentError = useMemo(() => {
    if (!touched.department) return "";
    if (!department) return "Vui lòng chọn khoa / ngành.";
    return "";
  }, [department, touched.department]);

  // ✅ NEW — validate Mã Sinh Viên (6 digits)
  const maSinhVienError = useMemo(() => {
    if (!touched.maSinhVien) return "";
    if (!maSinhVien.trim()) return "Vui lòng nhập mã sinh viên.";
    if (!/^\d{6}$/.test(maSinhVien)) return "Mã sinh viên phải gồm đúng 6 chữ số.";
    return "";
  }, [maSinhVien, touched.maSinhVien]);

  // ✅ No validation for Lớp for now
  const lopError = useMemo(() => {
    if (!lop) return "Vui lòng nhập tên lớp.";
  }) ;

  const allValid =
    !usernameError &&
    !emailError &&
    passErrors.length === 0 &&
    confirm === password &&
    password.length > 0 &&
    !departmentError &&
    !maSinhVienError;

  // ✅ UPDATED add handleChange
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSignUpData(prev => ({...prev, [name]: value }))
  }

  // ✅ Call the Zustand hook
  const { signup, loading } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ 
      username:true, email:true, password:true, 
      confirm:true, department:true, lop: true,
      maSinhVien: true,
    });
    if (!allValid) return;

    try {
      await signup(signUpData);                        
     
    } catch (error) {
      console.error("Error in Handle Submit:",error.message);
    }
    
  };

  const googleSignUp = () => {
    toast("Google OAuth coming soon!");    
  };

  return (
    <div className="signup-container">
      <div className="background-glow" />
      <AnimatedOrbs />

      <div className="signup-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="signup-card-wrapper"
        >
          <motion.div
            className="signup-card"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            <GlowBorder />

            <div className="signup-header">
              <h1>SIGN UP</h1>
            </div>

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">

                <label htmlFor="username">User name</label>
                <div className="input-wrapper">
                  <input
                    id="username"
                    name="username"        // ✅ add
                    type="text"
                    value={username}
                    onChange={handleChange}
                    onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                    placeholder="Your user name?"
                    className={usernameError ? "error" : ""}
                  />
                  <StatusDot ok={!usernameError && username.length > 0} bad={!!usernameError} />
                </div>
                {usernameError && <p className="error-text">{usernameError}</p>}
              </div>

              {/* 📧 Email */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    name="email"           // ✅ add
                    type="email"
                    value={email}
                    onChange={handleChange}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    placeholder="abcxyz@example.com"
                    className={emailError ? "error" : ""}
                  />
                  <StatusDot ok={!emailError && email.length > 0} bad={!!emailError} />
                </div>
                {emailError && <p className="error-text">{emailError}</p>}
              </div>

              {/* 🏫 Lớp */}
              <div className="form-group">
                <label htmlFor="lop">Lớp</label>
                <div className="input-wrapper">
                  <input
                    id="lop"
                    name="lop"
                    type="text"
                    value={lop}
                    onChange={handleChange}
                    onBlur={() => setTouched((t) => ({ ...t, lop: true }))}
                    placeholder="Nhập tên lớp (VD: YD23A)"
                    className={lopError ? "error" : ""}
                  />
                  <StatusDot ok={!!lop} />
                </div>
                {lopError && <p className="error-text">{lopError}</p>}
              </div>

              {/* 🎓 Mã Sinh Viên */}
              <div className="form-group">
                <label htmlFor="maSinhVien">Mã Sinh Viên</label>
                <div className="input-wrapper">
                  <input
                    id="maSinhVien"
                    name="maSinhVien"
                    type="text"
                    value={maSinhVien}
                    onChange={handleChange}
                    onBlur={() => setTouched((t) => ({ ...t, maSinhVien: true }))}
                    placeholder="Nhập mã sinh viên (6 chữ số)"
                    className={maSinhVienError ? "error" : ""}
                  />
                  <StatusDot ok={!maSinhVienError && maSinhVien.length === 6} bad={!!maSinhVienError} />
                </div>
                {maSinhVienError && <p className="error-text">{maSinhVienError}</p>}
              </div>

              {/* 🧠 Khoa / Ngành */}
              <div className="form-group">
                <label htmlFor="department">Khoa / Ngành</label>
                <div className="input-wrapper">
                  <select
                    id="department"
                    name="department"
                    value={department}
                    onChange={handleChange}
                    onBlur={() => setTouched((t) => ({ ...t, department: true }))}
                    className={departmentError ? "error" : ""}
                  >
                    <option value="">-- Chọn khoa / ngành --</option>
                    {departments_option.map((dep, i) => (
                      <option key={i} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                  <StatusDot ok={!departmentError && !!signUpData.department} bad={!!departmentError} />
                </div>
                {departmentError && <p className="error-text">{departmentError}</p>}
              </div>

              {/* 🆕🆕🆕 Lớp */}


              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    name="password"        // ✅ add
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={handleChange}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    placeholder="••••••••"
                    className={passErrors.length && touched.password ? "error" : ""}
                  />
                  <button type="button" onClick={() => setShowPwd((s) => !s)} className="show-password-btn">
                    {showPwd ? "Hide" : "Show"}
                  </button>
                  <StatusDot ok={touched.password && passErrors.length === 0 && password.length > 0} bad={touched.password && passErrors.length > 0} />
                </div>

                <div className="password-rules">
                  {passwordRules.map((r) => {
                    const ok = r.test(password);
                    return (
                      <div key={r.id} className={`rule ${ok ? "ok" : ""}`}>
                        <span className="rule-dot" />
                        {r.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Confirm */}
              <div className="form-group">
                <label htmlFor="confirm">Confirm password</label>
                <div className="input-wrapper">
                  <input
                    id="confirm"
                    name="confirm"         // ✅ add
                    type={showPwd ? "text" : "password"}
                    value={confirm}
                    onChange={handleChange}
                    onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                    placeholder="Re-enter password"
                    className={confirmError ? "error" : ""}
                  />
                  <StatusDot ok={!confirmError && confirm.length > 0} bad={!!confirmError} />
                </div>
                {confirmError && <p className="error-text">{confirmError}</p>}
              </div>

              {/* Submit */}
              <motion.button type="submit" disabled={loading} className="signup-btn" whileTap={{ scale: 0.98 }}>
                {loading ? <Spinner /> : "SIGN UP"}
              </motion.button>

              {/* Divider */}
              <div className="divider"><span>OR</span></div>

              {/* Google signup */}
              <motion.button type="button" onClick={googleSignUp} className="google-btn" whileTap={{ scale: 0.98 }}>
                <GoogleIcon />
                <span>Sign up with Google</span>
              </motion.button>
            </form>

          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function StatusDot({ ok, bad }) {
  return <span className={`status-dot ${ok ? "ok" : bad ? "bad" : ""}`} />;
}
function Spinner() { return <div className="spinner" />; }
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 533.5 544.3">
      <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.7-36.3-5-53.6H272.1v101.5h147c-6.3 34-25.1 62.7-53.6 81.9v68.1h86.6c50.7-46.7 81.4-115.5 81.4-198z"/>
      <path fill="#34A853" d="M272.1 544.3c73.6 0 135.3-24.4 180.4-66.2l-86.6-68.1c-24.1 16.2-54.9 25.9-93.8 25.9-71.9 0-132.8-48.5-154.5-113.6H28.4v71.2c45 89.2 137.5 150.8 243.7 150.8z"/>
      <path fill="#FBBC05" d="M117.6 322.3c-10.5-31.4-10.5-65.5 0-96.9V154.2H28.4c-39.3 78.6-39.3 171.4 0 250l89.2-81.9z"/>
      <path fill="#EA4335" d="M272.1 106.1c39.9-0.6 77.2 14.8 105.9 42.9l78.9-78.9C407.3 24.5 345.8-0.1 272.1 0 165.9 0 73.4 61.6 28.4 150.8l89.2 71.2c21.7-65.1 82.6-115.9 154.5-115.9z"/>
    </svg>
  );
}
function GlowBorder() { return <div className="glow-border" />; }
function AnimatedOrbs() {
  return (
    <div className="animated-orbs">
      {[...Array(8)].map((_, i) => (
        <motion.span
          key={i}
          className="orb"
          animate={{ x: [0, 100, -100, 0], y: [0, 80, -80, 0] }}
          transition={{ duration: 15 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
