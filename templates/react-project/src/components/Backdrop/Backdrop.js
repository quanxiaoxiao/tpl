/** @jsx jsx */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { jsx, css } from '@emotion/core';

const Backdrop = React.memo(({ onClick, ...other }) => {
  const handleClick = (ev) => {
    ev.stopPropagation();
    if (onClick) {
      onClick(ev);
    }
  };

  useEffect(() => {
    document.documentElement.style.height = '100vh';
    document.documentElement.style.width = '100vw';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.height = null;
      document.documentElement.style.width = null;
      document.documentElement.style.overflow = null;
      document.body.style.height = null;
      document.body.style.width = null;
      document.body.style.overflow = null;
    };
  }, []);

  return ReactDOM.createPortal((
    <div
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        z-index: 999;
        background: rgba(0, 0, 0, 0.6);
      `}
      onClick={handleClick}
      aria-label="backdrop"
      onWheel={(ev) => ev.stopPropagation()}
      {...other}
    />
  ), document.body);
});

Backdrop.propTypes = {
  onClick: PropTypes.func,
};

export default Backdrop;
