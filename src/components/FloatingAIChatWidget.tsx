import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X } from 'lucide-react';
import { AdvancedAITab } from './AdvancedAITab';
import { BirthDetails } from '../types';

interface FloatingAIChatWidgetProps {
  birthDetails?: BirthDetails;
  horoscopeData?: any;
  language?: 'en' | 'hi' | 'te';
  profiles?: any[];
  onSelectProfile?: (profile: any) => void;
}

export const FloatingAIChatWidget: React.FC<FloatingAIChatWidgetProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#E67E22] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#D35400] transition-colors z-[9999]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-4 sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[600px] bg-white rounded-2xl shadow-2xl z-[9998] border border-[#D4C5B9]/50 overflow-hidden"
          >
            <AdvancedAITab {...props} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
