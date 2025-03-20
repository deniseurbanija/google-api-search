"use client";

import { useState, useRef } from "react";
import { useGooglePlacesAutocomplete } from "@/hooks/use-google-places-autocomplete";
import { Search } from "lucide-react";

interface ArgentinaAddressSearchProps {
  onAddressSelect?: (address: {
    fullAddress: string;
    placeId: string;
    components: {
      street?: string;
      streetNumber?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      postalCode?: string;
    };
  }) => void;
  placeholder?: string;
  className?: string;
}

export function ArgentinaAddressSearch({
  onAddressSelect,
  placeholder = "Buscar dirección en Argentina...",
}: ArgentinaAddressSearchProps) {
  const [address, setAddress] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use hook with 'AR' code for Argentina
  const { predictions, fetchPredictions, clearPredictions, loading } =
    useGooglePlacesAutocomplete("AR");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    setSelectedAddress(null);

    if (value.length > 2) {
      fetchPredictions(value);
    } else {
      clearPredictions();
    }
  };

  const parseArgentinaAddress = (
    prediction: google.maps.places.AutocompletePrediction
  ) => {
    // Split the address into its components
    const addressParts = prediction.description
      .split(",")
      .map((part) => part.trim());

    const components = {
      street: addressParts[0]?.split(" ").slice(0, -1).join(" "), // Todo menos el último número
      streetNumber: addressParts[0]?.split(" ").pop(), // El último número
      neighborhood: addressParts[1],
      city: addressParts[2],
      state: addressParts[3],
      postalCode: "", // Se obtendría del place_id si es necesario
    };

    return {
      fullAddress: prediction.description,
      placeId: prediction.place_id,
      components,
    };
  };

  const handleAddressSelect = (
    prediction: google.maps.places.AutocompletePrediction
  ) => {
    setAddress(prediction.description);
    setSelectedAddress(prediction.description);
    clearPredictions();

    if (onAddressSelect) {
      const parsedAddress = parseArgentinaAddress(prediction);
      onAddressSelect(parsedAddress);
    }
  };

  return (
    <div className={"relative w-full"}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={address}
          onChange={handleInputChange}
          className="w-full pr-10"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {predictions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="px-3 py-2 hover:bg-accent cursor-pointer text-sm flex items-center justify-between"
              onClick={() => handleAddressSelect(prediction)}
            >
              <span>{prediction.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
