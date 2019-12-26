/** @jsx jsx */
import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { jsx, css } from '@emotion/core';
import { useSpring, animated } from 'react-spring';

const ScrollContent = React.memo(({ children }) => {
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const contentRef = useRef();
  const containerRef = useRef();
  const barRef = useRef();
  const startPointerSaved = useRef();

  useLayoutEffect(() => {
    let animationFrameID = null;
    const observer = new ResizeObserver((entries) => {
      const newContainerHeight = entries[0].contentRect.height;
      animationFrameID = window.requestAnimationFrame(() => {
        if (newContainerHeight !== containerHeight) {
          setContainerHeight(newContainerHeight);
        }
      });
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  useLayoutEffect(() => {
    let animationFrameID = null;
    const observer = new ResizeObserver((entries) => {
      const newContentHeight = entries[0].contentRect.height;
      animationFrameID = window.requestAnimationFrame(() => {
        if (newContentHeight !== contentHeight) {
          setContentHeight(newContentHeight);
        }
      });
    });
    observer.observe(contentRef.current);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  useEffect(() => {
    if (containerHeight >= contentHeight) {
      if (offsetY !== 0) {
        setOffsetY(0);
      }
    } else if (offsetY > contentHeight - containerHeight) {
      setOffsetY(contentHeight - containerHeight);
    }
  }, [containerHeight, contentHeight, offsetY]);

  const diffHeight = useMemo(() => contentHeight - containerHeight,
    [contentHeight, containerHeight]);

  const scrollBarHeight = useMemo(() => {
    if (diffHeight <= 0) {
      return 0;
    }
    if (containerHeight * 0.8 > diffHeight) {
      return containerHeight - diffHeight;
    }
    return containerHeight * 0.3;
  }, [offsetY, diffHeight, containerHeight]);

  const scrollBarOffsetY = useMemo(() => {
    if (diffHeight <= 0) {
      return 0;
    }
    if (containerHeight * 0.8 > diffHeight) {
      return offsetY;
    }
    return (containerHeight * 0.7) * (offsetY / diffHeight);
  }, [offsetY, diffHeight, containerHeight]);

  const spring = useSpring({
    from: {
      offsetY: 0,
      scrollBarOffsetY: 0,
    },
    to: {
      offsetY,
      scrollBarOffsetY,
    },
    config: {
      duration: 360,
      easing: (t) => t * (2 - t),
    },
  });

  const handleWheel = useCallback((ev) => {
    ev.stopPropagation();
    if (diffHeight > 0) {
      const { deltaY } = ev;
      setOffsetY((v) => {
        const step = Math.max(20, diffHeight * 0.08);
        const next = v + (deltaY > 0 ? step : -step);
        if (next < 0) {
          return 0;
        }
        if (next > diffHeight) {
          return diffHeight;
        }
        return next;
      });
    }
  }, [diffHeight, scrollBarHeight, containerHeight]);

  const handleMouseMoveOnDoc = (ev) => {
    const y = ev.clientY - startPointerSaved.current.y;
    const effectHeight = containerHeight - scrollBarHeight;
    setOffsetY((v) => {
      startPointerSaved.current = {
        x: ev.clientX,
        y: ev.clientY,
      };
      const next = v + diffHeight / effectHeight * y;
      if (next < 0) {
        return 0;
      }
      if (next > diffHeight) {
        return diffHeight;
      }
      return next;
    });
  };

  const handleMouseUpOnDoc = () => {
    document.removeEventListener('mousemove', handleMouseMoveOnDoc);
    document.removeEventListener('mouseup', handleMouseUpOnDoc);
    startPointerSaved.current = null;
    document.body.style.userSelect = null;
  };

  const handleMouseDownOnScrollbar = useCallback((ev) => {
    ev.stopPropagation();
    if (ev.target !== barRef.current) {
      const y = ev.clientY - ev.target.getBoundingClientRect().y;
      const percent = y / containerHeight;
      setOffsetY(diffHeight * percent);
    } else {
      document.body.style.userSelect = 'none';
      startPointerSaved.current = {
        x: ev.clientX,
        y: ev.clientY,
      };
      document.addEventListener('mousemove', handleMouseMoveOnDoc);
      document.addEventListener('mouseup', handleMouseUpOnDoc);
    }
  }, [diffHeight]);

  if (!containerHeight) {
    return (
      <div
        aria-label="table-body"
        ref={containerRef}
      >
        <div
          ref={contentRef}
        >
          &nbsp;
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label="table-body"
      ref={containerRef}
      onWheel={handleWheel}
      css={css`
        position: relative;
      `}
    >
      <animated.div
        ref={contentRef}
        style={{
          transform: startPointerSaved.current
            ? `translateY(-${offsetY}px)`
            : spring.offsetY.interpolate((t) => `translateY(${-t}px)`),
        }}
      >
        {children}
      </animated.div>
      {
        diffHeight > 0 && (
          <div
            css={css`
              position: absolute;
              top: 0;
              bottom: 0;
              right: 0;
              width: 6px;
              background: rgba(0, 0, 0, 0.1);
              z-index: 1;
            `}
            aria-label="scrollbar"
            onMouseDown={handleMouseDownOnScrollbar}
          >
            <animated.div
              css={css`
                position: absolute;
                left: 0;
                width: 100%;
                background: rgba(0, 0, 0, 0.35);
                border-radius: 3px;
              `}
              ref={barRef}
              style={{
                height: scrollBarHeight,
                top: startPointerSaved.current
                  ? scrollBarOffsetY
                  : spring.scrollBarOffsetY.interpolate((t) => t),
              }}
            />
          </div>
        )
      }
    </div>
  );
});

export default ScrollContent;
