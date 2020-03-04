import React, {
  useLayoutEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useScroll } from 'components/ContentScroll';

const Content = React.memo(({
  onChangeHeight,
  ...other
}) => {
  const { scrollTop, scrollHeight } = useScroll();
  const container = useRef();

  useLayoutEffect(() => {
    let animationFrameID = null;
    const observer = new ResizeObserver((entries) => {
      const newScrollHeight = entries[0].contentRect.height;
      animationFrameID = window.requestAnimationFrame(() => {
        if (newScrollHeight !== scrollHeight) {
          onChangeHeight(newScrollHeight);
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
    <div
      ref={container}
      style={{
        transform: `translateY(-${scrollTop}px)`,
      }}
      {...other}
    />
  );
});

Content.propTypes = {
  onChangeHeight: PropTypes.func.isRequired,
};

export default Content;
