import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Divider, Typography, AppBar, Toolbar, IconButton, Button,
  TextField, Switch, FormControlLabel, Chip, Paper, Stack,
  Grid, CircularProgress, InputAdornment, TextareaAutosize, Fade, Alert, Link
} from "@mui/material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import api from "../services/api";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import prefixer from "stylis-plugin-rtl";
import rtlPlugin from "stylis-plugin-rtl";

import {
  Menu as MenuIcon,
  SpaceDashboard as DashboardIcon,
  CompassCalibration as NavbarIcon,
  LaptopMac as HeroIcon,
  AccountCircle as AboutIcon,
  Psychology as SkillsIcon,
  BusinessCenter as ProjectsIcon,
  School as EducationIcon,
  WorkspacePremium as CertificatesIcon,
  ContactMail as ContactIcon,
  ViewStream as FooterIcon,
  Badge as ProfileIcon,
  AutoAwesome as AIIcon,
  CloudDownload as DownloadIcon,
  Save as SaveIcon,
  Code as CodeIcon,
  FormatListBulleted as FormIcon,
  CheckCircle as SuccessIcon,
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Visibility as EyeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  Star as StarIcon,
  CalendarMonth as DateIcon,
  MenuBook as CoursesIcon,
  Work as ExperienceIcon,
  OpenInNew as OpenInNewIcon,
  MailOutline as MessagesIcon,
  MarkEmailRead as MarkReadIcon,
  Circle as UnreadDotIcon,
  Logout as LogoutIcon,
  CloudUpload as UploadIcon,
  LockReset as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const cacheRtl = createCache({ key: "muirtl", stylisPlugins: [prefixer, rtlPlugin] });

const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: { main: "#4f46e5", light: "#818cf8", dark: "#3730a3" },
    secondary: { main: "#0ea5e9", light: "#38bdf8", dark: "#0369a1" },
    background: { default: "#f8fafc", paper: "#ffffff" },
    text: { primary: "#0f172a", secondary: "#475569", disabled: "#94a3b8" },
    divider: "#e2e8f0",
    success: { main: "#10b981", light: "#ecfdf5" },
    error: { main: "#ef4444", light: "#fef2f2" },
  },
  typography: {
    fontFamily: "'Tajawal', 'Inter', sans-serif",
    h1: { fontSize: "20px", fontWeight: 700 },
    h2: { fontSize: "15px", fontWeight: 600 },
    body1: { fontSize: "14px", lineHeight: 1.6 },
    body2: { fontSize: "13px" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none", padding: "8px 16px", gap: "8px",
          "&:hover": { boxShadow: "none" },
          "& .MuiButton-startIcon": { marginRight: 0, marginLeft: 0 },
          "& .MuiButton-endIcon": { marginRight: 0, marginLeft: 0 },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f8fafc", transition: "all 0.2s ease",
            "& fieldset": { textAlign: "right" },
            "&:hover": { backgroundColor: "#f1f5f9" },
            "&.Mui-focused": { backgroundColor: "#ffffff" },
          },
          "& .MuiInputLabel-root": {
            transformOrigin: "top right", right: 14, left: "auto",
            "&.MuiInputLabel-shrink": { transform: "translate(14px, -9px) scale(0.75)" },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)" },
      },
    },
  },
});

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

const STORAGE_KEYS = {
  profile: "portfolio_profile",
  hero: "portfolio_hero",
  about: "portfolio_about",
  skills: "portfolio_skills",
  projects: "portfolio_projects",
  education: "portfolio_education",
  certificates: "portfolio_certificates",
  contact: "portfolio_contact",
  navbar: "portfolio_navbar",
  footer: "portfolio_footer",
  experience: "portfolio_experience",
};

// Empty placeholders shown only for a brief moment before the real data
// arrives from the backend (or as a fallback if the backend is unreachable).
// Nothing here is fake content that ends up on the live site — fill
// everything in from each tab instead.
const defaultData = {
  profile: {
    name: "", title: "", tagline: "",
    email: "", phone: "", location: "",
    bio: "", shortBio: "", resumeUrl: "",
    social: { github: "", linkedin: "", twitter: "", instagram: "", whatsapp: "" },
    stats: [],
  },
  hero: { greeting: "", roles: [], ctaPrimary: { label: "", href: "#projects" }, ctaSecondary: { label: "", href: "#contact" }, showSocials: true, showScrollIndicator: true },
  about: { sectionTitle: "", sectionSubtitle: "", highlights: [], availability: "", yearsOfExperience: "" },
  skills: [],
  projects: [],
  education: [],
  certificates: [],
  experience: [],
  contact: { sectionTitle: "", sectionSubtitle: "", emailLabel: "", showPhone: true, showLocation: true, showSocials: true, availabilityMessage: "" },
  navbar: { logo: "", logoFull: "", links: [], showThemeToggle: true, showResumeButton: true, resumeLabel: "Resume" },
  footer: { copyrightName: "", tagline: "", showSocials: true, showBackToTop: true },
};

const SECTIONS = [
  { key: "profile",      label: "الملف الشخصي",  icon: <ProfileIcon /> },
  { key: "navbar",       label: "شريط التنقل",   icon: <NavbarIcon /> },
  { key: "hero",         label: "القسم الرئيسي", icon: <HeroIcon /> },
  { key: "about",        label: "عني",            icon: <AboutIcon /> },
  { key: "skills",       label: "المهارات",       icon: <SkillsIcon /> },
  { key: "projects",     label: "المشاريع",       icon: <ProjectsIcon /> },
  { key: "experience",   label: "الخبرات",        icon: <ExperienceIcon /> },
  { key: "education",    label: "التعليم",        icon: <EducationIcon /> },
  { key: "certificates", label: "الشهادات",       icon: <CertificatesIcon /> },
  { key: "contact",      label: "الاتصال",        icon: <ContactIcon /> },
  { key: "footer",       label: "الفوتر",         icon: <FooterIcon /> },
  { key: "messages",     label: "رسائل التواصل",  icon: <MessagesIcon /> },
  { key: "security",     label: "الأمان",          icon: <SecurityIcon /> },
];

/* ── مساعد الذكاء الاصطناعي ──────────────────────────────────── */
function AIAssistant({ section, currentData, onApply }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState(null);

  const askAI = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setError(null); setSuggestion(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL, max_tokens: 1000,
          system: `You are an expert portfolio content editor. Modify the dataset for section "${section}". Current data: ${JSON.stringify(currentData)}. Return ONLY valid JSON matching the data structure. No explanation or markdown.`,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const json = await res.json();
      const text = json.content?.[0]?.text || "";
      setSuggestion(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch {
      setError("تعذر الحصول على استجابة الذكاء الاصطناعي.");
    }
    setLoading(false);
  };

  return (
    <Paper variant="outlined" sx={{ mt: 3, p: 2.5, bgcolor: alpha(theme.palette.primary.main, 0.02), borderColor: alpha(theme.palette.primary.main, 0.15), borderRadius: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.dark" }}>المساعد الذكي لتوليد المحتوى</Typography>
        <AIIcon sx={{ color: "primary.main", fontSize: 18 }} />
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <TextField fullWidth size="small" value={prompt} onChange={(e) => setPrompt(e.target.value)}
          placeholder="صف التغييرات التي تريدها وسيقوم الذكاء الاصطناعي بتطبيقها..."
          onKeyDown={(e) => e.key === "Enter" && askAI()} />
        <Button variant="contained" onClick={askAI} disabled={loading} sx={{ minWidth: 120 }}>
          {loading ? <CircularProgress size={20} color="inherit" /> : "تطبيق ذكي"}
        </Button>
      </Stack>
      {error && <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>{error}</Typography>}
      {suggestion && (
        <Box sx={{ mt: 2 }}>
          <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "#f8fafc", maxHeight: 150, overflow: "auto", mb: 1.5 }}>
            <pre style={{ margin: 0, fontSize: "11px", fontFamily: "monospace" }}>{JSON.stringify(suggestion, null, 2)}</pre>
          </Paper>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="contained" color="success" onClick={() => { onApply(suggestion); setSuggestion(null); setPrompt(""); }}>اعتماد التغيير</Button>
            <Button size="small" variant="outlined" color="inherit" onClick={() => setSuggestion(null)}>إلغاء</Button>
          </Stack>
        </Box>
      )}
    </Paper>
  );
}

/* ── محرر JSON ───────────────────────────────────────────────── */
function JsonEditor({ value, onChange }) {
  const [raw, setRaw] = useState(JSON.stringify(value, null, 2));
  const [err, setErr] = useState(null);
  useEffect(() => { setRaw(JSON.stringify(value, null, 2)); }, [value]);
  return (
    <Box>
      <TextareaAutosize minRows={14} value={raw}
        onChange={(e) => { setRaw(e.target.value); try { onChange(JSON.parse(e.target.value)); setErr(null); } catch { setErr("صيغة JSON غير صالحة"); } }}
        style={{ width: "100%", fontFamily: "monospace", fontSize: "12px", backgroundColor: "#0f172a", color: "#f8fafc", padding: "16px", borderRadius: "12px", border: err ? "1px solid #ef4444" : "1px solid #e2e8f0", outline: "none", boxSizing: "border-box" }}
      />
      {err && <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>{err}</Typography>}
    </Box>
  );
}

/* ── محررات الأقسام ──────────────────────────────────────────── */

function ProfileEditor({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  const sf = (k, v) => onChange({ ...data, social: { ...data.social, [k]: v } });
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState(null);
  const resumeInputRef = useRef(null);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setResumeError("الملف يجب أن يكون بصيغة PDF");
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError("حجم الملف يجب ألا يتجاوز 5 ميجابايت");
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      return;
    }
    setUploadingResume(true);
    setResumeError(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      // Let the browser set the multipart boundary itself — overriding the
      // instance's default 'application/json' header is required here.
      const res = await api.post("/profile/resume", formData, {
        headers: { "Content-Type": undefined },
      });
      f("resumeUrl", res.data.data.resumeUrl);
    } catch (err) {
      setResumeError(err.response?.data?.message || "تعذر رفع الملف — تأكد من تسجيل الدخول.");
    } finally {
      setUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    }
  };

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} sm={6}><TextField fullWidth label="الاسم الكامل" value={data.name || ""} onChange={(e) => f("name", e.target.value)} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="المسمى الوظيفي" value={data.title || ""} onChange={(e) => f("title", e.target.value)} /></Grid>
      <Grid item xs={12}><TextField fullWidth label="شعار تعريفي مختصر (Tagline)" value={data.tagline || ""} onChange={(e) => f("tagline", e.target.value)} /></Grid>
      <Grid item xs={12} sm={4}><TextField fullWidth label="البريد الإلكتروني" value={data.email || ""} onChange={(e) => f("email", e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" /></InputAdornment> }} /></Grid>
      <Grid item xs={12} sm={4}><TextField fullWidth label="رقم الجوال" value={data.phone || ""} onChange={(e) => f("phone", e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon fontSize="small" /></InputAdornment> }} /></Grid>
      <Grid item xs={12} sm={4}><TextField fullWidth label="المدينة والدولة" value={data.location || ""} onChange={(e) => f("location", e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon fontSize="small" /></InputAdornment> }} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="نبذة سريعة (Short Bio)" value={data.shortBio || ""} onChange={(e) => f("shortBio", e.target.value)} /></Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>ملف السيرة الذاتية (PDF)</Typography>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button
            variant="outlined"
            size="small"
            component="label"
            disabled={uploadingResume}
            startIcon={uploadingResume ? <CircularProgress size={14} /> : <UploadIcon />}
          >
            {uploadingResume ? "جارٍ الرفع..." : data.resumeUrl ? "تغيير الملف" : "رفع ملف"}
            <input ref={resumeInputRef} type="file" accept="application/pdf" hidden onChange={handleResumeUpload} />
          </Button>
          {data.resumeUrl && (
            <Link href={data.resumeUrl} target="_blank" rel="noopener noreferrer" sx={{ fontSize: 13 }}>
              عرض الملف الحالي
            </Link>
          )}
        </Stack>
        {resumeError && <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>{resumeError}</Typography>}
      </Grid>
      <Grid item xs={12}><TextField fullWidth multiline rows={3} label="السيرة الذاتية الكاملة (Bio)" value={data.bio || ""} onChange={(e) => f("bio", e.target.value)} /></Grid>
      <Grid item xs={12}><Divider><Chip label="روابط المنصات الرقمية" size="small" /></Divider></Grid>
      {["github", "linkedin", "twitter", "instagram", "whatsapp"].map((k) => (
        <Grid item xs={12} sm={6} key={k}>
          <TextField fullWidth label={k.charAt(0).toUpperCase() + k.slice(1)} value={data.social?.[k] || ""} onChange={(e) => sf(k, e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><WebsiteIcon fontSize="small" /></InputAdornment> }} />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 700 }}>الإحصائيات الشخصية:</Typography>
        {(data.stats || []).map((st, i) => (
          <Stack key={i} direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
            <TextField fullWidth size="small" label="عنوان الإحصائية" value={st.label} onChange={(e) => { const ns = [...data.stats]; ns[i].label = e.target.value; f("stats", ns); }} />
            <TextField fullWidth size="small" label="القيمة" value={st.value} onChange={(e) => { const ns = [...data.stats]; ns[i].value = e.target.value; f("stats", ns); }} />
            <IconButton color="error" onClick={() => f("stats", data.stats.filter((_, j) => j !== i))}><DeleteIcon /></IconButton>
          </Stack>
        ))}
        <Button size="small" endIcon={<AddIcon />} variant="outlined" onClick={() => f("stats", [...(data.stats || []), { label: "", value: "" }])}>إضافة إحصائية</Button>
      </Grid>
    </Grid>
  );
}

function NavbarEditor({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  return (
    <Stack spacing={3}>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={4}><TextField fullWidth label="شعار الموقع المختصر" value={data.logo || ""} onChange={(e) => f("logo", e.target.value)} /></Grid>
        <Grid item xs={12} sm={4}><TextField fullWidth label="اسم الشعار الكامل" value={data.logoFull || ""} onChange={(e) => f("logoFull", e.target.value)} /></Grid>
        <Grid item xs={12} sm={4}><TextField fullWidth label="نص زر السيرة الذاتية" value={data.resumeLabel || ""} onChange={(e) => f("resumeLabel", e.target.value)} /></Grid>
      </Grid>
      <Box>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 700 }}>روابط شريط التنقل:</Typography>
        {(data.links || []).map((link, i) => (
          <Stack key={i} direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
            <TextField fullWidth size="small" label="اسم الرابط" value={link.label} onChange={(e) => { const nl = [...data.links]; nl[i].label = e.target.value; f("links", nl); }} />
            <TextField fullWidth size="small" label="الوجهة (href)" value={link.href} onChange={(e) => { const nl = [...data.links]; nl[i].href = e.target.value; f("links", nl); }} />
            <IconButton color="error" onClick={() => f("links", data.links.filter((_, j) => j !== i))}><DeleteIcon /></IconButton>
          </Stack>
        ))}
        <Button size="small" endIcon={<AddIcon />} variant="outlined" onClick={() => f("links", [...(data.links || []), { label: "", href: "" }])}>إضافة رابط</Button>
      </Box>
      <Stack direction="row" spacing={3}>
        <FormControlLabel control={<Switch checked={!!data.showThemeToggle} onChange={(e) => f("showThemeToggle", e.target.checked)} />} label="مفتاح تبديل المظهر" />
        <FormControlLabel control={<Switch checked={!!data.showResumeButton} onChange={(e) => f("showResumeButton", e.target.checked)} />} label="زر تحميل السيرة الذاتية" />
      </Stack>
    </Stack>
  );
}

function HeroEditor({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  const sl = (k, e) => onChange({ ...data, [k]: { ...data[k], [e.target.name]: e.target.value } });
  return (
    <Stack spacing={3}>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}><TextField fullWidth label="نص الترحيب" value={data.greeting || ""} onChange={(e) => f("greeting", e.target.value)} /></Grid>
        <Grid item xs={12}><TextField fullWidth multiline rows={3} label="الأدوار (كل دور في سطر)" value={(data.roles || []).join("\n")} onChange={(e) => f("roles", e.target.value.split("\n"))} /></Grid>
      </Grid>
      <Divider><Chip label="الزر الأساسي" size="small" /></Divider>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}><TextField fullWidth label="اسم الزر" name="label" value={data.ctaPrimary?.label || ""} onChange={(e) => sl("ctaPrimary", e)} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="رابط الزر" name="href" value={data.ctaPrimary?.href || ""} onChange={(e) => sl("ctaPrimary", e)} /></Grid>
      </Grid>
      <Divider><Chip label="الزر الثانوي" size="small" /></Divider>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}><TextField fullWidth label="اسم الزر" name="label" value={data.ctaSecondary?.label || ""} onChange={(e) => sl("ctaSecondary", e)} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="رابط الزر" name="href" value={data.ctaSecondary?.href || ""} onChange={(e) => sl("ctaSecondary", e)} /></Grid>
      </Grid>
      <Stack direction="row" spacing={3}>
        <FormControlLabel control={<Switch checked={!!data.showSocials} onChange={(e) => f("showSocials", e.target.checked)} />} label="إظهار أزرار التواصل" />
        <FormControlLabel control={<Switch checked={!!data.showScrollIndicator} onChange={(e) => f("showScrollIndicator", e.target.checked)} />} label="إظهار مؤشر التمرير" />
      </Stack>
    </Stack>
  );
}

function AboutEditor({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} sm={6}><TextField fullWidth label="العنوان الرئيسي" value={data.sectionTitle || ""} onChange={(e) => f("sectionTitle", e.target.value)} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="العنوان الفرعي" value={data.sectionSubtitle || ""} onChange={(e) => f("sectionSubtitle", e.target.value)} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="حالة التوفر للعمل" value={data.availability || ""} onChange={(e) => f("availability", e.target.value)} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="سنوات الخبرة" value={data.yearsOfExperience || ""} onChange={(e) => f("yearsOfExperience", e.target.value)} /></Grid>
      <Grid item xs={12}><TextField fullWidth multiline rows={2} label="أبرز النقاط (نقطة في كل سطر)" value={(data.highlights || []).join("\n")} onChange={(e) => f("highlights", e.target.value.split("\n"))} /></Grid>
    </Grid>
  );
}

function SkillsEditor({ data, onChange }) {
  return (
    <Stack spacing={3}>
      {data.map((cat, i) => (
        <Paper variant="outlined" key={cat.id || i} sx={{ p: 2.5, bgcolor: "#f8fafc" }}>
          <Stack direction="row" spacing={1.5} sx={{ mb: 2 }} alignItems="center">
            <TextField size="small" label="أيقونة" value={cat.icon || ""} onChange={(e) => { const nm = [...data]; nm[i].icon = e.target.value; onChange(nm); }} sx={{ width: 90 }} />
            <TextField size="small" label="اسم التصنيف" value={cat.category || ""} onChange={(e) => { const nm = [...data]; nm[i].category = e.target.value; onChange(nm); }} fullWidth />
            <IconButton color="error" onClick={() => onChange(data.filter((_, j) => j !== i))}><DeleteIcon /></IconButton>
          </Stack>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>المهارات:</Typography>
          {(cat.skills || []).map((sk, k) => (
            <Stack direction="row" spacing={1.5} key={k} sx={{ mb: 1 }} alignItems="center">
              <TextField size="small" label="اسم المهارة" value={sk.name || ""} onChange={(e) => { const nm = [...data]; nm[i].skills[k].name = e.target.value; onChange(nm); }} fullWidth />
              <TextField size="small" type="number" label="نسبة %" value={sk.level || 0} onChange={(e) => { const nm = [...data]; nm[i].skills[k].level = parseInt(e.target.value) || 0; onChange(nm); }} sx={{ width: 110 }} />
              <IconButton size="small" color="error" onClick={() => { const nm = [...data]; nm[i].skills = nm[i].skills.filter((_, j) => j !== k); onChange(nm); }}><DeleteIcon fontSize="small" /></IconButton>
            </Stack>
          ))}
          <Button size="small" endIcon={<AddIcon />} onClick={() => { const nm = [...data]; nm[i].skills = [...(nm[i].skills || []), { name: "", level: 80 }]; onChange(nm); }}>إضافة مهارة</Button>
        </Paper>
      ))}
      <Button endIcon={<AddIcon />} variant="outlined" onClick={() => onChange([...data, { id: Date.now(), category: "", icon: "⚡", skills: [] }])}>إضافة تصنيف جديد</Button>
    </Stack>
  );
}

/* ── رفع صورة غلاف المشروع — يستخدم /api/uploads/image العام ─────────── */
function ProjectImageUploader({ image, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("الملف يجب أن يكون صورة");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/uploads/image", formData, {
        headers: { "Content-Type": undefined },
      });
      onUploaded(res.data.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "تعذر رفع الصورة — تأكد من تسجيل الدخول.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
      {image && (
        <Box
          component="img"
          src={image}
          alt=""
          sx={{ width: 64, height: 40, objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0" }}
        />
      )}
      <Button
        variant="outlined"
        size="small"
        component="label"
        disabled={uploading}
        startIcon={uploading ? <CircularProgress size={14} /> : <UploadIcon />}
      >
        {uploading ? "جارٍ الرفع..." : image ? "تغيير الصورة" : "رفع صورة الغلاف"}
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleUpload} />
      </Button>
      {error && <Typography variant="caption" color="error">{error}</Typography>}
    </Stack>
  );
}

function ProjectsEditor({ data, onChange }) {
  return (
    <Stack spacing={3}>
      {data.map((proj, i) => (
        <Paper variant="outlined" key={proj.id || i} sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>مشروع #{i + 1}</Typography>
            <IconButton color="error" onClick={() => onChange(data.filter((_, j) => j !== i))}><DeleteIcon /></IconButton>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>صورة الغلاف</Typography>
              <ProjectImageUploader
                image={proj.image}
                onUploaded={(url) => { const nm = [...data]; nm[i] = { ...nm[i], image: url }; onChange(nm); }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>معرض صور إضافي (اختياري)</Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                {(proj.images || []).map((img, imgIdx) => (
                  <Box key={imgIdx} sx={{ position: "relative" }}>
                    <Box component="img" src={img} alt="" sx={{ width: 72, height: 48, objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                    <IconButton
                      size="small"
                      onClick={() => { const nm = [...data]; nm[i] = { ...nm[i], images: nm[i].images.filter((_, j) => j !== imgIdx) }; onChange(nm); }}
                      sx={{ position: "absolute", top: -8, right: -8, bgcolor: "#fff", border: "1px solid #e2e8f0", width: 22, height: 22, "&:hover": { bgcolor: "#fee2e2" } }}
                    >
                      <CloseIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
              <ProjectImageUploader
                image={null}
                onUploaded={(url) => { const nm = [...data]; nm[i] = { ...nm[i], images: [...(nm[i].images || []), url] }; onChange(nm); }}
              />
            </Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="عنوان المشروع" value={proj.title || ""} onChange={(e) => { const nm = [...data]; nm[i].title = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="التصنيف" value={proj.category || ""} onChange={(e) => { const nm = [...data]; nm[i].category = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="سنة الإنتاج" type="number" value={proj.year || ""} onChange={(e) => { const nm = [...data]; nm[i].year = parseInt(e.target.value) || ""; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="رابط GitHub" value={proj.github || ""} onChange={(e) => { const nm = [...data]; nm[i].github = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label="رابط العرض الحي" value={proj.demo || ""} onChange={(e) => { const nm = [...data]; nm[i].demo = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12}><TextField fullWidth size="small" multiline rows={2} label="وصف المشروع" value={proj.description || ""} onChange={(e) => { const nm = [...data]; nm[i].description = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label="التقنيات (افصل بفاصلة)" value={(proj.technologies || []).join(", ")} onChange={(e) => { const nm = [...data]; nm[i].technologies = e.target.value.split(",").map(t => t.trim()); onChange(nm); }} /></Grid>
            <Grid item xs={12}><FormControlLabel control={<Switch checked={!!proj.featured} onChange={(e) => { const nm = [...data]; nm[i].featured = e.target.checked; onChange(nm); }} />} label="مشروع مميز (Featured)" /></Grid>
          </Grid>
        </Paper>
      ))}
      <Button endIcon={<AddIcon />} variant="outlined" onClick={() => onChange([...data, { id: Date.now(), title: "", description: "", technologies: [], category: "", github: "", demo: "", featured: false, year: new Date().getFullYear(), images: [] }])}>إضافة مشروع جديد</Button>
    </Stack>
  );
}

function ExperienceEditor({ data, onChange }) {
  return (
    <Stack spacing={3}>
      {data.map((exp, i) => (
        <Paper variant="outlined" key={exp.id || i} sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>خبرة #{i + 1}</Typography>
            <IconButton color="error" onClick={() => onChange(data.filter((_, j) => j !== i))}><DeleteIcon /></IconButton>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="اسم الشركة / المؤسسة" value={exp.company || ""} onChange={(e) => { const nm = [...data]; nm[i].company = e.target.value; onChange(nm); }} InputProps={{ startAdornment: <InputAdornment position="start"><ExperienceIcon fontSize="small" /></InputAdornment> }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="المسمى الوظيفي" value={exp.role || ""} onChange={(e) => { const nm = [...data]; nm[i].role = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="نوع العمل (Full-time / Remote...)" value={exp.type || ""} onChange={(e) => { const nm = [...data]; nm[i].type = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="الموقع الجغرافي" value={exp.location || ""} onChange={(e) => { const nm = [...data]; nm[i].location = e.target.value; onChange(nm); }} InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon fontSize="small" /></InputAdornment> }} /></Grid>
            <Grid item xs={12} sm={5}><TextField fullWidth size="small" label="تاريخ البدء" value={exp.startDate || ""} onChange={(e) => { const nm = [...data]; nm[i].startDate = e.target.value; onChange(nm); }} InputProps={{ startAdornment: <InputAdornment position="start"><DateIcon fontSize="small" /></InputAdornment> }} /></Grid>
            <Grid item xs={12} sm={5}><TextField fullWidth size="small" label="تاريخ الانتهاء" value={exp.endDate || ""} onChange={(e) => { const nm = [...data]; nm[i].endDate = e.target.value; onChange(nm); }} disabled={!!exp.current} /></Grid>
            <Grid item xs={12} sm={2} sx={{ display: "flex", alignItems: "center" }}><FormControlLabel control={<Switch checked={!!exp.current} onChange={(e) => { const nm = [...data]; nm[i].current = e.target.checked; if (e.target.checked) nm[i].endDate = "Present"; onChange(nm); }} />} label="حالياً" /></Grid>
            <Grid item xs={12}><TextField fullWidth size="small" multiline rows={2} label="وصف المهام والدور" value={exp.description || ""} onChange={(e) => { const nm = [...data]; nm[i].description = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>المسؤوليات والإنجازات:</Typography>
              {(exp.responsibilities || []).map((r, k) => (
                <Stack key={k} direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <TextField fullWidth size="small" value={r} onChange={(e) => { const nm = [...data]; nm[i].responsibilities[k] = e.target.value; onChange(nm); }} placeholder={`إنجاز ${k + 1}`} />
                  <IconButton size="small" color="error" onClick={() => { const nm = [...data]; nm[i].responsibilities = nm[i].responsibilities.filter((_, j) => j !== k); onChange(nm); }}><DeleteIcon fontSize="small" /></IconButton>
                </Stack>
              ))}
              <Button size="small" endIcon={<AddIcon />} onClick={() => { const nm = [...data]; nm[i].responsibilities = [...(nm[i].responsibilities || []), ""]; onChange(nm); }}>إضافة إنجاز</Button>
            </Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label="التقنيات المستخدمة (افصل بفاصلة)" value={(exp.technologies || []).join(", ")} onChange={(e) => { const nm = [...data]; nm[i].technologies = e.target.value.split(",").map(t => t.trim()); onChange(nm); }} /></Grid>
          </Grid>
        </Paper>
      ))}
      <Button endIcon={<AddIcon />} variant="outlined" onClick={() => onChange([...data, { id: Date.now(), company: "", role: "", type: "Full-time", location: "", startDate: "", endDate: "", current: false, description: "", responsibilities: [], technologies: [] }])}>إضافة خبرة عمل جديدة</Button>
    </Stack>
  );
}

function EducationEditor({ data, onChange }) {
  return (
    <Stack spacing={3}>
      {data.map((edu, i) => (
        <Paper variant="outlined" key={edu.id || i} sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>المرحلة #{i + 1}</Typography>
            <IconButton color="error" onClick={() => onChange(data.filter((_, j) => j !== i))}><DeleteIcon /></IconButton>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="المؤسسة التعليمية" value={edu.institution || ""} onChange={(e) => { const nm = [...data]; nm[i].institution = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="الدرجة العلمية" value={edu.degree || ""} onChange={(e) => { const nm = [...data]; nm[i].degree = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="مجال الدراسة" value={edu.field || ""} onChange={(e) => { const nm = [...data]; nm[i].field = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="المعدل التراكمي (GPA)" value={edu.gpa || ""} onChange={(e) => { const nm = [...data]; nm[i].gpa = e.target.value; onChange(nm); }} InputProps={{ startAdornment: <InputAdornment position="start"><StarIcon fontSize="small" sx={{ color: "#eab308" }} /></InputAdornment> }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="تاريخ البدء" value={edu.startDate || ""} onChange={(e) => { const nm = [...data]; nm[i].startDate = e.target.value; onChange(nm); }} InputProps={{ startAdornment: <InputAdornment position="start"><DateIcon fontSize="small" /></InputAdornment> }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="تاريخ الانتهاء" value={edu.endDate || ""} onChange={(e) => { const nm = [...data]; nm[i].endDate = e.target.value; onChange(nm); }} InputProps={{ startAdornment: <InputAdornment position="start"><DateIcon fontSize="small" /></InputAdornment> }} /></Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label="مراتب الشرف والجوائز" value={edu.honors || ""} onChange={(e) => { const nm = [...data]; nm[i].honors = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12}><TextField fullWidth size="small" multiline rows={2} label="تفاصيل إضافية" value={edu.description || ""} onChange={(e) => { const nm = [...data]; nm[i].description = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label="المساقات البارزة (افصل بفاصلة)" value={(edu.courses || []).join(", ")} onChange={(e) => { const nm = [...data]; nm[i].courses = e.target.value.split(",").map(c => c.trim()); onChange(nm); }} InputProps={{ startAdornment: <InputAdornment position="start"><CoursesIcon fontSize="small" /></InputAdornment> }} /></Grid>
          </Grid>
        </Paper>
      ))}
      <Button endIcon={<AddIcon />} variant="outlined" onClick={() => onChange([...data, { id: Date.now(), institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "", honors: "", description: "", courses: [] }])}>إضافة مرحلة تعليمية</Button>
    </Stack>
  );
}

function CertificatesEditor({ data, onChange }) {
  return (
    <Stack spacing={3}>
      {data.map((cert, i) => (
        <Paper variant="outlined" key={cert.id || i} sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>الشهادة #{i + 1}</Typography>
            <IconButton color="error" onClick={() => onChange(data.filter((_, j) => j !== i))}><DeleteIcon /></IconButton>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="عنوان الشهادة" value={cert.title || ""} onChange={(e) => { const nm = [...data]; nm[i].title = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="الجهة المانحة" value={cert.issuer || ""} onChange={(e) => { const nm = [...data]; nm[i].issuer = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="تاريخ الإصدار" value={cert.issueDate || ""} onChange={(e) => { const nm = [...data]; nm[i].issueDate = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="تاريخ الانتهاء" value={cert.expiryDate || ""} onChange={(e) => { const nm = [...data]; nm[i].expiryDate = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Credential ID" value={cert.credentialId || ""} onChange={(e) => { const nm = [...data]; nm[i].credentialId = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="رابط التحقق" value={cert.credentialUrl || ""} onChange={(e) => { const nm = [...data]; nm[i].credentialUrl = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="التصنيف" value={cert.category || ""} onChange={(e) => { const nm = [...data]; nm[i].category = e.target.value; onChange(nm); }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="أيقونة" value={cert.icon || ""} onChange={(e) => { const nm = [...data]; nm[i].icon = e.target.value; onChange(nm); }} /></Grid>
          </Grid>
        </Paper>
      ))}
      <Button endIcon={<AddIcon />} variant="outlined" onClick={() => onChange([...data, { id: Date.now(), title: "", issuer: "", issueDate: "", expiryDate: "", credentialId: "", credentialUrl: "", category: "", icon: "📜" }])}>إضافة شهادة جديدة</Button>
    </Stack>
  );
}

function ContactEditor({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} sm={6}><TextField fullWidth label="العنوان الرئيسي" value={data.sectionTitle || ""} onChange={(e) => f("sectionTitle", e.target.value)} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="العنوان الفرعي" value={data.sectionSubtitle || ""} onChange={(e) => f("sectionSubtitle", e.target.value)} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="نص زر البريد" value={data.emailLabel || ""} onChange={(e) => f("emailLabel", e.target.value)} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="رسالة التوفر" value={data.availabilityMessage || ""} onChange={(e) => f("availabilityMessage", e.target.value)} /></Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={3}>
          <FormControlLabel control={<Switch checked={!!data.showPhone} onChange={(e) => f("showPhone", e.target.checked)} />} label="عرض الهاتف" />
          <FormControlLabel control={<Switch checked={!!data.showLocation} onChange={(e) => f("showLocation", e.target.checked)} />} label="عرض الموقع" />
          <FormControlLabel control={<Switch checked={!!data.showSocials} onChange={(e) => f("showSocials", e.target.checked)} />} label="عرض التواصل الاجتماعي" />
        </Stack>
      </Grid>
    </Grid>
  );
}

function FooterEditor({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} sm={6}><TextField fullWidth label="اسم حقوق النشر" value={data.copyrightName || ""} onChange={(e) => f("copyrightName", e.target.value)} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="شعار التذييل (Tagline)" value={data.tagline || ""} onChange={(e) => f("tagline", e.target.value)} /></Grid>
      <Grid item xs={12} sx={{ display: "flex", gap: 3 }}>
        <FormControlLabel control={<Switch checked={!!data.showSocials} onChange={(e) => f("showSocials", e.target.checked)} />} label="روابط السوشيال بالفوتر" />
        <FormControlLabel control={<Switch checked={!!data.showBackToTop} onChange={(e) => f("showBackToTop", e.target.checked)} />} label="زر الصعود للأعلى" />
      </Grid>
    </Grid>
  );
}

/* ── لوحة رسائل التواصل — مرتبطة مباشرة بـ /api/contact الحقيقي ─────────── */
function MessagesPanel({ api }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/contact");
      setMessages(res.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "تعذر تحميل رسائل التواصل — تأكد من تسجيل الدخول ومن أن الباك اند يعمل."
      );
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  const markAsRead = async (id) => {
    setBusyId(id);
    try {
      await api.put(`/contact/${id}/read`);
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read: true } : m)));
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تحديث حالة الرسالة.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteMessage = async (id) => {
    setBusyId(id);
    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "تعذر حذف الرسالة.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {messages.length === 0 ? (
        <Typography color="text.disabled" sx={{ textAlign: "center", py: 4 }}>
          لا توجد رسائل بعد.
        </Typography>
      ) : (
        messages.map((m) => (
          <Paper
            key={m._id}
            variant="outlined"
            sx={{
              p: 2.5,
              bgcolor: m.read ? "#ffffff" : "#f5f8ff",
              borderColor: m.read ? "#e2e8f0" : alpha("#4f46e5", 0.25),
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                {!m.read && <UnreadDotIcon sx={{ fontSize: 9, color: "primary.main" }} />}
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{m.name}</Typography>
                <Typography variant="caption" color="text.secondary">{m.email}</Typography>
              </Stack>
              <Typography variant="caption" color="text.disabled">
                {new Date(m.createdAt).toLocaleString("ar-EG")}
              </Typography>
            </Stack>

            {m.subject && (
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{m.subject}</Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap", mb: 1.5 }}>
              {m.message}
            </Typography>

            <Stack direction="row" spacing={1}>
              {!m.read && (
                <Button
                  size="small"
                  startIcon={busyId === m._id ? <CircularProgress size={14} /> : <MarkReadIcon />}
                  disabled={busyId === m._id}
                  onClick={() => markAsRead(m._id)}
                >
                  تعليم كمقروءة
                </Button>
              )}
              <Button
                size="small"
                color="error"
                startIcon={busyId === m._id ? <CircularProgress size={14} /> : <DeleteIcon />}
                disabled={busyId === m._id}
                onClick={() => deleteMessage(m._id)}
              >
                حذف
              </Button>
            </Stack>
          </Paper>
        ))
      )}
    </Stack>
  );
}

/* ── لوحة تغيير اسم المستخدم — مرتبطة مباشرة بـ /api/auth/update-username ── */
function ChangeUsernamePanel({ api }) {
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.get("/auth/me")
      .then((res) => { if (!cancelled && res.data?.data?.username) setCurrentUsername(res.data.data.username); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [api]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!newUsername || !currentPassword) {
      setError("الرجاء تعبئة كل الحقول");
      return;
    }
    if (newUsername.trim().length < 3) {
      setError("اسم المستخدم يجب أن يكون 3 أحرف على الأقل");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.put("/auth/update-username", { newUsername, currentPassword });
      setCurrentUsername(res.data.data.username);
      setNewUsername("");
      setCurrentPassword("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تغيير اسم المستخدم.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 480 }}>
      {currentUsername && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          اسم المستخدم الحالي: <strong>{currentUsername}</strong>
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
          {success && <Alert severity="success">تم تغيير اسم المستخدم بنجاح</Alert>}

          <TextField
            fullWidth
            label="اسم المستخدم الجديد"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            autoComplete="username"
            helperText="3 أحرف على الأقل"
          />

          <TextField
            fullWidth
            label="كلمة المرور الحالية (للتأكيد)"
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            endIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SecurityIcon />}
            sx={{ alignSelf: "flex-start" }}
          >
            {submitting ? "جارٍ الحفظ..." : "تغيير اسم المستخدم"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

/* ── لوحة تغيير كلمة المرور — مرتبطة مباشرة بـ /api/auth/change-password ── */
function ChangePasswordPanel({ api }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("الرجاء تعبئة كل الحقول");
      return;
    }
    if (newPassword.length < 6) {
      setError("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }

    setSubmitting(true);
    try {
      await api.put("/auth/change-password", { currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تغيير كلمة المرور.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 480 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        بعد تغيير كلمة المرور، استخدمها بالمرة القادمة لتسجيل الدخول للوحة التحكم.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
          {success && <Alert severity="success">تم تغيير كلمة المرور بنجاح</Alert>}

          <TextField
            fullWidth
            label="كلمة المرور الحالية"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowCurrent((v) => !v)}>
                    {showCurrent ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="كلمة المرور الجديدة"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            helperText="6 أحرف على الأقل"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowNew((v) => !v)}>
                    {showNew ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="تأكيد كلمة المرور الجديدة"
            type={showNew ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            endIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SecurityIcon />}
            sx={{ alignSelf: "flex-start" }}
          >
            {submitting ? "جارٍ الحفظ..." : "تغيير كلمة المرور"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

const EDITORS = {
  profile: ProfileEditor, navbar: NavbarEditor, hero: HeroEditor,
  about: AboutEditor, skills: SkillsEditor, projects: ProjectsEditor,
  experience: ExperienceEditor, education: EducationEditor,
  certificates: CertificatesEditor, contact: ContactEditor, footer: FooterEditor,
};

/* ── المكون الرئيسي ─────────────────────────────────────────── */
export default function PortfolioAdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(() => {
    const loaded = {};
    for (const [key, storageKey] of Object.entries(STORAGE_KEYS)) {
      try {
        const raw = localStorage.getItem(storageKey);
        loaded[key] = raw ? JSON.parse(raw) : defaultData[key];
      } catch { loaded[key] = defaultData[key]; }
    }
    return loaded;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState("form");
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Profile section is wired to the real backend (GET/PUT /api/profile) ──
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // ── Skills / Projects / Experience / Education / Certificates are also
  // wired to the real backend, each via its own CRUD endpoints. Since the
  // editors work on a whole array at once, "Save" diffs the array against
  // the last-synced copy and issues create/update/delete calls as needed.
  const COLLECTION_ENDPOINTS = {
    skills: "/skills",
    projects: "/projects",
    experience: "/experience",
    education: "/education",
    certificates: "/certificates",
  };
  const collectionsSyncedRef = useRef({});
  const [collectionsLoading, setCollectionsLoading] = useState(
    () => Object.fromEntries(Object.keys(COLLECTION_ENDPOINTS).map((k) => [k, true]))
  );
  const [collectionError, setCollectionError] = useState(null);
  const [savingSection, setSavingSection] = useState(null);

  // ── Navbar / Hero / About / Contact / Footer "display settings" live in a
  // single SiteSettings singleton doc (GET/PUT /api/settings). Each tab
  // saves independently — the PUT only sends the section being edited.
  const SETTINGS_SECTIONS = ["navbar", "hero", "about", "contact", "footer"];
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState(null);
  const [savingSettings, setSavingSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/settings");
        if (!cancelled && res.data?.data) {
          const { navbar, hero, about, contact, footer } = res.data.data;
          setData((prev) => ({ ...prev, navbar, hero, about, contact, footer }));
        }
      } catch (err) {
        if (!cancelled) {
          setSettingsError("تعذر تحميل إعدادات الموقع من الخادم — يتم عرض بيانات مؤقتة محلية.");
        }
      } finally {
        if (!cancelled) setSettingsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/profile");
        if (!cancelled && res.data?.data) {
          setData((prev) => ({ ...prev, profile: res.data.data }));
        }
      } catch (err) {
        if (!cancelled) {
          setProfileError(
            "تعذر تحميل بيانات الملف الشخصي من الخادم — يتم عرض بيانات مؤقتة محلية."
          );
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.all(
        Object.entries(COLLECTION_ENDPOINTS).map(async ([section, endpoint]) => {
          try {
            const res = await api.get(endpoint);
            const items = res.data?.data || [];
            if (!cancelled) {
              collectionsSyncedRef.current[section] = items;
              setData((prev) => ({ ...prev, [section]: items }));
            }
          } catch (err) {
            // keep local/mock defaults for this section if the backend call fails
          } finally {
            if (!cancelled) {
              setCollectionsLoading((prev) => ({ ...prev, [section]: false }));
            }
          }
        })
      );
    })();
    return () => { cancelled = true; };
  }, []);

  const updateSection = useCallback((section, newData) => {
    setData((prev) => {
      const next = { ...prev, [section]: newData };
      try { localStorage.setItem(STORAGE_KEYS[section], JSON.stringify(newData)); } catch {}
      return next;
    });
  }, []);

  const handleSave = async (section, newData) => {
    if (section === "profile") {
      setSavingProfile(true);
      setProfileError(null);
      try {
        const res = await api.put("/profile", newData);
        setData((prev) => ({ ...prev, profile: res.data.data }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (err) {
        setProfileError(
          err.response?.data?.message ||
            "تعذر حفظ الملف الشخصي على الخادم — تأكد من تسجيل الدخول ومن أن الباك اند يعمل."
        );
      } finally {
        setSavingProfile(false);
      }
      return;
    }

    if (COLLECTION_ENDPOINTS[section]) {
      const endpoint = COLLECTION_ENDPOINTS[section];
      setSavingSection(section);
      setCollectionError(null);
      try {
        const original = collectionsSyncedRef.current[section] || [];
        const originalIds = new Set(original.map((i) => i._id).filter(Boolean));
        const newIds = new Set(newData.map((i) => i._id).filter(Boolean));

        // Items removed from the array → delete on the server
        const toDelete = [...originalIds].filter((id) => !newIds.has(id));
        await Promise.all(toDelete.map((id) => api.delete(`${endpoint}/${id}`)));

        // Remaining items → update existing ones, create new ones (no _id yet)
        const saved = await Promise.all(
          newData.map(async (item) => {
            const { _id, __v, createdAt, updatedAt, ...payload } = item;
            if (_id && originalIds.has(_id)) {
              const res = await api.put(`${endpoint}/${_id}`, payload);
              return res.data.data;
            }
            const res = await api.post(endpoint, payload);
            return res.data.data;
          })
        );

        collectionsSyncedRef.current[section] = saved;
        updateSection(section, saved);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (err) {
        setCollectionError(
          err.response?.data?.message ||
            "تعذر حفظ البيانات على الخادم — تأكد من تسجيل الدخول ومن أن الباك اند يعمل."
        );
      } finally {
        setSavingSection(null);
      }
      return;
    }

    if (SETTINGS_SECTIONS.includes(section)) {
      setSavingSettings(section);
      setSettingsError(null);
      try {
        const res = await api.put("/settings", { [section]: newData });
        setData((prev) => ({ ...prev, [section]: res.data.data[section] }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (err) {
        setSettingsError(
          err.response?.data?.message ||
            "تعذر حفظ الإعدادات على الخادم — تأكد من تسجيل الدخول ومن أن الباك اند يعمل."
        );
      } finally {
        setSavingSettings(null);
      }
      return;
    }

    updateSection(section, newData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const currentData = data[activeSection];
  const EditorComponent = EDITORS[activeSection];
  const sidebarWidth = 265;

  const sidebarContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#ffffff" }}>
      <Box sx={{ p: 3, borderBottom: "1px solid #e2e8f0" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h1" sx={{ fontSize: "16px", fontWeight: 800 }}>لوحة التحكم</Typography>
          <DashboardIcon sx={{ color: "primary.main" }} />
        </Stack>
        <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 0.5 }}>
          التعديلات تنعكس فوراً على الموقع
        </Typography>
      </Box>

      <List sx={{ px: 1.5, py: 2, flexGrow: 1, overflowY: "auto" }}>
        {SECTIONS.map((sec) => (
          <ListItemButton key={sec.key} selected={activeSection === sec.key}
            onClick={() => { setActiveSection(sec.key); setMobileOpen(false); }}
            sx={{
              borderRadius: "10px", mb: 0.5, py: 1, px: 2,
              "&.Mui-selected": {
                bgcolor: alpha(theme.palette.primary.main, 0.08), color: "primary.main",
                "& .MuiListItemIcon-root": { color: "primary.main" },
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.12) },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>{sec.icon}</ListItemIcon>
            <ListItemText primary={sec.label} primaryTypographyProps={{ fontSize: "13px", fontWeight: activeSection === sec.key ? 700 : 500 }} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 1 }}>
        {/* زر فتح الموقع */}
        <Button fullWidth variant="contained" size="small" endIcon={<OpenInNewIcon />}
          onClick={() => window.open("/", "_blank")} sx={{ py: 1, borderRadius: "8px" }}>
          فتح الموقع
        </Button>
        {/* زر التصدير */}
        <Button fullWidth variant="outlined" size="small" endIcon={<DownloadIcon />}
          onClick={() => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob); a.download = "portfolio-backup.json"; a.click();
          }}
          sx={{ py: 1, borderRadius: "8px" }}>
          تصدير نسخة احتياطية
        </Button>
        {/* زر تسجيل الخروج */}
        <Button
          fullWidth
          variant="text"
          size="small"
          color="error"
          endIcon={<LogoutIcon />}
          onClick={() => {
            if (window.confirm("هل تريد تسجيل الخروج من لوحة التحكم؟")) handleLogout();
          }}
          sx={{ py: 1, borderRadius: "8px" }}
        >
          تسجيل الخروج
        </Button>
      </Box>
    </Box>
  );

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }} dir="rtl" lang="ar">

          <AppBar position="fixed" sx={{ display: { lg: "none" }, bgcolor: "#ffffff", color: "text.primary", borderBottom: "1px solid #e2e8f0", boxShadow: "none" }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <IconButton color="inherit" onClick={() => setMobileOpen(!mobileOpen)}><MenuIcon /></IconButton>
              <Typography variant="h2">{SECTIONS.find((s) => s.key === activeSection)?.label}</Typography>
              <Box sx={{ width: 40 }} />
            </Toolbar>
          </AppBar>

          <Box component="nav" sx={{ width: { lg: sidebarWidth }, flexShrink: { lg: 0 } }}>
            <Drawer variant="temporary" anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}
              sx={{ display: { xs: "block", lg: "none" }, "& .MuiDrawer-paper": { width: sidebarWidth, borderLeft: "none", borderRight: "1px solid #e2e8f0" } }}>
              {sidebarContent}
            </Drawer>
            <Drawer variant="permanent" anchor="right" open
              sx={{ display: { xs: "none", lg: "block" }, "& .MuiDrawer-paper": { width: sidebarWidth, borderLeft: "none", borderRight: "1px solid #e2e8f0" } }}>
              {sidebarContent}
            </Drawer>
          </Box>

          <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, pt: { xs: 10, lg: 4 }, width: "100%" }}>
            <Box sx={{ maxWidth: 900, mx: "auto" }}>

              {/* الترويسة */}
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2} sx={{ mb: 4 }}>
                <Box>
                  <Typography variant="h1">{SECTIONS.find((s) => s.key === activeSection)?.label}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    التعديلات تُحفظ تلقائياً وتنعكس فوراً على الموقع.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent={{ xs: "space-between", sm: "flex-end" }}>
                  <Fade in={saved}>
                    <Stack direction="row" spacing={0.5} alignItems="center"
                      sx={{ px: 1.5, py: 0.7, bgcolor: "success.light", color: "success.main", borderRadius: 2, border: "1px solid", borderColor: alpha(theme.palette.success.main, 0.2) }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>تم الحفظ</Typography>
                      <SuccessIcon sx={{ fontSize: 14 }} />
                    </Stack>
                  </Fade>

                  {activeSection !== "messages" && activeSection !== "security" && (
                    <>
                      {/* مبدّل الواجهة / JSON */}
                      <Stack direction="row" sx={{ border: "1px solid", borderColor: "primary.main", borderRadius: "12px", overflow: "hidden" }}>
                        {[{ mode: "form", label: "واجهة", Icon: FormIcon }, { mode: "json", label: "JSON", Icon: CodeIcon }].map(({ mode, label, Icon }) => (
                          <Box key={mode} onClick={() => setEditMode(mode)}
                            sx={{
                              display: "flex", alignItems: "center", gap: "6px", px: 1.5, py: 0.75,
                              cursor: "pointer", fontSize: "13px", fontWeight: 600, userSelect: "none",
                              bgcolor: editMode === mode ? "primary.main" : "transparent",
                              color: editMode === mode ? "#fff" : "primary.main",
                              transition: "all 0.15s ease",
                              "&:hover": { bgcolor: editMode === mode ? "primary.dark" : alpha(theme.palette.primary.main, 0.06) },
                            }}
                          >
                            <Icon sx={{ fontSize: 16 }} />
                            <span>{label}</span>
                          </Box>
                        ))}
                      </Stack>

                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={
                          (savingProfile || savingSection === activeSection || savingSettings === activeSection)
                            ? <CircularProgress size={16} color="inherit" />
                            : <SaveIcon />
                        }
                        disabled={savingProfile || savingSection === activeSection || savingSettings === activeSection}
                        onClick={() => handleSave(activeSection, currentData)}
                      >
                        {(savingProfile || savingSection === activeSection || savingSettings === activeSection) ? "جارٍ الحفظ..." : "حفظ"}
                      </Button>
                    </>
                  )}
                </Stack>
              </Stack>

              {/* تنبيه أخطاء تحميل/حفظ البيانات من الباك اند */}
              {activeSection === "profile" && profileError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setProfileError(null)}>
                  {profileError}
                </Alert>
              )}
              {COLLECTION_ENDPOINTS[activeSection] && collectionError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setCollectionError(null)}>
                  {collectionError}
                </Alert>
              )}
              {SETTINGS_SECTIONS.includes(activeSection) && settingsError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSettingsError(null)}>
                  {settingsError}
                </Alert>
              )}

              {/* المحرر */}
              {activeSection === "messages" ? (
                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3.5 }, bgcolor: "#ffffff", borderRadius: 4, border: "1px solid #e2e8f0" }}>
                  <MessagesPanel api={api} />
                </Paper>
              ) : activeSection === "security" ? (
                <Stack spacing={3}>
                  <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3.5 }, bgcolor: "#ffffff", borderRadius: 4, border: "1px solid #e2e8f0" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 2.5 }}>تغيير اسم المستخدم</Typography>
                    <ChangeUsernamePanel api={api} />
                  </Paper>
                  <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3.5 }, bgcolor: "#ffffff", borderRadius: 4, border: "1px solid #e2e8f0" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 2.5 }}>تغيير كلمة المرور</Typography>
                    <ChangePasswordPanel api={api} />
                  </Paper>
                </Stack>
              ) : (
                <>
                  <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3.5 }, bgcolor: "#ffffff", borderRadius: 4, border: "1px solid #e2e8f0" }}>
                    {(activeSection === "profile" && profileLoading) ||
                    (COLLECTION_ENDPOINTS[activeSection] && collectionsLoading[activeSection]) ||
                    (SETTINGS_SECTIONS.includes(activeSection) && settingsLoading) ? (
                      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress size={28} />
                      </Box>
                    ) : editMode === "json" ? (
                      <JsonEditor value={currentData} onChange={(v) => updateSection(activeSection, v)} />
                    ) : EditorComponent ? (
                      <EditorComponent data={currentData} onChange={(v) => updateSection(activeSection, v)} />
                    ) : (
                      <Typography color="text.disabled">محرر هذا القسم قيد التطوير.</Typography>
                    )}
                  </Paper>

                  {/* مساعد الذكاء الاصطناعي */}
                  <AIAssistant section={activeSection} currentData={currentData} onApply={(v) => handleSave(activeSection, v)} />

                  {/* شاشة المراقبة */}
                  <Paper variant="outlined" sx={{ mt: 3, overflow: "hidden", borderColor: "#e2e8f0", borderRadius: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center"
                      sx={{ px: 2, py: 1.25, borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "text.secondary" }}>LIVE STATE — البيانات النشطة</Typography>
                        <EyeIcon sx={{ color: "text.disabled", fontSize: 14 }} />
                      </Stack>
                      <Chip label={activeSection} size="small" sx={{ fontSize: 10, height: 20 }} />
                    </Stack>
                    <Box sx={{ p: 2, bgcolor: "#ffffff", maxHeight: 160, overflow: "auto" }}>
                      <pre style={{ fontFamily: "monospace", fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.6 }} dir="ltr">
                        {JSON.stringify(currentData, null, 2)}
                      </pre>
                    </Box>
                  </Paper>
                </>
              )}

            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}