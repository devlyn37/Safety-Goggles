import { useState, useEffect } from "react";

export default function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  let options = {
    threshold: 0.01,
  };

  const observer = new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting),
    options
  );

  useEffect(() => {
    observer.observe(ref.current);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
}
