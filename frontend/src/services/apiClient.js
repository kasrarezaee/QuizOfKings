export const apiCall = async (url, method = 'GET', token = '', body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['auth-token'] = token;

    const res = await fetch(`${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });

    console.log(body)

    return res;
};
