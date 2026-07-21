import { Routes, Route, Navigate } from 'react-router-dom';
import WifiRegistrationLayout from './WifiRegistrationLayout';
import DeviceInfoStep from './DeviceInfoStep';
import VoucherStep from './VoucherStep';
import VerifyStep from './VerifyStep';
import ConnectedStep from './ConnectedStep';

export default function WifiRegistration({ onNavigate, onLogout, userName, userRole }) {
  return (
    <Routes>
      <Route
        element={
          <WifiRegistrationLayout
            onNavigate={onNavigate}
            onLogout={onLogout}
            userName={userName}
            userRole={userRole}
          />
        }
      >
        <Route index element={<Navigate to="deviceinfo" replace />} />
        <Route path="deviceinfo" element={<DeviceInfoStep />} />
        <Route path="voucher" element={<VoucherStep />} />
        <Route path="verify" element={<VerifyStep />} />
        <Route path="connected" element={<ConnectedStep />} />
        <Route path="*" element={<Navigate to="deviceinfo" replace />} />
      </Route>
    </Routes>
  );
}