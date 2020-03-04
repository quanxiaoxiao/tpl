/** @jsx jsx */
import React, {
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import { jsx, css } from '@emotion/core';
import ResizeObserver from 'resize-observer-polyfill';

const PadHeight = React.memo(({
  children,
  type = 'top',
  style,
  height = '100%',
  className,
  ...other
}) => {
  const [padHeight, setPadHeight] = useState(0);

  const list = useMemo(() => React
    .Children
    .toArray(children)
    .filter((child) => !!child && child.type), [children]);

  const elems = useMemo(() => {
    if (list.length === 0) {
      return {
        padElem: null,
        contents: [],
      };
    }
    if (list.length === 1) {
      return {
        padElem: null,
        contents: list[0],
      };
    }
    if (type === 'top') {
      const [topElem, ...contents] = list;
      return {
        padElem: topElem,
        contents,
      };
    }
    const bottomElem = list.slice(list.length - 1);
    const contents = list.slice(0, list.length - 1);
    return {
      padElem: bottomElem,
      contents,
    };
  }, [list, type]);

  const headerRef = useRef();

  useLayoutEffect(() => {
    let animationFrameID = null;
    let observer;
    if (headerRef.current) {
      observer = new ResizeObserver((entries) => {
        const newPadHeight = entries[0].contentRect.height;
        if (newPadHeight !== padHeight) {
          animationFrameID = window.requestAnimationFrame(() => {
            setPadHeight(newPadHeight);
          });
        }
      });
      observer.observe(headerRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  const contents = useMemo(() => (
    <div
      css={css`
          height: 100%;
          position: relative;
        `}
      className={className}
      style={style}
    >
      {elems.contents}
    </div>
  ), [elems.contents, className, style]);

  if (list.length <= 1) {
    return React.cloneElement(contents, other);
  }

  return (
    <div
      style={{
        [type === 'top' ? 'paddingTop' : 'paddingBottom']: padHeight,
        height,
      }}
      css={css`
        position: relative;
      `}
    >
      <div
        ref={headerRef}
        aria-label={type}
        css={css`
          position: absolute;
          ${type === 'top' ? 'top' : 'bottom'}: 0;
          width: 100%;
          z-index: 1;
        `}
      >
        {elems.padElem}
      </div>
      {
        React.cloneElement(contents, other)
      }
    </div>
  );
});

PadHeight.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: stylePropType,
  className: PropTypes.string,
  children: PropTypes.any, // eslint-disable-line
  type: PropTypes.oneOf(['top', 'bottom']),
};

export default PadHeight;
