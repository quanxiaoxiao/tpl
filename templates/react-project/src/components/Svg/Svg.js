/* eslint react/no-array-index-key:0 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FontSizeContext from 'contexts/FontSize';
import _ from 'lodash';
import { size as wrapper } from '../HighOrder';

class Svg extends PureComponent {
  nodeRef = React.createRef();

  get margin() {
    const { margin = {}, width, height } = this.props;
    const fontSize = this.context;
    const dimension = {
      top: fontSize * 1.4,
      left: fontSize * 1.25,
      right: fontSize * 1.25,
      bottom: fontSize * 1.4,
    };
    if (_.isFunction(margin)) {
      return {
        ...dimension,
        ...margin({ width, height }),
      };
    }
    return {
      ...dimension,
      ...margin,
    };
  }

  get width() {
    const { width } = this.props;
    const { left, right } = this.margin;
    return width - left - right;
  }

  get height() {
    const { height } = this.props;
    const { top, bottom } = this.margin;
    return height - top - bottom;
  }

  get clientRect() {
    if (!this.nodeRef.current) {
      return {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
      };
    }
    const { width, height, margin } = this;
    const { top, left } = this.nodeRef.current.getBoundingClientRect();
    return {
      width,
      height,
      top: top + margin.top,
      left: left + margin.left,
    };
  }

  handleEventListener = (listener, { target, clientX, clientY }) => {
    const { width, height } = this;
    const { left, top } = target.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    listener({
      x: _.clamp(width, 0, x),
      y: _.clamp(height, 0, y),
      width,
      height,
    });
  }

  renderEventsLayer() {
    const eventProps = Object.entries(this.props)
      .filter(([key, value]) => /^on[A-Z]\w+/.test(key) && _.isFunction(value))
      .reduce((props, [key, listener]) => ({
        ...props,
        [key]: (ev) => this.handleEventListener(listener, ev),
      }), {});

    if (_.isEmpty(eventProps)) {
      return null;
    }

    const { width, height } = this;
    return (
      <rect
        width={width}
        height={height}
        fill="none"
        pointerEvents="all"
        {...eventProps}
      />
    );
  }

  render() {
    const { position, children } = this.props;
    const { top, left } = this.margin;
    const { width, height, clientRect } = this;
    const fontSize = this.context;

    let result;
    if (Array.isArray(children)) {
      result = children
        .map((child) => (_.isFunction(child) ? child({
          width,
          height,
          fontSize,
          clientRect,
          margin: this.margin,
        }) : child))
        .filter((child) => child)
        .map((child, i) => React.cloneElement(child, { key: i }));
    } else if (children) {
      result = _.isFunction(children) ? children({
        width,
        height,
        fontSize,
        clientRect,
        margin: this.margin,
      }) : children;
    }

    const { width: containerWidth, height: containerHeight } = this.props;

    return (
      <svg
        style={{
          width: containerWidth,
          height: containerHeight,
        }}
        ref={this.nodeRef}
      >
        <g
          transform={position === 'topLeft'
            ? `translate(${left}, ${top})`
            : `translate(${width / 2 + left}, ${height / 2 + top})`}
        >
          {
            !_.isEmpty(result) && result
          }
          {this.renderEventsLayer()}
        </g>
      </svg>
    );
  }
}

Svg.contextType = FontSizeContext;

Svg.defaultProps = {
  position: 'topLeft',
};

Svg.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  position: PropTypes.oneOf(['topLeft', 'center']),
  margin: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
      bottom: PropTypes.number,
      right: PropTypes.number,
    }),
  ]),
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
    PropTypes.array,
  ]),
};

export default wrapper(Svg);
