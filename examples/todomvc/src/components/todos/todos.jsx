import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { onlyUpdateForPropTypes } from 'recompose'
import cn from 'classnames'
import Todo from '../todo'

const Todos = ({
  // style
  style,
  className,
  // data
  todos,
  allCompleted,
  // callbacks
  onCompleteAll,
}) => (
  <section className="main">
    {todos.length > 0 &&
      <Fragment>
        <input
          className="toggle-all"
          type="checkbox"
          checked={allCompleted}
        />
        <label onClick={onCompleteAll} />
      </Fragment>
    }
    <ul style={style} className={cn('todo-list', className)}>
      {todos.map(id => <Todo key={id} id={id} />)}
    </ul>
  </section>
)

Todos.propTypes = {
  // style
  style: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // data
  todos: PropTypes.arrayOf(PropTypes.number),
  allCompleted: PropTypes.bool,
  // callbacks
  onCompleteAll: PropTypes.func,
}

Todos.defaultProps = {
  // style
  style: undefined,
  className: undefined,
  // data
  todos: [],
  allCompleted: false,
  // callbacks
  onCompleteAll: undefined,
}

export default onlyUpdateForPropTypes(Todos)
