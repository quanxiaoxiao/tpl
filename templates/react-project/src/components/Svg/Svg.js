import React, {
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

const Svg = React.memo(({
  children,
  margin,
  position,
}) => {
  const container = useRef();
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentRect, setContentRect] = useState();

  useLayoutEffect(() => {
    let animationFrameID = null;
    const observer = new ResizeObserver((entries) => {
      if (!contentRect
        || ['top', 'left', 'right', 'bottom', 'width', 'height']
          .some((name) => entries[0].contentRect[name] !== contentRect[name])) {
        animationFrameID = window.requestAnimationFrame(() => {
          setContentRect(entries[0].contentRect);
          setContainerWidth(entries[0].contentRect.width);
          setContainerHeight(entries[0].contentRect.height);
        });
      }
    });

    observer.observe(container.current);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  const style = useMemo(() => {
    const defaultMargin = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
    if (!margin || !containerWidth || !containerHeight) {
      return {
        width: containerWidth,
        height: containerHeight,
        margin: {
          ...defaultMargin,
        },
      };
    }
    const newMargin = {
      ...defaultMargin,
      ...margin,
    };
    const width = containerWidth - newMargin.left - newMargin.right;
    const height = containerHeight - newMargin.top - newMargin.bottom;
    return {
      width,
      height,
      margin: newMargin,
    };
  }, [containerWidth, containerHeight, margin]);

  const transform = useMemo(() => {
    if (position === 'center') {
      return `translate(${containerWidth / 2}, ${containerHeight / 2})`;
    }
    return `translate(${style.margin.left}, ${style.margin.top})`;
  }, [style, position, containerWidth, containerHeight]);


  if (!containerWidth) {
    return (
      <div
        ref={container}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    );
  }


  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
      ref={container}
    >
      <svg
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        <g
          transform={transform}
        >
          {children({
            ...style,
            contentRect,
          })}
        </g>
      </svg>
    </div>
  );
});

Svg.propTypes = {
  children: PropTypes.func.isRequired,
  position: PropTypes.oneOf(['center', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight']),
  margin: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number,
    left: PropTypes.number,
  }),
};

export default Svg;
