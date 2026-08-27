/**
 * Portfolio Service
 * Currently uses mock data. To switch to real API:
 * 1. Set VITE_USE_MOCK=false in .env
 * 2. Ensure your backend exposes the endpoints listed below
 *
 * Note: our real backend wraps every response as { success, data },
 * so real-API calls below unwrap `res.data.data` to keep the same
 * { data: ... } shape the mock branch returns (and that useApiData expects).
 */

import api from './api';
import { profileData } from '../data/profile';
import { skillsData } from '../data/skills';
import { projectsData } from '../data/projects';
import { experienceData } from '../data/experience';
import { educationData, certificatesData } from '../data/education';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// GET /api/profile
export const getProfile = async () => {
  if (USE_MOCK) { await delay(); return { data: profileData }; }
  const res = await api.get('/profile');
  return { data: res.data.data };
};

// GET /api/skills
export const getSkills = async () => {
  if (USE_MOCK) { await delay(); return { data: skillsData }; }
  const res = await api.get('/skills');
  return { data: res.data.data };
};

// GET /api/projects
export const getProjects = async (params = {}) => {
  if (USE_MOCK) {
    await delay();
    let data = [...projectsData];
    if (params.category && params.category !== 'All') {
      data = data.filter((p) => p.category === params.category);
    }
    if (params.technology) {
      data = data.filter((p) => p.technologies.includes(params.technology));
    }
    return { data };
  }
  const res = await api.get('/projects', { params });
  return { data: res.data.data };
};

// GET /api/projects/:id
export const getProjectById = async (id) => {
  if (USE_MOCK) {
    await delay(200);
    const project = projectsData.find((p) => p.id === id);
    return { data: project };
  }
  const res = await api.get(`/projects/${id}`);
  return { data: res.data.data };
};

// GET /api/experience
export const getExperience = async () => {
  if (USE_MOCK) { await delay(); return { data: experienceData }; }
  const res = await api.get('/experience');
  return { data: res.data.data };
};

// GET /api/education
export const getEducation = async () => {
  if (USE_MOCK) { await delay(); return { data: educationData }; }
  const res = await api.get('/education');
  return { data: res.data.data };
};

// GET /api/certificates
export const getCertificates = async () => {
  if (USE_MOCK) { await delay(); return { data: certificatesData }; }
  const res = await api.get('/certificates');
  return { data: res.data.data };
};

// POST /api/contact
export const sendContactMessage = async (formData) => {
  if (USE_MOCK) {
    await delay(800);
    console.log('[MOCK] Contact form submitted:', formData);
    return { data: { success: true, message: 'Message sent successfully!' } };
  }
  const res = await api.post('/contact', formData);
  return { data: res.data };
};

// GET /api/settings — Navbar / Hero / About / Contact / Footer display settings
export const getSettings = async () => {
  if (USE_MOCK) {
    await delay();
    return { data: { navbar: {}, hero: {}, about: {}, contact: {}, footer: {} } };
  }
  const res = await api.get('/settings');
  return { data: res.data.data };
};