import React from 'react'
import PropTypes from 'prop-types'
import { onlyUpdateForPropTypes } from 'recompose'

const Todo = ({ style, className, label }) => (
  <div style={style} className={className}>
    {label}
  </div>
)

Todo.propTypes = {
  style: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  label: PropTypes.string,
}

Todo.defaultProps = {
  style: {},
  className: '',
  label: undefined,
}

export default onlyUpdateForPropTypes(Todo)
