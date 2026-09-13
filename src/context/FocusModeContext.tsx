import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FocusFontSize = 'normal' | 'large' | 'xlarge' | 'huge';

export interface FocusModeContextType {
  isFocusMode: boolean;
  setIsFocusMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleFocusMode: () => void;
  fontSize: FocusFontSize;
  setFontSize: (size: FocusFontSize | ((prev: FocusFontSize) => FocusFontSize)) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const defaultFocusMode: FocusModeContextType = {
  isFocusMode: false,
  setIsFocusMode: () => {},
  toggleFocusMode: () => {},
  fontSize: 'large',
  setFontSize: () => {},
  increaseFontSize: () => {},
  decreaseFontSize: () => {}
};

export const FocusModeContext = createContext<FocusModeContextType>(defaultFocusMode);

const FONT_SIZE_ORDER: FocusFontSize[] = ['normal', 'large', 'xlarge', 'huge'];

export const FocusModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFocusMode, setIsFocusModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('eb_focus_mode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [fontSize, setFontSizeState] = useState<FocusFontSize>(() => {
    try {
      const saved = localStorage.getItem('eb_focus_font_size') as FocusFontSize;
      if (saved && FONT_SIZE_ORDER.includes(saved)) {
        return saved;
      }
      return 'large';
    } catch {
      return 'large';
    }
  });

  const setIsFocusMode = (value: boolean | ((prev: boolean) => boolean)) => {
    setIsFocusModeState(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem('eb_focus_mode', String(next));
      } catch {}
      return next;
    });
  };

  const toggleFocusMode = () => {
    setIsFocusMode(prev => !prev);
  };

  const setFontSize = (size: FocusFontSize | ((prev: FocusFontSize) => FocusFontSize)) => {
    setFontSizeState(prev => {
      const next = typeof size === 'function' ? size(prev) : size;
      try {
        localStorage.setItem('eb_focus_font_size', next);
      } catch {}
      return next;
    });
  };

  const increaseFontSize = () => {
    setFontSizeState(prev => {
      const idx = FONT_SIZE_ORDER.indexOf(prev);
      const next = idx < FONT_SIZE_ORDER.length - 1 ? FONT_SIZE_ORDER[idx + 1] : prev;
      try {
        localStorage.setItem('eb_focus_font_size', next);
      } catch {}
      return next;
    });
  };

  const decreaseFontSize = () => {
    setFontSizeState(prev => {
      const idx = FONT_SIZE_ORDER.indexOf(prev);
      const next = idx > 0 ? FONT_SIZE_ORDER[idx - 1] : prev;
      try {
        localStorage.setItem('eb_focus_font_size', next);
      } catch {}
      return next;
    });
  };

  // Keyboard shortcut listener: 'Escape' to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  return (
    <FocusModeContext.Provider
      value={{
        isFocusMode,
        setIsFocusMode,
        toggleFocusMode,
        fontSize,
        setFontSize,
        increaseFontSize,
        decreaseFontSize
      }}
    >
      {children}
    </FocusModeContext.Provider>
  );
};

export const useFocusMode = (): FocusModeContextType => {
  const context = useContext(FocusModeContext);
  return context || defaultFocusMode;
};
