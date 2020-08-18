/** @jsx jsx */
import React, { Fragment } from 'react';
import { jsx, css, Global } from '@emotion/core';
import emotionNormalize from 'emotion-normalize';

import useColor from 'hooks/useColor';

import { init as initStyle } from 'styles';
import Navs from './Navs';
import Pages from './Pages';

const Container = React.memo(() => {
  const getColor = useColor();

  return (
    <Fragment>
      <Global
        styles={css`
          ${emotionNormalize}
          ${initStyle}
          body {
            color: ${getColor('a02')};
            background: ${getColor('a05')};
            input::placeholder {
              color: ${getColor('a07')};
            }
          }
        `}
      />
      <div
        css={css`
          height: 100%;
          display: flex;
        `}
      >
        <div
          css={css`
            flex-grow: 1;
            background: rgb(48, 65, 86);
          `}
        >
          <Navs />
        </div>
        <div
          css={css`
            width: calc(100% - 12rem);
            padding: 1rem;
            > div {
              height: 100%;
            }
          `}
        >
          <Pages />
        </div>
      </div>
    </Fragment>
  );
});

export default Container;
