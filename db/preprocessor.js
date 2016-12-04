preprocessors = {
  json: JSON.stringify,
  jsonPretty: JSON.pretty
}
module.exports = ({preprocessor}, data) =>
  preprocessors[preprocessor](data)
