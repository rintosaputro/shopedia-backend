const { HOST } = process.env

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

exports.pageInfoCreator = (totalDataCount, url, values) => {
  const {
    page,
    limit
  } = values

  const keys = []
  let next = HOST + url + '?'
  let prev = HOST + url + '?'

  for (const key in values) {
    keys.push(key)
  }

  keys.forEach((el, idx) => {
    if (values[el]) {
      if (el === 'page') {
        next += el + '=' + (Number(values[el]) + 1) + '&'
        prev += el + '=' + (Number(values[el]) - 1) + '&'
      } else if (idx < (keys.length - 1)) {
        next += el + '=' + values[el] + '&'
        prev += el + '=' + values[el] + '&'
      } else {
        next += el + '=' + values[el]
        prev += el + '=' + values[el]
      }
    }
  })

  const totalData = totalDataCount

  const totalPages = Math.ceil(totalData / limit) || 1

  return ({
    totalData,
    currentPage: page,
    next: page < totalPages ? next : null,
    prev: page > 1 ? prev : null,
    lastPage: totalPages
  })
}
