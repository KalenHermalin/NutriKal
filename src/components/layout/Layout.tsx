import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { motion } from 'framer-motion';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen min-w-[320px] bg-background">
      <main className="flex-grow container mx-auto px-4 py-6 max-w-6xl min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full pb-20"
        >
          <Outlet />
        </motion.div>
      </main>

      <Navigation />
    </div>
  );
};

export default Layout;
