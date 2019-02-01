# To emulate uploading files

1. Head to _node_modules_ > _axios-mock-adapter_ > _src_ > _handle_request.js
1. Add this on line 15

```javascript
if (typeof config.url === 'object') {
  config.url = config.url[0];
}
```

so it should look like this:

```javascript
  function handleRequest(mockAdapter, resolve, reject, config) {
  if (typeof config.url === 'object') {
      config.url = config.url[0];
  }

  if (config.baseURL && config.url.substr(0, config.baseURL.length) === config.baseURL) {
    config.url = config.url.slice(config.baseURL ? config.baseURL.length : 0);
  }
  
```