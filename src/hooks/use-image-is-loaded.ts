import { useEffect, useState } from "react";

export function useImageIsLoaded(src?: string | null) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!src) {
      setIsLoaded(false);
      return;
    }

    let isMounted = true;
    const image = new window.Image();

    const createStatusHandler = (status: boolean) => () => {
      if (isMounted) setIsLoaded(status);
    };

    setIsLoaded(false);
    image.onload = createStatusHandler(true);
    image.onerror = createStatusHandler(false);
    image.src = src;

    return () => {
      isMounted = false;
    };
  }, [src]);

  return isLoaded;
}
