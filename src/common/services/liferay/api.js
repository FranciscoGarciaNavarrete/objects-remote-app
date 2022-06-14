const { REACT_APP_LIFERAY_API = window.location.origin } = process.env
const Liferay = window.Liferay || {
	ThemeDisplay: {
		getCompanyGroupId: () => 0,
		getScopeGroupId: () => 0,
		getSiteGroupId: () => 0,
	},
	authToken: "",
};

const baseFetch = (url, { body, method = 'GET' } = {}) => {
  return fetch(REACT_APP_LIFERAY_API + url, {
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      "Content-Type": "application/json",
			"x-csrf-token": Liferay.authToken,
    },
    method
  }).then(response => {
    const {status} = response;
    const responseContentType = response.headers.get('content-type');
    if (status === 204) {
      return {status};
    }
    else if (response.ok && responseContentType === 'application/json') {
      return response.json();
    }
    else {
      return response.text();
    }
  });
}

export default baseFetch;