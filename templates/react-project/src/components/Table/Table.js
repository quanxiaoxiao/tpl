/** @jsx jsx */
import React, {
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import _ from 'lodash';
import { jsx, css } from '@emotion/core';
import useFontSize from 'hooks/useFontSize';
import ScrollContent from './ScrollContent';

const Table = React.memo(({
  className,
  list,
  columns,
  scroll,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const container = useRef();
  const fontSize = useFontSize();

  useLayoutEffect(() => {
    let animationFrameID = null;
    const observer = new ResizeObserver((entries) => {
      const newWidth = entries[0].contentRect.width;
      if (containerWidth !== newWidth) {
        animationFrameID = window.requestAnimationFrame(() => {
          setContainerWidth(Math.floor(newWidth));
        });
      }
    });

    observer.observe(container.current);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });


  const columnList = useMemo(() => columns
    .map((columnItem) => {
      if (columnItem.width) {
        return {
          ...columnItem,
          width: columnItem.width > 0
            ? fontSize * columnItem.width
            : containerWidth * columnItem.width,
        };
      }
      return columnItem;
    })
    .map((columnItem) => {
      let columnWidth;
      if (columnItem.style && columnItem.style.width) {
        columnWidth = columnItem.style.width;
      } else if (columnItem.width) {
        columnWidth = columnItem.width;
      }

      return {
        ...columnItem,
        style: {
          ...columnWidth
            ? {
              width: columnWidth,
            }
            : {
              flex: '1 1',
            },
          ..._.omit(columnItem.style ?? {}, ['width', 'flex']),
        },
      };
    }), [containerWidth, columns, fontSize]);

  const content = useMemo(() => {
    if (!containerWidth) {
      return null;
    }
    const rows = list
      .map((item) => (
        <div
          key={item.id}
          aria-label="table-row"
          css={css`
            display: flex;
            align-items: center;
            [aria-label=table-cell] {
              position: relative;
            }
          `}
          style={{
            ...item.__$?.style ?? {},
          }}
        >
          {
          columnList
            .map((columnItem) => (
              <div
                aria-label="table-cell"
                key={columnItem.dataKey}
                style={{
                  ...item.__$?.style ?? {},
                  ..._.pick(columnItem.style, ['width', 'flex']),
                }}
                {..._.omit(item.__$ || {}, ['style'])}
              >
                {item[columnItem.dataKey]}
              </div>
            ))
        }
        </div>
      ));
    return rows;
  }, [containerWidth, columnList, list]);


  if (!containerWidth) {
    return (
      <div
        ref={container}
        className={className}
      >
        &nbsp;
      </div>
    );
  }

  return (
    <div
      ref={container}
      className={className}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
        aria-label="table-header"
      >
        {
          columnList
            .map((columnItem) => (
              <div
                aria-label="table-cell"
                key={columnItem.dataKey}
                style={columnItem.style}
              >
                {columnItem.elem}
              </div>
            ))
        }
      </div>
      {
        scroll ? (
          <ScrollContent>
            {content}
          </ScrollContent>
        ) : (
          <div
            aria-label="table-body"
          >
            {content}
          </div>
        )
      }
    </div>
  );
});

Table.propTypes = {
  className: PropTypes.string,
  scroll: PropTypes.bool,
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    dataKey: PropTypes.string,
    elem: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    width: PropTypes.number,
    style: stylePropType,
  })).isRequired,
};

export default Table;
