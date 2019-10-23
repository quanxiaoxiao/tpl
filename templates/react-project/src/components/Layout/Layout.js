import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

const justifyMap = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center',
  between: 'space-between',
};

const verticalMap = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch',
};

const isReactFragment = (variableToInspect) => {
  if (variableToInspect.type) {
    return variableToInspect.type === React.Fragment;
  }
  return variableToInspect === React.Fragment;
};

const Layout = ({
  children,
  style = {},
  justify,
  gap,
  vertical = 'stretch',
  inline,
  ...other
}) => {
  const defaultStyle = {
    display: inline ? 'inline-flex' : 'flex',
    justifyContent: justifyMap[justify],
    alignItems: verticalMap[vertical],
  };
  return (
    <div
      style={{ ...defaultStyle, ...style }}
      {...other}
    >
      {
        React.Children.toArray(children)
          .filter((child) => !!child && child.type)
          .reduce((acc, child, i) => {
            if (child.type.displayName !== 'LayoutItem'
              && isReactFragment(child)
              && Array.isArray(child.props.children)) {
              return [
                ...acc,
                ...child
                  .props
                  .children
                  .filter((item) => {
                    if (!item) {
                      return false;
                    }
                    return item.type && item.type.displayName === 'LayoutItem';
                  })
                  .map((item, j) => {
                    if (!item.props.key) {
                      return React.cloneElement(item, {
                        key: `layout_${i}_${j}`, // eslint-disable-line
                      });
                    }
                    return item;
                  }),
              ];
            }
            return [...acc, child];
          }, [])
          .map((child, idx) => {
            const itemStyle = {};
            if (typeof child.props.width !== 'undefined') {
              itemStyle.width = child.props.width;
            } else if (!justify) {
              itemStyle.flex = '1 1';
            }
            const gapSize = child.props.gap || gap;
            if (idx !== 0 && gapSize) {
              itemStyle.marginLeft = gapSize;
            }
            return React.cloneElement(child, {
              style: {
                ...(child.props.style || {}),
                ...itemStyle,
              },
            });
          })
      }
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.any, // eslint-disable-line
  gap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  justify: PropTypes.oneOf(['left', 'right', 'center', 'between']),
  style: stylePropType,
  inline: PropTypes.bool,
  vertical: PropTypes.oneOf(['start', 'end', 'center', 'stretch']),
};

export default Layout;
