import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockParcelsGeoJSON } from '../../data/mockParcelsGeoJSON';
import { Layers, Search, CheckCircle, AlertTriangle, XCircle, Compass, Eye } from 'lucide-react';

// Fix standard Leaflet icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function CadastralMap({ 
  selectedParcelId, 
  onParcelSelect = () => {},
  height = "560px",
  showControls = true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBaseMap, setActiveBaseMap] = useState("streets");

  // Center on Bally, Howrah
  const centerCoord = [22.6505, 288.3450 > 100 ? 88.3450 : 88.3450]; // [22.6505, 88.3450]

  const getStyleForFeature = (feature) => {
    const isSelected = selectedParcelId === feature.properties.parcelId;
    const status = feature.properties.status;

    let fillColor = "#10b981"; // Validated (green)
    let strokeColor = "#059669";

    if (status === "Needs Review") {
      fillColor = "var(--color-warning)"; // Amber
      strokeColor = "var(--color-saffron)";
    } else if (status === "Issue Detected" || status === "Rejected") {
      fillColor = "#f43f5e"; // Red
      strokeColor = "#e11d48";
    } else if (status === "Processing") {
      fillColor = "#0ea5e9"; // Blue
      strokeColor = "#0284c7";
    }

    if (isSelected) {
      return {
        fillColor: "#3b82f6",
        weight: 3.5,
        opacity: 1,
        color: "#1d4ed8",
        dashArray: "",
        fillOpacity: 0.65
      };
    }

    return {
      fillColor: fillColor,
      weight: 1.5,
      opacity: 0.9,
      color: strokeColor,
      dashArray: "",
      fillOpacity: 0.4
    };
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [22.6505, 88.3450],
        zoom: 16,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile layer: CartoDB Positron for clean SaaS look
      const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Render GeoJSON
    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    const filteredFeatures = mockParcelsGeoJSON.features.filter(f => {
      const matchStatus = filterStatus === "all" || f.properties.status.toLowerCase().includes(filterStatus.toLowerCase());
      const matchQuery = !searchQuery || 
        f.properties.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.properties.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.properties.parcelId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });

    const geoJsonData = {
      type: "FeatureCollection",
      features: filteredFeatures
    };

    geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
      style: getStyleForFeature,
      onEachFeature: (feature, layer) => {
        // Label tooltip
        layer.bindTooltip(
          `<strong>Plot ${feature.properties.surveyNumber}</strong><br/>${feature.properties.owner} (${feature.properties.area})`,
          { permanent: false, direction: "top", className: "cadastral-tooltip" }
        );

        // Click handler
        layer.on({
          click: () => {
            onParcelSelect(feature.properties);
          },
          mouseover: (e) => {
            const target = e.target;
            target.setStyle({
              weight: 3,
              fillOpacity: 0.65
            });
          },
          mouseout: (e) => {
            geoJsonLayerRef.current.resetStyle(e.target);
          }
        });
      }
    }).addTo(map);

    // If selectedParcelId, fly to that parcel
    if (selectedParcelId) {
      const selectedFeature = mockParcelsGeoJSON.features.find(f => f.properties.parcelId === selectedParcelId);
      if (selectedFeature) {
        const bounds = L.geoJSON(selectedFeature).getBounds();
        map.flyToBounds(bounds, { maxZoom: 17, padding: [40, 40] });
      }
    }

    return () => {
      // cleanup is handled on unmount
    };
  }, [selectedParcelId, filterStatus, searchQuery]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-card bg-slate-100 flex flex-col">
      {/* Map Top Filter Bar */}
      {showControls && (
        <div className="p-3 bg-white/90 backdrop-blur-sm border-b border-slate-200 z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search survey #, owner, or parcel ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">All Validation States</option>
              <option value="validated">✓ Validated Parcels</option>
              <option value="review">⚠ Needs Review</option>
              <option value="issue">✕ Issues Detected</option>
            </select>

            <button
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setView([22.6505, 88.3450], 16);
                }
              }}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Reset View"
            >
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Map</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Viewport Container */}
      <div 
        ref={mapContainerRef} 
        style={{ height }} 
        className="w-full relative z-0" 
      />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-elevated text-xs space-y-1.5">
        <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          Cadastral Parcel Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block border border-emerald-600"></span>
          <span className="text-slate-700 font-medium">Green = Validated (Match)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block border border-amber-600"></span>
          <span className="text-slate-700 font-medium">Amber = Needs Review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block border border-rose-600"></span>
          <span className="text-slate-700 font-medium">Red = Issue / Mismatch</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block border border-blue-600"></span>
          <span className="text-slate-700 font-medium">Blue = Selected Parcel</span>
        </div>
      </div>
    </div>
  );
}
