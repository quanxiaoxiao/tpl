import React, {
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import ResizeObserver from 'resize-observer-polyfill';
import Context from './Context';

const Box = React.memo(({
  children,
  className,
  style,
  ...props
}) => {
  const container = useRef();
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useLayoutEffect(() => {
    let animationFrameID = null;
    const observer = new ResizeObserver((entries) => {
      const newContainerWidth = entries[0].contentRect.width;
      const newContainerHeight = entries[0].contentRect.height;
      animationFrameID = window.requestAnimationFrame(() => {
        if (newContainerWidth !== containerWidth || newContainerHeight !== containerHeight) {
          setContainerWidth(newContainerWidth);
          setContainerHeight(newContainerHeight);
        }
      });
    });
    observer.observe(container.current);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  return (
    <Context.Provider
      value={{
        containerWidth,
        containerHeight,
      }}
    >
      <div
        ref={container}
        style={style}
        className={className}
        {...props}
      >
        {children}
      </div>
    </Context.Provider>
  );
});

Box.propTypes = {
  className: PropTypes.string,
  style: stylePropType,
  children: PropTypes.any, // eslint-disable-line
};

export default Box;
