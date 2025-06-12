import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-6xl">
        <div className="flex items-center gap-2">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <svg 
              className="w-8 h-8 text-primary" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M21.876 9.987c-.606-3.352-3.235-6.16-6.731-7.055-3.538-.906-7.05.306-9.292 2.958-.015-.155-.036-.309-.036-.466 0-.552-.447-1-1-1s-1 .448-1 1c0 2.72 1.683 5.212 4.341 6.391-.232.297-.468.588-.682.896-1.051 1.515-1.658 3.258-1.658 4.966 0 1.42.366 2.817 1.05 4.031.255.451.83.612 1.28.356.45-.255.611-.83.356-1.28-.549-.974-.854-2.081-.854-3.184 0-1.994.85-3.93 2.331-5.28.182-.166.353-.343.519-.525.181.103.36.21.55.305.585.291 1.194.518 1.821.671l.062.257c.646 2.646 3.137 4.499 5.87 4.499 2.628 0 5.007-1.704 5.762-4.243.067-.229.126-.461.172-.695.286-.24.559-.5.802-.789.22-.26.421-.536.599-.827.174.12.362.21.576.21.552 0 1-.448 1-1 0-.431-.274-.792-.657-.929zm-17.876-2.904c.493 0 .953-.131 1.363-.347.36.155.722.3 1.095.428-.707.303-1.671.403-2.458.135.001-.072.001-.144 0-.216zm14.887 6.274c-.407 1.729-2.015 2.954-3.887 2.954-1.909 0-3.564-1.286-3.976-3.141l-.113-.467c-.039-.159-.109-.309-.207-.433-.629-.79-1.115-1.692-1.407-2.681.09-.142.181-.283.273-.423.303-.462.632-.9.984-1.308.499.125.982.32 1.432.58.511.295.962.669 1.34 1.108l.916-1.055c-.397-.345-.827-.647-1.292-.891 1.237-.687 2.585-1.09 3.977-1.163.368-.019.733.003 1.093.061 1.684.273 3.145 1.282 4.058 2.801.226.377.406.777.54 1.191.2.619.252 1.252.157 1.881-.143.95-.567 1.821-1.21 2.527-.271.297-.576.558-.901.779-.116-.452-.285-.889-.506-1.302l-1.177.706c.245.407.414.852.48 1.317.012.083.021.167.027.251-.154.061-.312.115-.473.159-.116.031-.234.056-.352.075zm2.989-5.343c-.285-.321-.59-.619-.912-.89.122-.321.219-.651.289-.99.195-.068.371-.177.519-.317.136.734.124 1.488-.029 2.223.045-.007.089-.017.133-.026z" />
            </svg>
          </motion.div>
          <h1 className="text-xl font-bold">NutriTrack</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          
          <button 
            className="md:hidden rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
