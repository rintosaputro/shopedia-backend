const { HOST } = process.env

exports.pageInfo = (total, limit, page, url, route = '') => {
  const last = Math.ceil(total / limit)
  const pageInfo = {
    prev: page > 1 ? `${HOST}/${route}?page=${page - 1}&${url}` : null,
    next: page < last ? `${HOST}/${route}?page=${page + 1}&${url}` : null,
    totalData: total,
    currentPage: page,
    lastPage: last
  }
  return pageInfo
}
