/** @jsx jsx */
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';

const inputEventNameList = [
  'onChange',
  'onInput',
  'onFocus',
  'onBlur',
  'onKeyDown',
  'onKeyPress',
];

const containerPropNameList = [
  'style',
  'classNames',
];

const Input = React.memo(({
  right,
  left,
  forwardedref,
  className,
  autoSize,
  value,
  ...props
}) => {
  const [isFocus, setFocus] = useState(false);
  const [width, setWidth] = useState(autoSize ? 0 : null);
  const input = useRef();
  const sizer = useRef();
  const getColor = useColor();

  const copyInputStyle = useCallback(() => {
    if (!sizer.current || !input.current) {
      return;
    }
    const inputStyle = window.getComputedStyle(input.current);
    sizer.current.style.fontSize = inputStyle.fontSize;
    sizer.current.style.fontFamily = inputStyle.fontFamily;
    sizer.current.style.fontStyle = inputStyle.fontStyle;
    sizer.current.style.letterSpacing = inputStyle.letterSpacing;
    sizer.current.style.textTransform = inputStyle.textTransform;
  }, []);

  useEffect(() => {
    if (autoSize) {
      copyInputStyle();
      const newWidth = sizer.current.scrollWidth;
      setWidth(newWidth);
    }
  }, [autoSize]);

  useEffect(() => {
    if (autoSize) {
      const newWidth = sizer.current.scrollWidth;
      setWidth(newWidth);
    }
  }, [value]);

  const keys = Object.keys(props);

  const eventHandlers = (acc, eventName) => {
    const origin = acc[eventName];
    if (origin) {
      return {
        ...acc,
        [eventName]: (ev) => {
          const ret = origin(ev);
          if (ret !== false) {
            props[eventName](ev);
          }
        },
      };
    }
    return {
      ...acc,
      [eventName]: props[eventName],
    };
  };

  const eventNameList = keys
    .filter((eventName) => /^on[A-Z]/.test(eventName) && typeof props[eventName] === 'function');

  const inputEventHandlers = eventNameList
    .filter((eventName) => inputEventNameList.includes(eventName))
    .reduce(eventHandlers, {
      onFocus: () => {
        setFocus(true);
      },
      onBlur: () => {
        setFocus(false);
      },
    });

  const containerEventHandlers = eventNameList
    .filter((eventName) => !inputEventNameList.includes(eventName))
    .reduce(eventHandlers, {
      onMouseDown: (ev) => {
        if (ev.target !== input.current) {
          ev.preventDefault();
          if (!isFocus) {
            input.current.focus();
          }
        }
      },
    });

  const containerProps = keys
    .filter((propName) => !eventNameList.includes(propName)
      && containerPropNameList.includes(propName))
    .reduce((acc, propName) => ({
      ...acc,
      [propName]: props[propName],
    }), {});

  const inputProps = keys
    .filter((propName) => !eventNameList.includes(propName)
      && !containerPropNameList.includes(propName))
    .reduce((acc, propName) => ({
      ...acc,
      [propName]: props[propName],
    }), {});

  return (
    <div
      aria-label={`input-${isFocus ? 'focus' : 'blur'}`}
      css={css`
        height: 2.4rem;
        display: ${autoSize ? 'inline-flex' : 'flex'};
        ${autoSize ? 'vertical-align: bottom;' : ''}
        align-items: center;
        position: relative;
      `}
      className={className}
      ref={forwardedref}
      {...containerEventHandlers}
      {...containerProps}
    >
      {left}
      <input
        ref={input}
        value={value}
        css={css`
          color: ${getColor('text')};
          flex-grow: 1;
          border-width: 0;
          outline: 0;
          background: transparent;
          padding: 0;
          line-height: 1;
          font-family: inherit;
          margin-left: ${left ? '0.6rem' : 0};
          margin-right: ${right ? '0.6rem' : 0};
          vertical-align: bottom;
          &::-webkit-input-placeholder {
            color: ${getColor('text.placeholder')};
          }
        `}
        style={{
          width: width != null ? Math.max(2, width) : null,
        }}
        {...inputEventHandlers}
        {...inputProps}
      />
      {right}
      {
        autoSize && (
          <div
            ref={sizer}
            css={css`
              position: absolute;
              top: 0;
              left: 0;
              overflow: scroll;
              white-space: pre;
              visibility: hidden;
            `}
          >
            {value}
          </div>
        )
      }
    </div>
  );
});

Input.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  right: PropTypes.element,
  left: PropTypes.element,
  autoSize: PropTypes.bool,
};

export default React.forwardRef((props, ref) => (
  <Input
    {...props}
    forwardedref={ref}
  />
));
