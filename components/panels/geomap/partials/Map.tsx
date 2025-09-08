"use client";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { Button } from "./ui/button";

import { cn } from "@/lib/utils";
import { useSystems } from "../data";
import { IMapMachine } from "@/services/systemService";

function createImgIcon(url: string) {
  return L.icon({
    iconUrl: url,
    iconSize: [30, 30],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

const machineIcons: Record<string, Record<string, L.Icon>> = {
  server: {
    up: createImgIcon("./icons/server-up.png"),
    down: createImgIcon("./icons/server-down.png"),
    maintenance: createImgIcon("./icons/server-maintenance.png"),
  },
  pc: {
    up: createImgIcon("./icons/pc-up.png"),
    down: createImgIcon("./icons/pc-down.png"),
    maintenance: createImgIcon("./icons/pc-maintenance.png"),
  },
  router: {
    up: createImgIcon("./icons/router-up.png"),
    down: createImgIcon("./icons/router-down.png"),
    maintenance: createImgIcon("./icons/router-maintenance.png"),
  },
  software: {
    up: createImgIcon("./icons/software-up.png"),
    down: createImgIcon("./icons/software-down.png"),
    maintenance: createImgIcon("./icons/software-maintenance.png"),
  },
};

const machineTypes: any = {
  up: "bg-green-600/10 text-green-500",
  down: "bg-red-600/10 text-red-500",
  maintenance: "bg-yellow-600/10 text-yellow-500",
};

export default function Map({
  onSelectMachine,
}: {
  onSelectMachine: (machine: IMapMachine) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const { data: systems, error, isLoading } = useSystems();
  const mapRef = useRef<L.Map | null>(null);

  // Hook sempre chamado
  useEffect(() => {
    setMounted(true);
  }, []);

  // Corrige mapa deformado ao voltar para aba
  useEffect(() => {
    function handleVisibilityChange() {
      if (!document.hidden && mapRef.current) {
        setTimeout(() => {
          mapRef.current?.invalidateSize();
        }, 200);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro!</p>;
  if (!mounted) return null;

  function offsetLatLng(lat: number, lng: number, index: number) {
    const offset = 0.00005;
    const angle = (index * 45 * Math.PI) / 180;
    return [lat + Math.sin(angle) * offset, lng + Math.cos(angle) * offset];
  }

  const positionMap: Record<string, number> = {};

  return (
    <MapContainer
      center={[-8.9186, 13.204]}
      zoom={16}
      style={{ height: "100%", width: "100%" }}
      className="rounded-md"
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />
      {systems?.map((machine: any) => {
        const key = `${machine.lat},${machine.lng}`;
        const index = positionMap[key] ?? 0;
        positionMap[key] = index + 1;

        const [latOffset, lngOffset] = offsetLatLng(
          machine.lat,
          machine.lng,
          index
        );

        return (
          <Marker
            key={machine.id}
            position={[latOffset, lngOffset]}
            icon={
              machineIcons[machine.type]?.[machine.status] ??
              machineIcons.server.up
            }
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
                      machineTypes[machine.status]
                    )}
                  >
                    {machine?.status}
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
                    className="w-full bg-blue-600"
                    size="sm"
                  >
                    Mais informações
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
