let isLoading = false;
let isLoaded = false;
let loadPromise: Promise<void> | null = null;

export function loadGoogleMapsScript(): Promise<void> {
  // Return existing promise if already loading
  if (loadPromise) return loadPromise;

  // Return resolved promise if already loaded
  if (isLoaded) return Promise.resolve();

  // Create a new loading promise
  loadPromise = new Promise<void>((resolve, reject) => {
    if (isLoading) return;

    isLoading = true;

    // Check if the script is already in the document
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      isLoaded = true;
      isLoading = false;
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    // Set up callbacks
    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      resolve();
    };

    script.onerror = (error) => {
      isLoading = false;
      loadPromise = null;
      reject(new Error(`Failed to load Google Maps script: ${error}`));
    };

    // Add script to document
    document.head.appendChild(script);
  });

  return loadPromise;
}
