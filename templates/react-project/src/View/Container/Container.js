/** @jsx jsx */
import React, { Fragment } from 'react';
import { jsx, css, Global } from '@emotion/core';
import emotionNormalize from 'emotion-normalize';
import { Route, Switch } from 'react-router-dom';

import Layout from 'components/Layout';

import Home from 'pages/Home';
import Project from 'pages/Project';

import useColor from 'hooks/useColor';
import useSize from 'hooks/useSize';

import { init as initStyle } from 'styles';

import Header from './Header';
import Navs from './Navs';


const Container = React.memo(() => {
  const getColor = useColor();
  const getSize = useSize();

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
      <Header />
      <Layout
        css={css`
          height: calc(100vh - ${getSize('height.header')});
        `}
      >
        <Layout.Item
          width="12rem"
          css={css`
            background: ${getColor('fill')};
          `}
        >
          <Navs />
        </Layout.Item>
        <Layout.Item>
          <Switch>
            <Route
              exact
              path="/"
              component={Home}
            />
            <Route
              exact
              path="/project"
              component={Project}
            />
          </Switch>
        </Layout.Item>
      </Layout>
    </Fragment>
  );
});

export default Container;
