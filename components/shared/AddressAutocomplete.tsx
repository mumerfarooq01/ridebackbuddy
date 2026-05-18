"use client";

import { useEffect, useRef, useCallback } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

interface Props {
  value: string;
  onSelect: (address: string, lat: number, lng: number) => void;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

let initDone = false;

async function initMaps() {
  if (!initDone) {
    setOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      v: "weekly",
    });
    initDone = true;
  }
  return importLibrary("places");
}

export default function AddressAutocomplete({
  value,
  onSelect,
  onChange,
  placeholder,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  // Always keep a ref to the latest onSelect so the stale listener closure
  // calls the current version instead of the one from the first render.
  const onSelectRef = useRef(onSelect);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.formatted_address && place.geometry?.location) {
      onSelectRef.current(
        place.formatted_address,
        place.geometry.location.lat(),
        place.geometry.location.lng(),
      );
    }
  }, []);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) return;

    initMaps().then(({ Autocomplete }) => {
      if (!inputRef.current || autocompleteRef.current) return;

      autocompleteRef.current = new Autocomplete(inputRef.current, {
        componentRestrictions: { country: "ca" },
        fields: ["formatted_address", "geometry"],
        types: ["address"],
      });

      autocompleteRef.current.addListener("place_changed", handlePlaceChanged);
    });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [handlePlaceChanged]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      autoComplete="off"
    />
  );
}
