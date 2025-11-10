// Device List Component (Combines Table and Cards)
import React from "react";
import type { VehicleDevice } from "../types/device";
import { DeviceTable } from "./DeviceTable";
import { DeviceCard } from "./DeviceCard";

interface DeviceListProps {
  devices: VehicleDevice[];
  loading?: boolean;
}

export const DeviceList: React.FC<DeviceListProps> = ({ devices, loading = false }) => (
  <>
    <DeviceTable devices={devices} loading={loading} />
    <div className="md:hidden divide-y divide-gray-200">
      {devices.map(device => <DeviceCard key={device.id} device={device} />)}
    </div>
  </>
);

