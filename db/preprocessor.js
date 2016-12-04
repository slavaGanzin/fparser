preprocessors = {
  json: JSON.stringify,
  jsonPretty: x => JSON.stringify(x, null, ' ')
}
module.exports = ({preprocessor}, data) =>
  preprocessors[preprocessor](data)
