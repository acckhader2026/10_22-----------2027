import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { FocusModeToggle } from '../FocusModeToggle';
import { FocusModeProvider, useFocusMode } from '../../context/FocusModeContext';

describe('Focus Mode Reading Experience Component & Context', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders FocusModeToggle in default mode with both options', () => {
    const handleToggle = vi.fn();
    render(<FocusModeToggle isFocusMode={false} onToggle={handleToggle} />);

    expect(screen.getAllByText(/الوضع الافتراضي/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/وضع التركيز/)[0]).toBeInTheDocument();
    expect(screen.getByText('العادي')).toBeInTheDocument();
  });

  it('renders FocusModeToggle in focus mode with active indicator', () => {
    const handleToggle = vi.fn();
    render(<FocusModeToggle isFocusMode={true} onToggle={handleToggle} />);

    expect(screen.getByText('مفعّل')).toBeInTheDocument();
    expect(screen.getByText(/تم إخفاء القوائم والعناصر الجانبية/)).toBeInTheDocument();
    expect(screen.getByText(/Esc للإنهاء/)).toBeInTheDocument();
  });

  it('clicking the switch calls onToggle', () => {
    const handleToggle = vi.fn();
    render(<FocusModeToggle isFocusMode={false} onToggle={handleToggle} />);

    const switchBtn = screen.getByRole('switch');
    fireEvent.click(switchBtn);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('clicking the mode button calls onToggle when changing state', () => {
    const handleToggle = vi.fn();
    render(<FocusModeToggle isFocusMode={false} onToggle={handleToggle} />);

    const focusBtn = screen.getByRole('button', { name: /وضع التركيز/ });
    fireEvent.click(focusBtn);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('FocusModeContext provides toggle functionality and persists to localStorage', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FocusModeProvider>{children}</FocusModeProvider>
    );

    const { result } = renderHook(() => useFocusMode(), { wrapper });

    expect(result.current.isFocusMode).toBe(false);

    act(() => {
      result.current.toggleFocusMode();
    });

    expect(result.current.isFocusMode).toBe(true);
    expect(localStorage.getItem('eb_focus_mode')).toBe('true');

    act(() => {
      result.current.toggleFocusMode();
    });

    expect(result.current.isFocusMode).toBe(false);
    expect(localStorage.getItem('eb_focus_mode')).toBe('false');
  });

  it('pressing Escape exits focus mode', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FocusModeProvider>{children}</FocusModeProvider>
    );

    const { result } = renderHook(() => useFocusMode(), { wrapper });

    act(() => {
      result.current.setIsFocusMode(true);
    });

    expect(result.current.isFocusMode).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(result.current.isFocusMode).toBe(false);
  });
});
