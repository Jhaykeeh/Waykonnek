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
    { icon: 'WiFi', title: 'WiFi Registration', desc: 'Quick and easy device registration for campus network access.' },
    { icon: 'Stats', title: 'Real-Time Monitoring', desc: 'Track bandwidth usage and network performance as it happens.' },
    { icon: 'Policy', title: 'Fair Usage Policy', desc: 'Keep the network fair and fast for every student and staff member.' },
    { icon: 'Reports', title: 'Detailed Reports', desc: 'Get actionable insights from bandwidth and device analytics.' },
    { icon: 'Admin', title: 'Admin Control Panel', desc: 'Manage devices, users, and policies from one central dashboard.' },
    { icon: 'Alerts', title: 'Instant Alerts', desc: 'Receive timely notifications for network issues and threshold events.' },
  ];

  const steps = [
    { number: '01', title: 'Register Device', detail: 'Easily enroll your device with the CITU network and get connected.' },
    { number: '02', title: 'Monitor Usage', detail: 'Check your bandwidth stats and stay within fair usage limits.' },
    { number: '03', title: 'Manage Access', detail: 'Administrators can approve requests and keep the network secure.' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage="landing" onNavigate={onNavigate} />

      <section style={{ background: COLORS.backgrounds.gradient, padding: '80px 24px 56px', color: COLORS.text.white }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gap: '32px', gridTemplateColumns: '1.3fr 1fr', alignItems: 'center' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '8px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.10)', color: COLORS.text.white, fontSize: '13px', letterSpacing: '0.08em' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4CAF50' }}></span>
              <span>Campus network management</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.7rem, 4vw, 4.2rem)', lineHeight: '1.05', fontWeight: '800', marginBottom: '20px', fontFamily: FONTS.primary }}>
              Secure, fair, and reliable bandwidth for CITU.
            </h1>
            <p style={{ maxWidth: '680px', fontSize: '1.01rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.86)', marginBottom: '30px' }}>
              Waykonnek-CITU brings streamlined device registration, network monitoring, and administrator control together in one polished campus platform.
              Manage connectivity with confidence and keep the whole community online.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              <Button onClick={() => onNavigate('register')} padding="14px 28px" style={{ fontSize: '15px' }}>
                Get Started
              </Button>
              <Button variant="secondary" onClick={() => onNavigate('about')} padding="14px 28px" style={{ fontSize: '15px' }}>
                Learn More
              </Button>
            </div>
          </div>

          <Card style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', padding: '30px', backdropFilter: 'blur(14px)', borderRadius: '24px' }}>
            <div style={{ display: 'grid', gap: '24px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '13px', color: COLORS.text.mutedGold, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
                  Campus network at a glance
                </p>
                <h2 style={{ margin: '10px 0 0', fontSize: '26px', color: COLORS.text.heading, fontFamily: FONTS.primary }}>Your network, simplified.</h2>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { label: 'Connected Users', value: APP_CONFIG.TOTAL_USERS.toLocaleString() },
                  { label: 'Network Capacity', value: `${APP_CONFIG.TOTAL_BANDWIDTH_GBPBS} Gbps` },
                  { label: 'Registered Devices', value: APP_CONFIG.TOTAL_REGISTERED_DEVICES.toLocaleString() },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '14px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.08)' }}>
                    <span style={{ color: COLORS.text.mutedGold, fontSize: '14px' }}>{item.label}</span>
                    <strong style={{ color: COLORS.text.white, fontSize: '16px' }}>{item.value}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gap: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '18px' }}>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.82)', fontSize: '14px', lineHeight: '1.65' }}>
                  Waykonnek-CITU supports a growing campus community with fair bandwidth policies and fast access, while giving administrators real-time insight into network health.
                </p>
                <Button variant="secondary" onClick={() => onNavigate('login')} padding="12px 22px" style={{ fontSize: '14px' }}>
                  Admin Access
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section style={{ backgroundColor: COLORS.bgPage, padding: '40px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { value: APP_CONFIG.TOTAL_USERS.toLocaleString() + '+', label: 'Users' },
              { value: '98%', label: 'Uptime' },
              { value: `${APP_CONFIG.TOTAL_BANDWIDTH_GBPBS} Gbps`, label: 'Bandwidth' },
              { value: APP_CONFIG.TOTAL_REGISTERED_DEVICES.toLocaleString() + '+', label: 'Devices' },
            ].map((stat, idx) => (
              <Card key={idx} style={{ textAlign: 'center', padding: '28px 24px' }}>
                <div style={{ fontSize: '30px', fontWeight: 'bold', color: COLORS.textHeading, marginBottom: '8px' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: COLORS.text.mutedGold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', backgroundColor: COLORS.bgPage }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <p style={{ color: COLORS.text.mutedGold, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '16px', fontSize: '13px' }}>
              What We Offer
            </p>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: COLORS.textHeading, marginBottom: '16px' }}>
              Powerful features built for campus networks
            </h2>
            <p style={{ maxWidth: '720px', margin: '0 auto', color: COLORS.textBody, fontSize: '16px', lineHeight: '1.8' }}>
              Manage bandwidth, devices, and user access with elegant tools designed for the needs of CITU students and administrators.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {features.map((feature, idx) => (
              <Card key={idx} style={{ padding: '28px 24px', minHeight: '240px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '54px', height: '54px', borderRadius: '14px', background: `linear-gradient(135deg, ${COLORS.maroon.medium}, ${COLORS.maroon.dark})`, margin: '0 auto 18px', border: `1px solid ${COLORS.gold.primary}` }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: COLORS.text.gold, fontFamily: FONTS.primary }}>{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: '700', color: COLORS.textHeading, marginBottom: '10px', textAlign: 'center' }}>{feature.title}</h3>
                <p style={{ color: COLORS.textBody, fontSize: '15px', lineHeight: '1.7', textAlign: 'center' }}>{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: `linear-gradient(135deg, ${COLORS.maroon.light} 0%, ${COLORS.maroon.dark} 100%)`, padding: '80px 24px', color: COLORS.text.white }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gap: '40px', gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
          <div>
            <p style={{ color: COLORS.text.mutedGold, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '16px', fontSize: '13px' }}>
              How it works
            </p>
            <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px' }}>
              Connect faster with a smarter network experience
            </h2>
            <p style={{ fontSize: '17px', lineHeight: '1.8', color: 'rgba(255,255,255,0.9)', marginBottom: '32px' }}>
              From device registration to real-time monitoring, Waykonnek-CITU keeps your campus connected while giving administrators the tools to keep the network secure and fair.
            </p>
            <div style={{ display: 'grid', gap: '16px' }}>
              {steps.map((step) => (
                <div key={step.number} style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: '18px', alignItems: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '18px 22px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: COLORS.gold.primary, color: COLORS.maroon.dark, display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>
                    {step.number}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '700' }}>{step.title}</h3>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.82)', lineHeight: '1.6' }}>{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', padding: '38px', backdropFilter: 'blur(14px)' }}>
            <h3 style={{ color: COLORS.text.gold, fontSize: '22px', marginBottom: '18px' }}>Start securing your campus network today</h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', lineHeight: '1.8', marginBottom: '28px' }}>
              Register your campus devices, monitor traffic, and empower administrators with the tools they need for reliable connectivity.
            </p>
            <Button onClick={() => onNavigate('register')} padding="16px 32px" style={{ fontSize: '16px' }}>
              Register Your Device
            </Button>
          </Card>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
