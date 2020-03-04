/* eslint jsx-a11y/no-noninteractive-tabindex: 0 */
/* eslint no-param-reassign: 0 */
/** @jsx jsx */
import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import { jsx, css } from '@emotion/core';
import ResizeObserver from 'resize-observer-polyfill';
import stylePropType from 'react-style-proptype';
import _ from 'lodash';
import Context from './Context';

const performanceNow = () => window.performance.now();
const ANIMATION_TIME = 240;
const PIXEL_STEP = 10;

const ContentScroll = React.memo(({
  scrollHeight,
  onScroll,
  children,
  height = 0,
  style = {},
  ...other
}) => {
  const [clientHeight, setClientHeight] = useState(height);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrolling, setScroll] = useState(false);
  const containerRef = useRef();
  const animationStartSaved = useRef();
  const animationEndSaved = useRef();
  const animateFrameSaved = useRef();
  const scrollTopStartSaved = useRef();
  const scrollTopTargetSaved = useRef();

  useLayoutEffect(() => {
    if (height > 0) {
      return () => {};
    }
    let animationFrameID = null;
    const observer = new ResizeObserver((entries) => {
      const newClientHeight = entries[0].contentRect.height;
      animationFrameID = window.requestAnimationFrame(() => {
        if (newClientHeight !== clientHeight) {
          setClientHeight(newClientHeight);
        }
      });
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  useEffect(() => {
    if (clientHeight >= scrollHeight) {
      if (scrollTop !== 0) {
        setScrollTop(0);
      }
    } else if (scrollTop > scrollHeight - clientHeight) {
      setScrollTop(scrollHeight - clientHeight);
    }
  }, [clientHeight, scrollHeight, scrollTop]);

  const cleanup = () => {
    if (animateFrameSaved.current) {
      window.cancelAnimationFrame(animateFrameSaved.current);
    }
    if (scrolling) {
      setScroll(false);
    }
    animationStartSaved.current = null;
    animationEndSaved.current = null;
    scrollTopStartSaved.current = null;
    scrollTopTargetSaved.current = null;
    animateFrameSaved.current = null;
  };

  const animate = (timestamp) => {
    if (scrollTopTargetSaved.current === scrollTopStartSaved.current) {
      setScrollTop(scrollTopTargetSaved.current);
      cleanup();
    } else if (timestamp >= animationEndSaved.current) {
      setScrollTop(scrollTopTargetSaved.current);
      cleanup();
    } else {
      const length = animationEndSaved.current - animationStartSaved.current;
      const progress = Math.max(timestamp - animationStartSaved.current, 0);
      const percentage = progress / length;
      const t = percentage * (2 - percentage);
      const moveTo = (scrollTopTargetSaved.current - scrollTopStartSaved.current) * t;
      if (moveTo !== 0) {
        setScrollTop(scrollTopStartSaved.current + moveTo);
      }
      animateFrameSaved.current = window.requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (scrollTopTargetSaved.current != null && scrollTopTargetSaved.current === scrollTop) {
      cleanup();
    }
    if (onScroll) {
      onScroll(scrollTop);
    }
  }, [scrollTop]);

  const scroll = (target) => {
    if (clientHeight < scrollHeight) {
      if (animationStartSaved.current && performanceNow() - animationStartSaved.current < 40) {
        return;
      }
      if (target <= 0) {
        if (scrollTop === 0) {
          return;
        }
        target = 0;
      }
      if (target >= scrollHeight - clientHeight) {
        if (scrollTop === scrollHeight - clientHeight) {
          return;
        }
        target = scrollHeight - clientHeight;
      }
      if (scrollTop === target) {
        cleanup();
        return;
      }

      if (!scrolling) {
        setScroll(true);
      }

      if (scrollTopTargetSaved.current == null) {
        animateFrameSaved.current = window.requestAnimationFrame(animate);
      }
      if (!animationEndSaved.current) {
        animationStartSaved.current = performanceNow();
        animationEndSaved.current = animationStartSaved.current + ANIMATION_TIME;
      }
      scrollTopStartSaved.current = scrollTop;
      scrollTopTargetSaved.current = target;
    }
  };

  const handleWheel = (ev) => {
    if (clientHeight < scrollHeight) {
      ev.stopPropagation();
      scroll(ev.deltaY / 2 * PIXEL_STEP + scrollTop);
    }
  };

  const handleKeyDow = (ev) => {
    if (ev.keyCode === 40) {
      scroll(scrollTop + 50);
    } else if (ev.keyCode === 38) {
      scroll(scrollTop - 50);
    }
  };

  const handleScroll = (v) => {
    if (v >= 0
      && scrollHeight > clientHeight
      && v <= scrollHeight - clientHeight) {
      setScrollTop(v);
    }
  };

  useEffect(() => {
    const handler = (ev) => {
      if (clientHeight < scrollHeight && containerRef.current.contains(ev.target)) {
        ev.preventDefault();
        ev.returnValue = false; // eslint-disable-line
      }
    };
    window.addEventListener('DOMMouseScroll', handler, false);
    document.addEventListener('wheel', handler, { passive: false });
    window.onwheel = handler;
    window.ontouchmove = handler;
    return () => {
      window.removeEventListener('DOMMouseScroll', handler, false);
      document.removeEventListener('wheel', handler, { passive: false });
      window.onwheel = null;
      window.ontouchmove = null;
    };
  }, [clientHeight, scrollHeight]);

  return (
    <Context.Provider
      value={{
        scrollTop,
        clientHeight,
        scrollHeight,
        scrolling,
        onScroll: handleScroll,
        setScroll,
      }}
    >
      <div
        css={css`
          position: relative;
          height: 100%;
          outline: 0;
        `}
        {...other}
        ref={containerRef}
        onWheel={handleWheel}
        onKeyDown={handleKeyDow}
        tabIndex={0}
        style={{
          ..._.omit(style, ['height']),
          overflow: 'hidden',
          height: height !== 0 ? height : null,
        }}
      >
        {children}
      </div>
    </Context.Provider>
  );
});

ContentScroll.propTypes = {
  children: PropTypes.any, // eslint-disable-line
  style: stylePropType,
  height: PropTypes.number,
  scrollHeight: PropTypes.number.isRequired,
  onScroll: PropTypes.func,
};

export default ContentScroll;
