class ApiClient {

  constructor() {
    this.base = import.meta.env.VITE_API_BASE_URL;
  }

  async getBaseHeaders() {
    return {
      'Content-Type': 'application/json',
      'name': localStorage.getItem("name") || "",
      'token': localStorage.getItem("token") || ""
    };
  }


  /**
   * Function to build the URL
   * @param partialUrl 
   * @param {*} params 
   * @returns 
   */
  buildFullUrl(partialUrl, params = {}) {
    const resolvedPath = partialUrl.replace(/{([^}]+)}/g, (match, key) => {
      if (params.hasOwnProperty(key)) {
        return params[key];
      }
      console.warn(`Missing value for template key: ${key}`);
      return match;
    });
    const path = `${this.base}${resolvedPath}`;
    console.log("URL : ", path)
    return path;
  }

  async handleResponse(response) {
    const data = await response.json();
    let retData = {
      status: response.status,
      data: data.data,
      messages: data?.messages
    }
    return retData
  }

  async get(url) {
    const headers = await this.getBaseHeaders();
    const res = await fetch(url, { method: 'GET', headers });
    return this.handleResponse(res);
  }

  async post(url, body) {
    const headers = await this.getBaseHeaders();
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    return this.handleResponse(res);
  }

  async put(url, body) {
    const headers = await this.getBaseHeaders();
    const res = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });
    return this.handleResponse(res);
  }

  async delete(url, body) {
    const headers = await this.getBaseHeaders();
    const res = await fetch(url, {
      method: 'DELETE',
      headers,
      body: JSON.stringify(body)
    });
    return this.handleResponse(res);
  }
}

export default new ApiClient();
