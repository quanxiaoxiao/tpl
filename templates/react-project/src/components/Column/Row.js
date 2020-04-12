/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { jsx, css } from '@emotion/core';
import useColumn from './useColumn';

const Row = React.memo(({
  list,
  ...other
}) => {
  const { sizeList, columnList } = useColumn();

  return (
    <div
      css={css`
          display: flex;
        `}
      {...other}
    >
      {
          columnList
            .map((columnItem, i) => {
              const item = list[i];
              const type = typeof item;
              const size = sizeList[i];
              return (
                <div
                  key={columnItem.key}
                  aria-label={`cell-${i}`}
                  css={css`
                      position: relative;
                    `}
                  style={{
                    width: size ? `${size.percent * 100}%` : null,
                  }}
                  title={type === 'string' ? item : null}
                >
                  {
                    type === 'function'
                      ? (size ? item(size, i) : '')
                      : item
                  }
                </div>
              );
            })
        }
    </div>
  );
});

Row.propTypes = {
  list: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Row;
