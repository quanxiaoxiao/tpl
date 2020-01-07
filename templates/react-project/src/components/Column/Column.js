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
    const fixedWidthList = list
      .filter((item) => item.width >= 1);

    const percentWidthList = list
      .filter((item) => item.width < 1);

    const fiexdUsaged = fixedWidthList.reduce((acc, cur) => acc + cur.width, 0);
    const percentUsaged = percentWidthList.reduce((acc, cur) => acc + cur.width, 0);

    if (fiexdUsaged > containerWidth || percentUsaged > 1) {
      console.error('columns width usage exceed container width');
      return list.map(({ width, ...rest }) => ({
        ...rest,
      }));
    }

    const restCount = list.length - fixedWidthList.length - percentWidthList.length;
    const perWidth = restCount === 0
      ? 0
      : (1 - fiexdUsaged / containerWidth - percentUsaged) / restCount;

    return list
      .map((item) => {
        if ('width' in item) {
          return {
            ...item,
            width: item.width >= 1 ? item.width : `${item.width * 100}%`,
            itemWidth: item.width >= 1 ? item.width : item.width * containerWidth,
          };
        }
        return {
          ...item,
          width: `${perWidth * 100}%`,
          itemWidth: perWidth * containerWidth,
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
      value={{
        list: columnList,
        width: containerWidth,
      }}
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
