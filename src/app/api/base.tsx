export class BaseApi {
  url: URL;
  base_headers: HeadersInit;
  
  constructor(v: number, endpoint: string, custom_headers: any = {}) {
    this.url = this.create_url(v, endpoint);
    this.base_headers = new Headers(custom_headers);
  }

  public create_url(v: number, endpoint: string): URL {
    return new URL(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v${v}/${endpoint}`);
  }

  private get_delete = async (
    query: any,
    http_method: string = 'GET',
    callback: CallableFunction = (...state: any[]) => {},
    current_state: any = {},
  ) => {
    let uri = this.url;
    for (let k in query) {
      uri.searchParams.set(k, query[k])
    }
    const headers: HeadersInit = new Headers(this.base_headers);
    headers.set('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
    headers.set('Content-Type', 'application/json');
    let response = await fetch(
      uri.href,
      {
        method: http_method,
        headers: headers,
      },
    )
    if (response.status === 401) {
      let res = await this.refresh_token();
      if (res.status === 200) {
        localStorage.setItem("access_token", res.body.access_token);
        localStorage.setItem("refresh_token", res.body.refresh_token);
        headers.set('Authorization', `Bearer ${res.body.access_token}`);
        response = await fetch(
          uri.href,
          {
            method: http_method,
            headers: headers,
          }
        )
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        callback({...current_state, logged_in: false});
      }
    }
    let res = { status: 400 };
    try {
      res = { status: response.status, body: await response.json() }
    } catch (error) { 
      res = { status: response.status, body: {} }
    } finally {
      if ( !res || ![200, 201, 204, 401].includes(res.status) ) {
        callback({ ...current_state }, 'Error', JSON.stringify(res?.body), true);
      }
      return res
    }
  }

  public get = async (
    query: any,
    callback: CallableFunction = (...state: any[]) => {},
    current_state: any = {},
  ) => {
    return await this.get_delete(query, 'GET', callback, current_state);
  }

  public delete = async (
    query: any,
    callback: CallableFunction = (...state: any[]) => {},
    current_state: any = {},
  ) => {
    return await this.get_delete(query, 'DELETE', callback, current_state);
  }

  private post_put_patch = async (
    data: any,
    content_type: string,
    http_method: string = 'POST',
    callback: CallableFunction = (...state: any[]) => {},
    current_state: any = {},
  ) => {
    const headers: HeadersInit = new Headers(this.base_headers);
    headers.set('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
    var json_body: string = '';
    var form_body: FormData = new FormData;
    if (content_type === 'application/json') {
      json_body = JSON.stringify(data);
      headers.set('Content-Type', content_type);
    }
    else {
      if (data instanceof FormData) {
        form_body = data;
      } else {
        form_body = new FormData();
        for(let name in data) {
          if (data[name] !== undefined && data[name] !== null) {
            if ( data[name].constructor === Array) {
              for (let v of data[name]) {
                form_body.append(name, v)
              }
            }
            else {
              form_body.append(name, data[name])
            }
          } 
        }
      }
    }
    let response = await fetch(
      this.url.href,
      {
        method: http_method,
        body: (content_type === 'application/json') ? json_body : form_body,
        headers: headers,
      }
    )
    if (response.status === 401) {
      let res = await this.refresh_token();
      if (res.status === 200) {
        localStorage.setItem("access_token", res.body.access_token);
        localStorage.setItem("refresh_token", res.body.refresh_token);
        headers.set('Authorization', `Bearer ${res.body.access_token}`);
        response = await fetch(
          this.url.href,
          {
            method: http_method,
            body: (content_type === 'application/json') ? json_body : form_body,
            headers: headers,
          }
        )
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        callback({...current_state, logged_in: false});
      }
    }
    let res = { status: 400 };
    try {
      res = { status: response.status, body: await response.json() }
    } catch (error) { 
      res = { status: response.status, body: {} }
    } finally {
      if ( !res || ![200, 201, 204, 401].includes(res.status) ) {
        callback({ ...current_state }, 'Error', JSON.stringify(res?.body), true);
      }
      return res
    }
  }

  public post = async (
    data: any,
    content_type: string,
    callback: CallableFunction = (...state: any[]) => {},
    current_state: any = {},
  ) => {
    return await this.post_put_patch(data, content_type, 'POST', callback, current_state);
  }

  public put = async (
    data: any,
    content_type: string,
    callback: CallableFunction = (...state: any[]) => {},
    current_state: any = {},
  ) => {
    return await this.post_put_patch(data, content_type, 'PUT', callback, current_state);
  }

  public refresh_token = async () => {
    if (localStorage.getItem("refresh_token")) {
      let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/token/refresh/`);
      const headers: HeadersInit = new Headers(this.base_headers);
      headers.set('Content-Type', 'application/json');
      let response = await fetch(
        url.href,
        {
          method: 'POST',
          body: JSON.stringify({refresh: localStorage.getItem("refresh_token")}),
          headers: headers,
        }
      )
      return { status: response.status, body: await response.json() }
    }
    return { status: 401, body: {} }
  }
}
