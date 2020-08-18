import React, { useMemo } from 'react';
import _ from 'lodash';
import { Redirect, Route, Switch } from 'react-router-dom';
import Test from 'pages/Test';
import list from '../pages';

const Pages = React.memo(() => {
  const pageList = useMemo(() => {
    const traversal = (arr, pre) => {
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const path = `${pre}${item.path}`;
        if (item.component) {
          result.push({
            ...item,
            path,
          });
        }
        if (!_.isEmpty(item.list)) {
          result.push(...traversal(item.list, path));
        }
      }
      return result;
    };
    return [
      ...traversal(list, ''),
      ...process.env.NODE_ENV === 'development' ? [
        {
          path: '/test',
          component: Test,
        },
      ] : [],
    ];
  }, []);

  const redirectList = useMemo(() => {
    const traversal = (arr, pre) => {
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const path = `${pre}${item.path}`;
        if (item.redirect) {
          result.push({
            ...item,
            path,
            redirect: `${path}${item.redirect}`,
          });
        }
        if (!_.isEmpty(item.list)) {
          result.push(...traversal(item.list, path));
        }
      }
      return result;
    };
    return traversal(list, '');
  }, []);

  return (
    <Switch>
      {
        pageList
          .map((pageItem) => (
            <Route
              exact
              key={pageItem.path}
              path={pageItem.path}
            >
              {
                pageItem.component && React.createElement(pageItem.component)
              }
            </Route>
          ))
      }
      {
        redirectList
          .map((item) => (
            <Redirect
              exact
              key={item.path}
              from={item.path}
              to={item.redirect}
            />
          ))
      }
    </Switch>
  );
});

export default Pages;
