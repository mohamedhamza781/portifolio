import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardActions, CardMedia,
  Chip, Button, Stack, useTheme, alpha, Container,
  Dialog, IconButton
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SectionWrapper from '../common/SectionWrapper';
import { SkeletonCard, ErrorMessage } from '../common/LoadingStates';
import { useApiData } from '../../hooks/useApiData';
import { getProjects } from '../../services/portfolioService';
import { projectCategories } from '../../data/projects';
import { useInView } from '../../hooks/useApiData';

const ProjectCard = ({ project, index, onOpenGallery }) => {
  const theme = useTheme();
  const { mode } = theme.palette;
  const [ref, inView] = useInView();
  const activeAccent = theme.palette.secondary.main;
  const hasGallery = project.images?.length > 0;

  // صورة بديلة احترافية في حال لم يمتلك المشروع صورة خاصة به داخل ملف البيانات
  const projectImage = project.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop';

  return (
    <Card
      ref={ref}
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        backgroundColor: alpha(theme.palette.text.primary, 0.01),
        backdropFilter: 'blur(10px)',
        borderRadius: '24px', 
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(30px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(index * 0.08, 0.4)}s`,
        overflow: 'hidden',
        position: 'relative',
        '&:hover': { 
          borderColor: activeAccent,
          backgroundColor: alpha(theme.palette.text.primary, 0.02),
          transform: 'translateY(-6px)',
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.04)}`,
          '& .project-title': { color: activeAccent },
          '& .project-media': { transform: 'scale(1.06)' }, // تأثير زووم ناعم للصورة عند التمرير
          '& .media-overlay': { opacity: 0.25 } // تعميق تباين الصورة
        },
      }}
    >
      {/* صندوق الصورة المحمي بتأثير الزجاج المدمج */}
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: '56.25%' /* أبعاد عرض 16:9 القياسية الفخمة */ }}>
        <CardMedia
          component="img"
          className="project-media"
          image={projectImage}
          alt={project.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
        {/* طبقة حماية لونية تعطي الصورة لمعة زجاجية منسجمة مع النظام */}
        <Box 
          className="media-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: mode === 'dark' ? '#000' : activeAccent,
            opacity: mode === 'dark' ? 0.15 : 0.04,
            transition: 'opacity 0.4s ease',
            mixBlendMode: mode === 'dark' ? 'normal' : 'multiply'
          }}
        />
        
        {/* أوسمة التصنيف والتميز مدمجة فوق الصورة بروعة بصريّة */}
        <Box sx={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 3 }}>
          <Chip
            label={project.category}
            size="small"
            sx={{ 
              bgcolor: alpha(theme.palette.background.paper, 0.85), 
              color: mode === 'light' ? 'text.primary' : activeAccent, 
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, 
              fontWeight: 700, 
              fontSize: '0.68rem',
              borderRadius: '8px',
              fontFamily: '"Syne", sans-serif'
            }}
          />
          {project.featured && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                px: 1.2,
                py: 0.4,
                borderRadius: '8px',
                bgcolor: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,215,0,0.3)'
              }}
            >
              <StarIcon sx={{ fontSize: 13, color: '#FFD700' }} />
              <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Featured
              </Typography>
            </Box>
          )}
        </Box>

        {/* زر فتح معرض الصور — يظهر فقط لو المشروع عنده صور إضافية */}
        {hasGallery && (
          <Button
            onClick={() => onOpenGallery(project)}
            startIcon={<PhotoLibraryIcon fontSize="small" />}
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              zIndex: 3,
              bgcolor: alpha('#000', 0.55),
              color: '#fff',
              backdropFilter: 'blur(6px)',
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'initial',
              borderRadius: '8px',
              px: 1.3,
              py: 0.5,
              '&:hover': { bgcolor: alpha('#000', 0.75) },
            }}
          >
            {project.images.length + 1} Photos
          </Button>
        )}
      </Box>

      <CardContent sx={{ flex: 1, p: { xs: 3, md: 3.5 }, pt: 3 }}>
        <Typography 
          variant="h6" 
          className="project-title"
          sx={{ 
            fontFamily: '"Syne", sans-serif', 
            fontWeight: 700, 
            mb: 1.5, 
            fontSize: '1.2rem',
            color: 'text.primary',
            transition: 'color 0.3s ease'
          }}
        >
          {project.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 4, fontSize: '0.92rem' }}>
          {project.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {project.technologies.map((tech) => (
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
      </CardContent>

      <CardActions sx={{ px: { xs: 3, md: 3.5 }, pb: 3.5, pt: 0, gap: 1.5 }}>
        <Button
          size="small"
          startIcon={<GitHubIcon fontSize="small" />}
          href={project.github}
          target="_blank"
          sx={{ 
            color: 'text.secondary', 
            fontWeight: 600,
            textTransform: 'initial',
            fontSize: '0.82rem',
            borderRadius: '10px',
            px: 1.5,
            '&:hover': { color: 'text.primary', bgcolor: alpha(theme.palette.text.primary, 0.04) } 
          }}
        >
          Code
        </Button>
        <Button
          size="small"
          startIcon={<OpenInNewIcon fontSize="small" />}
          href={project.demo}
          target="_blank"
          sx={{ 
            color: activeAccent, 
            fontWeight: 600,
            textTransform: 'initial',
            fontSize: '0.82rem',
            borderRadius: '10px',
            px: 1.5,
            '&:hover': { color: theme.palette.mode === 'dark' ? '#FFF' : theme.palette.secondary.dark, bgcolor: alpha(activeAccent, 0.06) } 
          }}
        >
          Live Demo
        </Button>
        <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto', fontWeight: 600, fontFamily: '"Syne", sans-serif' }}>
          {project.year}
        </Typography>
      </CardActions>
    </Card>
  );
};

const Projects = () => {
  const theme = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const { data: projects, loading, error, refetch } = useApiData(
    getProjects,
    { category: activeCategory },
    [activeCategory]
  );

  // معرض الصور — يفتح على مشروع محدد بمؤشر أول صورة
  const [galleryProject, setGalleryProject] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openGallery = (project) => { setGalleryProject(project); setGalleryIndex(0); };
  const closeGallery = () => setGalleryProject(null);

  const galleryImages = galleryProject
    ? [galleryProject.image, ...(galleryProject.images || [])].filter(Boolean)
    : [];

  const nextImage = () => setGalleryIndex((i) => (i + 1) % galleryImages.length);
  const prevImage = () => setGalleryIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);

  return (
    <SectionWrapper id="projects" title="Projects" subtitle="What I've Built">
      <Container 
        maxWidth="lg" 
        sx={{ 
          px: { xs: 3, sm: 5, md: 7 }, 
          py: { xs: 4, md: 6 } 
        }}
      >
        {/* أزرار الفلترة المحسنة بحواف Bento دائرية ناعمة */}
        <Box sx={{ mb: 6 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1.2 }}>
            {projectCategories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setActiveCategory(cat)}
                variant={activeCategory === cat ? 'filled' : 'outlined'}
                sx={{
                  cursor: 'pointer',
                  fontFamily: '"Syne", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  px: 1.5,
                  py: 2.2,
                  borderRadius: '12px',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  ...(activeCategory === cat
                    ? { bgcolor: 'text.primary', color: 'background.default', borderColor: 'text.primary', '&:hover': { bgcolor: 'text.primary' } }
                    : { borderColor: alpha(theme.palette.divider, 0.2), color: 'text.secondary', '&:hover': { borderColor: 'text.primary', color: 'text.primary', transform: 'translateY(-1px)' } }),
                }}
              />
            ))}
          </Stack>
        </Box>

        {loading && (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {[1, 2, 3].map((n) => (
              <Grid item xs={12} sm={6} md={4} key={n}><SkeletonCard height={360} /></Grid>
            ))}
          </Grid>
        )}
        
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        
        {projects && (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {projects.map((project, i) => (
              <Grid item xs={12} sm={6} md={4} key={project._id}>
                <ProjectCard project={project} index={i} onOpenGallery={openGallery} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Dialog معرض الصور */}
      <Dialog
        open={!!galleryProject}
        onClose={closeGallery}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', bgcolor: '#0a0a0a', overflow: 'hidden' } }}
      >
        {galleryProject && (
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={closeGallery}
              sx={{ position: 'absolute', top: 12, right: 12, zIndex: 5, bgcolor: alpha('#000', 0.5), color: '#fff', '&:hover': { bgcolor: alpha('#000', 0.7) } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <Box sx={{ position: 'relative', width: '100%', pt: '62.5%', bgcolor: '#000' }}>
              <Box
                component="img"
                src={galleryImages[galleryIndex]}
                alt={`${galleryProject.title} — ${galleryIndex + 1}`}
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
              />

              {galleryImages.length > 1 && (
                <>
                  <IconButton
                    onClick={prevImage}
                    sx={{ position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)', bgcolor: alpha('#000', 0.5), color: '#fff', '&:hover': { bgcolor: alpha('#000', 0.7) } }}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={nextImage}
                    sx={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', bgcolor: alpha('#000', 0.5), color: '#fff', '&:hover': { bgcolor: alpha('#000', 0.7) } }}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.8 }}>
                    {galleryImages.map((_, idx) => (
                      <Box
                        key={idx}
                        onClick={() => setGalleryIndex(idx)}
                        sx={{
                          width: idx === galleryIndex ? 20 : 7,
                          height: 7,
                          borderRadius: '4px',
                          bgcolor: idx === galleryIndex ? '#fff' : alpha('#fff', 0.4),
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>

            <Box sx={{ p: 2.5, bgcolor: '#111' }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontFamily: '"Syne", sans-serif' }}>
                {galleryProject.title}
              </Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                {galleryIndex + 1} / {galleryImages.length}
              </Typography>
            </Box>
          </Box>
        )}
      </Dialog>
    </SectionWrapper>
  );
};

export default Projects;
