import React from 'react';
import { Box, CircularProgress, Skeleton, Card, CardContent, alpha, useTheme, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// مؤشر تحميل زجاجي عصري يتوسط الشاشة بسلاسة
export const LoadingSpinner = ({ height = 240 }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height, width: '100%' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        {/* حلقة خلفية ناعمة لتعزيز المظهر الزجاجي الفخم */}
        <CircularProgress
          variant="determinate"
          sx={{ color: alpha(theme.palette.secondary.main, 0.1) }}
          size={44}
          thickness={4.5}
          value={100}
        />
        {/* حلقة الدوران الرئيسية باللون الأزرق الكهربائي المشع */}
        <CircularProgress
          color="secondary"
          variant="indeterminate"
          disableShrink
          sx={{
            position: 'absolute',
            left: 0,
            animationDuration: '600ms',
          }}
          size={44}
          thickness={4.5}
        />
      </Box>
    </Box>
  );
};

// هيكل عظمي (Skeleton) هيدسي متناسق 100% مع أبعاد بطاقات الـ Bento الجديدة
export const SkeletonCard = ({ height = 240 }) => {
  const theme = useTheme();
  return (
    <Card 
      elevation={0}
      sx={{ 
        height, 
        borderRadius: 24, // حواف Bento الدائرية
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backgroundColor: alpha(theme.palette.text.primary, 0.015),
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* محاكاة للأفاتار أو الصورة العلوية بالبطاقة */}
        <Skeleton 
          variant="rectangular" 
          height={50} 
          width={50}
          sx={{ mb: 2.5, borderRadius: '12px', backgroundColor: alpha(theme.palette.text.primary, 0.04) }} 
        />
        {/* محاكاة للعناوين والنصوص */}
        <Skeleton variant="text" width="65%" height={28} sx={{ borderRadius: '4px', backgroundColor: alpha(theme.palette.text.primary, 0.04) }} />
        <Skeleton variant="text" width="40%" height={18} sx={{ mt: 1, mb: 2, borderRadius: '4px', backgroundColor: alpha(theme.palette.text.primary, 0.03) }} />
        
        <Skeleton variant="text" width="100%" height={20} sx={{ borderRadius: '4px', backgroundColor: alpha(theme.palette.text.primary, 0.02) }} />
        <Skeleton variant="text" width="90%" height={20} sx={{ mt: 0.5, borderRadius: '4px', backgroundColor: alpha(theme.palette.text.primary, 0.02) }} />
        
        {/* محاكاة حقول الـ Chips السفلية */}
        <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
          <Skeleton variant="rounded" width={65} height={22} sx={{ borderRadius: '6px', backgroundColor: alpha(theme.palette.text.primary, 0.03) }} />
          <Skeleton variant="rounded" width={65} height={22} sx={{ borderRadius: '6px', backgroundColor: alpha(theme.palette.text.primary, 0.03) }} />
          <Skeleton variant="rounded" width={65} height={22} sx={{ borderRadius: '6px', backgroundColor: alpha(theme.palette.text.primary, 0.03) }} />
        </Box>
      </CardContent>
    </Card>
  );
};

// حاوية خطأ احترافية مؤطرة باللون الأحمر الهادئ بدلاً من النص العاري
export const ErrorMessage = ({ message = 'Something went wrong.' }) => {
  const theme = useTheme();
  return (
    <Box 
      sx={{ 
        p: { xs: 3, md: 4 }, 
        my: 3,
        mx: 'auto',
        maxWidth: 500,
        textAlign: 'center', 
        borderRadius: '16px',
        border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
        backgroundColor: alpha(theme.palette.error.main, 0.02),
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5
      }}
    >
      <ErrorOutlineIcon sx={{ color: 'error.main', fontSize: 32 }} />
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'error.main', 
          fontWeight: 600,
          fontSize: '0.92rem',
          lineHeight: 1.5
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};