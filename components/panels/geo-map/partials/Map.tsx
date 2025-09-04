"use client";

import { useEffect, useState, useContext, useRef } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ReactDOMServer from "react-dom/server";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { Button } from "./ui/button";
import ErrorMachineIcon from "./icons/error";
import ActiveMachineIcon from "./icons/active";
import MaintenanceMachineIcon from "./icons/maintenance";

import { cn } from "@/lib/utils";
import { IMapMachine, IMapMachineStatus } from "..";

interface MachineStateIcon {
  active: L.DivIcon;
  inactive: L.DivIcon;
  maintenance: L.DivIcon;
}

const machines: IMapMachine[] = [
  {
    id: 1,
    name: "Servidor DNS",
    status: {
      id: "active",
      label: "Activo",
    },
    type: "Server",
    connection_type: "HTTPS",
    lat: -8.9186,
    lng: 13.204, // Talatona Shopping
    lastCheck: "2025-09-02T12:30:00Z",

    // new fields
    check_interval: "5m",
    owner_user_id: "user-123",
    company_id: "company-456",
    target: "192.168.0.10",
    sla_target: 99.9,
    criticality_level: "high",
    created_at: "2025-01-15T08:00:00Z",
    updated_at: "2025-09-02T12:31:00Z",
  },
  {
    id: 2,
    name: "Router Principal",
    status: {
      id: "maintenance",
      label: "Manutenção",
    },
    type: "Router",
    connection_type: "PING",
    lat: -8.9189,
    lng: 13.1965, // Belas Business Park
    lastCheck: "2025-09-02T09:15:00Z",

    // new fields
    check_interval: "10m",
    owner_user_id: "user-789",
    company_id: "company-456",
    target: "192.168.0.20",
    sla_target: 98.5,
    criticality_level: "medium",
    created_at: "2025-02-01T10:15:00Z",
    updated_at: "2025-09-02T09:16:00Z",
  },
  {
    id: 3,
    name: "Sensor de Luz",
    status: {
      id: "inactive",
      label: "Inactivo",
    },
    type: "Sensor",
    connection_type: "SNMP",
    lat: -8.9305,
    lng: 13.2101, // Kilamba Kiaxi area
    lastCheck: "2025-09-01T21:45:00Z",

    // new fields
    check_interval: "30m",
    owner_user_id: "user-555",
    company_id: "company-789",
    target: "192.168.0.30",
    sla_target: 95.0,
    criticality_level: "low",
    created_at: "2025-03-10T14:00:00Z",
    updated_at: "2025-09-01T21:46:00Z",
  },
];

const machineStateIcons: MachineStateIcon = {
  active: L.divIcon({
    html: ReactDOMServer.renderToString(<ActiveMachineIcon />),
    className: "",
    iconSize: [22, 22],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  inactive: L.divIcon({
    html: ReactDOMServer.renderToString(<ErrorMachineIcon />),
    className: "",
    iconSize: [22, 22],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  maintenance: L.divIcon({
    html: ReactDOMServer.renderToString(<MaintenanceMachineIcon />),
    className: "",
    iconSize: [22, 22],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
};

const machineTypes: IMapMachineStatus = {
  active: "bg-green-600/10 text-green-500",
  inactive: "bg-red-600/10 text-red-500",
  maintenance: "bg-yellow-600/10 text-yellow-500",
};

export default function Map({
  onSelectMachine,
}: {
  onSelectMachine: (machine: IMapMachine) => void;
}) {
  const mapKey = useRef("map-container-fabio");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <MapContainer
        key={typeof window !== "undefined" ? "map-" + Date.now() : "map-ssr"}
        center={[-8.9186, 13.204]}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {machines.map((machine) => (
          <Marker
            key={machine.id}
            position={[machine.lat, machine.lng]}
            icon={machineStateIcons[machine.status.id]}
          >
            <Popup>
              <div className="flex w-64 flex-col rounded-xl bg-white shadow-md ring-1 ring-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <h1 className="text-sm font-semibold text-gray-800">
                    {machine.name}
                  </h1>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      machineTypes[machine.status.id]
                    )}
                  >
                    {machine.status.label}
                  </span>
                </div>

                {/* Body */}
                <div className="space-y-2 px-3 py-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Tipo:</span>
                    <span>{machine.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Conexão:</span>
                    <span>{machine.connection_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Última verificação:
                    </span>
                    <span className="truncate">
                      {new Date(machine.lastCheck).toLocaleString("pt-PT")}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t px-3 py-2">
                  <Button
                    onClick={() => onSelectMachine(machine)}
                    className="w-full"
                    size="sm"
                  >
                    Mais informações
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
