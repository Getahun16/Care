"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Location data ────────────────────────────────────────────────────────────

type SiteType = "farm" | "lab" | "processing" | "partner";

interface ProjectSite {
  id: string;
  name: string;
  type: SiteType;
  lat: number;
  lng: number;
  description: string;
  country: string;
}

const projectSites: ProjectSite[] = [
  {
    id: "yirgacheffe",
    name: "Yirgacheffe Coffee Zone",
    type: "farm",
    lat: 6.15,
    lng: 38.2,
    description: "Primary field site. Pilot composting and circular processing trials with Yirgacheffe Cooperative.",
    country: "Ethiopia",
  },
  {
    id: "kaffa",
    name: "Kaffa Zone – Biochar Trials",
    type: "farm",
    lat: 7.33,
    lng: 36.0,
    description: "18-month longitudinal biochar/compost soil fertility trial across smallholder farms.",
    country: "Ethiopia",
  },
  {
    id: "jimma",
    name: "Jimma University Research Station",
    type: "lab",
    lat: 7.67,
    lng: 36.83,
    description: "Soil analysis laboratory partner. Coffee husk biochar characterization and soil microbiome studies.",
    country: "Ethiopia",
  },
  {
    id: "sidama",
    name: "Sidama Zone – Socio-Economic Study",
    type: "processing",
    lat: 6.83,
    lng: 38.42,
    description: "Gender & income impact survey site. Cooperative integration for circular practices at washing stations.",
    country: "Ethiopia",
  },
  {
    id: "aau",
    name: "Addis Ababa University (AAU)",
    type: "lab",
    lat: 9.045,
    lng: 38.763,
    description: "South partner institution. Leads WP3, WP4. Environmental engineering and socio-economic research.",
    country: "Ethiopia",
  },
  {
    id: "antwerp",
    name: "University of Antwerp",
    type: "partner",
    lat: 51.22,
    lng: 4.4,
    description: "North partner and project coordinator. Circular bioeconomy expertise and VLIR-UOS programme lead.",
    country: "Belgium",
  },
];

// ── Icon factory ─────────────────────────────────────────────────────────────

const COLOR_MAP: Record<SiteType, string> = {
  farm: "#4ade80",       // leaf green
  lab: "#60a5fa",        // blue
  processing: "#fb923c", // orange
  partner: "#c084fc",    // purple
};

const LABEL_MAP: Record<SiteType, string> = {
  farm: "☕ Farm / Field Site",
  lab: "🔬 Research Lab",
  processing: "⚙️ Processing Station",
  partner: "🏛 Partner University",
};

function makeIcon(type: SiteType) {
  const color = COLOR_MAP[type];
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26S32 27 32 16C32 7.163 24.837 0 16 0z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `);
  return L.icon({
    iconUrl: `data:image/svg+xml,${svg}`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
  });
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ProjectMap() {
  useEffect(() => {
    // Fix default icon URLs broken by webpack
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {(Object.keys(LABEL_MAP) as SiteType[]).map((type) => (
          <div key={type} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: COLOR_MAP[type] }}
            />
            {LABEL_MAP[type]}
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-border shadow-card" style={{ height: 480 }}>
        <MapContainer
          center={[8.5, 38.5]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          scrollWheelZoom={false}
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {projectSites.map((site) => (
            <Marker key={site.id} position={[site.lat, site.lng]} icon={makeIcon(site.type)}>
              <Popup maxWidth={260}>
                <div className="py-1">
                  <p className="font-semibold text-sm mb-1">{site.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{LABEL_MAP[site.type]} · {site.country}</p>
                  <p className="text-xs leading-relaxed">{site.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
