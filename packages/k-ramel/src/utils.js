export const getFromPath = (data, path) => path.split('.').reduce(
  (curr, sub) => curr && curr[sub],
  data,
)
