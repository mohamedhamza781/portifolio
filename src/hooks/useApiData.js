import { useState, useEffect } from 'react';

// Turns raw axios/network error objects into a friendly Arabic message
// instead of leaking things like "timeout of 10000ms exceeded" straight
// to the UI.
const getFriendlyErrorMessage = (err) => {
  if (err.code === 'ECONNABORTED') {
    return 'الخادم يستغرق وقتاً أطول من المعتاد للاستجابة — تأكد من اتصالك بالإنترنت وحاول مرة أخرى.';
  }
  if (!err.response && err.message === 'Network Error') {
    return 'تعذر الاتصال بالخادم، تأكد من اتصالك بالإنترنت.';
  }
  if (err.response?.data?.message) {
    return err.response.data.message;
  }
  return 'حدث خطأ أثناء تحميل البيانات، حاول مرة أخرى.';
};

/**
 * Generic async data fetcher hook
 * Designed to work with portfolioService functions
 */
export const useApiData = (fetchFn, params = null, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await (params ? fetchFn(params) : fetchFn());
      setData(response.data);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch };
};

/**
 * Scroll position tracker for nav highlight
 */
export const useScrollSpy = (sectionIds) => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return activeSection;
};

/**
 * Intersection observer hook for fade-in animations
 */
export const useInView = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1, ...options }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, inView];
};