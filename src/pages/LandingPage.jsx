/**
 * LandingPage Component
 * Public home page with hero, stats, features, and CTA.
 */

import { COLORS, FONTS, APP_CONFIG } from '../constants/theme';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { Button } from '../components/ui';

export default function LandingPage({ onNavigate }) {
  const features = [
    { icon: '📶', title: 'WiFi Registration', desc: 'Quick and easy device registration for campus network access' },
    { icon: '📊', title: 'Real-Time Monitoring', desc: 'Track bandwidth usage and network performance in real-time' },
    { icon: '⚖️', title: 'Fair Usage Policy', desc: 'Ensure equitable bandwidth distribution across all users' },
    { icon: '📈', title: 'Detailed Reports', desc: 'Comprehensive analytics and usage reports for administrators' },
    { icon: '🔐', title: 'Admin Control Panel', desc: 'Full administrative control over network settings and policies' },
    { icon: '🔔', title: 'Instant Alerts', desc: 'Real-time notifications for network anomalies and threshold breaches' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage="landing" onNavigate={onNavigate} />

      {/* Hero Section */}
      <section style={{ background: COLORS.backgrounds.gradient, padding: '100px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '20px', lineHeight: '1.2' }}>
          Waykonnek-CITU — Intelligent Bandwidth Management for CITU
        </h1>
        <p style={{ fontSize: '20px', color: COLORS.text.white, fontFamily: FONTS.primary, marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          Empowering Cebu Institute of Technology – University with smart network monitoring,
          fair bandwidth allocation, and seamless connectivity for over {APP_CONFIG.TOTAL_USERS.toLocaleString()} users.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Button onClick={() => onNavigate('register')} padding="16px 32px" style={{ fontSize: '18px' }}>
            Get Started →
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('about')} padding="16px 32px" style={{ fontSize: '18px' }}>
            Learn More
          </Button>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{
        backgroundColor: COLORS.maroon.dark,
        borderTop: `2px solid ${COLORS.gold.border}`,
        borderBottom: `2px solid ${COLORS.gold.border}`,
        padding: '30px 40px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap', gap: '20px' }}>
          {[
            { value: APP_CONFIG.TOTAL_USERS.toLocaleString() + '+', label: 'Users' },
            { value: '98%', label: 'Uptime' },
            { value: `${APP_CONFIG.TOTAL_BANDWIDTH_GBPBS} Gbps`, label: 'Bandwidth' },
            { value: APP_CONFIG.TOTAL_REGISTERED_DEVICES.toLocaleString() + '+', label: 'Devices' },
          ].map((stat, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 40px', flex: 1, backgroundColor: COLORS.bgPage }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '60px' }}>
          Powerful Features
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {features.map((feature, idx) => (
            <Card key={idx}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '12px' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '14px', color: COLORS.textBody, fontFamily: FONTS.primary, lineHeight: '1.6' }}>
                  {feature.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: `linear-gradient(135deg, ${COLORS.maroon.medium} 0%, ${COLORS.maroon.light} 100%)`,
        padding: '60px 40px', textAlign: 'center', borderTop: `2px solid ${COLORS.gold.border}`,
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '20px' }}>
          Ready to Get Started?
        </h2>
        <p style={{ fontSize: '18px', color: COLORS.text.white, fontFamily: FONTS.primary, marginBottom: '30px' }}>
          Join thousands of CITU users enjoying optimized network connectivity
        </p>
        <Button onClick={() => onNavigate('register')} padding="16px 40px" style={{ fontSize: '18px' }}>
          Register Now
        </Button>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
