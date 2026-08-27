import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, TextField, Button, IconButton, Paper,
  Alert, Snackbar, CircularProgress, useTheme, Stack, alpha, Container,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SectionWrapper from '../common/SectionWrapper';
import { sendContactMessage, getProfile } from '../../services/portfolioService';
import { profileData as defaultProfile } from '../../data/profile';
import { useInView } from '../../hooks/useApiData';

const validationSchema = Yup.object({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  subject: Yup.string().min(5, 'Subject must be at least 5 characters').required('Subject is required'),
  message: Yup.string().min(20, 'Message must be at least 20 characters').required('Message is required'),
});

const ContactInfo = ({ icon, label, value, theme }) => {
  const activeAccent = theme.palette.secondary.main;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: '12px', // تصميم Bento هندسي للأيقونات
          bgcolor: alpha(activeAccent, 0.08),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: activeAccent,
          border: `1px solid ${alpha(activeAccent, 0.15)}`,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', mb: 0.2 }}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ fontSize: '0.95rem' }}>{value}</Typography>
      </Box>
    </Box>
  );
};

const Contact = () => {
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });
  const [leftRef, leftInView] = useInView();
  const [rightRef, rightInView] = useInView();
  const activeAccent = theme.palette.secondary.main;
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

  const formik = useFormik({
    initialValues: { name: '', email: '', subject: '', message: '' },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await sendContactMessage(values);
        setSnackbar({ open: true, severity: 'success', message: "Message sent! I'll get back to you soon." });
        resetForm();
      } catch (err) {
        setSnackbar({ open: true, severity: 'error', message: 'Failed to send. Please try again.' });
      }
    },
  });

  // Only real, filled-in links render — no dead icons pointing to "".
  const socialLinks = [
    { icon: <EmailIcon fontSize="small" />, href: profileData.email ? `mailto:${profileData.email}` : '', label: 'Email', color: activeAccent },
    { icon: <GitHubIcon fontSize="small" />, href: profileData.social.github, label: 'GitHub', color: theme.palette.text.primary },
    { icon: <LinkedInIcon fontSize="small" />, href: profileData.social.linkedin, label: 'LinkedIn', color: '#0A66C2' },
    { icon: <TwitterIcon fontSize="small" />, href: profileData.social.twitter, label: 'Twitter', color: '#1DA1F2' },
    { icon: <InstagramIcon fontSize="small" />, href: profileData.social.instagram, label: 'Instagram', color: '#E4405F' },
    { icon: <WhatsAppIcon fontSize="small" />, href: profileData.social.whatsapp, label: 'WhatsApp', color: '#25D366' },
  ].filter((link) => link.href);

  // تحسين مظهر حقول الإدخال لتتناسق مع الـ Bento Design الفخم
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: alpha(theme.palette.text.primary, 0.005),
      transition: 'all 0.2s ease',
      '& fieldset': { borderColor: alpha(theme.palette.divider, 0.15) },
      '&:hover fieldset': { borderColor: alpha(theme.palette.text.primary, 0.25) },
      '&.Mui-focused fieldset': { borderColor: activeAccent, borderWidth: '1px' },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
      '&.Mui-focused': { color: activeAccent }
    }
  };

  return (
    <SectionWrapper id="contact" title="Get In Touch" subtitle="Let's Work Together">
      {/* Container لحماية المكون من الالتصاق وضبط توازن الهوامش بكسل بكسل */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          px: { xs: 3, sm: 5, md: 7 }, 
          py: { xs: 4, md: 6 } 
        }}
      >
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          {/* Left panel */}
          <Grid item xs={12} md={5}>
            <Box
              ref={leftRef}
              sx={{
                opacity: leftInView ? 1 : 0,
                transform: leftInView ? 'none' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4, fontSize: '1.02rem' }}>
                Have a project in mind or want to discuss opportunities? I'd love to hear from you. Send me a message and I'll respond within 24 hours.
              </Typography>

              <Stack spacing={3.5} sx={{ mb: 5 }}>
                <ContactInfo icon={<EmailIcon fontSize="small" />} label="Email" value={profileData.email} theme={theme} />
                <ContactInfo icon={<PhoneIcon fontSize="small" />} label="Phone" value={profileData.phone} theme={theme} />
                <ContactInfo icon={<LocationOnIcon fontSize="small" />} label="Location" value={profileData.location} theme={theme} />
              </Stack>

              <Typography variant="overline" color="text.disabled" sx={{ letterSpacing: '0.15em', fontWeight: 700, display: 'block', mb: 2, fontFamily: '"Syne", sans-serif' }}>
                Find Me On
              </Typography>
              <Stack direction="row" spacing={1.5}>
                {socialLinks.map((link) => (
                  <IconButton
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    aria-label={link.label}
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '10px',
                      border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                      color: 'text.secondary',
                      '&:hover': { color: link.color, borderColor: link.color, bgcolor: alpha(link.color, 0.04), transform: 'translateY(-2px)' },
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {link.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Right panel — form */}
          <Grid item xs={12} md={7}>
            <Paper
              ref={rightRef}
              elevation={0}
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{
                p: { xs: 3.5, md: 5 },
                border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                borderRadius: '24px', // حواف ناعمة متطابقة تماماً مع باقي أقسام لوحة التحكم وبطاقات الـ Bento
                opacity: rightInView ? 1 : 0,
                transform: rightInView ? 'none' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
                backgroundColor: alpha(theme.palette.text.primary, 0.015),
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  borderColor: alpha(activeAccent, 0.4),
                  boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.04)}`
                }
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Your Name" name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Your Email" name="email" type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Subject" name="subject"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                    helperText={formik.touched.subject && formik.errors.subject}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth multiline rows={5} label="Your Message" name="message"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.message && Boolean(formik.errors.message)}
                    helperText={formik.touched.message && formik.errors.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={formik.isSubmitting}
                    endIcon={formik.isSubmitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      bgcolor: 'text.primary',
                      color: 'background.default',
                      fontWeight: 700,
                      fontFamily: '"Syne", sans-serif',
                      borderRadius: '12px',
                      py: 1.8,
                      textTransform: 'initial',
                      boxShadow: 'none',
                      transition: 'all 0.25s ease',
                      '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.85), boxShadow: 'none', transform: 'translateY(-1px)' },
                      '&:disabled': { bgcolor: 'action.disabledBackground' },
                    }}
                  >
                    {formik.isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled" 
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: '12px', fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SectionWrapper>
  );
};

export default Contact;