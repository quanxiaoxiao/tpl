/** @jsx jsx */
import React, { useContext } from 'react';
import { jsx, css } from '@emotion/core';
import { Link, useLocation } from 'react-router-dom';
import useColor from 'hooks/useColor';
import Context from 'View/Context';

const Navs = React.memo(() => {
  const { state: { navList } } = useContext(Context);
  const getColor = useColor();
  const location = useLocation();

  return (
    <div>
      {
        navList
          .map((item) => ({
            ...item,
            isActive: item.path === location.pathname,
          }))
          .map((item) => (
            <Link
              key={item.name}
              to={item.path}
              css={css`
                display: block;
                color: ${getColor(item.isActive ? 'theme' : 'text')};
              `}
            >
              {item.name}
            </Link>
          ))
      }
    </div>
  );
});

export default Navs;
