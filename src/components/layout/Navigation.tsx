import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, BarChart2, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = () => {
  return (
    <motion.nav
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 w-full bg-card border-t border-border/40 z-50"
    >
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-between py-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-primary' : 'text-muted hover:text-primary'
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
                `flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-primary' : 'text-muted hover:text-primary'
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
                `flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-primary' : 'text-muted hover:text-primary'
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
                `flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-primary' : 'text-muted hover:text-primary'
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
  );
};

export default Navigation;
