import React, {
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import Context from './Context';

const Size = React.memo(({
  children,
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
      if (newContainerWidth !== containerWidth || newContainerHeight !== containerHeight) {
        animationFrameID = window.requestAnimationFrame(() => {
          setContainerWidth(newContainerWidth);
          setContainerHeight(newContainerHeight);
        });
      }
    });
    observer.observe(container.current);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  if (!containerWidth) {
    return (
      <div
        ref={container}
      >
        &nbsp;
      </div>
    );
  }

  return (
    <Context.Provider
      value={{
        containerWidth,
        containerHeight,
      }}
    >
      <div
        ref={container}
      >
        {React.cloneElement(children, props)}
      </div>
    </Context.Provider>
  );
});

Size.propTypes = {
  children: PropTypes.any, // eslint-disable-line
};

export default Size;
