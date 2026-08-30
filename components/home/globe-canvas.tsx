"use client";

import * as React from "react";
import * as THREE from "three";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, Geometry } from "geojson";
import worldTopology from "world-atlas/countries-110m.json";
import { markerColor, type GeoOfferCountry } from "@/lib/geo-offers";

interface GlobeCanvasProps {
  countries: GeoOfferCountry[];
  onSelect: (country: GeoOfferCountry | null) => void;
  selected: GeoOfferCountry | null;
  className?: string;
}

// globe.gl ships without TS types for the parts we use, so we load it lazily
// inside useEffect (client-only) and type the instance loosely.
type GlobeInstance = any;

// world-atlas ships a handful of names that don't match our dataset's
// (shorter, more colloquial) country names verbatim - alias just those, so a
// polygon click can look up the matching dataset entry by name.
const COUNTRY_NAME_ALIASES: Record<string, string> = {
  "United States of America": "United States",
};

// Land/country polygons for the "continents and countries must be clearly
// visible" requirement - bundled from the world-atlas npm package (not
// fetched at runtime) so this works offline and needs no connect-src CSP
// exception. Computed once at module load, not per-mount.
const worldCountryFeatures = feature(
  worldTopology as unknown as Topology,
  (worldTopology as unknown as Topology).objects.countries as GeometryCollection
).features as Feature<Geometry, { name: string }>[];

export function GlobeCanvas({ countries, onSelect, selected, className }: GlobeCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const globeRef = React.useRef<GlobeInstance>(null);
  const onSelectRef = React.useRef(onSelect);
  onSelectRef.current = onSelect;
  const countriesRef = React.useRef(countries);
  countriesRef.current = countries;
  const [ready, setReady] = React.useState(false);

  // One-time init: builds the globe instance itself. Data is applied
  // separately below so a later dataset update (e.g. once the live fetch in
  // useGeoOffers() resolves) doesn't require tearing down and rebuilding the
  // whole WebGL scene - just re-feeding pointsData/ringsData.
  React.useEffect(() => {
    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;

    (async () => {
      const GlobeGl = (await import("globe.gl")).default;
      if (disposed || !containerRef.current) return;

      const el = containerRef.current;
      const { clientWidth, clientHeight } = el;

      const world: GlobeInstance = (new GlobeGl(el) as GlobeInstance)
        .width(clientWidth)
        .height(clientHeight)
        .backgroundColor("rgba(0,0,0,0)")
        .showGlobe(true)
        .showAtmosphere(true)
        .atmosphereColor("#F5F5F7")
        .atmosphereAltitude(0.18)
        .showGraticules(false)
        // Country/continent landmasses - the primary "which countries are
        // covered" wayfinding layer, drawn as flat-shaded silhouettes rather
        // than a photo texture so it stays a stylized data globe, not a
        // stock-earth image.
        .polygonsData(worldCountryFeatures)
        .polygonCapColor(() => "rgba(255,255,255,0.14)")
        .polygonSideColor(() => "rgba(255,255,255,0.03)")
        .polygonStrokeColor(() => "rgba(255,255,255,0.35)")
        .polygonAltitude(0.005)
        .onPolygonClick((f: Feature<Geometry, { name: string }>) => {
          const worldName = f.properties?.name;
          const datasetName = worldName ? (COUNTRY_NAME_ALIASES[worldName] ?? worldName) : undefined;
          const match = countriesRef.current.find((c) => c.name === datasetName);
          if (match) {
            world.controls().autoRotate = false;
            onSelectRef.current(match);
          }
        })
        .pointLat((d: GeoOfferCountry) => d.lat)
        .pointLng((d: GeoOfferCountry) => d.lng)
        .pointColor((d: GeoOfferCountry) => markerColor(d))
        .pointAltitude(0.012)
        .pointRadius((d: GeoOfferCountry) => 0.35 + Math.min(d.activeOffers / 220, 1) * 0.9)
        .pointLabel(
          (d: GeoOfferCountry) =>
            `<div style="font-family:var(--font-sans,sans-serif);font-size:12px;line-height:1.4">
               <strong>${d.name}</strong> | ${d.activeOffers} active deals
             </div>`
        )
        // Persistent text labels physically rendered at each node (distinct
        // from pointLabel above, which is only the hover/click tooltip).
        // labelDotRadius is 0 because the colored dot is already drawn by
        // the pointsData layer - this layer is text-only.
        .labelsData(countries)
        .labelLat((d: GeoOfferCountry) => d.lat)
        .labelLng((d: GeoOfferCountry) => d.lng)
        .labelText((d: GeoOfferCountry) => d.name)
        .labelSize(0.55)
        .labelDotRadius(0)
        .labelColor(() => "rgba(255, 255, 255, 0.85)")
        .labelResolution(2)
        .labelAltitude(0.014)
        .ringLat((d: GeoOfferCountry) => d.lat)
        .ringLng((d: GeoOfferCountry) => d.lng)
        .ringColor(() => (t: number) => `rgba(245,245,247,${1 - t})`)
        .ringMaxRadius(3.2)
        .ringPropagationSpeed(1.6)
        .ringRepeatPeriod(2200)
        .onPointClick((d: GeoOfferCountry) => {
          world.controls().autoRotate = false;
          onSelectRef.current(d);
        })
        .onGlobeClick(() => onSelectRef.current(null));

      // Style the base sphere as brushed near-black rather than a photo
      // texture - this is the "signature" look: a live network-ops globe,
      // not a stock earth, and it matches the site's true-black theme.
      const globeMaterial = world.globeMaterial() as THREE.MeshPhongMaterial;
      globeMaterial.color = new THREE.Color("#000000");
      globeMaterial.emissive = new THREE.Color("#8E8E93");
      globeMaterial.emissiveIntensity = 0.05;
      globeMaterial.shininess = 12;

      const controls = world.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = true;
      controls.minDistance = 180;
      controls.maxDistance = 520;

      world.pointOfView({ altitude: 2.2 }, 0);

      resizeObserver = new ResizeObserver(() => {
        if (!el) return;
        world.width(el.clientWidth);
        world.height(el.clientHeight);
      });
      resizeObserver.observe(el);

      globeRef.current = world;
      setReady(true);
    })();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      if (globeRef.current && containerRef.current) {
        // globe.gl doesn't expose a formal destroy(); clearing the container's
        // DOM/WebGL context on unmount avoids leaking canvases between routes.
        containerRef.current.innerHTML = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Feed data separately from init - this is the seam that makes the widget
  // "dynamic data object" driven rather than hardcoded: whenever `countries`
  // changes (e.g. a live fetch resolves, or later a webhook pushes an
  // update through useGeoOffers()), the already-running globe just gets new
  // points/rings, no re-render of the WebGL context needed.
  React.useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointsData(countries);
    globeRef.current.ringsData(countries.filter((c) => c.tier === "primary"));
    globeRef.current.labelsData(countries);
  }, [countries, ready]);

  // Pause auto-rotation while a marker is selected so the info panel content stays put.
  React.useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = !selected;
    }
  }, [selected]);

  return (
    <div className={className}>
      <div ref={containerRef} className="h-full w-full" aria-hidden={!ready} />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-40 w-40 animate-pulse-slow rounded-full border border-accent-silver/20 bg-accent-silver/5" />
        </div>
      )}
    </div>
  );
}
