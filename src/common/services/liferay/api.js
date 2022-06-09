const { REACT_APP_LIFERAY_API = window.location.origin } = process.env

const baseFetch = async (url, { body, method = 'GET' } = {}) => {
  let headers = new Headers({
    Authorization: 'Basic ' + btoa('test@liferay.com:a'),
    'Content-Type': 'application/json'
  })

  let apiPath = 'http://localhost:8080'

  const response = await fetch(apiPath + '/' + url, {
    ...(body && { body: JSON.stringify(body) }),
    headers: headers,
    method
  })

  const data = await response.json()

  return { data }
}

export { REACT_APP_LIFERAY_API }

export default baseFetch