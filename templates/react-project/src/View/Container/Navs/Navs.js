import React, { Fragment, useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom';
import list from '../pages';
import NavItem from './NavItem';

const Navs = React.memo(() => {
  const match = useRouteMatch('/:name/(.*)?');
  const currentPath = match ? `/${match.params.name}` : '/';

  const navList = useMemo(() => list
    .map((item) => ({
      ...item,
      isActive: currentPath === item.path,
    })), [currentPath]);

  return (
    <Fragment>
      {
          navList
            .map((item) => (
              <NavItem
                key={item.path}
                item={item}
              />
            ))
        }
    </Fragment>
  );
});

export default Navs;
