import React from "react";
import clsx from "clsx";

interface StaticGMapProps {
  lat: number;
  lng: number;
  className?: string;
}

const StaticGMap: React.FC<StaticGMapProps> = ({ lat, lng, className }) => {
  const hasCoords = lat != null && lng != null;

  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  return (
    <div
      className={clsx(
        "relative w-full h-full overflow-hidden rounded-lg",
        "border border-[var(--gp-border)] bg-[var(--gp-surface)]",
        className
      )}
    >
      {!hasCoords ? (
        <div className="flex items-center justify-center h-full text-[var(--gp-text-muted)] text-sm">
          No Location Available
        </div>
      ) : (
        <iframe
          title="Google Map"
          src={mapUrl}
          allowFullScreen
          loading="lazy"
          className="w-full h-full border-none"
        />
      )}
    </div>
  );
};

export default StaticGMap;