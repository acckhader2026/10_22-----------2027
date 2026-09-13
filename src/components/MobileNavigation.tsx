import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Scale, Award, Brain } from 'lucide-react';

interface MobileNavigationProps {
  onOpenSidebar?: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav 
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#1D1D1B] text-[#F9F7F2] border-t border-[#1D1D1B]/20 shadow-2xl flex items-center justify-around px-2 py-1 select-none font-serif"
      aria-label="شريط التنقل السفلي للهاتف"
    >
      <NavLink
        id="mobile-nav-home"
        to="/"
        aria-current={pathname === '/' ? 'page' : undefined}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 text-[10px] font-bold transition ${
            isActive && pathname === '/'
              ? 'text-[#C4A484]'
              : 'text-[#F9F7F2]/70 hover:text-white'
          }`
        }
      >
        <Home className="w-4 h-4 mb-0.5" />
        <span>الرئيسية</span>
      </NavLink>

      <NavLink
        id="mobile-nav-curriculum"
        to="/curriculum"
        aria-current={pathname.startsWith('/curriculum') ? 'page' : undefined}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 text-[10px] font-bold transition ${
            isActive || pathname.startsWith('/curriculum')
              ? 'text-[#C4A484]'
              : 'text-[#F9F7F2]/70 hover:text-white'
          }`
        }
      >
        <BookOpen className="w-4 h-4 mb-0.5" />
        <span>المنهج</span>
      </NavLink>

      <NavLink
        id="mobile-nav-training"
        to="/training"
        aria-current={pathname.startsWith('/training') ? 'page' : undefined}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 text-[10px] font-bold transition ${
            isActive || pathname.startsWith('/training')
              ? 'text-[#C4A484]'
              : 'text-[#F9F7F2]/70 hover:text-white'
          }`
        }
      >
        <Scale className="w-4 h-4 mb-0.5" />
        <span>التدريب</span>
      </NavLink>

      <NavLink
        id="mobile-nav-assessment"
        to="/assessment"
        aria-current={pathname.startsWith('/assessment') ? 'page' : undefined}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 text-[10px] font-bold transition ${
            isActive || pathname.startsWith('/assessment')
              ? 'text-[#C4A484]'
              : 'text-[#F9F7F2]/70 hover:text-white'
          }`
        }
      >
        <Award className="w-4 h-4 mb-0.5" />
        <span>التقييم</span>
      </NavLink>

      <NavLink
        id="mobile-nav-mypath"
        to="/my-path"
        aria-current={pathname.startsWith('/my-path') ? 'page' : undefined}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 text-[10px] font-bold transition ${
            isActive || pathname.startsWith('/my-path')
              ? 'text-[#C4A484]'
              : 'text-[#F9F7F2]/70 hover:text-white'
          }`
        }
      >
        <Brain className="w-4 h-4 mb-0.5" />
        <span>مساري</span>
      </NavLink>
    </nav>
  );
};
