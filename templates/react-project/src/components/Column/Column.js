import React, {
  useLayoutEffect,
  useRef,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import Context from './Context';

const Column = React.memo(({
  list,
  children,
  ...other
}) => {
  const container = useRef();
  const [containerWidth, setContainerWidth] = useState(0);

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

  const columnList = useMemo(() => {
    if (containerWidth === 0) {
      return list.map(({ width, ...rest }) => ({
        ...rest,
      }));
    }
    const usage = list
      .reduce((acc, cur) => {
        if ('width' in cur) {
          return {
            width: acc.width + (cur.width >= 1 ? cur.width : cur.width * containerWidth),
            count: acc.count + 1,
          };
        }
        return acc;
      }, {
        width: 0,
        count: 0,
      });
    if (usage.width > containerWidth) {
      console.error('columns width usage exceed container width');
      return list.map(({ width, ...rest }) => ({
        ...rest,
      }));
    }
    const count = list.length;
    return list
      .map((item) => {
        if ('width' in item) {
          return {
            ...item,
            width: item.width >= 1 ? item.width : item.width * containerWidth,
          };
        }
        return {
          ...item,
          width: (containerWidth - usage.width) / (count - usage.count),
        };
      });
  }, [containerWidth, list]);

  if (!containerWidth) {
    return (
      <div
        {...other}
        ref={container}
      >
        &nbsp;
      </div>
    );
  }

  return (
    <Context.Provider
      value={columnList}
    >
      <div
        {...other}
        ref={container}
        aria-label="table"
      >
        {children}
      </div>
    </Context.Provider>
  );
});

Column.propTypes = {
  children: PropTypes.any, // eslint-disable-line
  list: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    width: PropTypes.number,
  })).isRequired,
};

export default Column;
