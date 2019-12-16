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
import ScrollBar from './ScrollBar';

const Table = React.memo(({
  className,
  list,
  columns,
  scroll,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const container = useRef();
  const bodyRef = useRef();
  const contentRef = useRef();
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

  useLayoutEffect(() => {
    let animationFrameID = null;
    let observer;
    if (bodyRef.current && contentRef.current && scroll) {
      observer = new ResizeObserver((entries) => {
        const newBodyHeight = entries[0].contentRect.height;
        if (offsetY !== 0) {
          if (newBodyHeight >= contentHeight) {
            setOffsetY(0);
          } else if (offsetY > contentHeight - newBodyHeight) {
            setOffsetY(contentHeight - newBodyHeight);
          }
        }
        if (newBodyHeight !== bodyHeight) {
          animationFrameID = window.requestAnimationFrame(() => {
            setBodyHeight(newBodyHeight);
          });
        }
      });

      observer.observe(bodyRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
        window.cancelAnimationFrame(animationFrameID);
      }
    };
  });

  useLayoutEffect(() => {
    let animationFrameID = null;
    let observer;
    if (bodyRef.current && contentRef.current && scroll) {
      observer = new ResizeObserver((entries) => {
        const newContentHeight = entries[0].contentRect.height;
        if (offsetY !== 0) {
          if (bodyHeight >= newContentHeight) {
            setOffsetY(0);
          } else if (offsetY > newContentHeight - bodyHeight) {
            setOffsetY(newContentHeight - bodyHeight);
          }
        }
        if (contentHeight !== newContentHeight) {
          animationFrameID = window.requestAnimationFrame(() => {
            setContentHeight(newContentHeight);
          });
        }
      });

      observer.observe(contentRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
        window.cancelAnimationFrame(animationFrameID);
      }
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

  const handleWheelOnBody = (ev) => {
    if (scroll && bodyRef.current && contentRef.current) {
      if (contentHeight > bodyHeight) {
        const { deltaY } = ev;
        setOffsetY((v) => {
          const next = v + (deltaY > 0 ? 10 : -10);
          if (next < 0) {
            return 0;
          }
          if (next > contentHeight - bodyHeight) {
            return contentHeight - bodyHeight;
          }
          return next;
        });
      }
    }
  };

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
      <div
        aria-label="table-body"
        ref={bodyRef}
        onWheel={handleWheelOnBody}
        css={css`
          position: relative;
          [aria-label=scrollbar] {
            display: none;
          }
          &:hover {
            [aria-label=scrollbar] {
              display: block;
            }
          }
        `}
      >
        {
          scroll && contentHeight > bodyHeight && (
            <ScrollBar
              offsetY={offsetY}
              contentHeight={contentHeight}
              bodyHeight={bodyHeight}
            />
          )
        }
        {
          (() => {
            const rows = list
              .map((item) => (
                <div
                  key={item.id}
                  aria-label="table-row"
                  css={css`
                    display: flex;
                    align-items: center;
                  `}
                >
                  {
                  columnList
                    .map((columnItem) => (
                      <div
                        aria-label="table-cell"
                        key={columnItem.dataKey}
                        style={{
                          ..._.pick(columnItem.style, ['width', 'flex']),
                        }}
                      >
                        {item[columnItem.dataKey]}
                      </div>
                    ))
                }
                </div>
              ));
            if (scroll) {
              return (
                <div
                  ref={contentRef}
                  style={{
                    transform: `translate3d(0, ${-offsetY}px, 0)`,
                  }}
                >
                  {rows}
                </div>
              );
            }
            return rows;
          })()
        }
      </div>
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
