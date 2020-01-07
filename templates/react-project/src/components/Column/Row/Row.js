/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import _ from 'lodash';
import useColumn from '../useColumn';

const Row = React.memo(({ ...props }) => {
  const { list: columnList } = useColumn();

  return (
    <div
      aria-label="row"
      css={css`
        display: flex;
        align-items: center;
      `}
      {..._.omit(props, columnList.map((item) => item.key))}
    >
      {
        columnList
          .map((columnItem) => (
            <div
              aria-label="cell"
              key={columnItem.key}
              css={css`
                position: relative,
                overflow-x: hidden;
              `}
              style={{
                width: columnItem.width,
              }}
            >
              {props[columnItem.key]}
            </div>
          ))
      }
    </div>
  );
});

export default Row;
