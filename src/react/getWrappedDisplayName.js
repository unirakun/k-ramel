export default Component => (
  Component.displayName
  || Component.name
  || (Component.constructor && Component.constructor.name)
  || 'Unknown'
)
