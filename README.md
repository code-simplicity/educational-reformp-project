<h1 align="center">educational_reformp-project-毕业设计门户</h1>

<p align="center">
    <a href="https://github.com/vuejs/vue-next">
        <img src="https://img.shields.io/badge/vue3-3.2.21-brightgreen.svg" alt="vue">
    </a>
    <a href="https://github.com/element-plus/element-plus">
        <img src="https://img.shields.io/badge/elementPlus-1.2.0-beta.svg" alt="element-plus">
    </a>
    <a href="https://github.com/vuejs/vue-router-next">
        <img src="https://img.shields.io/badge/vue-router4-4.0.12.svg" alt="vue-router">
    </a>
</p>

## 下载依赖

```shell
yarn install
```

## 启动服务

```shell
yarn serve
```

## 打包

```shell
yarn build
```

## 技术说明

- vue3、vue-router4、vuex4、vue-cli-plugin-style-resources-loader
- axios
- sass、sass-loader
- element-plus1.0.2
- xgplayer
- nprogress

## 记录一下这里出现的问题

首先就是登录，这里登录后端是返回一个tokenKey给前端，前端接受到这个tokenKey之后，然后登录成功了之后，将这个tokenKey加入了后面需要用到该接口的请求头中，例如下面这个

```js
instance.interceptors.request.use((config) => {
    // 判断token是否存在，这个token是存在redis中的，存在tokenKey，给请求头加上这个值
    const tokenKey = getToken()
    console.log("tokenKey", tokenKey)
    if (tokenKey !== "" && tokenKey !== undefined && tokenKey !== null) {
        console.log('config', config)
        config.headers.common['authorization'] = tokenKey
    }
    return config;
}, error => {
    return new Promise.reject(error)
})
```

那么后端是这么解决这个问题的，首先就是后端这块会设置跨域，比如下面这样

```js
app.use((req, res, next) => {
  //判断路径
  if (req.path !== "/" && !req.path.includes(".")) {
    res.set({
      "Access-Control-Allow-Credentials": true, //允许后端发送cookie
      "Access-Control-Allow-Origin": req.headers.origin || "*", //任意域名都可以访问,或者基于我请求头里面的域
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested_With", //设置请求头格式和类型
      "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS", //允许支持的请求方式
      "Content-Type": "application/json; charset=utf-8", //默认与允许的文本格式json和编码格式
    });
  }
  if (req.method.toLowerCase() == "options") {
    res.status(204).send(200)
  } else {
    next()
  }
});
```

上面代码中配置了`options`，为什么这样呢，首先就是携带有一种请求叫做`Preflighted Request`（带预检的跨域请求），`Preflighted Request`，在发送真正的请求前，会先发送一个方法为`OPTIONS`的预请求`(Preflighted Request)`，用于试探服务端是否能接受真正的请求。如果`options`获得的回应时拒绝性质的，如`404、403、500`等状态，就会停止`post、get`请求的发出的请求，我这里当时是做了错误的处理，导致一直是产生`cors`。