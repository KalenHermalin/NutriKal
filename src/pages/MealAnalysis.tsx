import React, { useState } from 'react';
import { Barcode, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CameraScanner from '../components/CameraScanner';

const MealAnalysis = () => {
  const [mode, setMode] = useState<'camera' | 'barcode'>('camera');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Food Analysis</h1>
        <p className="text-muted">Analyze meals with camera or scan barcodes</p>
      </motion.div>

      {/* Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Analysis Mode</h2>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${mode === 'camera' ? 'text-primary font-medium' : 'text-muted'}`}>
              Camera
            </span>
            <button
              onClick={() => setMode(mode === 'camera' ? 'barcode' : 'camera')}
              className="text-primary"
            >
              {mode === 'camera' ? <ToggleLeft size={24} /> : <ToggleRight size={24} />}
            </button>
            <span className={`text-sm ${mode === 'barcode' ? 'text-primary font-medium' : 'text-muted'}`}>
              Barcode
            </span>
          </div>
        </div>



        <motion.div
          key="camera"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <CameraScanner mode={mode.toString()} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MealAnalysis;
