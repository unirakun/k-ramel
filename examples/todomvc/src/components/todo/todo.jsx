import React from 'react'
import PropTypes from 'prop-types'
import { onlyUpdateForPropTypes } from 'recompose'

const Todo = ({ style, className, label }) => (
  <li style={style} className={className}>
    <label>{label}</label>
  </li>
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
