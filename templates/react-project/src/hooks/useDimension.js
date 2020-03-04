import { useLayoutEffect, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const getSize = (elem) => {
  if (!elem) {
    return {
      width: 0,
      height: 0,
    };
  }
  return {
    width: elem.offsetWidth,
    height: elem.offsetHeight,
  };
};

const useDimension = (ref) => {
  const [dimension, setDimension] = useState(getSize(ref.current));

  useLayoutEffect(() => {
    if (!ref.current) {
      return () => {};
    }
    let animationFrameID = null;
    const observer = new ResizeObserver((entries) => {
      const { contentRect } = entries[0];
      const { width: nextWidth, height: nextHeight } = contentRect;
      animationFrameID = window.requestAnimationFrame(() => {
        if (dimension.width !== nextWidth
          || dimension.height !== nextHeight) {
          setDimension({
            width: nextWidth,
            height: nextHeight,
          });
        }
      });
    });
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  return dimension;
};

export default useDimension;
