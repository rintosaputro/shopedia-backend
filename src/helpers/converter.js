exports.cloudPathToFileName = (path) => {
  const filename = path.split('/').slice(-4).join('/').split('.').slice(0, 1).join('')
  return filename
}
