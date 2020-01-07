/** @jsx jsx */
import React, { Fragment } from 'react';
import { jsx, css, Global } from '@emotion/core';
import emotionNormalize from 'emotion-normalize';
import { Route, Switch } from 'react-router-dom';

import Home from 'pages/Home';

import useColor from 'hooks/useColor';

import { init as initStyle } from 'styles';


const Container = React.memo(() => {
  const getColor = useColor();

  return (
    <Fragment>
      <Global
        styles={css`
        ${emotionNormalize}
        ${initStyle}
        body {
          color: ${getColor('text')};
          background: ${getColor('fill.background')};
        }
        `}
      />
      <Switch>
        <Route
          exact
          path="/"
        >
          <Home />
        </Route>
      </Switch>
    </Fragment>
  );
});

export default Container;
