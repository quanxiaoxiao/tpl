/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from 'react';
import PropTypes from 'prop-types';
import useColor from 'hooks/useColor';

const Button = React.memo(({ children, ...other }) => {
  const getColor = useColor();

  return (
    <button
      type="button"
      css={css`
        background: ${getColor('fill.button.1')};
        color: ${getColor('text.2')};
        border-width: 0;
        outline: 0;
        padding: 0.6rem 0.8rem;
        border-radius: 5px;

        &:active {
          background: ${getColor('fill.button.1.active')};
        }
      `}
      {...other}
    >
      {children}
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Button;
