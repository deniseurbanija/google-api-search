"use client";

import { useState, useEffect, useCallback } from "react";
import { loadGoogleMapsScript } from "@/lib/google-maps";
import { debounce } from "lodash";

export function useGooglePlacesAutocomplete(countryCode = "") {
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken | null>(null);

  // Load the Google Maps script and initialize the autocomplete service
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        await loadGoogleMapsScript();

        if (
          isMounted &&
          window.google &&
          window.google.maps &&
          window.google.maps.places
        ) {
          const service = new window.google.maps.places.AutocompleteService();
          const token =
            new window.google.maps.places.AutocompleteSessionToken();

          setAutocompleteService(service);
          setSessionToken(token);
        }
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  // Function to fetch predictions based on input
  const debouncedFetchPredictions = useCallback(
    debounce(async (input: string) => {
      if (!autocompleteService || !sessionToken || input.length < 3) {
        return;
      }

      setLoading(true);

      try {
        const request: google.maps.places.AutocompletionRequest = {
          input,
          sessionToken,
          types: ["address"],
        };

        // Add country restriction if a country code is provided
        if (countryCode) {
          request.componentRestrictions = {
            country: countryCode.toLowerCase(),
          };
        }

        autocompleteService.getPlacePredictions(
          request,
          (
            results: google.maps.places.AutocompletePrediction[] | null,
            status: google.maps.places.PlacesServiceStatus
          ) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results
            ) {
              setPredictions(results);
            } else {
              setPredictions([]);
            }
            setLoading(false);
          }
        );
      } catch (error) {
        console.error("Error fetching predictions:", error);
        setPredictions([]);
        setLoading(false);
      }
    }, 300),
    [autocompleteService, sessionToken, countryCode]
  );

  // Function to clear predictions
  const clearPredictions = useCallback(() => {
    setPredictions([]);
  }, []);

  return {
    predictions,
    loading,
    fetchPredictions: debouncedFetchPredictions,
    clearPredictions,
  };
}
