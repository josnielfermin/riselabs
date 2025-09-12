import { useState, useEffect } from "react";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // prefer addEventListener if available
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", listener as EventListener);
    } else {
      mediaQuery.addListener(listener as any);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", listener as EventListener);
      } else {
        mediaQuery.removeListener(listener as any);
      }
    };
  }, [query]);

  return matches;
}
export default useMediaQuery;
