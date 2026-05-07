import React, { useState, useEffect } from 'react';
import { Map, MapMarker, MarkerContent, MarkerPopup, MarkerLabel } from '@components/ui/map';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import { PeaksBoard } from '@api/BoardSDK.js';
import { MapPin, Check, Clock } from 'lucide-react';

const PEAK_COORDS = {
  'mt. washington': { lng: -71.3033, lat: 44.2706 },
  'mt. hood': { lng: -121.6959, lat: 45.3735 },
  'mt. baker': { lng: -121.8145, lat: 48.7768 },
  'bolivia': { lng: -68.0322, lat: -16.5000 },
  'aconcagua': { lng: -70.0109, lat: -32.6532 },
  'k2': { lng: 76.5133, lat: 35.8800 },
};

function getCoords(name) {
  const lower = (name || '').toLowerCase();
  for (const [key, coords] of Object.entries(PEAK_COORDS)) {
    if (lower.includes(key)) return coords;
  }
  return null;
}

export default function TrackerMap() {
  const [peaks, setPeaks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPeaks() {
      try {
        const peaksBoard = new PeaksBoard();
        const result = await peaksBoard.items()
          .withColumns(['stage', 'tripDate', 'region', 'mapPin', 'elevationM'])
          .withPagination({ limit: 50 })
          .execute();
        setPeaks(result.items || []);
      } catch (err) {
        console.error('Failed to fetch peaks:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPeaks();
  }, []);

  if (loading) {
    return (
      <section id="tracker-section" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl tracking-wide text-foreground mb-8">
            Where I've Been & Where I'm Headed.
          </h2>
          <Skeleton className="w-full h-[400px] rounded-lg" />
        </div>
      </section>
    );
  }

  const mappedPeaks = peaks.map(p => ({ ...p, coords: getCoords(p.name) })).filter(p => p.coords);

  return (
    <section id="tracker-section" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl tracking-wide text-foreground mb-2">
          Where I've Been & Where I'm Headed.
        </h2>
        <p className="text-muted-foreground mb-8">Tap any pin for trip details and elevation.</p>
        <div className="w-full h-[420px] rounded-lg overflow-hidden border border-border">
          <Map center={[-100, 40]} zoom={2.5} className="h-full w-full">
            {mappedPeaks.map(peak => (
              <PeakPin key={peak.id} peak={peak} />
            ))}
          </Map>
        </div>
      </div>
    </section>
  );
}

function PeakPin({ peak }) {
  const isCompleted = peak.stage === 'Completed';
  const isDream = peak.stage === 'Dream Goal';
  return (
    <MapMarker longitude={peak.coords.lng} latitude={peak.coords.lat}>
      <MarkerContent>
        <div className={`size-6 rounded-full border-2 border-foreground flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110 ${isCompleted ? 'bg-primary' : isDream ? 'bg-muted' : 'bg-secondary'}`}>
          {isCompleted ? <Check className="size-3 text-primary-foreground" /> : <Clock className="size-3 text-muted-foreground" />}
        </div>
        <MarkerLabel position="bottom">
          <span className="text-[10px] text-foreground">{peak.name}</span>
        </MarkerLabel>
      </MarkerContent>
      <MarkerPopup className="w-56 p-0">
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-foreground">{peak.name}</span>
            <Badge variant={isCompleted ? 'default' : 'secondary'} className="text-[10px]">
              {peak.stage || 'Unknown'}
            </Badge>
          </div>
          {peak.elevationM && <p className="text-xs text-muted-foreground">{peak.elevationM}m elevation</p>}
          {peak.tripDate && <p className="text-xs text-muted-foreground">{peak.tripDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>}
          {peak.region && <p className="text-xs text-muted-foreground">{peak.region}</p>}
        </div>
      </MarkerPopup>
    </MapMarker>
  );
}
