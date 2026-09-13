import React, { StrictMode, Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled Application Error:', error, errorInfo);
  }

  handleReload = () => {
    try {
      localStorage.removeItem('eb_access_token');
      localStorage.removeItem('eb_refresh_token');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F9F7F2] text-[#1D1D1B] flex items-center justify-center p-6 font-serif" dir="rtl">
          <div className="max-w-md w-full bg-white border-2 border-[#1D1D1B] p-8 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 bg-[#8A1F1D] text-white flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h1 className="text-xl font-bold text-[#1D1D1B]">حدث خطأ غير متوقع أثناء تحميل الصفحة</h1>
            <p className="text-sm text-[#1D1D1B]/70 leading-relaxed">
              واجهت المنظومة خطأً تقنياً مؤقتاً. يمكنك إعادة تهيئة الجلسة وتحميل المنظومة من جديد.
            </p>
            <button
              id="reload-app-btn"
              onClick={this.handleReload}
              className="w-full py-3 bg-[#1D1D1B] text-[#F9F7F2] font-bold text-sm hover:bg-[#C4A484] hover:text-[#1D1D1B] transition-colors cursor-pointer"
            >
              إعادة تحميل المنظومة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);

