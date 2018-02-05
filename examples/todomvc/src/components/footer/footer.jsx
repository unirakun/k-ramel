import React from 'react'
import PropTypes from 'prop-types'
import { onlyUpdateForPropTypes } from 'recompose'

const Footer = ({
  style,
  className,
  todos,
  todosLeft,
  todosCompleted,
  onClearCompleted,
}) => {
  if (todos === 0) return null
  return (
    <footer style={style} className={`footer ${className}`}>
      <span className="todo-count">
        <strong>{todosLeft}</strong> {`item${todosLeft > 1 ? 's' : ''} left`}
      </span>
      <ul className="filters">
        <li>
          All
        </li>
        <li>
          Active
        </li>
        <li>
          Completed
        </li>
      </ul>
      {todosCompleted > 0 &&
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      }
    </footer>
  )
}

Footer.propTypes = {
  style: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  todos: PropTypes.number,
  todosLeft: PropTypes.number,
  todosCompleted: PropTypes.number,
  onClearCompleted: PropTypes.func,
}

Footer.defaultProps = {
  style: undefined,
  className: undefined,
  todos: 0,
  todosLeft: 0,
  todosCompleted: 0,
  onClearCompleted: undefined,
}

export default onlyUpdateForPropTypes(Footer)
