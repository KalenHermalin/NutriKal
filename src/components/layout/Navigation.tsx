import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, BarChart2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // Reset visibility when route changes
  useEffect(() => {
    setIsVisible(true);
  }, [location.pathname]);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const scrollThreshold = 10; // Minimum scroll to trigger hide/show

      // Only hide on scroll down if we've scrolled enough
      if (
        scrollingDown &&
        currentScrollY > 100 &&
        Math.abs(currentScrollY - lastScrollY) > scrollThreshold
      ) {
        setIsVisible(false);
      } else if (!scrollingDown && Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: 50, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : 20,
          opacity: isVisible ? 1 : 0.8,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        className="fixed bottom-0 left-0 w-full bg-card border-t border-border/40 z-[9000] shadow-lg backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-between py-3">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 ${isActive ? 'text-primary' : 'text-muted hover:text-primary'
                  }`
                }
              >
                <Home className="h-6 w-6" />
                <span className="text-xs">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 ${isActive ? 'text-primary' : 'text-muted hover:text-primary'
                  }`
                }
              >
                <Search className="h-6 w-6" />
                <span className="text-xs">Search</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/analyze"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 ${isActive ? 'text-primary' : 'text-muted hover:text-primary'
                  }`
                }
              >
                <BarChart2 className="h-6 w-6" />
                <span className="text-xs">Analyze</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 ${isActive ? 'text-primary' : 'text-muted hover:text-primary'
                  }`
                }
              >
                <User className="h-6 w-6" />
                <span className="text-xs">Profile</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};

export default Navigation;
