import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  message: string | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { message: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { message: error instanceof Error ? error.message : 'Terjadi kesalahan tak terduga.' };
  }

  render() {
    if (this.state.message) {
      return (
        <div className="min-h-svh flex flex-col items-center justify-center gap-4 bg-[#fdf3e3] p-6 text-center text-[#2a1710]">
          <h1 className="text-2xl font-black">Terjadi kesalahan</h1>
          <p className="max-w-md text-sm text-[#334155]">{this.state.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl border-2 border-[#2a1710] bg-[#e2571a] px-5 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0px_#2a1710]"
          >
            Muat ulang halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
