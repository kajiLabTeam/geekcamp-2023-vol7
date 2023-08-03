import { useEffect, useRef, useState } from "react";

type Size = {
  width: number,
  height: number
};

export default function useDomSize<T extends HTMLElement>(waitTime: number = 100) {
  const [size, setSize] = useState<Size | null>(null);

  const domRef = useRef<T>(null!);
  const flagRef = useRef<Symbol | null>(null);
  const resizeObserverRef = useRef(
    new ResizeObserver(([dom]) => {
      const currentFlag = Symbol();
      flagRef.current = currentFlag;
      setTimeout(() => {
        if (flagRef.current === currentFlag) {
          setSize({ width: dom.contentRect.width, height: dom.contentRect.height });
        }
      }, waitTime);
    })
  );

  useEffect(() => {
    resizeObserverRef.current.observe(domRef.current);

    return () => resizeObserverRef.current.disconnect();
  }, []);

  return [domRef, size] as const;
}
