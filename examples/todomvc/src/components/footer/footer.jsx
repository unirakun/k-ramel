import React from 'react'
import PropTypes from 'prop-types'
import { onlyUpdateForPropTypes } from 'recompose'
import cn from 'classnames'

const Footer = ({
  // style
  style,
  className,
  // data
  todos,
  todosLeft,
  todosCompleted,
  filter,
  // callbacks
  onClearCompleted,
  onClickAll,
  onClickCompleted,
  onClickActive,
}) => {
  if (todos === 0) return null
  return (
    <footer style={style} className={cn('footer', className)}>
      <span className="todo-count">
        <strong>{todosLeft}</strong> {`item${todosLeft > 1 ? 's' : ''} left`}
      </span>
      <ul className="filters">
        <li>
          <a className={cn({ selected: filter === 'all' })} onClick={onClickAll}>All</a>
        </li>
        <li>
          <a className={cn({ selected: filter === 'active' })} onClick={onClickActive}>Active</a>
        </li>
        <li>
          <a className={cn({ selected: filter === 'completed' })} onClick={onClickCompleted}>Completed</a>
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
  // style
  style: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // data
  todos: PropTypes.number,
  todosLeft: PropTypes.number,
  todosCompleted: PropTypes.number,
  filter: PropTypes.string,
  // callbacks
  onClearCompleted: PropTypes.func,
  onClickAll: PropTypes.func,
  onClickCompleted: PropTypes.func,
  onClickActive: PropTypes.func,
}

Footer.defaultProps = {
  // style
  style: undefined,
  className: undefined,
  // data
  todos: 0,
  todosLeft: 0,
  todosCompleted: 0,
  filter: 'all',
  // callbacks
  onClearCompleted: undefined,
  onClickAll: undefined,
  onClickCompleted: undefined,
  onClickActive: undefined,
}

export default onlyUpdateForPropTypes(Footer)
