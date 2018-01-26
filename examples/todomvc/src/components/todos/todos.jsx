import React from 'react'
import PropTypes from 'prop-types'
import { onlyUpdateForPropTypes } from 'recompose'
import Todo from '../todo'

const Todos = ({ style, className, todos }) => (
  <div style={style} className={className}>
    {todos.map(id => <Todo key={id} id={id} />)}
  </div>
)

Todos.propTypes = {
  style: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  todos: PropTypes.arrayOf(PropTypes.string),
}

Todos.defaultProps = {
  style: {},
  className: '',
  todos: [],
}

export default onlyUpdateForPropTypes(Todos)
