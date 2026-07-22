import { Component } from 'react';
import { COLORS, FONTS } from '../constants/theme';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: COLORS.bgPage, padding: '24px',
        }}>
          <div style={{
            maxWidth: '480px', width: '100%', textAlign: 'center',
            backgroundColor: COLORS.maroon.card, borderRadius: '12px',
            border: `1px solid ${COLORS.gold.border}`, padding: '48px 32px',
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(244,67,54,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid #F44336' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#F44336' }}>!</span>
            </div>
            <h2 style={{
              fontSize: '24px', fontWeight: 'bold', color: COLORS.textHeading,
              fontFamily: FONTS.primary, marginBottom: '12px',
            }}>
              Something went wrong
            </h2>
            <p style={{
              fontSize: '14px', color: COLORS.textBody, fontFamily: FONTS.primary,
              marginBottom: '24px', lineHeight: '1.6',
            }}>
              An unexpected error occurred. You can try again or return to the home page.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={this.handleReset} style={{
                padding: '10px 24px', borderRadius: '8px', border: `1px solid ${COLORS.gold.border}`,
                backgroundColor: 'transparent', color: COLORS.text.gold, fontFamily: FONTS.primary,
                fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
              }}>
                Try Again
              </button>
              <button onClick={this.handleGoHome} style={{
                padding: '10px 24px', borderRadius: '8px', border: 'none',
                backgroundColor: COLORS.maroon.dark, color: COLORS.text.white, fontFamily: FONTS.primary,
                fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
              }}>
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
