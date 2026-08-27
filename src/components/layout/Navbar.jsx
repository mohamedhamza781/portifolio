import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box, Drawer,
  List, ListItem, ListItemButton, ListItemText, useMediaQuery, useTheme, Container, alpha
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { NAV_LINKS as defaultNavLinks, SECTION_IDS } from '../../routes';
import { useScrollSpy } from '../../hooks/useApiData';
import { getSettings, getProfile } from '../../services/portfolioService';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useScrollSpy(SECTION_IDS);

  // Starts empty/neutral, then swaps in the real data from the backend
  // (edited via the "شريط التنقل" tab in the admin dashboard) once it arrives.
  const [profileName, setProfileName] = useState('');
  const [navbarSettings, setNavbarSettings] = useState({ logo: '', logoFull: '', links: [] });

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((res) => { if (!cancelled && res.data) setProfileName(res.data.name || ''); })
      .catch(() => {});
    getSettings()
      .then((res) => { if (!cancelled && res.data?.navbar) setNavbarSettings(res.data.navbar); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Falls back to the first word of the real name if no short "logo" was
  // set in the dashboard — never shows a placeholder like "Alex".
  const logoText = navbarSettings.logo || (profileName ? profileName.split(' ')[0] : '');
  const navLinks = navbarSettings.links?.length > 0 ? navbarSettings.links : defaultNavLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: scrolled
            ? alpha(theme.palette.background.default, 0.75)
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          py: scrolled ? 1 : 2, // تأثير تصغير حجم النافبار عند النزول لقيمة جمالية
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 } }}>
            {/* اللوجو */}
            <Typography
              variant="h6"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              sx={{
                fontFamily: '"Syne", sans-serif',
                fontWeight: 800,
                fontSize: '1.4rem',
                cursor: 'pointer',
                color: 'text.primary',
                letterSpacing: '-0.5px',
                '& span': { color: 'secondary.main' },
              }}
            >
              {logoText}{logoText && <span>.</span>}
            </Typography>

            {/* الشاشات الكبيرة */}
            {!isMobile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.replace('#', '');
                  return (
                    <Button
                      key={link.label}
                      onClick={() => handleNavClick(link.href)}
                      sx={{
                        color: isActive ? 'text.primary' : 'text.secondary',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.875rem',
                        textTransform: 'initial', // مظهر أكثر عصرية وتجنب الأحرف الكبيرة الإجبارية
                        px: 2,
                        position: 'relative',
                        backgroundColor: 'transparent',
                        transition: 'color 0.3s ease',
                        '&:hover': { 
                          color: 'text.primary', 
                          backgroundColor: 'transparent' 
                        },
                        // تأثير الخط السفلي التفاعلي (Modern Indicator)
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 4,
                          left: '50%',
                          transform: isActive ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                          width: '60%',
                          height: '2px',
                          backgroundColor: 'secondary.main',
                          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          transformOrigin: 'center',
                        }
                      }}
                    >
                      {link.label}
                    </Button>
                  );
                })}

                {/* زر الإجراء الأساسي Call-to-Action */}
                <Button
                  variant="contained"
                  onClick={() => handleNavClick('#contact')}
                  sx={{ 
                    ml: 1.5, 
                    bgcolor: 'text.primary', // لون متناسق وعصري (Contrast dynamic)
                    color: 'background.default',
                    fontWeight: 600,
                    borderRadius: '12px',
                    px: 3,
                    textTransform: 'initial',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      bgcolor: 'text.primary',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 20px ${alpha(theme.palette.text.primary, 0.15)}`
                    } 
                  }}
                >
                  Hire Me
                </Button>
              </Box>
            ) : (
              /* الشاشات الصغيرة */
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  onClick={() => setDrawerOpen(true)} 
                  sx={{ 
                    color: 'text.primary',
                    bgcolor: alpha(theme.palette.text.primary, 0.04),
                    borderRadius: '10px'
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* القائمة الجانبية للموبايل */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { 
            width: '100%', 
            maxWidth: 300, 
            bgcolor: 'background.default', 
            px: 3, 
            py: 4,
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <Typography variant="h6" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800 }}>
            {logoText}{logoText && <span style={{ color: theme.palette.secondary.main }}>.</span>}
          </Typography>
          <IconButton 
            onClick={() => setDrawerOpen(false)}
            sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, borderRadius: '10px' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <ListItem key={link.label} disablePadding>
                <ListItemButton
                  onClick={() => handleNavClick(link.href)}
                  sx={{ 
                    borderRadius: '12px',
                    bgcolor: isActive ? alpha(theme.palette.secondary.main, 0.08) : 'transparent',
                    py: 1.5,
                    '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.04) }
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontFamily: '"Syne", sans-serif',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'secondary.main' : 'text.primary',
                      fontSize: '1.05rem'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        
        <Box sx={{ mt: 'auto', pt: 4 }}>
          <Button
            fullWidth 
            variant="contained"
            onClick={() => handleNavClick('#contact')}
            sx={{ 
              bgcolor: 'text.primary', 
              color: 'background.default',
              py: 1.5,
              fontWeight: 600,
              borderRadius: '12px',
              textTransform: 'initial',
              boxShadow: 'none',
              '&:hover': { bgcolor: 'text.primary' }
            }}
          >
            Hire Me
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;