import { useEffect, useRef } from "react";

export default function useInfiniteScroll<T>(setSize: (size: number | ((_size: number) => number)) => Promise<T[][] | undefined>) {
  const observerTarget = useRef(null);
  const target = observerTarget.current;


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("intersecting...", entries);
          setSize((s) => s + 1);
        }
      },
      { threshold: 0}
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [target, setSize]);

  return { observerTarget }
}