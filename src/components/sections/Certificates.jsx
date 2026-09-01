import React from 'react';
import {
  Box, Typography, Grid, Paper, Chip, Button, useTheme, Avatar, alpha, Container
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VerifiedIcon from '@mui/icons-material/Verified';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';
import TerminalIcon from '@mui/icons-material/Terminal';
import SectionWrapper from '../common/SectionWrapper';
import { LoadingSpinner, ErrorMessage } from '../common/LoadingStates';
import { useApiData, useInView } from '../../hooks/useApiData';
import { getCertificates } from '../../services/portfolioService';

// دالة ذكية لاختيار أيقونة MUI برمجية بدلاً من الإيموجي أو الأيقونات العشوائية
const getCertificateIcon = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('front') || cat.includes('react') || cat.includes('ui')) return <CodeIcon fontSize="small" />;
  if (cat.includes('back') || cat.includes('data') || cat.includes('api')) return <StorageIcon fontSize="small" />;
  if (cat.includes('devops') || cat.includes('cloud') || cat.includes('cyber')) return <TerminalIcon fontSize="small" />;
  return <CardMembershipIcon fontSize="small" />;
};

const CertCard = ({ cert, index }) => {
  const theme = useTheme();
  const [ref, inView] = useInView();
  const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();
  
  // استخدام لون التمييز الفرعي للسمة للحفاظ على تناسق الهوية الرقمية الفخمة
  const activeAccent = theme.palette.secondary.main;

  return (
    <Paper
      ref={ref}
      elevation={0}
      sx={{
        p: { xs: 3, md: 3.5 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        borderRadius: '24px', // حواف Bento دائرية متناسقة 100% مع باقي المكونات
        backgroundColor: alpha(theme.palette.text.primary, 0.015),
        backdropFilter: 'blur(10px)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(30px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(index * 0.08, 0.4)}s`,
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          borderColor: activeAccent,
          backgroundColor: alpha(theme.palette.text.primary, 0.025),
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.04)}`,
          transform: 'translateY(-5px)',
          '& .cert-title': { color: activeAccent }
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2.5 }}>
        <Avatar
          sx={{
            width: 46,
            height: 46,
            borderRadius: '12px', // تصميم Bento الهندسي للأيقونة
            backgroundColor: alpha(activeAccent, 0.08),
            color: activeAccent,
            border: `1px solid ${alpha(activeAccent, 0.15)}`,
            flexShrink: 0,
          }}
        >
          {getCertificateIcon(cert.category)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="subtitle1" 
            className="cert-title"
            sx={{ 
              fontFamily: '"Syne", sans-serif', 
              fontWeight: 700, 
              lineHeight: 1.3, 
              mb: 0.5,
              fontSize: '1.05rem',
              color: 'text.primary',
              transition: 'color 0.3s ease'
            }}
          >
            {cert.title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.8rem' }}>
            {cert.issuer}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          label={cert.category}
          size="small"
          sx={{ 
            bgcolor: alpha(theme.palette.text.primary, 0.04), 
            color: 'text.secondary', 
            fontWeight: 600, 
            fontSize: '0.68rem', 
            height: 22, 
            borderRadius: '6px',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        />
        {isExpired && (
          <Chip 
            label="Expired" 
            size="small" 
            variant="outlined" 
            sx={{ 
              fontSize: '0.68rem', 
              height: 22, 
              borderRadius: '6px',
              borderColor: alpha(theme.palette.error.main, 0.3), 
              color: 'error.main',
              fontWeight: 600
            }} 
          />
        )}
      </Box>

      <Box sx={{ flex: 1, mb: 3 }}>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.75, fontWeight: 500 }}>
          Issued: {cert.issueDate}
          {cert.expiryDate && ` · Expires: ${cert.expiryDate}`}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace', fontSize: '0.72rem', bgcolor: alpha(theme.palette.text.primary, 0.02), px: 1, py: 0.4, borderRadius: '4px', border: `1px solid ${alpha(theme.palette.divider, 0.05)}` }}>
          ID: {cert.credentialId}
        </Typography>
      </Box>

      <Box sx={{ pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.15)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.6,
            px: 1,
            py: 0.3,
            borderRadius: '6px',
            bgcolor: alpha(theme.palette.success.main, 0.06),
            border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`
          }}
        >
          <VerifiedIcon sx={{ fontSize: 13, color: 'success.main' }} />
          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Verified
          </Typography>
        </Box>
        <Button
          size="small"
          endIcon={<OpenInNewIcon sx={{ fontSize: 12 }} />}
          href={cert.credentialUrl}
          target="_blank"
          sx={{ 
            fontSize: '0.8rem', 
            color: 'text.secondary', 
            fontWeight: 600,
            textTransform: 'initial',
            borderRadius: '8px',
            px: 1.5,
            '&:hover': { color: activeAccent, bgcolor: alpha(activeAccent, 0.05) } 
          }}
        >
          View Credential
        </Button>
      </Box>
    </Paper>
  );
};

const Certificates = () => {
  const { data: certificates, loading, error, refetch } = useApiData(getCertificates);

  return (
    <SectionWrapper id="certificates" title="Certificates" subtitle="Credentials & Achievements" dark>
      {/* Container لمنع الالتصاق نهائياً وضبط توازن الهوامش الجانبية */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          px: { xs: 3, sm: 5, md: 7 }, 
          py: { xs: 4, md: 6 } 
        }}
      >
        {loading && <LoadingSpinner height={300} />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        {certificates && (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {certificates.map((cert, i) => (
              <Grid item xs={12} sm={6} md={4} key={cert.id}>
                <CertCard cert={cert} index={i} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </SectionWrapper>
  );
};

export default Certificates;