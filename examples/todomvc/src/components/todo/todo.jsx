import React from 'react'
import PropTypes from 'prop-types'
import { onlyUpdateForPropTypes } from 'recompose'
import cn from 'classnames'

const Todo = ({
  // style
  style,
  className,
  // data
  label,
  completed,
  editing,
  // callbacks
  onComplete,
  onEdit,
  onRemove,
  onUpdate,
  onChange,
  onKeyDown,
}) => (
  <li style={style} className={cn(className, { completed, editing })}>
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={completed}
        onChange={onComplete}
      />
      <label htmlFor="editField" onDoubleClick={onEdit}>
        {label}
      </label>
      <button className="destroy" onClick={onRemove} />
    </div>
    <input
      className="edit"
      value={editing}
      onBlur={onUpdate}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  </li>
)

Todo.propTypes = {
  // style
  style: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // data
  label: PropTypes.string,
  completed: PropTypes.bool,
  editing: PropTypes.bool,
  // callbacks
  onComplete: PropTypes.func,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  onUpdate: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
}

Todo.defaultProps = {
  // style
  style: undefined,
  className: undefined,
  // data
  label: undefined,
  completed: false,
  editing: false,
  // callbacks
  onComplete: undefined,
  onEdit: undefined,
  onRemove: undefined,
  onUpdate: undefined,
  onChange: undefined,
  onKeyDown: undefined,
}

export default onlyUpdateForPropTypes(Todo)
