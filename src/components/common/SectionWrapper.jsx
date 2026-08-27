import React from 'react';
import { Box, Container, Typography, useTheme, alpha } from '@mui/material';
import { useInView } from '../../hooks/useApiData';

const SectionWrapper = ({ id, title, subtitle, children, dark = false, sx = {} }) => {
  const theme = useTheme();
  const [ref, inView] = useInView();
  const activeAccent = theme.palette.secondary.main;

  return (
    <Box
      id={id}
      component="section"
      sx={{
        py: { xs: 10, md: 14 }, // مساحات تنفس عمودية مريحة تعكس الفخامة الهندسية
        backgroundColor: dark
          ? alpha(theme.palette.text.primary, 0.01) // خلفية زجاجية متناهية الصغر للأقسام المتبادلة
          : 'transparent',
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {/* Container الموحد للمشروع لضمان عدم حدوث أي تفاوت في المحاذاة الجانبية */}
      <Container 
        maxWidth="lg"
        sx={{ 
          px: { xs: 3, sm: 5, md: 7 } 
        }}
      >
        {(title || subtitle) && (
          <Box
            ref={ref}
            sx={{
              mb: { xs: 6, md: 9 },
              textAlign: 'left',
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(25px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)', // حركة انزلاق مطاطية ناعمة وعصرية
            }}
          >
            {subtitle && (
              <Typography
                variant="overline"
                sx={{
                  color: 'secondary.main', // يعتمد برمجياً على اللون الأزرق الكهربائي من السمة مباشرة
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  display: 'block',
                  mb: 1.5,
                  fontFamily: '"Syne", sans-serif',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase'
                }}
              >
                {subtitle}
              </Typography>
            )}
            
            {title && (
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Syne", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '2.2rem', sm: '2.6rem', md: '3.2rem' },
                  letterSpacing: '-0.03em',
                  color: 'text.primary',
                  position: 'relative',
                  display: 'inline-block',
                  lineHeight: 1.1,
                  // مظهر النقطة النيونية الفخمة المتناسقة مع الشعار في التذييل بدلاً من الخط التقليدي البدائي
                  '&::after': {
                    content: '"."',
                    color: activeAccent,
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    fontWeight: 'inherit',
                  },
                }}
              >
                {title}
              </Typography>
            )}
          </Box>
        )}
        
        {/* محتوى القسم الداخلي الممرر */}
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default SectionWrapper;