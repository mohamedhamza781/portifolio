import React from 'react';
import {
  Box, Typography, Paper, Chip, Stack, useTheme, Avatar, alpha, Container
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SectionWrapper from '../common/SectionWrapper';
import { LoadingSpinner, ErrorMessage } from '../common/LoadingStates';
import { useApiData, useInView } from '../../hooks/useApiData';
import { getEducation } from '../../services/portfolioService';

const EducationCard = ({ edu, index }) => {
  const theme = useTheme();
  const { mode } = theme.palette;
  const [ref, inView] = useInView();
  const activeAccent = theme.palette.secondary.main;

  return (
    <Paper
      ref={ref}
      elevation={0}
      sx={{
        p: { xs: 3.5, md: 4 },
        mb: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        borderRadius: '24px', // حواف Bento دائرية متناسقة مع الأقسام السابقة
        backgroundColor: alpha(theme.palette.text.primary, 0.015),
        backdropFilter: 'blur(10px)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(30px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s`,
        '&:hover': { 
          borderColor: activeAccent, 
          backgroundColor: alpha(theme.palette.text.primary, 0.025),
          transform: 'translateY(-4px)',
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.04)}`
        },
        display: 'flex',
        gap: { xs: 2.5, sm: 3 },
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { sm: 'flex-start' },
      }}
    >
      {/* Premium Avant-Garde Mini Avatar */}
      <Avatar
        sx={{
          width: 52,
          height: 52,
          borderRadius: '14px', // تصميم Bento الهندسي للأيقونة
          backgroundColor: alpha(activeAccent, 0.08),
          color: activeAccent,
          border: `1px solid ${alpha(activeAccent, 0.15)}`,
          flexShrink: 0,
        }}
      >
        <SchoolIcon sx={{ fontSize: 22 }} />
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '1.15rem', color: 'text.primary', mb: 0.5 }}>
              {edu.degree} in {edu.field}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {edu.institution}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ fontFamily: '"Syne", sans-serif' }}>
              {edu.startDate} — {edu.endDate}
            </Typography>
          </Stack>
        </Box>

        {/* Honors and GPA Row */}
        {(edu.honors || edu.gpa) && (
          <Stack direction="row" spacing={1.5} sx={{ mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
            {edu.honors && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  px: 1.2,
                  py: 0.4,
                  borderRadius: '6px',
                  bgcolor: mode === 'dark' ? 'rgba(255,215,0,0.06)' : 'rgba(218,165,32,0.08)',
                  border: `1px solid ${mode === 'dark' ? 'rgba(255,215,0,0.15)' : 'rgba(218,165,32,0.15)'}`
                }}
              >
                <EmojiEventsIcon sx={{ fontSize: 13, color: mode === 'dark' ? '#FFD700' : '#DAA520' }} />
                <Typography variant="caption" sx={{ color: mode === 'dark' ? '#FFD700' : '#DAA520', fontWeight: 700 }}>
                  {edu.honors}
                </Typography>
              </Box>
            )}
            {edu.gpa && (
              <Box 
                sx={{ 
                  px: 1.2,
                  py: 0.4,
                  borderRadius: '6px',
                  bgcolor: alpha(theme.palette.text.primary, 0.03),
                  border: `1px solid ${alpha(theme.palette.divider, 0.15)}`
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  GPA: {edu.gpa}
                </Typography>
              </Box>
            )}
          </Stack>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, mb: 3, fontSize: '0.92rem' }}>
          {edu.description}
        </Typography>

        {/* Courses section with structured layout */}
        {edu.courses?.length > 0 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <MenuBookIcon sx={{ fontSize: 14, color: activeAccent }} />
              <Typography variant="caption" color="text.primary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontSize: '0.68rem' }}>
                Key Courses
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {edu.courses.map((course) => (
                <Chip
                  key={course}
                  label={course}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.7rem', 
                    height: 24, 
                    fontWeight: 500,
                    borderColor: alpha(theme.palette.divider, 0.2), 
                    color: 'text.secondary',
                    borderRadius: '6px',
                    bgcolor: alpha(theme.palette.text.primary, 0.005)
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
};

const Education = () => {
  const { data: education, loading, error } = useApiData(getEducation);

  return (
    <SectionWrapper id="education" title="Education" subtitle="Academic Background">
      {/* الحاوية لحماية الحواف الجانبية وتطابق العرض بكسل بكسل */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          px: { xs: 3, sm: 5, md: 7 }, 
          py: { xs: 4, md: 6 } 
        }}
      >
        {loading && <LoadingSpinner height={300} />}
        {error && <ErrorMessage message={error} />}
        {education && (
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            {education.map((edu, i) => (
              <EducationCard key={edu._id} edu={edu} index={i} />
            ))}
          </Box>
        )}
      </Container>
    </SectionWrapper>
  );
};

export default Education;