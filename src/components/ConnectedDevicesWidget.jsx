import { SectionHeading } from './ui';
import Card from './Card';
import DeviceRow from './admin/DeviceRow';
import { MOCK_CONNECTED_DEVICES } from '../data/mockData';

export default function ConnectedDevicesWidget() {
  return (
    <Card>
      <SectionHeading>Connected Devices</SectionHeading>
      {MOCK_CONNECTED_DEVICES.map((device, idx) => (
        <DeviceRow 
          key={device.name} 
          {...device} 
          isLast={idx === MOCK_CONNECTED_DEVICES.length - 1} 
        />
      ))}
    </Card>
  );
}
