import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, TextField, Button, IconButton,
  InputAdornment, CircularProgress, GlobalStyles, Link, Collapse, alpha,
} from "@mui/material";
import { keyframes } from "@mui/system";
import {
  PersonOutline, LockOutlined,
  Visibility, VisibilityOff,
  CheckCircleOutline, ErrorOutline,
  ArrowBackIosNew,
} from "@mui/icons-material";
import api from "../services/api";

const TOKEN_KEY = "token";

/* ─── Design tokens (Light mode) ─── */
const T = {
  primary: "#1A1A1A",
  secondary: "#0052FF",
  bg: "#FFFFFF",
  paper: "#FFFFFF",
  textSecondary: "#555555",
  textDisabled: "#9E9E9E",
  divider: "rgba(0, 0, 0, 0.08)",
  error: "#E5484D",
};

/* ─── Animations ─── */
const slideUpIn = keyframes`
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;
const floatActive = keyframes`
  0%, 100% { transform: translate(-50%, -50%) scale(1) translateY(0px); }
  50%      { transform: translate(-50%, -50%) scale(1.1) translateY(-20px); }
`;
const pulseGlow = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.3); opacity: 0.5; }
`;
const popIn = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
`;
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
`;

/* ─── Glowing-orb background ─── */
const AnimatedBackground = () => (
  <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
    {[
      { size: 650, x: "85%", y: "15%", color: alpha(T.secondary, 0.06), delay: "0s" },
      { size: 480, x: "15%", y: "80%", color: alpha(T.secondary, 0.04), delay: "2s" },
    ].map((orb, i) => (
      <Box
        key={i}
        sx={{
          position: "absolute",
          width: orb.size,
          height: orb.size,
          borderRadius: "50%",
          left: orb.x,
          top: orb.y,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          animation: `${floatActive} 12s ease-in-out ${orb.delay} infinite`,
        }}
      />
    ))}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(${T.divider} 1px, transparent 1px), linear-gradient(90deg, ${T.divider} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        maskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 80%)",
      }}
    />
  </Box>
);

export default function AdminLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showP, setShowP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [focused, setFocused] = useState("");
  const userRef = useRef(null);

  useEffect(() => { userRef.current?.focus(); }, []);
  useEffect(() => {
    if (localStorage.getItem(TOKEN_KEY)) navigate("/admin");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.trim() || !pass.trim()) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      setShakeKey((k) => k + 1);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { username: user, password: pass });
      const { token } = res.data.data;
      localStorage.setItem(TOKEN_KEY, token);
      setSuccess(true);
      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "بيانات الدخول غير صحيحة، حاول مجدداً");
      setShakeKey((k) => k + 1);
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyles
        styles={{
          "@import": [
            "url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap')",
          ],
          "*,*::before,*::after": { boxSizing: "border-box" },
          "html,body,#root": { height: "100%" },
          body: { backgroundColor: T.bg, fontFamily: "'DM Sans', sans-serif" },
        }}
      />

      <Box
        dir="rtl"
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: T.bg,
          p: { xs: 2.5, sm: 3 },
        }}
      >
        <AnimatedBackground />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 420,
            animation: `${slideUpIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both`,
          }}
        >
          {/* Main Card Container */}
          <Box
            sx={{
              border: `1px solid ${alpha(T.primary, 0.08)}`,
              borderRadius: "24px",
              backgroundColor: alpha(T.paper, 0.85),
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: `0 20px 40px -15px ${alpha(T.primary, 0.07)}, 0 0 0 1px ${alpha(T.primary, 0.02)}`,
              p: { xs: 3.5, sm: 4.5 },
            }}
          >
            {/* Header Content Inside Box & Centered */}
            <Box sx={{ textAlign: "center", mb: 3.5 }}>
              {/* Badge */}
              
                

              {/* Title */}
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: "1.85rem", sm: "2.2rem" },
                  lineHeight: 1.15,
                  letterSpacing: "-0.8px",
                  color: T.primary,
                  mb: 1,
                }}
              >
                لوحة التحكم
              </Typography>

              {/* Description */}
              <Typography sx={{ color: T.textSecondary, fontSize: "0.92rem", lineHeight: 1.6 }}>
                سجّل دخولك لإدارة محتوى ملفك الشخصي.
              </Typography>
            </Box>

            {success ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.8, py: 2, animation: `${popIn} 0.4s cubic-bezier(0.34,1.56,0.64,1)` }}>
                <Box sx={{
                  width: 52, height: 52, borderRadius: "14px",
                  background: alpha("#10b981", 0.1),
                  border: "1px solid rgba(16,185,129,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <CheckCircleOutline sx={{ color: "#10b981", fontSize: 26 }} />
                </Box>
                <Typography sx={{ fontSize: "0.9rem", color: "#0f9d70", fontWeight: 700 }}>
                  تم التحقق — جارٍ نقلك للوحة التحكم
                </Typography>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
                {/* Username */}
                <Box>
                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: T.textDisabled, mb: 0.8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    اسم المستخدم
                  </Typography>
                  <TextField
                    inputRef={userRef}
                    fullWidth
                    placeholder="admin"
                    value={user}
                    onChange={(e) => { setUser(e.target.value); setError(""); }}
                    onFocus={() => setFocused("user")}
                    onBlur={() => setFocused("")}
                    error={!!error}
                    autoComplete="username"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline sx={{ fontSize: 19, color: focused === "user" ? T.secondary : T.textDisabled, transition: "color 0.2s" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={fieldSx(!!error)}
                  />
                </Box>

                {/* Password */}
                <Box>
                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: T.textDisabled, mb: 0.8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    كلمة المرور
                  </Typography>
                  <TextField
                    fullWidth
                    type={showP ? "text" : "password"}
                    placeholder="••••••••"
                    value={pass}
                    onChange={(e) => { setPass(e.target.value); setError(""); }}
                    onFocus={() => setFocused("pass")}
                    onBlur={() => setFocused("")}
                    error={!!error}
                    autoComplete="current-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined sx={{ fontSize: 19, color: focused === "pass" ? T.secondary : T.textDisabled, transition: "color 0.2s" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowP((v) => !v)} edge="end" size="small" sx={{ color: T.textDisabled, "&:hover": { color: T.primary } }}>
                            {showP ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={fieldSx(!!error)}
                  />
                </Box>

                {/* Error Banner */}
                <Collapse in={!!error}>
                  <Box key={shakeKey} sx={{
                    display: "flex", alignItems: "center", gap: 1,
                    px: 1.6, py: 1.2,
                    background: alpha(T.error, 0.05),
                    border: `1px solid ${alpha(T.error, 0.2)}`,
                    borderRadius: "10px",
                    animation: `${shake} 0.38s ease`,
                  }}>
                    <ErrorOutline sx={{ fontSize: 16, color: T.error, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: "0.82rem", color: T.error, fontWeight: 500 }}>{error}</Typography>
                  </Box>
                </Collapse>

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 0.5,
                    bgcolor: T.primary,
                    color: "#fff",
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: "0.92rem",
                    borderRadius: "12px",
                    textTransform: "none",
                    boxShadow: "none",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": {
                      bgcolor: T.primary,
                      transform: "translateY(-1.5px)",
                      boxShadow: `0 8px 20px -4px ${alpha(T.primary, 0.25)}`,
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                    "&.Mui-disabled": { bgcolor: alpha(T.primary, 0.4), color: "#fff" },
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      <CircularProgress size={16} sx={{ color: "rgba(255,255,255,0.8)" }} />
                      <span>جارٍ التحقق...</span>
                    </Box>
                  ) : (
                    "الدخول إلى لوحة التحكم"
                  )}
                </Button>
              </Box>
            )}
          </Box>

          {/* Back link */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}>
            <Link
              href="/"
              underline="none"
              sx={{
                fontSize: "0.82rem", fontWeight: 600, color: T.textSecondary,
                display: "flex", alignItems: "center", gap: 0.6,
                transition: "all 0.2s ease",
                "&:hover": { color: T.secondary, transform: "translateX(3px)" },
              }}
            >
              العودة للموقع
              <ArrowBackIosNew sx={{ fontSize: 10 }} />
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
}

/* ─── TextField styling ─── */
function fieldSx(hasError) {
  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: alpha(T.primary, 0.01),
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.9rem",
      transition: "all 0.2s ease",
      "& fieldset": { borderColor: hasError ? alpha(T.error, 0.4) : T.divider },
      "&:hover fieldset": { borderColor: hasError ? T.error : alpha(T.primary, 0.2) },
      "&.Mui-focused": {
        backgroundColor: "#FFFFFF",
        boxShadow: hasError
          ? `0 0 0 3px ${alpha(T.error, 0.1)}`
          : `0 0 0 3px ${alpha(T.secondary, 0.12)}`,
      },
      "&.Mui-focused fieldset": { borderColor: hasError ? T.error : T.secondary, borderWidth: "1.5px" },
    },
    "& .MuiOutlinedInput-input": { p: "12px 14px" },
  };
}