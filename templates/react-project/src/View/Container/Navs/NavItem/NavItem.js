/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { jsx, css } from '@emotion/core';
import { Link } from 'react-router-dom';
import useColor from 'hooks/useColor';
import Icon from 'components/Icon';

const NavItem = React.memo(({ item }) => {
  const getColor = useColor();

  return (
    <Link
      to={item.path}
      css={css`
        height: 3.2rem;
        display: flex;
        align-items: center;
        text-decoration: none;
        color: ${getColor(item.isActive ? 'a00' : 'a08')};
        transition: 0.3s background;
        position: relative;
        padding-left: 2rem;
        padding-right: 1rem;
      `}
    >
      <Icon
        code={item.iconCode}
        color="currentColor"
      />
      <span
        css={css`
          margin-left: 0.6rem;
        `}
      >
        {item.name}
      </span>
    </Link>
  );
});

NavItem.propTypes = {
  item: PropTypes.shape({
    isActive: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    iconCode: PropTypes.string.isRequired,
  }).isRequired,
};

export default NavItem;
