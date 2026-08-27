import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Stack, Container, useTheme, IconButton, alpha
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { profileData as defaultProfile } from '../../data/profile';
import { getProfile, getSettings } from '../../services/portfolioService';

const AnimatedBackground = ({ mode, theme }) => (
  <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
    {/* دوائر متوهجة ديناميكية ومتحركة بسلاسة أكبر */}
    {[
      { size: { xs: 400, md: 700 }, x: '80%', y: '15%', color: mode === 'dark' ? alpha(theme.palette.secondary.main, 0.12) : alpha(theme.palette.secondary.main, 0.06), delay: '0s' },
      { size: { xs: 300, md: 500 }, x: '15%', y: '65%', color: mode === 'dark' ? 'rgba(0,180,216,0.1)' : 'rgba(0,180,216,0.05)', delay: '2s' },
    ].map((orb, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          width: orb.size,
          height: orb.size,
          borderRadius: '50%',
          left: orb.x,
          top: orb.y,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          animation: `floatActive 12s ease-in-out ${orb.delay} infinite`,
          '@keyframes floatActive': {
            '0%, 100%': { transform: 'translate(-50%, -50%) scale(1) translateY(0px)' },
            '50%': { transform: 'translate(-50%, -50%) scale(1.15) translateY(-30px)' },
          },
        }}
      />
    ))}
    {/* خطوط الشبكة الفخمة */}
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        backgroundImage: mode === 'dark'
          ? `linear-gradient(${alpha(theme.palette.divider, 0.25)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.divider, 0.25)} 1px, transparent 1px)`
          : `linear-gradient(${alpha(theme.palette.divider, 0.4)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.divider, 0.4)} 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        maskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 90%)', 
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 90%)',
      }}
    />
  </Box>
);

const Hero = () => {
  const theme = useTheme();
  const { mode } = theme.palette;
  const [roleIdx, setRoleIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  // Starts with the local defaults so the hero renders immediately, then
  // swaps in the real data from the backend (edited via the admin dashboard)
  // once it arrives — no loading flicker.
  const [profileData, setProfileData] = useState(defaultProfile);
  // Rotating role text — comes from the "القسم الرئيسي" (Hero) tab in the
  // admin dashboard (SiteSettings.hero.roles). Empty until an admin adds
  // some, so nothing fake shows before that.
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((res) => { if (!cancelled && res.data) setProfileData(res.data); })
      .catch(() => {}); // keep defaults if the backend is unreachable
    getSettings()
      .then((res) => { if (!cancelled && res.data?.hero?.roles) setRoles(res.data.hero.roles); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (roles.length === 0) return undefined;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setRoleIdx((prev) => (prev + 1) % roles.length);
        setVisible(true);
      }, 400); 
    }, 3500);
    return () => clearInterval(interval);
  }, [roles]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      <AnimatedBackground mode={mode} theme={theme} />

      {/* الحاوية المعدلة لحل مشكلة الالتصاق بالجوانب وضبط المسافة مع الفوتر */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 1, 
          px: { xs: 3, sm: 5, md: 7 }, 
          pt: { xs: 16, md: 16 }, 
          pb: { xs: 16, md: 12 } // المسافة السفلية المريحة لمنع الالتصاق بالـ Footer
        }}
      >
        <Box sx={{ maxWidth: 850 }}>

          {/* الاسم بتأثير ضخم وفخم */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.4rem', sm: '3.6rem', md: '4.8rem', lg: '6.5rem' },
              fontFamily: '"Syne", sans-serif',
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-2px',
              mb: 2,
              overflowWrap: 'break-word', // شبكة أمان فقط لأسماء طويلة جداً — ما بتتفعل بالاستخدام العادي
              animation: 'slideUpIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
              color: 'text.primary',
            }}
          >
            {profileData.name}
          </Typography>

          {/* النصوص التبادلية للأدوار */}
          {roles.length > 0 && (
            <Box sx={{ height: { xs: 50, md: 70 }, mb: 3, display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.8rem', md: '2.8rem' },
                  fontFamily: '"Syne", sans-serif',
                  color: mode === 'dark' ? 'text.primary' : 'secondary.main',
                  background: mode === 'dark' ? `linear-gradient(45deg, #FFF 30%, ${theme.palette.secondary.main} 90%)` : 'none',
                  WebkitBackgroundClip: mode === 'dark' ? 'text' : 'none',
                  WebkitTextFillColor: mode === 'dark' ? 'transparent' : 'none',
                  fontWeight: 700,
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(-15px) scale(0.98)',
                  filter: visible ? 'blur(0px)' : 'blur(4px)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {roles[roleIdx]}
              </Typography>
            </Box>
          )}

          {/* سيرة قصيرة مريحة للعين */}
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.05rem', md: '1.2rem' },
              color: 'text.secondary',
              maxWidth: 600,
              lineHeight: 1.8,
              mb: 5,
              animation: 'slideUpIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
            }}
          >
            {profileData.shortBio}
          </Typography>

          {/* أزرار اتخاذ الإجراء الـ CTAs الفخمة */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ mb: 6, animation: 'slideUpIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both' }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => scrollTo('projects')}
              sx={{ 
                bgcolor: 'text.primary', 
                color: 'background.default', 
                px: 4, 
                py: 1.8,
                fontWeight: 600,
                borderRadius: '14px',
                textTransform: 'initial',
                boxShadow: 'none',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  bgcolor: 'text.primary',
                  transform: 'translateY(-3px)',
                  boxShadow: `0 10px 25px ${alpha(theme.palette.text.primary, 0.15)}`
                } 
              }}
            >
              View My Work
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => scrollTo('contact')}
              sx={{ 
                px: 4, 
                py: 1.8, 
                borderRadius: '14px',
                borderColor: alpha(theme.palette.divider, 0.2), 
                color: 'text.primary', 
                textTransform: 'initial',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  borderColor: 'text.primary', 
                  bgcolor: alpha(theme.palette.text.primary, 0.03),
                  transform: 'translateY(-3px)'
                } 
              }}
            >
              Get In Touch
            </Button>
            <Button
              variant="text"
              size="large"
              startIcon={<FileDownloadIcon />}
              href={profileData.resumeUrl}
              download
              sx={{ 
                color: 'text.secondary', 
                fontWeight: 600,
                borderRadius: '14px',
                px: 2,
                textTransform: 'initial',
                '&:hover': { color: 'secondary.main', bgcolor: 'transparent' } 
              }}
            >
              Download CV
            </Button>
          </Stack>

          {/* صندوق الإحصائيات الفاخر (Bento Style Layout) */}
          <Stack 
            direction="row" 
            spacing={{ xs: 2, md: 4 }} 
            sx={{ 
              mb: 5, 
              animation: 'slideUpIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
              flexWrap: 'wrap', 
              gap: 2 
            }}
          >
            {profileData.stats.map((stat) => (
              <Box 
                key={stat.label}
                sx={{
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  bgcolor: alpha(theme.palette.text.primary, 0.015),
                  px: 3,
                  py: 2,
                  borderRadius: '16px',
                  width: { xs: '100%', sm: 200 },
                  flexShrink: 0,
                  backdropFilter: 'blur(5px)'
                }}
              >
                <Typography variant="h4" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, color: 'text.primary', lineHeight: 1.1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.03em', fontWeight: 500, display: 'block', mt: 0.5 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* أزرار السوشيال ميديا المحسنة */}
          <Stack direction="row" spacing={1.5} sx={{ animation: 'slideUpIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both' }}>
            <IconButton 
              href={profileData.social.github} 
              target="_blank" 
              sx={{ 
                color: 'text.secondary', 
                p: 1.5,
                border: `1px solid ${alpha(theme.palette.divider, 0.15)}`, 
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                '&:hover': { color: 'text.primary', borderColor: 'text.primary', transform: 'scale(1.05)' } 
              }}
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton 
              href={profileData.social.linkedin} 
              target="_blank" 
              sx={{ 
                color: 'text.secondary', 
                p: 1.5,
                border: `1px solid ${alpha(theme.palette.divider, 0.15)}`, 
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                '&:hover': { color: '#0A66C2', borderColor: '#0A66C2', transform: 'scale(1.05)' } 
              }}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Container>

      {/* مؤشر النزول للأسفل الصغير المبتكر */}
      <Box
        onClick={() => scrollTo('about')}
        sx={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          color: 'text.secondary',
          gap: 0.5,
          zIndex: 2,
          '&:hover': { color: 'secondary.main' },
          animation: 'bounceActive 2.5s ease infinite',
          '@keyframes bounceActive': { '0%, 100%': { transform: 'translateX(-50%) translateY(0)' }, '50%': { transform: 'translateX(-50%) translateY(-10px)' } },
        }}
      >
        <Typography variant="caption" sx={{ letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600 }}>Scroll</Typography>
        <ArrowDownwardIcon sx={{ fontSize: '1rem' }} />
      </Box>
    </Box>
  );
};

export default Hero;