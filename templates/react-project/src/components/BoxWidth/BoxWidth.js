import React, {
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import ResizeObserver from 'resize-observer-polyfill';
import Context from './Context';

const BoxWidth = React.memo(({
  children,
  onChange,
  className,
  style = {},
  width,
  ...props
}) => {
  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(width);

  useLayoutEffect(() => {
    if (width != null) {
      return () => {};
    }
    let animationFrameID = null;
    const observer = new ResizeObserver((entries) => {
      const newContainerWidth = entries[0].contentRect.width;
      animationFrameID = window.requestAnimationFrame(() => {
        if (newContainerWidth !== containerWidth) {
          setContainerWidth(newContainerWidth);
        }
      });
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  if (containerWidth == null) {
    return (
      <Context.Provider
        value={0}
      >
        <div
          ref={containerRef}
          className={className}
          style={style}
        >
          &nbsp;
        </div>
      </Context.Provider>
    );
  }

  return (
    <Context.Provider
      value={containerWidth}
    >
      <div
        ref={containerRef}
        className={className}
        style={width != null ? {
          ...style,
          width,
        } : style}
        {...props}
      >
        {children}
      </div>
    </Context.Provider>
  );
});

BoxWidth.propTypes = {
  width: PropTypes.number,
  onChange: PropTypes.func,
  style: stylePropType,
  className: PropTypes.string,
  children: PropTypes.any, // eslint-disable-line
};

export default BoxWidth;
