import React from 'react';
import {
  Box, Typography, Paper, Chip, Stack, useTheme, alpha, Container,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SectionWrapper from '../common/SectionWrapper';
import { LoadingSpinner, ErrorMessage } from '../common/LoadingStates';
import { useApiData, useInView } from '../../hooks/useApiData';
import { getExperience } from '../../services/portfolioService';

const TimelineItem = ({ job, index, isLast }) => {
  const theme = useTheme();
  const [ref, inView] = useInView();
  const isEven = index % 2 === 0;
  const activeAccent = theme.palette.secondary.main;

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        gap: { xs: 3, md: 0 },
        mb: isLast ? 0 : 5,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : `translateY(30px)`,
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`,
      }}
    >
      {/* Desktop: Right-aligned date for odd items */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, justifyContent: 'flex-end', pr: 5, pt: 2.5 }}>
        {!isEven && (
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: job.current ? activeAccent : 'text.disabled', fontWeight: 700, fontFamily: '"Syne", sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
              {job.startDate} — {job.current ? 'Present' : job.endDate}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Center line + premium interactive dot */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', minWidth: 50, position: 'relative' }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '14px', // حواف Bento هندسية بدلاً من الدائرة الكاملة
            backgroundColor: job.current ? activeAccent : alpha(theme.palette.text.primary, 0.02),
            border: `1px solid ${job.current ? activeAccent : alpha(theme.palette.divider, 0.15)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            flexShrink: 0,
            boxShadow: job.current ? `0 0 20px ${alpha(activeAccent, 0.4)}` : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <WorkIcon sx={{ fontSize: 16, color: job.current ? 'background.default' : 'text.secondary' }} />
        </Box>
        {!isLast && (
          <Box sx={{ flex: 1, width: 2, backgroundColor: alpha(theme.palette.divider, 0.15), my: 1.5 }} />
        )}
      </Box>

      {/* Mobile: Left dot timeline indicators */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', minWidth: 24 }}>
        <Box sx={{ width: 12, height: 12, mt: 3, borderRadius: '4px', bgcolor: job.current ? activeAccent : alpha(theme.palette.divider, 0.4), flexShrink: 0, boxShadow: job.current ? `0 0 10px ${activeAccent}` : 'none' }} />
        {!isLast && <Box sx={{ flex: 1, width: 2, bgcolor: alpha(theme.palette.divider, 0.15), mt: 1 }} />}
      </Box>

      {/* Content Block */}
      <Box sx={{ flex: 1, pl: { xs: 0, md: isEven ? 5 : 0 }, pr: { md: isEven ? 0 : 5 }, pb: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
            borderRadius: '24px', // حواف Bento الموحدة مع باقي الأقسام
            backgroundColor: alpha(theme.palette.text.primary, 0.015),
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            '&:hover': { 
              borderColor: job.current ? activeAccent : 'text.primary', 
              backgroundColor: alpha(theme.palette.text.primary, 0.025),
              transform: 'translateY(-4px)',
              boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.04)}`
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '1.15rem', color: 'text.primary', mb: 0.5 }}>
                {job.role}
              </Typography>
              <Typography variant="body2" color="secondary.main" fontWeight={700} sx={{ fontSize: '0.95rem' }}>
                {job.company}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
              {job.current && (
                <Chip 
                  label="Current" 
                  size="small" 
                  sx={{ 
                    bgcolor: alpha(activeAccent, 0.1), 
                    color: activeAccent, 
                    fontWeight: 700, 
                    height: 22, 
                    fontSize: '0.65rem',
                    borderRadius: '6px',
                    border: `1px solid ${alpha(activeAccent, 0.2)}`,
                    textTransform: 'uppercase',
                    fontFamily: '"Syne", sans-serif'
                  }} 
                />
              )}
              <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ display: { xs: 'block', md: 'none' } }}>
                {job.startDate} — {job.current ? 'Present' : job.endDate}
              </Typography>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.75, fontSize: '0.92rem' }}>
            {job.description}
          </Typography>

          {/* Responsibilities list with clean spacing */}
          <Box component="ul" sx={{ m: 0, pl: 2, mb: 3.5 }}>
            {job.responsibilities.map((resp, i) => (
              <Box component="li" key={i} sx={{ mb: 1, '&::marker': { color: activeAccent } }}>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.9rem' }}>
                  {resp}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Tech stack stack badges */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {job.technologies.map((tech) => (
              <Chip
                key={tech}
                label={tech}
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
        </Paper>
      </Box>

      {/* Desktop Left-aligned date for even items */}
      {isEven && (
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, pl: 5, pt: 2.5 }}>
          <Typography variant="caption" sx={{ color: job.current ? activeAccent : 'text.disabled', fontWeight: 700, fontFamily: '"Syne", sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
            {job.startDate} — {job.current ? 'Present' : job.endDate}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const Experience = () => {
  const { data: experience, loading, error } = useApiData(getExperience);

  return (
    <SectionWrapper id="experience" title="Experience" subtitle="My Career Path" dark>
      {/* الحاوية المحدثة لضبط الأبعاد الجانبية وحماية الحواف من الالتصاق */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          px: { xs: 3, sm: 5, md: 7 }, 
          py: { xs: 4, md: 6 } 
        }}
      >
        {loading && <LoadingSpinner height={300} />}
        {error && <ErrorMessage message={error} />}
        {experience && (
          <Box sx={{ maxWidth: 1000, mx: 'auto', position: 'relative' }}>
            {experience.map((job, i) => (
              <TimelineItem key={job._id} job={job} index={i} isLast={i === experience.length - 1} />
            ))}
          </Box>
        )}
      </Container>
    </SectionWrapper>
  );
};

export default Experience;