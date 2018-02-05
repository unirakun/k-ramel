import React from 'react'
import PropTypes from 'prop-types'
import { onlyUpdateForPropTypes } from 'recompose'

const Header = ({
  style,
  className,
  newTodo,
  addTodo,
  onNewTodoChange,
}) => (
  <header style={style} className={`header ${className}`}>
    <h1>todos</h1>
    <input
      className="new-todo"
      name="newTodo"
      placeholder="What needs to be done?"
      autoFocus
      value={newTodo}
      onKeyDown={addTodo}
      onChange={onNewTodoChange}
    />
  </header>
)

Header.propTypes = {
  style: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  newTodo: PropTypes.string,
  onNewTodoChange: PropTypes.func.isRequired,
  addTodo: PropTypes.func.isRequired,
}

Header.defaultProps = {
  style: undefined,
  className: undefined,
  newTodo: '',
}

export default onlyUpdateForPropTypes(Header)
