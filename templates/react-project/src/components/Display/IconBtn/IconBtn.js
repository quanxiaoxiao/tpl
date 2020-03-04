/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';
import Icon from 'components/Icon';

const IconBtn = React.memo(({
  code,
  ...other
}) => {
  const getColor = useColor();

  return (
    <button
      type="button"
      css={css`
          width: 1.8rem;
          height: 1.8rem;
          border-width: 0;
          outline: unset;
          background: rgba(0, 0, 0, 0);
          display: inline-block;
        `}
      {...other}
    >
      <Icon
        css={css`
            width: 100%;
            height: 100%;
            display: block;
          `}
        code={code}
        color={getColor('a03')}
      />
    </button>
  );
});

IconBtn.propTypes = {
  code: PropTypes.string.isRequired,
};

export default IconBtn;
