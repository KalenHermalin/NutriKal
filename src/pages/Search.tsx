import React from 'react';
import { motion } from 'framer-motion';
import FoodSearchList from '../components/common/FoodSearchList';

const Search = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Food Search</h1>
        <p className="text-muted">Search and add foods to your daily log</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <FoodSearchList />
      </motion.div>
    </div>
  );
};

export default Search;
