/**
 * ContactPage Component
 * Contact info cards + message form with success confirmation.
 */

import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { Button, Input } from '../components/ui';

export default function ContactPage({ onNavigate }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    setIsSubmitted(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage="contact" onNavigate={onNavigate} />

      {/* Hero Section */}
      <section style={{ background: COLORS.backgrounds.gradient, padding: '60px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '16px' }}>
          Contact Us
        </h1>
        <p style={{ fontSize: '20px', color: COLORS.text.white, fontFamily: FONTS.primary, maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Get in touch with the Waykonnek-CITU team for support or inquiries
        </p>
      </section>

      {/* Main Content */}
      <section style={{ flex: 1, padding: '60px 40px', backgroundColor: COLORS.bgPage }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Left Column - Contact Info */}
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '32px' }}>
              Get In Touch
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              {[
                { icon: '📍', label: 'Address', value: 'N. Bacalso Ave, Cebu City' },
                { icon: '📞', label: 'Phone', value: '(032) 261-7741' },
                { icon: '📧', label: 'Email', value: 'waykonnek@cit.edu' },
                { icon: '🕒', label: 'Hours', value: 'Mon–Fri 8AM–5PM' },
              ].map((item, idx) => (
                <Card key={idx} style={{ padding: '20px', backgroundColor: COLORS.bgSection }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '32px' }}>{item.icon}</div>
                    <div>
                      <p style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: '0 0 4px 0', fontWeight: 'bold' }}>{item.label}</p>
                      <p style={{ fontSize: '16px', color: COLORS.textBody, fontFamily: FONTS.primary, margin: 0 }}>{item.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Card style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgSection }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
                <p style={{ fontSize: '16px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>Campus Map</p>
                <p style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: '4px 0 0 0' }}>N. Bacalso Ave, Cebu City</p>
              </div>
            </Card>
          </div>

          {/* Right Column - Message Form */}
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '32px' }}>
              Send Us a Message
            </h2>

            {isSubmitted ? (
              <Card style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
                  Message Sent Successfully!
                </h3>
                <p style={{ fontSize: '16px', color: COLORS.textBody, fontFamily: FONTS.primary, marginBottom: '32px', lineHeight: '1.6' }}>
                  Thank you for contacting us. We'll get back to you within 24-48 hours.
                </p>
                <Button onClick={handleReset}>Send Another Message</Button>
              </Card>
            ) : (
              <Card>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
                    <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Subject</label>
                    <select name="subject" value={formData.subject} onChange={handleChange}
                      style={{
                        width: '100%', padding: '11px 14px', backgroundColor: COLORS.bgInput,
                        border: `1px solid ${COLORS.gold.border}`, borderRadius: '8px',
                        color: COLORS.maroon.card, fontFamily: FONTS.primary, fontSize: '14px',
                        outline: 'none', boxSizing: 'border-box',
                      }}>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Message</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows="6"
                      style={{
                        width: '100%', padding: '11px 14px', backgroundColor: COLORS.bgInput,
                        border: `1px solid ${COLORS.gold.border}`, borderRadius: '8px',
                        color: COLORS.maroon.card, fontFamily: FONTS.primary, fontSize: '14px',
                        outline: 'none', resize: 'vertical', minHeight: '120px', boxSizing: 'border-box',
                      }} />
                  </div>

                  <Button type="submit">Send Message →</Button>
                </form>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
