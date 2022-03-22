exports.responseHandler = (res, status = 200, message = null, data = null, error = null, pageInfo = null) => {
  let success = true
  if (status >= 400) {
    success = false
  }
  const jsonRes = {
    success
  }
  if (message) {
    jsonRes.message = message
  }
  if (data) {
    jsonRes.results = data
  }
  if (error) {
    jsonRes.error = error
  }
  if (pageInfo) {
    jsonRes.pageInfo = pageInfo
  }
  return res.status(status).json(jsonRes)
}
