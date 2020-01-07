import { useMemo } from 'react';

const useRect = (containerWidth, containerHeight, margin) => {
  const marginTop = margin && margin.top ? margin.top : 0;
  const marginLeft = margin && margin.left ? margin.left : 0;
  const marginRight = margin && margin.right ? margin.right : 0;
  const marginBottom = margin && margin.bottom ? margin.bottom : 0;

  const clientRect = useMemo(() => ({
    margin: {
      top: marginTop,
      left: marginLeft,
      right: marginRight,
      bottom: marginBottom,
    },
    width: Math.max(containerWidth - marginLeft - marginRight, 0),
    height: Math.max(containerHeight - marginTop - marginBottom, 0),
  }), [
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    containerWidth,
    containerHeight,
  ]);

  return clientRect;
};

export default useRect;
