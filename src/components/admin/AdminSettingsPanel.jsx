/**
 * AdminSettingsPanel — System settings: bandwidth limit, max devices, maintenance mode.
 */
import { useState } from 'react';
import { COLORS, FONTS, APP_CONFIG } from '../../constants/theme';
import { Button, Toggle, Input } from '../ui';
import Card from '../Card';

export default function AdminSettingsPanel() {
  const [bandwidthLimit, setBandwidthLimit] = useState(String(APP_CONFIG.MONTHLY_BANDWIDTH_CAP_GB));
  const [maxDevices, setMaxDevices] = useState(String(APP_CONFIG.MAX_DEVICES_PER_STUDENT));
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoReject, setAutoReject] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleSave = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <>
      {settingsSaved && (
        <div style={{
          marginBottom: '24px', padding: '14px 20px',
          backgroundColor: 'rgba(76,175,80,0.15)', border: '1px solid #4CAF50',
          borderRadius: '10px', color: '#4CAF50', fontFamily: FONTS.primary, fontSize: '14px',
        }}>
          Settings saved successfully!
        </div>
      )}

      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
        System Settings
      </h3>
      <Card style={{ marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <Input label="Bandwidth Limit Per User (GB)" type="number" value={bandwidthLimit}
            onChange={(e) => setBandwidthLimit(e.target.value)} />
          <Input label="Max Devices Per Student" type="number" value={maxDevices}
            onChange={(e) => setMaxDevices(e.target.value)} />

          <div style={{ gridColumn: '1 / -1', padding: '16px', backgroundColor: 'rgba(61,8,8,0.2)', borderRadius: '10px', border: `1px solid ${COLORS.gold.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>Maintenance Mode</div>
              <div style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, marginTop: '2px' }}>Disables student access while maintenance is ongoing</div>
            </div>
            <Toggle enabled={maintenanceMode} onToggle={() => setMaintenanceMode((p) => !p)} activeColor="#F44336" />
          </div>

          <div style={{ gridColumn: '1 / -1', padding: '16px', backgroundColor: 'rgba(61,8,8,0.2)', borderRadius: '10px', border: `1px solid ${COLORS.gold.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>Auto-reject After {APP_CONFIG.AUTO_REJECT_DAYS} Days</div>
              <div style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, marginTop: '2px' }}>Automatically reject device requests pending over {APP_CONFIG.AUTO_REJECT_DAYS} days</div>
            </div>
            <Toggle enabled={autoReject} onToggle={() => setAutoReject((p) => !p)} />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleSave} padding="11px 28px">Save Settings</Button>
        </div>
      </Card>
    </>
  );
}
