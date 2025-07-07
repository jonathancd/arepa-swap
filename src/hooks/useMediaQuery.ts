import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);

    media.addEventListener("change", onChange);
    setMatches(media.matches);

    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
