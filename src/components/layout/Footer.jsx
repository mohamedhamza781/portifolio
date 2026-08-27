import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, IconButton, Stack, useTheme, alpha } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { profileData as defaultProfile } from '../../data/profile';
import { getProfile } from '../../services/portfolioService';

const Footer = () => {
  const theme = useTheme();
  // Starts with local defaults, then swaps in the real data from the
  // backend (edited via the admin dashboard) once it arrives.
  const [profileData, setProfileData] = useState(defaultProfile);

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((res) => { if (!cancelled && res.data) setProfileData(res.data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const { name, email, social } = profileData;
  const activeAccent = theme.palette.secondary.main;

  // Only real, filled-in links render — no dead icons pointing to "".
  const socialLinks = [
    { icon: <EmailIcon fontSize="small" />, href: email ? `mailto:${email}` : '', label: 'Email', color: activeAccent },
    { icon: <GitHubIcon fontSize="small" />, href: social.github, label: 'GitHub', color: theme.palette.text.primary },
    { icon: <LinkedInIcon fontSize="small" />, href: social.linkedin, label: 'LinkedIn', color: '#0A66C2' },
    { icon: <TwitterIcon fontSize="small" />, href: social.twitter, label: 'Twitter', color: '#1DA1F2' },
    { icon: <InstagramIcon fontSize="small" />, href: social.instagram, label: 'Instagram', color: '#E4405F' },
    { icon: <WhatsAppIcon fontSize="small" />, href: social.whatsapp, label: 'WhatsApp', color: '#25D366' },
  ].filter((link) => link.href);

  // استخراج الاسم الأول برمجياً لعرضه كشعار نصي فخم
  const firstName = name ? name.split(' ')[0] : 'Portfolio';

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 5, md: 6 },
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(12px)',
        position: 'relative',
      }}
    >
      {/* الحاوية الموحدة لحماية الحواف وضمان الاتساق بكسل بكسل مع باقي أجزاء الصفحة */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          px: { xs: 3, sm: 5, md: 7 }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: 4 
          }}
        >
          {/* Brand/Logo Section */}
          <Typography
            sx={{
              fontFamily: '"Syne", sans-serif',
              fontWeight: 800,
              fontSize: '1.4rem',
              letterSpacing: '-0.02em',
              color: 'text.primary',
              '& span': { color: activeAccent },
            }}
          >
            {firstName}<span>.</span>
          </Typography>

          {/* Premium Social Links Buttons */}
          <Stack direction="row" spacing={1.5}>
            {socialLinks.map((link) => (
              <IconButton
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                aria-label={link.label}
                size="small"
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  color: 'text.secondary',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': { 
                    color: link.color, 
                    borderColor: alpha(link.color, 0.3),
                    bgcolor: alpha(link.color, 0.04), 
                    transform: 'translateY(-3px)' 
                  },
                }}
              >
                {link.icon}
              </IconButton>
            ))}
          </Stack>

          {/* Copyright and Credits text */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.6,
              fontSize: '0.88rem',
              fontWeight: 500
            }}
          >
            © {new Date().getFullYear()} {name}
           
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;