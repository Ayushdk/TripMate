"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface Place {
  display_name: string;
  lat: string;
  lon: string;
}

interface OSMAutocompleteProps {
  onPlaceSelected: (place: Place) => void;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function OSMAutocomplete({
  onPlaceSelected,
  placeholder = "Search destination...",
  value = "",
  onChange,
  className = ""
}: OSMAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Place[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skipSearch, setSkipSearch] = useState(false); 
  const [selected, setSelected] = useState(false); // ✅ track if a place is selected
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Fetch places
  useEffect(() => {
    if (skipSearch) {
      setSkipSearch(false);
      return;
    }

    if (query.length < 3 || selected) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const controller = new AbortController();
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&addressdetails=1&limit=5`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults(data || []);
        setShowDropdown(true);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error("OSM API error:", err);
        }
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 400);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [query, skipSearch, selected]);

  // Handle selection
  const handleSelect = useCallback(
    (place: Place) => {
      const parts = place.display_name.split(",");
      const shortName =
        parts.length > 1
          ? `${parts[0]}, ${parts[parts.length - 1]}`.trim()
          : parts[0];

      setQuery(shortName);
      setShowDropdown(false);
      setResults([]);
      setSkipSearch(true);
      setSelected(true); // ✅ lock dropdown until input changes

      onChange?.(shortName);
      onPlaceSelected(place);
    },
    [onChange, onPlaceSelected]
  );

  // Reset selected if user edits text
  const handleInputChange = (val: string) => {
    setQuery(val);
    setSelected(false); // ✅ allow dropdown again
    onChange?.(val);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() =>
          query.length >= 3 && results.length > 0 && !selected && setShowDropdown(true)
        }
        placeholder={placeholder}
        className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />

      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      )}

      {showDropdown && results.length > 0 && (
        <ul className="absolute w-full bg-background border border-border rounded-lg mt-1 max-h-60 overflow-y-auto z-50 shadow-lg">
          {results.map((place, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(place)}
              className="p-3 cursor-pointer hover:bg-muted border-b border-border last:border-b-0 transition-colors"
            >
              <div className="text-sm font-medium text-foreground">
                {place.display_name.split(",")[0]}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {place.display_name.split(",").slice(1).join(",").trim()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
