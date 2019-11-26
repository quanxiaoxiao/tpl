/** @jsx jsx */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';

const Backdrop = React.memo(({ onClick, ...other }) => {
  const [elem, setElem] = useState(null);
  const getColor = useColor();

  useEffect(() => {
    const div = document.createElement('div');
    document.body.append(div);
    setElem(div);
    return () => {
      if (div) {
        div.remove();
      }
    };
  }, []);

  const handleClick = (ev) => {
    ev.stopPropagation();
    if (onClick) {
      onClick(ev);
    }
  };

  if (!elem) {
    return null;
  }

  return ReactDOM.createPortal((
    <div
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 9999;
        background: ${getColor('fill.backdrop')};
      `}
      onClick={handleClick}
      aria-label="backdrop"
      {...other}
    />
  ), elem);
});


Backdrop.propTypes = {
  onClick: PropTypes.func,
};

export default Backdrop;
