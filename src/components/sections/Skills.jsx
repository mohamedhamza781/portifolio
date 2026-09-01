import React from 'react';
import { Box, Typography, Grid, Paper, useTheme, alpha, Container } from '@mui/material';
import SectionWrapper from '../common/SectionWrapper';
import { LoadingSpinner, ErrorMessage } from '../common/LoadingStates';
import { useApiData } from '../../hooks/useApiData';
import { getSkills } from '../../services/portfolioService';
import { useInView } from '../../hooks/useApiData';

// استيراد أيقونات MUI الرسمية للمهارات
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import PaletteIcon from '@mui/icons-material/Palette';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

// دالة ذكية لاختيار الأيقونة المناسبة بناءً على اسم القسم الآتي من الـ API
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('front') || name.includes('client') || name.includes('ui')) {
    return <CodeIcon fontSize="small" />;
  }
  if (name.includes('back') || name.includes('server') || name.includes('database') || name.includes('data')) {
    return <StorageIcon fontSize="small" />;
  }
  if (name.includes('cloud') || name.includes('devops') || name.includes('tools')) {
    return <CloudIcon fontSize="small" />;
  }
  if (name.includes('design') || name.includes('ux') || name.includes('creative')) {
    return <PaletteIcon fontSize="small" />;
  }
  return <SettingsSuggestIcon fontSize="small" />; // أيقونة افتراضية لأي قسم آخر
};

const SkillBar = ({ name, level, delay, theme }) => {
  const [ref, inView] = useInView();
  const barColor = theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.text.primary;
  
  return (
    <Box ref={ref} sx={{ mb: 2.8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {level}%
        </Typography>
      </Box>
      <Box sx={{
        height: 6,
        backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.1) : alpha(theme.palette.divider, 0.4),
        borderRadius: '100px',
        overflow: 'hidden',
      }}>
        <Box
          sx={{
            height: '100%',
            width: inView ? `${level}%` : '0%',
            backgroundColor: barColor,
            borderRadius: '100px',
            boxShadow: theme.palette.mode === 'dark' ? `0 0 10px ${alpha(barColor, 0.5)}` : 'none',
            transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
          }}
        />
      </Box>
    </Box>
  );
};

const CategoryCard = ({ category, skills, index }) => {
  const theme = useTheme();
  const [ref, inView] = useInView();

  return (
    <Paper
      ref={ref}
      elevation={0}
      sx={{
        p: { xs: 3.5, md: 4 },
        height: '100%',
        border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        backgroundColor: alpha(theme.palette.text.primary, 0.015),
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(30px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
        '&:hover': {
          borderColor: theme.palette.mode === 'dark' ? 'secondary.main' : 'text.primary',
          backgroundColor: alpha(theme.palette.text.primary, 0.025),
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.04)}`,
          transform: 'translateY(-4px)'
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        {/* صندوق الأيقونة المحدث بـ MUI Icon */}
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '12px',
            backgroundColor: alpha(theme.palette.secondary.main, 0.08),
            color: 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
          }}
        >
          {getCategoryIcon(category)}
        </Box>
        <Typography variant="h6" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, color: 'text.primary' }}>
          {category}
        </Typography>
      </Box>
      
      {skills.map((skill, i) => (
        <SkillBar 
          key={skill.name} 
          name={skill.name} 
          level={skill.level} 
          delay={0.05 + i * 0.04} 
          theme={theme}
        />
      ))}
    </Paper>
  );
};

const Skills = () => {
  const { data: skills, loading, error, refetch } = useApiData(getSkills);

  return (
    <SectionWrapper id="skills" title="Skills" subtitle="What I Work With" dark>
      <Container 
        maxWidth="lg" 
        sx={{ 
          px: { xs: 3, sm: 5, md: 7 }, 
          py: { xs: 4, md: 6 } 
        }}
      >
        {loading && <LoadingSpinner height={300} />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        {skills && (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {skills.map((cat, i) => (
              <Grid item xs={12} sm={6} key={cat.id}>
                <CategoryCard {...cat} index={i} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </SectionWrapper>
  );
};

export default Skills;