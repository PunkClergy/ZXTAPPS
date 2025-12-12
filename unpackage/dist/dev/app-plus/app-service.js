if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _imports_0$7 = "/static/public/logo.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$v = {
    data() {
      return {
        title: "欢迎使用",
        timer: null
      };
    },
    onLoad() {
      this.initLaunchScreen();
    },
    onUnload() {
      if (this.timer)
        clearTimeout(this.timer);
    },
    methods: {
      initLaunchScreen() {
        this.timer = setTimeout(() => {
          this.handleJump();
        }, 1500);
      },
      handleJump() {
        uni.navigateTo({
          url: "/pages/desk/desk",
          animationType: "fade-in",
          animationDuration: 300
        });
      }
    }
  };
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 添加启动画面布局 "),
        vue.createElementVNode("view", { class: "launch-screen" }, [
          vue.createElementVNode("image", {
            class: "logo",
            src: _imports_0$7,
            mode: "aspectFit"
          }),
          vue.createElementVNode("view", { class: "text-area" }, [
            vue.createElementVNode(
              "text",
              { class: "title" },
              vue.toDisplayString($data.title),
              1
              /* TEXT */
            )
          ])
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/index/index.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const defaultConfig = {
    url: "",
    method: "GET",
    timeout: 1e4,
    loading: true
  };
  class Http {
    constructor(config) {
      this.baseURL = config.baseURL;
      this.interceptor = {};
    }
    // 设置拦截器
    setInterceptor(interceptor) {
      this.interceptor = interceptor;
    }
    // 核心请求方法
    async request(config) {
      let mergedConfig = {
        ...defaultConfig,
        ...config
      };
      if (typeof this.interceptor.request === "function") {
        mergedConfig = this.interceptor.request(mergedConfig);
      }
      let url = this.baseURL + mergedConfig.url;
      if (mergedConfig.params) {
        const params = new URLSearchParams(mergedConfig.params).toString();
        url += `?${params}`;
      }
      try {
        let requestData = mergedConfig.data || {};
        if (mergedConfig.isFormData) {
          const formData = {};
          for (const key in requestData) {
            if (requestData.hasOwnProperty(key)) {
              formData[key] = String(requestData[key]);
            }
          }
          requestData = formData;
        }
        formatAppLog("log", "at utils/request/http.js:65", "发送请求:", {
          url,
          method: mergedConfig.method,
          data: requestData,
          header: mergedConfig.header
        });
        const response = await uni.request({
          url,
          method: mergedConfig.method,
          data: requestData,
          header: mergedConfig.header,
          timeout: mergedConfig.timeout
        });
        let res = response;
        if (typeof this.interceptor.response === "function") {
          res = this.interceptor.response(response);
        }
        if (res.statusCode === 200) {
          return res.data;
        } else {
          formatAppLog("error", "at utils/request/http.js:90", "接口返回异常:", res);
          return Promise.reject(res.data);
        }
      } catch (error) {
        formatAppLog("error", "at utils/request/http.js:95", "请求异常:", error);
        this.handleError(error);
        return Promise.reject(error);
      } finally {
        if (mergedConfig.loading) {
          uni.hideLoading();
        }
      }
    }
    // 错误处理
    handleError(error) {
      const errMsg = error.errMsg || "";
      if (errMsg.includes("timeout")) {
        uni.showToast({
          title: "请求超时",
          icon: "none"
        });
      } else if (errMsg.includes("abort")) {
        formatAppLog("log", "at utils/request/http.js:115", "请求被取消");
      } else {
        uni.showToast({
          title: "网络异常，请稍后重试",
          icon: "none"
        });
      }
    }
    // 快捷方法
    get(url, params, config) {
      return this.request({
        ...config,
        url,
        method: "GET",
        params
      });
    }
    post(url, data, config) {
      return this.request({
        ...config,
        url,
        method: "POST",
        data
      });
    }
    postFormData(url, data, config) {
      return this.request({
        ...config,
        url,
        method: "POST",
        data,
        isFormData: true
      });
    }
    put(url, data, config) {
      return this.request({
        ...config,
        url,
        method: "PUT",
        data
      });
    }
    delete(url, params, config) {
      return this.request({
        ...config,
        url,
        method: "DELETE",
        params
      });
    }
  }
  const http = new Http({
    baseURL: "https://k1sw.wiselink.net.cn"
    // 你的基础地址
  });
  http.get = (url, params, config) => http.request({
    ...config,
    url,
    method: "GET",
    params
  });
  http.post = (url, data, config) => http.request({
    ...config,
    url,
    method: "POST",
    data
  });
  http.postFormData = (url, data, config) => http.request({
    ...config,
    url,
    method: "POST",
    data,
    isFormData: true
  });
  http.put = (url, data, config) => http.request({
    ...config,
    url,
    method: "PUT",
    data
  });
  http.delete = (url, params, config) => http.request({
    ...config,
    url,
    method: "DELETE",
    params
  });
  http.setInterceptor({
    request: (config) => {
      const token = uni.getStorageSync("token");
      let header = config.header || {};
      if (token) {
        header["token"] = token;
      }
      if (config.isFormData) {
        header["content-type"] = "application/x-www-form-urlencoded";
      } else {
        header["content-type"] = "application/json";
      }
      config.header = header;
      return config;
    },
    response: (response) => {
      if (response.data.code === 9e3) {
        uni.navigateTo({
          url: "/pages/login/login"
        });
      }
      return response;
    }
  });
  const login = (data) => http.get("/api/login", data);
  const u_getQrcodeImg = (data) => http.get("/deskapi/getQrcodeImg", data);
  const u_updatePassword = (data) => http.get("/api/updatePassword", data);
  const u_updateUserName = (data) => http.get("/api/updateUserName", data);
  const u_register = (data) => http.postFormData("/userapi/userReg", data);
  const u_user_delChildUser = (data) => http.get("/accountapi/delChildUser", data);
  const u_user_childUserList = (data) => http.get("/accountapi/childUserList", data);
  const u_user_addOrUpdateChildUser = (data) => http.postFormData("/accountapi/addOrUpdateChildUser", data);
  const u_user_roleapiList = (data) => http.postFormData("/roleapi/list", data);
  const u_setMenuTree = (data) => http.postFormData("/userapi/userReg", data);
  const u_getCarList = (data) => http.get("/carapi/getCarList", data);
  const u_addOrUpdateCar = (data) => http.postFormData("/carapi/addOrUpdateCar", data);
  const u_rentRecord = (data) => http.get("/rentKeyApi/rentRecord", data);
  const u_updateRentKey = (data) => http.postFormData("/rentKeyApi/updateRentKey", data);
  const u_sendRentKey = (data) => http.get("/rentKeyApi/sendRentKey", data);
  const u_cancelRentKey = (data) => http.get("/rentKeyApi/cancelRentKey", data);
  const u_childUserList = (data) => http.get("/accountapi/childUserList", data);
  const u_transferAdminUser = (data) => http.postFormData("/accountapi/transferAdminUser", data);
  const u_roleapiList$1 = (data) => http.postFormData("/roleapi/list", data);
  const u_roleapigetRole = (data) => http.get("/roleapi/getRole", data);
  const u_getMenuTree$1 = (data) => http.get("/roleapi/getMenuTree", data);
  const u_addOrUpdateChildUser = (data) => http.postFormData("/accountapi/addOrUpdateChildUser", data);
  const u_delChildUser = (data) => http.get("/accountapi/delChildUser", data);
  const u_roleapidel$1 = (data) => http.get("/roleapi/del", data);
  const u_roleapiaddOrUpdate$1 = (data) => http.postFormData("/roleapi/addOrUpdate", data);
  const u_oilDipstickapiDipsticHistory = (data) => http.get("/oilDipstickapi/dipsticHistory", data);
  const u_dzBussinessMobileApiGetCarStatus = (data) => http.postFormData("/dzBussinessMobileApi/getCarStatus", data);
  const u_dzBussinessMobileApiRentStart = (data) => http.get("/oilDipstickapi/rentStart", data);
  const u_oilDipstickapiRentEnd = (data) => http.get("/oilDipstickapi/rentEnd", data);
  const u_oilDipstickapiGetOilPriceList = (data) => http.get("/oilDipstickapi/getOilPriceList", data);
  const u_getOilSet = (data) => http.get("/oilDipstickapi/getOilSet", data);
  const u_saveOilSet = (data) => http.post("/oilDipstickapi/saveOilSet", data);
  const u_companyInfo = (data) => http.get("/companyapi/companyInfo", data);
  const u_companyImprove = (data) => http.postFormData("/companyapi/companyImprove", data);
  const u_installerapiList = (data) => http.get("/installerapi/list", data);
  const u_shopapiList = (data) => http.get("/shopapi/list", data);
  const u_addMessage = (data) => http.postFormData("/userapi/addMessage", data);
  const u_paivatecarList = (data) => http.get("/carapi/getCarList", data);
  const u_paivatesendInfo = (data) => http.postFormData("/renterApi/uploadControlRecord", data);
  const u_paivateuploadLog = (data) => http.post("/loggerapi/uploadLog", data);
  const u_getCarBluetoothKeyByCode = (data) => http.get("/renterApi/getCarBluetoothKeyByCode", data);
  const u_paivateAddOrUpdateCar = (data) => http.postFormData("/carapi/addOrUpdateCar", data);
  const u_paivateCarapiDeleteCar = (data) => http.postFormData("/carapi/deleteCar", data);
  const u_paivateUpdateRentKey = (data) => http.postFormData("/rentKeyApi/updateRentKey", data);
  const u_paivateCarList = (data) => http.get("/carapi/getCarList", data);
  const u_paivateRentRecord = (data) => http.get("/rentKeyApi/rentRecord", data);
  const u_paivateSendRentKey = (data) => http.get("/rentKeyApi/sendRentKey", data);
  const u_paivateCancelRentKey = (data) => http.get("/rentKeyApi/cancelRentKey", data);
  const u_promotionalApi = (data) => http.get("/promotionalApi/list", data);
  const u_promotionalApiWxBooklist = (data) => http.get("/promotionalApi/wxFilelist", data);
  const u_industryList = (data) => http.get("/promotionalApi/industryList", data);
  const info_screen = () => {
    return new Promise((resolve, reject) => {
      uni.getSystemInfo({
        success: function(res) {
          formatAppLog("log", "at utils/scheme/screen.js:10", "屏幕可用高度:", res.windowHeight);
          resolve(res);
        },
        fail: function(err) {
          formatAppLog("error", "at utils/scheme/screen.js:14", "获取系统信息失败", err);
          reject(err);
        }
      });
    });
  };
  const _imports_0$6 = "/static/public/nav_left.png";
  const _imports_1$8 = "/static/public/home.png";
  const _sfc_main$u = {
    name: "CustomHeader",
    props: {
      title: {
        // 更明确的属性名
        type: String,
        default: "首页"
      }
    },
    data() {
      return {
        screenInfo: {},
        // 屏幕信息对象
        baseLink: "https://k1sw.wiselink.net.cn"
        // 基础域名
      };
    },
    methods: {
      // 初始化屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          formatAppLog("error", "at components/custom-header/index.vue:45", "[ScreenInfo] 获取屏幕信息失败:", error);
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 返回按钮事件
      handleBack() {
        this.$emit("back");
        uni.navigateBack();
      },
      // 首页按钮事件
      handleHome() {
        this.$emit("home");
        formatAppLog("log", "at components/custom-header/index.vue:61", uni);
        uni.switchTab({
          url: "/pages/desk/desk"
        });
      }
    },
    computed: {
      // 当前用户信息
      userInfo() {
        return uni.getStorageSync("user_info") || null;
      },
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏主体高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全的屏幕高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    mounted() {
      this.initialScreenInfo();
    }
  };
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "custom-navbar",
        style: vue.normalizeStyle({ height: $options.navbarTotalHeight + "px" })
      },
      [
        vue.createCommentVNode(" 状态栏占位视图 "),
        vue.createElementVNode(
          "view",
          {
            class: "status-bar",
            style: vue.normalizeStyle({ height: $options.statusBarHeight + "px" })
          },
          null,
          4
          /* STYLE */
        ),
        vue.createCommentVNode(" 导航栏主体 "),
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar",
            style: vue.normalizeStyle([{ height: $options.navBarHeight + "px" }, { "display": "flex", "gap": "100rpx", "justify-content": "flex-start" }])
          },
          [
            vue.createElementVNode("view", { style: { "display": "flex", "align-items": "center", "gap": "30rpx" } }, [
              vue.createElementVNode("image", {
                src: _imports_0$6,
                class: "action-icon back-icon",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.handleBack && $options.handleBack(...args))
              }),
              vue.createElementVNode("image", {
                src: _imports_1$8,
                class: "action-icon home-icon",
                onClick: _cache[1] || (_cache[1] = (...args) => $options.handleHome && $options.handleHome(...args))
              })
            ]),
            vue.createElementVNode(
              "view",
              { style: { "font-size": "34rpx", "font-weight": "600" } },
              vue.toDisplayString($props.title),
              1
              /* TEXT */
            )
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const CustomNavBar = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["__scopeId", "data-v-3f55fa2f"], ["__file", "C:/ZXT/ZXTRentN/static/google20256/components/custom-header/index.vue"]]);
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  (function(self2) {
    var nativeURLSearchParams = function() {
      try {
        if (self2.URLSearchParams && new self2.URLSearchParams("foo=bar").get("foo") === "bar") {
          return self2.URLSearchParams;
        }
      } catch (e2) {
      }
      return null;
    }(), isSupportObjectConstructor = nativeURLSearchParams && new nativeURLSearchParams({ a: 1 }).toString() === "a=1", decodesPlusesCorrectly = nativeURLSearchParams && new nativeURLSearchParams("s=%2B").get("s") === "+", isSupportSize = nativeURLSearchParams && "size" in nativeURLSearchParams.prototype, __URLSearchParams__ = "__URLSearchParams__", encodesAmpersandsCorrectly = nativeURLSearchParams ? function() {
      var ampersandTest = new nativeURLSearchParams();
      ampersandTest.append("s", " &");
      return ampersandTest.toString() === "s=+%26";
    }() : true, prototype = URLSearchParamsPolyfill.prototype, iterable = !!(self2.Symbol && self2.Symbol.iterator);
    if (nativeURLSearchParams && isSupportObjectConstructor && decodesPlusesCorrectly && encodesAmpersandsCorrectly && isSupportSize) {
      return;
    }
    function URLSearchParamsPolyfill(search) {
      search = search || "";
      if (search instanceof URLSearchParams || search instanceof URLSearchParamsPolyfill) {
        search = search.toString();
      }
      this[__URLSearchParams__] = parseToDict(search);
    }
    prototype.append = function(name, value) {
      appendTo(this[__URLSearchParams__], name, value);
    };
    prototype["delete"] = function(name) {
      delete this[__URLSearchParams__][name];
    };
    prototype.get = function(name) {
      var dict = this[__URLSearchParams__];
      return this.has(name) ? dict[name][0] : null;
    };
    prototype.getAll = function(name) {
      var dict = this[__URLSearchParams__];
      return this.has(name) ? dict[name].slice(0) : [];
    };
    prototype.has = function(name) {
      return hasOwnProperty(this[__URLSearchParams__], name);
    };
    prototype.set = function set(name, value) {
      this[__URLSearchParams__][name] = ["" + value];
    };
    prototype.toString = function() {
      var dict = this[__URLSearchParams__], query = [], i, key, name, value;
      for (key in dict) {
        name = encode(key);
        for (i = 0, value = dict[key]; i < value.length; i++) {
          query.push(name + "=" + encode(value[i]));
        }
      }
      return query.join("&");
    };
    var useProxy = self2.Proxy && nativeURLSearchParams && (!decodesPlusesCorrectly || !encodesAmpersandsCorrectly || !isSupportObjectConstructor || !isSupportSize);
    var propValue;
    if (useProxy) {
      propValue = new Proxy(nativeURLSearchParams, {
        construct: function(target, args) {
          return new target(new URLSearchParamsPolyfill(args[0]).toString());
        }
      });
      propValue.toString = Function.prototype.toString.bind(URLSearchParamsPolyfill);
    } else {
      propValue = URLSearchParamsPolyfill;
    }
    Object.defineProperty(self2, "URLSearchParams", {
      value: propValue
    });
    var USPProto = self2.URLSearchParams.prototype;
    USPProto.polyfill = true;
    if (!useProxy && self2.Symbol) {
      USPProto[self2.Symbol.toStringTag] = "URLSearchParams";
    }
    if (!("forEach" in USPProto)) {
      USPProto.forEach = function(callback, thisArg) {
        var dict = parseToDict(this.toString());
        Object.getOwnPropertyNames(dict).forEach(function(name) {
          dict[name].forEach(function(value) {
            callback.call(thisArg, value, name, this);
          }, this);
        }, this);
      };
    }
    if (!("sort" in USPProto)) {
      USPProto.sort = function() {
        var dict = parseToDict(this.toString()), keys = [], k, i, j;
        for (k in dict) {
          keys.push(k);
        }
        keys.sort();
        for (i = 0; i < keys.length; i++) {
          this["delete"](keys[i]);
        }
        for (i = 0; i < keys.length; i++) {
          var key = keys[i], values = dict[key];
          for (j = 0; j < values.length; j++) {
            this.append(key, values[j]);
          }
        }
      };
    }
    if (!("keys" in USPProto)) {
      USPProto.keys = function() {
        var items = [];
        this.forEach(function(item, name) {
          items.push(name);
        });
        return makeIterator(items);
      };
    }
    if (!("values" in USPProto)) {
      USPProto.values = function() {
        var items = [];
        this.forEach(function(item) {
          items.push(item);
        });
        return makeIterator(items);
      };
    }
    if (!("entries" in USPProto)) {
      USPProto.entries = function() {
        var items = [];
        this.forEach(function(item, name) {
          items.push([name, item]);
        });
        return makeIterator(items);
      };
    }
    if (iterable) {
      USPProto[self2.Symbol.iterator] = USPProto[self2.Symbol.iterator] || USPProto.entries;
    }
    if (!("size" in USPProto)) {
      Object.defineProperty(USPProto, "size", {
        get: function() {
          var dict = parseToDict(this.toString());
          if (USPProto === this) {
            throw new TypeError("Illegal invocation at URLSearchParams.invokeGetter");
          }
          return Object.keys(dict).reduce(function(prev, cur) {
            return prev + dict[cur].length;
          }, 0);
        }
      });
    }
    function encode(str) {
      var replace = {
        "!": "%21",
        "'": "%27",
        "(": "%28",
        ")": "%29",
        "~": "%7E",
        "%20": "+",
        "%00": "\0"
      };
      return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function(match) {
        return replace[match];
      });
    }
    function decode(str) {
      return str.replace(/[ +]/g, "%20").replace(/(%[a-f0-9]{2})+/ig, function(match) {
        return decodeURIComponent(match);
      });
    }
    function makeIterator(arr) {
      var iterator = {
        next: function() {
          var value = arr.shift();
          return { done: value === void 0, value };
        }
      };
      if (iterable) {
        iterator[self2.Symbol.iterator] = function() {
          return iterator;
        };
      }
      return iterator;
    }
    function parseToDict(search) {
      var dict = {};
      if (typeof search === "object") {
        if (isArray(search)) {
          for (var i = 0; i < search.length; i++) {
            var item = search[i];
            if (isArray(item) && item.length === 2) {
              appendTo(dict, item[0], item[1]);
            } else {
              throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
            }
          }
        } else {
          for (var key in search) {
            if (search.hasOwnProperty(key)) {
              appendTo(dict, key, search[key]);
            }
          }
        }
      } else {
        if (search.indexOf("?") === 0) {
          search = search.slice(1);
        }
        var pairs = search.split("&");
        for (var j = 0; j < pairs.length; j++) {
          var value = pairs[j], index = value.indexOf("=");
          if (-1 < index) {
            appendTo(dict, decode(value.slice(0, index)), decode(value.slice(index + 1)));
          } else {
            if (value) {
              appendTo(dict, decode(value), "");
            }
          }
        }
      }
      return dict;
    }
    function appendTo(dict, name, value) {
      var val = typeof value === "string" ? value : value !== null && value !== void 0 && typeof value.toString === "function" ? value.toString() : JSON.stringify(value);
      if (hasOwnProperty(dict, name)) {
        dict[name].push(val);
      } else {
        dict[name] = [val];
      }
    }
    function isArray(val) {
      return !!val && "[object Array]" === Object.prototype.toString.call(val);
    }
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
  })(typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof window !== "undefined" ? window : commonjsGlobal);
  const langs = {
    "zh-CN": {
      language: "English",
      signedin: "已登录",
      signin: "去登录",
      vehiclelist: "车辆列表",
      vehiclebinding: "车辆绑定",
      vehicle: "车辆",
      create: "新增",
      update: "修改",
      dailyrental: "短租",
      vin: "车架号",
      fuel: "油箱容积",
      cartype: "车辆类型",
      platform: "设备平台",
      devID: "设备号",
      selfserve: "自助取还",
      fullservice: "非自助取还",
      selectcar: "选择此车",
      plate: "车牌号",
      series: "车系",
      model: "车型",
      year: "年款",
      start: "启动方式",
      confirm: "确认",
      pushstart: "一键启动",
      physkey: "机械钥匙",
      other: "其他",
      explain: "说明",
      explain1: "为使用按键按下启动",
      explain2: "为使用钥匙片拧动启动",
      licenseplatenumber: "请输入车牌号",
      deviceidentificationnumber: "请输入设备号",
      vehicleseries: "请输入车系",
      vehiclemodel: "请输入车型",
      modelyear: "请输入年款",
      vehicleidentificationnumber: "请输入车架号",
      fueltankcapacity: "请输入邮箱容积",
      userdirectory: "人员列表",
      accesscontrol: "权限管理",
      account: "账号",
      role: "角色",
      mobile: "手机号",
      permissionssettings: "权限设置",
      adduser: "新增人员",
      edituser: "修改人员",
      user: "人员",
      name: "姓名",
      password: "密码",
      pleaseaccount: "请输入账号",
      pleasename: "请输入姓名",
      pleasepassword: "请输入密码",
      pleasemobile: "请输入手机号",
      transferadmin: "移交管理员",
      sendkey: "发送钥匙",
      usagelog: "使用记录",
      cancelled: "已取消",
      inuse: "使用中",
      copylink: "复制链接",
      cancelride: "取消用车",
      starttime: "Start Time",
      endtime: "End Time",
      vehicleselection: "选择车辆",
      reselect: "重新选择",
      company: "企业名称",
      contact: "联系人",
      phone: "联系电话",
      notes: "备注",
      invoice_name: "开票名称",
      tax_id: "纳税人识别号",
      address: "地址",
      bank: "开户行",
      company_placeholder: "请输入企业名称",
      contact_placeholder: "请输入联系人",
      phone_placeholder: "请输入联系电话",
      notes_placeholder: "请输入备注",
      invoice_name_placeholder: "请输入开票名称",
      tax_id_placeholder: "请输入纳税人识别号",
      address_placeholder: "请输入地址",
      bank_placeholder: "请输入开户行",
      account_placeholder: "请输入开户账号",
      phone_number: "请输入电话",
      businesshours: "营业时间",
      signup: "注册",
      haveanaccount: "已有账号?",
      loginnow: "立即登录",
      entercode: "请输入验证码",
      Reenterpassword: "请再次输入密码",
      verificationcode: "验证码",
      confirmpassword: "确认密码",
      username: "用户名",
      pleaseusername: "请输入用户名"
    },
    "en-US": {
      language: "中文",
      signedin: "Signed in",
      signin: "Sign in",
      vehiclelist: "Vehicle List",
      vehiclebinding: "Vehicle Binding",
      vehicle: "Vehicle",
      create: "Create ",
      update: "Update ",
      dailyrental: "D.Rental",
      vin: "Vin",
      fuel: "Fuel",
      cartype: "Car Type",
      platform: "Platform",
      devID: "DevID",
      selfserve: "Self-Serve",
      fullservice: "Full-Service",
      selectcar: "Select Car",
      plate: "Plate",
      series: "Series",
      model: "Model",
      year: "Year",
      start: "Start",
      confirm: "Confirm ",
      pushstart: "PushStart",
      phykey: "PhysKey",
      other: "Other",
      explain: "Explain",
      explain1: "Press Button Start",
      explain2: "Turn Key Start",
      licenseplatenumber: "License Plate Number",
      deviceidentificationnumber: "Device Identification Number",
      vehicleseries: "Vehicle Series",
      vehiclemodel: "Vehicle Model",
      modelyear: "Model Year",
      vehicleidentificationnumber: "Vehicle Identification Number (VIN)",
      fueltankcapacity: "Fuel Tank Capacity",
      userdirectory: "User Directory",
      accesscontrol: "Access Control",
      role: "Role",
      mobile: "Mobile",
      permissionssettings: "Permissions Settings",
      adduser: "Create User",
      edituser: "Edit User",
      user: "User",
      name: "Name",
      password: "Password",
      pleaseaccount: "Please enter Account",
      pleasepassword: "Please enter Password",
      pleasename: "Please enter Name",
      pleasemobile: "Please enter Phone",
      transferadmin: "Transfer Admin",
      sendkey: "Send Key",
      usagelog: "Usage Log",
      cancelled: "Cancelled",
      inuse: "In Use",
      copylink: "Copy Link",
      cancelride: "Cancel Ride",
      starttime: "Start Time",
      endtime: "End Time",
      vehicleselection: "Vehicle Selection",
      reselect: "Reselect",
      company: "Company",
      contact: "Contact",
      phone: "Phone",
      notes: "Notes",
      invoice_name: "Invoice Name",
      tax_id: "Tax ID",
      address: "Address",
      bank: "Bank",
      account: "Account",
      company_placeholder: "Enter company name",
      contact_placeholder: "Enter contact person",
      phone_placeholder: "Enter phone number",
      notes_placeholder: "Enter notes",
      invoice_name_placeholder: "Enter invoice name",
      tax_id_placeholder: "Enter tax ID",
      address_placeholder: "Enter address",
      bank_placeholder: "Enter bank name",
      account_placeholder: "Enter account number",
      phone_number: "Enter phone number",
      businesshours: "Business Hours",
      Reenterpassword: "Re-enter Password",
      verificationcode: "verification Code",
      signup: "Sign Up",
      haveanaccount: "Have an account?",
      loginnow: "Log In Now",
      entercode: "Enter Code",
      confirmpassword: "Confirm Password",
      username: "Username",
      pleaseusername: "Please enter username"
    }
  };
  let currentLang = uni.getStorageSync("lang") || "zh-CN";
  if (!langs[currentLang]) {
    currentLang = "zh-CN";
    uni.setStorageSync("lang", currentLang);
  }
  const _imports_0$5 = "/static/public/car_icon.png";
  const _imports_0$4 = "/static/public/_edit.png";
  const _sfc_main$t = {
    components: {
      CustomNavBar
    },
    data() {
      return {
        screenInfo: {},
        // 屏幕信息对象
        g_page: 1,
        // 当前页码
        g_items: [],
        // 车辆列表数据
        g_activeTab: 1,
        // 当前激活的标签页(1:车辆列表 2:新增车辆)
        btnState: "",
        // 按钮显示文本
        params: {},
        batterylift: "",
        souce: null,
        langs: {}
      };
    },
    onLoad(options) {
      this.souce = options == null ? void 0 : options.souce;
    },
    onShow() {
      this.initialCarList();
      this.initialScreenInfo();
      this.handleGetCurrentLanguage();
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      handleGetCurrentLanguage() {
        let currentLang2 = uni.getStorageSync("lang") || "zh-CN";
        this.langs = langs[currentLang2];
      },
      handleSelectVehicle(evt) {
        var _a;
        formatAppLog("log", "at pages/carRental/vehicleList/index.vue:232", (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset);
        uni.redirectTo({
          url: `${this.souce}?info=${JSON.stringify(evt.currentTarget.dataset.item)}`
        });
      },
      // 滚动到底部加载更多
      lower(e2) {
        if (!this.loading) {
          this.loading = true;
          this.g_page++;
          setTimeout(() => {
            this.initialCarList();
            this.loading = false;
          }, 1e3);
        }
      },
      // 编辑车辆信息
      handleEdit(evt) {
        this.btnState = this.langs.update;
        this.params = evt;
        this.g_activeTab = 2;
      },
      // 切换标签页
      handleSwitchTab(evt) {
        this.g_activeTab = evt;
        if (evt == 1) {
          this.params = {};
          this.btnState = this.langs.create;
        }
      },
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          formatAppLog("error", "at pages/carRental/vehicleList/index.vue:271", "[ScreenInfo] 获取屏幕信息失败:", error);
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 获取车辆列表
      async initialCarList() {
        try {
          const res = await u_getCarList({
            page: this.g_page
          });
          if (this.g_page > 1 && res.content.length === 0) {
            uni.showToast({
              title: `已加载全部数据：共${this.g_items.length}条`,
              icon: "none"
            });
          }
          this.g_items = this.g_items.concat((res == null ? void 0 : res.content) || []);
        } catch (error) {
          formatAppLog("error", "at pages/carRental/vehicleList/index.vue:296", "获取车辆列表失败:", error);
        }
      },
      handleBindinput(evt, text) {
        formatAppLog("log", "at pages/carRental/vehicleList/index.vue:300", evt, text);
        this.params[text] = evt.detail.value;
      },
      // 确认修改
      async handleSubmit() {
        const {
          params
        } = this;
        const {
          id,
          ccdate,
          platenumber,
          sn,
          vehicleModeName,
          vehicleSerialName,
          vin,
          xsgw
        } = params;
        if (!platenumber || !sn) {
          uni.showToast({
            title: "车牌号或设备号不能为空",
            icon: "none"
          });
          return;
        }
        const submitData = {
          id: id || "",
          ccdate,
          platenumber,
          sn,
          vehicleModeName,
          vehicleSerialName,
          vin,
          xsgw,
          batterylift: this.batterylift
        };
        try {
          const res = await u_addOrUpdateCar(submitData);
          if (res.code === 1e3) {
            uni.showToast({
              title: "提交成功",
              icon: "success"
            });
            this.g_activeTab = 1;
            this.g_items = [];
            this.g_page = 1;
            this.$nextTick(() => {
              this.initialCarList();
            });
          } else {
            uni.showToast({
              title: res.msg || "提交失败",
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/carRental/vehicleList/index.vue:361", "提交出错:", error);
          uni.showToast({
            title: "网络异常，请重试",
            icon: "none"
          });
        }
      },
      handleBatterylift(evt) {
        formatAppLog("log", "at pages/carRental/vehicleList/index.vue:369", evt);
        this.batterylift = evt;
      }
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b, _c, _d, _e, _f, _g;
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "container",
        style: vue.normalizeStyle({ height: `${$options.safeScreenHeight}px` })
      },
      [
        vue.createVNode(_component_CustomNavBar, {
          title: $data.langs.vehiclebinding
        }, null, 8, ["title"]),
        vue.createCommentVNode(" 主容器 "),
        vue.createElementVNode(
          "view",
          {
            class: "record-container",
            style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
          },
          [
            vue.createCommentVNode(" 标签切换区域 "),
            vue.createElementVNode("view", { class: "record-tabs" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["record-tabs-item", $data.g_activeTab == 1 ? "tabs-active-1" : "tabs-no-active-1"]),
                  onClick: _cache[0] || (_cache[0] = ($event) => $options.handleSwitchTab(1))
                },
                vue.toDisplayString($data.langs.vehiclelist),
                3
                /* TEXT, CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["record-tabs-item", $data.g_activeTab == 2 ? "tabs-active-2" : "tabs-no-active-2"]),
                  onClick: _cache[1] || (_cache[1] = ($event) => $options.handleSwitchTab(2))
                },
                vue.toDisplayString($data.btnState || $data.langs.create) + vue.toDisplayString($data.langs.vehicle),
                3
                /* TEXT, CLASS */
              )
            ]),
            vue.createCommentVNode(" 车辆列表区域 "),
            $data.g_activeTab == 1 ? (vue.openBlock(), vue.createElementBlock(
              "scroll-view",
              {
                key: 0,
                style: { "height": "100vh" },
                "scroll-y": "",
                onScrolltolower: _cache[3] || (_cache[3] = (...args) => $options.lower && $options.lower(...args))
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.g_items, (item, index) => {
                    var _a2, _b2, _c2, _d2;
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      class: "content-item"
                    }, [
                      vue.createElementVNode("view", { class: "content-item-head" }, [
                        vue.createElementVNode("view", { class: "head-left" }, [
                          vue.createElementVNode("view", { class: "left-category" }, [
                            vue.createElementVNode("image", { src: _imports_0$5 }),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString(item == null ? void 0 : item.platenumber),
                              1
                              /* TEXT */
                            )
                          ]),
                          vue.createElementVNode("view", { class: "left-split_line" }),
                          vue.createElementVNode(
                            "view",
                            { class: "left-model" },
                            vue.toDisplayString((item == null ? void 0 : item.vehicleSerialName) || "-") + vue.toDisplayString((item == null ? void 0 : item.vehicleModeName) || ""),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "view",
                            { class: "left-brand" },
                            vue.toDisplayString($data.langs.dailyrental),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "head-right" }, [
                          vue.createElementVNode("image", {
                            src: _imports_0$4,
                            onClick: ($event) => $options.handleEdit(item)
                          }, null, 8, ["onClick"])
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "content-item-info" }, [
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass("info-item  " + (((_a2 = item == null ? void 0 : item.vin) == null ? void 0 : _a2.length) > 15 ? "long-info-item" : ""))
                          },
                          [
                            vue.createElementVNode(
                              "label",
                              null,
                              vue.toDisplayString($data.langs.vin) + " ：",
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString((item == null ? void 0 : item.vin) || "-"),
                              1
                              /* TEXT */
                            )
                          ],
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass("info-item  " + (((_b2 = item == null ? void 0 : item.xsgw) == null ? void 0 : _b2.length) > 15 ? "long-info-item" : ""))
                          },
                          [
                            vue.createElementVNode(
                              "label",
                              null,
                              vue.toDisplayString($data.langs.fuel) + " ：",
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString((item == null ? void 0 : item.xsgw) ? item.xsgw + "L" : "-"),
                              1
                              /* TEXT */
                            )
                          ],
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode("view", { class: "info-item" }, [
                          vue.createElementVNode(
                            "label",
                            null,
                            vue.toDisplayString($data.langs.cartype) + " ：",
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString((item == null ? void 0 : item.sn) ? $data.langs.selfserve : $data.langs.fullservice),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass("info-item  " + (((_c2 = item == null ? void 0 : item.carOwnerName) == null ? void 0 : _c2.length) > 15 ? "long-info-item" : ""))
                          },
                          [
                            vue.createElementVNode(
                              "label",
                              null,
                              vue.toDisplayString($data.langs.platform) + " ：",
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString((item == null ? void 0 : item.carOwnerName) || "-"),
                              1
                              /* TEXT */
                            )
                          ],
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass("info-item  " + (((_d2 = item == null ? void 0 : item.sn) == null ? void 0 : _d2.length) > 15 ? "long-info-item" : ""))
                          },
                          [
                            vue.createElementVNode(
                              "label",
                              null,
                              vue.toDisplayString($data.langs.devID) + " ：",
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString((item == null ? void 0 : item.sn) || "-"),
                              1
                              /* TEXT */
                            )
                          ],
                          2
                          /* CLASS */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "content-item-footer" }, [
                        vue.createElementVNode("view", { class: "footer-right" }, [
                          $data.souce ? (vue.openBlock(), vue.createElementBlock("view", {
                            key: 0,
                            class: "footer-right-btn",
                            "data-item": item,
                            onClick: _cache[2] || (_cache[2] = (...args) => $options.handleSelectVehicle && $options.handleSelectVehicle(...args))
                          }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString($data.langs.selectcar),
                              1
                              /* TEXT */
                            )
                          ], 8, ["data-item"])) : vue.createCommentVNode("v-if", true),
                          vue.createElementVNode("view", null, [
                            vue.createElementVNode("checkbox-group", { "data-item": item }, [
                              vue.createElementVNode("checkbox", { style: { "transform": "scale(0.7)" } })
                            ], 8, ["data-item"])
                          ])
                        ])
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              32
              /* NEED_HYDRATION */
            )) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 新增车辆区域 "),
            $data.g_activeTab == 2 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
              key: 1,
              "scroll-y": "",
              style: { "height": "100vh" }
            }, [
              vue.createElementVNode("view", { class: "card-info" }, [
                vue.createCommentVNode(" 车牌号 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode("label", { class: "form-label" }, [
                    vue.createTextVNode(
                      vue.toDisplayString($data.langs.plate),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("text", { class: "required-mark" }, "*")
                  ]),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.licenseplatenumber,
                    value: (_a = $data.params) == null ? void 0 : _a.platenumber,
                    maxlength: "10",
                    "placeholder-style": "color: #999;",
                    onInput: _cache[4] || (_cache[4] = (e2) => $options.handleBindinput(e2, "platenumber"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 设备号 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode("label", { class: "form-label" }, [
                    vue.createTextVNode(
                      vue.toDisplayString($data.langs.devID),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("text", { class: "required-mark" }, "*")
                  ]),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.deviceidentificationnumber,
                    value: (_b = $data.params) == null ? void 0 : _b.sn,
                    maxlength: "20",
                    "placeholder-style": "color: #999;",
                    onInput: _cache[5] || (_cache[5] = (e2) => $options.handleBindinput(e2, "sn"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 车系 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.series),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.vehicleseries,
                    value: (_c = $data.params) == null ? void 0 : _c.vehicleSerialName,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[6] || (_cache[6] = (e2) => $options.handleBindinput(e2, "vehicleSerialName"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 车型 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.model),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.vehiclemodel,
                    value: (_d = $data.params) == null ? void 0 : _d.vehicleModeName,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[7] || (_cache[7] = (e2) => $options.handleBindinput(e2, "vehicleModeName"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 年款 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.year),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.modelyear,
                    value: (_e = $data.params) == null ? void 0 : _e.ccdate,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[8] || (_cache[8] = (e2) => $options.handleBindinput(e2, "ccdate"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 车架号 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.vin),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.vehicleidentificationnumber,
                    value: (_f = $data.params) == null ? void 0 : _f.vin,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[9] || (_cache[9] = (e2) => $options.handleBindinput(e2, "vin"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 油箱容积 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.fuel),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.fueltankcapacity,
                    value: (_g = $data.params) == null ? void 0 : _g.xsgw,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[10] || (_cache[10] = (e2) => $options.handleBindinput(e2, "xsgw"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 启动方式 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.start),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "card-info-item-tabs" }, [
                    vue.createElementVNode("view", { class: "card-info-item-tabs-btn" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass($data.batterylift == $data.langs.pushstart ? "tabs-active" : ""),
                          onClick: _cache[11] || (_cache[11] = ($event) => $options.handleBatterylift($data.langs.pushstart))
                        },
                        vue.toDisplayString($data.langs.pushstart),
                        3
                        /* TEXT, CLASS */
                      ),
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass($data.batterylift == $data.langs.phykey ? "tabs-active" : ""),
                          onClick: _cache[12] || (_cache[12] = ($event) => $options.handleBatterylift($data.langs.phykey))
                        },
                        vue.toDisplayString($data.langs.phykey),
                        3
                        /* TEXT, CLASS */
                      ),
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass($data.batterylift == $data.langs.other ? "tabs-active" : ""),
                          onClick: _cache[13] || (_cache[13] = ($event) => $options.handleBatterylift($data.langs.other))
                        },
                        vue.toDisplayString($data.langs.other),
                        3
                        /* TEXT, CLASS */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "tabs-footer" }, [
                      vue.createElementVNode(
                        "view",
                        null,
                        vue.toDisplayString($data.langs.explain) + "：",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "card-info-item-tips" }, [
                        vue.createElementVNode(
                          "view",
                          null,
                          "[" + vue.toDisplayString($data.langs.pushstart) + "]" + vue.toDisplayString($data.langs.explain1) + "；",
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "view",
                          null,
                          "[" + vue.toDisplayString($data.langs.phykey) + "]" + vue.toDisplayString($data.langs.explain2) + "；",
                          1
                          /* TEXT */
                        )
                      ])
                    ])
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode(
                  "view",
                  {
                    onClick: _cache[14] || (_cache[14] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
                  },
                  vue.toDisplayString($data.langs.confirm) + vue.toDisplayString($data.btnState || $data.langs.create),
                  1
                  /* TEXT */
                )
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesCarRentalVehicleListIndex = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/carRental/vehicleList/index.vue"]]);
  const _sfc_main$s = {
    components: {
      CustomNavBar
    },
    data() {
      return {
        screenInfo: {},
        // 屏幕信息对象
        g_items: [],
        // 车辆列表数据
        langs: {}
      };
    },
    onLoad(options) {
    },
    onShow() {
      this.initialPersonnelList();
      this.initialScreenInfo();
      this.handleGetCurrentLanguage();
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      handleGetCurrentLanguage() {
        let currentLang2 = uni.getStorageSync("lang") || "zh-CN";
        this.langs = langs[currentLang2];
      },
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          formatAppLog("error", "at pages/system/account/transfer/index.vue:105", "[ScreenInfo] 获取屏幕信息失败:", error);
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 获取人员列表
      async initialPersonnelList() {
        try {
          const res = await u_childUserList({});
          this.g_items = this.g_items.concat((res == null ? void 0 : res.content) || []);
        } catch (error) {
          formatAppLog("error", "at pages/system/account/transfer/index.vue:120", "获取人员列表失败:", error);
        }
      },
      // 移交管理员
      async handleTransfer(evt) {
        var _a, _b, _c;
        const targetUserId = (_c = (_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.item) == null ? void 0 : _c.id;
        try {
          const res = await u_transferAdminUser({
            targetUserId
          });
          if (res.code === 1e3) {
            uni.showToast({
              title: res.msg || "操作成功",
              icon: "success"
            });
            this.g_items = [];
            this.$nextTick(() => {
              this.initialPersonnelList();
            });
          } else {
            uni.showToast({
              title: res.msg || "提交失败",
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/system/account/transfer/index.vue:148", "提交出错:", error);
          uni.showToast({
            title: "网络异常，请重试",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "container",
        style: vue.normalizeStyle({ height: `${$options.safeScreenHeight}px` })
      },
      [
        vue.createVNode(_component_CustomNavBar, {
          title: $data.langs.transferadmin
        }, null, 8, ["title"]),
        vue.createCommentVNode(" 主容器 "),
        vue.createElementVNode(
          "view",
          {
            class: "record-container",
            style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
          },
          [
            vue.createElementVNode("scroll-view", {
              style: { "height": "100vh" },
              "scroll-y": ""
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.g_items, (item, index) => {
                  var _a, _b, _c;
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "content-item"
                  }, [
                    vue.createElementVNode("view", { class: "content-item-head" }, [
                      vue.createElementVNode("view", { class: "head-left" }, [
                        vue.createElementVNode("view", { class: "left-category" }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item == null ? void 0 : item.realname),
                            1
                            /* TEXT */
                          )
                        ])
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "content-item-info" }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass("info-item  " + (((_a = item == null ? void 0 : item.username) == null ? void 0 : _a.length) > 15 ? "long-info-item" : ""))
                        },
                        [
                          vue.createElementVNode(
                            "label",
                            null,
                            vue.toDisplayString($data.langs.account) + " ：",
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString((item == null ? void 0 : item.username) || "-"),
                            1
                            /* TEXT */
                          )
                        ],
                        2
                        /* CLASS */
                      ),
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass("info-item  " + (((_b = item == null ? void 0 : item.roleName) == null ? void 0 : _b.length) > 15 ? "long-info-item" : ""))
                        },
                        [
                          vue.createElementVNode(
                            "label",
                            null,
                            vue.toDisplayString($data.langs.role) + " ：",
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item == null ? void 0 : item.roleName),
                            1
                            /* TEXT */
                          )
                        ],
                        2
                        /* CLASS */
                      ),
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass("info-item  " + (((_c = item == null ? void 0 : item.mobile) == null ? void 0 : _c.length) > 15 ? "long-info-item" : ""))
                        },
                        [
                          vue.createElementVNode(
                            "label",
                            null,
                            vue.toDisplayString($data.langs.mobile) + " ：",
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString((item == null ? void 0 : item.mobile) || "-"),
                            1
                            /* TEXT */
                          )
                        ],
                        2
                        /* CLASS */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "content-item-footer" }, [
                      vue.createElementVNode("view", { class: "footer-right" }, [
                        vue.createElementVNode("view", {
                          class: "footer-right-btn",
                          "data-item": item,
                          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleTransfer && $options.handleTransfer(...args))
                        }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString($data.langs.transferadmin),
                            1
                            /* TEXT */
                          )
                        ], 8, ["data-item"])
                      ])
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesSystemAccountTransferIndex = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/system/account/transfer/index.vue"]]);
  const NODE_KEY = "$treeNodeId";
  const markNodeData = function(node, data) {
    if (!data || data[NODE_KEY])
      return;
    Object.defineProperty(data, NODE_KEY, {
      value: node.id,
      enumerable: false,
      configurable: false,
      writable: false
    });
  };
  const getNodeKey = function(key, data) {
    if (!data)
      return null;
    if (!key)
      return data[NODE_KEY];
    return data[key];
  };
  const objectAssign = function(target) {
    for (let i = 1, j = arguments.length; i < j; i++) {
      let source = arguments[i] || {};
      for (let prop in source) {
        if (source.hasOwnProperty(prop)) {
          let value = source[prop];
          if (value !== void 0) {
            target[prop] = value;
          }
        }
      }
    }
    return target;
  };
  const arrayFindIndex = function(arr, pred) {
    for (let i = 0; i !== arr.length; ++i) {
      if (pred(arr[i])) {
        return i;
      }
    }
    return -1;
  };
  const getChildState = function(node) {
    let all = true;
    let none = true;
    let allWithoutDisable = true;
    for (let i = 0, j = node.length; i < j; i++) {
      const n = node[i];
      if (n.checked !== true || n.indeterminate) {
        all = false;
        if (!n.disabled) {
          allWithoutDisable = false;
        }
      }
      if (n.checked !== false || n.indeterminate) {
        none = false;
      }
    }
    return {
      all,
      none,
      allWithoutDisable,
      half: !all && !none
    };
  };
  const reInitChecked = function(node) {
    if (!node || node.childNodesId.length === 0)
      return;
    let childNodes = node.getChildNodes(node.childNodesId);
    const {
      all,
      none,
      half
    } = getChildState(childNodes);
    if (all) {
      node.checked = true;
      node.indeterminate = false;
    } else if (half) {
      node.checked = false;
      node.indeterminate = true;
    } else if (none) {
      node.checked = false;
      node.indeterminate = false;
    }
    let parent = node.getParent(node.parentId);
    if (!parent || parent.level === 0)
      return;
    if (!node.store().checkStrictly) {
      reInitChecked(parent);
    }
  };
  const getPropertyFromData = function(node, prop) {
    const props = node.store().props;
    const data = node.data || {};
    const config = props[prop];
    if (typeof config === "function") {
      return config(data, node);
    } else if (typeof config === "string") {
      return data[config];
    } else if (typeof config === "undefined") {
      const dataProp = data[prop];
      return dataProp === void 0 ? "" : dataProp;
    }
  };
  const isNull = function(v) {
    return v === void 0 || v === null || v === "";
  };
  const getStore = function(store) {
    let thisStore = store;
    return function() {
      return thisStore;
    };
  };
  let nodeIdSeed = 0;
  class Node {
    constructor(options) {
      this.time = (/* @__PURE__ */ new Date()).getTime();
      this.id = nodeIdSeed++;
      this.text = null;
      this.checked = false;
      this.indeterminate = false;
      this.data = null;
      this.expanded = false;
      this.parentId = null;
      this.visible = true;
      this.isCurrent = false;
      for (let name in options) {
        if (options.hasOwnProperty(name)) {
          if (name === "store") {
            this.store = getStore(options[name]);
          } else {
            this[name] = options[name];
          }
        }
      }
      if (!this.store()) {
        throw new Error("[Node]store is required!");
      }
      this.level = 0;
      this.loaded = false;
      this.childNodesId = [];
      this.loading = false;
      this.label = getPropertyFromData(this, "label");
      this.key = this._getKey();
      this.disabled = getPropertyFromData(this, "disabled");
      this.nextSibling = null;
      this.previousSibling = null;
      this.icon = "";
      this._handleParentAndLevel();
      this._handleProps();
      this._handleExpand();
      this._handleCurrent();
      if (this.store().lazy) {
        this.store()._initDefaultCheckedNode(this);
      }
      this.updateLeafState();
    }
    _getKey() {
      if (!this.data || Array.isArray(this.data))
        return null;
      if (typeof this.data === "object") {
        const nodeKey = this.store().key;
        const key = this.data[nodeKey];
        if (typeof key === "undefined") {
          throw new Error(`您配置的node-key为"${nodeKey}"，但数据中并未找到对应"${nodeKey}"属性的值，请检查node-key的配置是否合理`);
        }
        return key;
      }
      throw new Error("不合法的data数据");
    }
    _handleParentAndLevel() {
      if (this.parentId !== null) {
        let parent = this.getParent(this.parentId);
        if (this.store().isInjectParentInNode) {
          this.parent = parent;
        }
        if (!parent) {
          parent = {
            level: 0
          };
        } else {
          const parentChildNodes = parent.getChildNodes(parent.childNodesId);
          const index = parent.childNodesId.indexOf(this.key);
          this.nextSibling = index > -1 ? parentChildNodes[index + 1] : null;
          this.previousSibling = index > 0 ? parentChildNodes[index - 1] : null;
        }
        this.level = parent.level + 1;
      }
    }
    _handleProps() {
      const props = this.store().props;
      if (this.store().showNodeIcon) {
        if (props && typeof props.icon !== "undefined") {
          this.icon = getPropertyFromData(this, "icon");
        } else {
          formatAppLog("warn", "at components/ly-tree/model/node.js:120", '请配置props属性中的"icon"字段');
        }
      }
      this.store().registerNode(this);
      if (props && typeof props.isLeaf !== "undefined") {
        const isLeaf = getPropertyFromData(this, "isLeaf");
        if (typeof isLeaf === "boolean") {
          this.isLeafByUser = isLeaf;
        }
      }
    }
    _handleExpand() {
      if (this.store().lazy !== true && this.data) {
        this.setData(this.data);
        if (this.store().defaultExpandAll) {
          this.expanded = true;
        }
      } else if (this.level > 0 && this.store().lazy && this.store().defaultExpandAll) {
        this.expand();
      }
      if (!Array.isArray(this.data)) {
        markNodeData(this, this.data);
      }
      if (!this.data)
        return;
      const defaultExpandedKeys = this.store().defaultExpandedKeys;
      const key = this.store().key;
      if (key && defaultExpandedKeys && defaultExpandedKeys.indexOf(this.key) !== -1) {
        this.expand(null, this.store().autoExpandparent);
      }
    }
    _handleCurrent() {
      const key = this.store().key;
      if (key && this.store().currentNodeKey !== void 0 && this.key === this.store().currentNodeKey) {
        this.store().currentNode = this;
        this.store().currentNode.isCurrent = true;
      }
    }
    destroyStore() {
    }
    setData(data) {
      if (!Array.isArray(data)) {
        markNodeData(this, data);
      }
      this.data = data;
      this.childNodesId = [];
      let children;
      if (this.level === 0 && Array.isArray(this.data)) {
        children = this.data;
      } else {
        children = getPropertyFromData(this, "children") || [];
      }
      for (let i = 0, j = children.length; i < j; i++) {
        this.insertChild({
          data: children[i]
        });
      }
    }
    contains(target, deep = true) {
      const walk = function(parent) {
        const children = parent.getChildNodes(parent.childNodesId) || [];
        let result = false;
        for (let i = 0, j = children.length; i < j; i++) {
          const child = children[i];
          if (child === target || deep && walk(child)) {
            result = true;
            break;
          }
        }
        return result;
      };
      return walk(this);
    }
    remove() {
      if (this.parentId !== null) {
        const parent = this.getParent(this.parentId);
        parent.removeChild(this);
      }
    }
    insertChild(child, index, batch) {
      if (!child)
        throw new Error("insertChild error: child is required.");
      if (!(child instanceof Node)) {
        if (!batch) {
          const children = this.getChildren(true);
          if (children.indexOf(child.data) === -1) {
            if (typeof index === "undefined" || index < 0) {
              children.push(child.data);
            } else {
              children.splice(index, 0, child.data);
            }
          }
        }
        objectAssign(child, {
          parentId: isNull(this.key) ? "" : this.key,
          store: this.store()
        });
        child = new Node(child);
      }
      child.level = this.level + 1;
      if (typeof index === "undefined" || index < 0) {
        this.childNodesId.push(child.key);
      } else {
        this.childNodesId.splice(index, 0, child.key);
      }
      this.updateLeafState();
    }
    insertBefore(child, ref) {
      let index;
      if (ref) {
        index = this.childNodesId.indexOf(ref.id);
      }
      this.insertChild(child, index);
    }
    insertAfter(child, ref) {
      let index;
      if (ref) {
        index = this.childNodesId.indexOf(ref.id);
        if (index !== -1)
          index += 1;
      }
      this.insertChild(child, index);
    }
    removeChild(child) {
      const children = this.getChildren() || [];
      const dataIndex = children.indexOf(child.data);
      if (dataIndex > -1) {
        children.splice(dataIndex, 1);
      }
      const index = this.childNodesId.indexOf(child.key);
      if (index > -1) {
        this.store() && this.store().deregisterNode(child);
        child.parentId = null;
        this.childNodesId.splice(index, 1);
      }
      this.updateLeafState();
    }
    removeChildByData(data) {
      let targetNode = null;
      for (let i = 0; i < this.childNodesId.length; i++) {
        let node = this.getChildNodes(this.childNodesId);
        if (node[i].data === data) {
          targetNode = node[i];
          break;
        }
      }
      if (targetNode) {
        this.removeChild(targetNode);
      }
    }
    // 为了避免APP端parent嵌套结构导致报错，这里parent需要从nodesMap中获取
    getParent(parentId) {
      try {
        if (!parentId.toString())
          return null;
        return this.store().nodesMap[parentId];
      } catch (error) {
        return null;
      }
    }
    // 为了避免APP端childNodes嵌套结构导致报错，这里childNodes需要从nodesMap中获取
    getChildNodes(childNodesId) {
      let childNodes = [];
      if (childNodesId.length === 0)
        return childNodes;
      childNodesId.forEach((key) => {
        childNodes.push(this.store().nodesMap[key]);
      });
      return childNodes;
    }
    expand(callback, expandparent) {
      const done = () => {
        if (expandparent) {
          let parent = this.getParent(this.parentId);
          while (parent && parent.level > 0) {
            parent.expanded = true;
            parent = this.getParent(parent.parentId);
          }
        }
        this.expanded = true;
        if (callback)
          callback();
      };
      if (this.shouldLoadData()) {
        this.loadData(function(data) {
          if (Array.isArray(data)) {
            if (this.checked) {
              this.setChecked(true, true);
            } else if (!this.store().checkStrictly) {
              reInitChecked(this);
            }
            done();
          }
        });
      } else {
        done();
      }
    }
    doCreateChildren(array, defaultProps = {}) {
      array.forEach((item) => {
        this.insertChild(objectAssign({
          data: item
        }, defaultProps), void 0, true);
      });
    }
    collapse() {
      this.expanded = false;
    }
    shouldLoadData() {
      return this.store().lazy === true && this.store().load && !this.loaded;
    }
    updateLeafState() {
      if (this.store().lazy === true && this.loaded !== true && typeof this.isLeafByUser !== "undefined") {
        this.isLeaf = this.isLeafByUser;
        return;
      }
      const childNodesId = this.childNodesId;
      if (!this.store().lazy || this.store().lazy === true && this.loaded === true) {
        this.isLeaf = !childNodesId || childNodesId.length === 0;
        return;
      }
      this.isLeaf = false;
    }
    setChecked(value, deep, recursion, passValue) {
      this.indeterminate = value === "half";
      this.checked = value === true;
      if (this.checked && this.store().expandOnCheckNode) {
        this.expand(null, true);
      }
      if (this.store().checkStrictly)
        return;
      if (this.store().showRadio)
        return;
      if (!(this.shouldLoadData() && !this.store().checkDescendants)) {
        let childNodes = this.getChildNodes(this.childNodesId);
        let {
          all,
          allWithoutDisable
        } = getChildState(childNodes);
        if (!this.isLeaf && (!all && allWithoutDisable)) {
          this.checked = false;
          value = false;
        }
        const handleDescendants = () => {
          if (deep) {
            let childNodes2 = this.getChildNodes(this.childNodesId);
            for (let i = 0, j = childNodes2.length; i < j; i++) {
              const child = childNodes2[i];
              passValue = passValue || value !== false;
              const isCheck = child.disabled ? child.checked : passValue;
              child.setChecked(isCheck, deep, true, passValue);
            }
            const {
              half,
              all: all2
            } = getChildState(childNodes2);
            if (!all2) {
              this.checked = all2;
              this.indeterminate = half;
            }
          }
        };
        if (this.shouldLoadData()) {
          this.loadData(() => {
            handleDescendants();
            reInitChecked(this);
          }, {
            checked: value !== false
          });
          return;
        } else {
          handleDescendants();
        }
      }
      if (!this.parentId)
        return;
      let parent = this.getParent(this.parentId);
      if (parent && parent.level === 0)
        return;
      if (!recursion) {
        reInitChecked(parent);
      }
    }
    setRadioChecked(value) {
      const allNodes = this.store()._getAllNodes().sort((a, b) => b.level - a.level);
      allNodes.forEach((node) => node.setChecked(false, false));
      this.checked = value === true;
    }
    getChildren(forceInit = false) {
      if (this.level === 0)
        return this.data;
      const data = this.data;
      if (!data)
        return null;
      const props = this.store().props;
      let children = "children";
      if (props) {
        children = props.children || "children";
      }
      if (data[children] === void 0) {
        data[children] = null;
      }
      if (forceInit && !data[children]) {
        data[children] = [];
      }
      return data[children];
    }
    updateChildren() {
      let childNodes = this.getChildNodes(this.childNodesId);
      const newData = this.getChildren() || [];
      const oldData = childNodes.map((node) => node.data);
      const newDataMap = {};
      const newNodes = [];
      newData.forEach((item, index) => {
        const key = item[NODE_KEY];
        const isNodeExists = !!key && arrayFindIndex(oldData, (data) => data[NODE_KEY] === key) >= 0;
        if (isNodeExists) {
          newDataMap[key] = {
            index,
            data: item
          };
        } else {
          newNodes.push({
            index,
            data: item
          });
        }
      });
      if (!this.store().lazy) {
        oldData.forEach((item) => {
          if (!newDataMap[item[NODE_KEY]])
            this.removeChildByData(item);
        });
      }
      newNodes.forEach(({
        index,
        data
      }) => {
        this.insertChild({
          data
        }, index);
      });
      this.updateLeafState();
    }
    loadData(callback, defaultProps = {}) {
      if (this.store().lazy === true && this.store().load && !this.loaded && (!this.loading || Object.keys(defaultProps).length)) {
        this.loading = true;
        const resolve = (children) => {
          this.loaded = true;
          this.loading = false;
          this.childNodesId = [];
          this.doCreateChildren(children, defaultProps);
          this.updateLeafState();
          callback && callback.call(this, children);
        };
        this.store().load(this, resolve);
      } else {
        callback && callback.call(this);
      }
    }
  }
  class TreeStore {
    constructor(options) {
      this.ready = false;
      this.currentNode = null;
      this.currentNodeKey = null;
      Object.assign(this, options);
      if (!this.key) {
        throw new Error("[Tree] nodeKey is required");
      }
      this.nodesMap = {};
      this.root = new Node({
        data: this.data,
        store: this
      });
      if (this.lazy && this.load) {
        const loadFn = this.load;
        loadFn(this.root, (data) => {
          this.root.doCreateChildren(data);
          this._initDefaultCheckedNodes();
          this.ready = true;
        });
      } else {
        this._initDefaultCheckedNodes();
        this.ready = true;
      }
    }
    filter(value, data) {
      const filterNodeMethod = this.filterNodeMethod;
      const lazy = this.lazy;
      const _self = this;
      const traverse = function(node) {
        const childNodes = node.root ? node.root.getChildNodes(node.root.childNodesId) : node.getChildNodes(node.childNodesId);
        childNodes.forEach((child) => {
          if (data && typeof data === "object") {
            let nodePath = _self.getNodePath(child.data);
            if (!nodePath.some((pathItem) => pathItem[_self.key] === data[_self.key])) {
              child.visible = false;
              traverse(child);
              return;
            }
          }
          if (_self.childVisibleForFilterNode) {
            let parent = child.getParent(child.parentId);
            child.visible = filterNodeMethod.call(child, value, child.data, child) || parent && parent.visible;
          } else {
            child.visible = filterNodeMethod.call(child, value, child.data, child);
          }
          traverse(child);
        });
        if (!node.visible && childNodes.length) {
          let allHidden = true;
          allHidden = !childNodes.some((child) => child.visible);
          if (node.root) {
            node.root.visible = allHidden === false;
          } else {
            node.visible = allHidden === false;
          }
        }
        if (!value)
          return;
        if (node.visible && !node.isLeaf && !lazy)
          node.expand();
      };
      traverse(this);
    }
    setData(newVal) {
      const instanceChanged = newVal !== this.root.data;
      if (instanceChanged) {
        this.root.setData(newVal);
        this._initDefaultCheckedNodes();
      } else {
        this.root.updateChildren();
      }
    }
    getNode(data) {
      if (data instanceof Node)
        return data;
      const key = typeof data !== "object" ? data : getNodeKey(this.key, data);
      if (!key)
        return null;
      return this.nodesMap[key] || null;
    }
    insertBefore(data, refData) {
      const refNode = this.getNode(refData);
      let parent = refNode.getParent(refNode.parentId);
      parent.insertBefore({
        data
      }, refNode);
    }
    insertAfter(data, refData) {
      const refNode = this.getNode(refData);
      let parent = refNode.getParent(refNode.parentId);
      parent.insertAfter({
        data
      }, refNode);
    }
    remove(data) {
      const node = this.getNode(data);
      if (node && node.parentId !== null) {
        let parent = node.getParent(node.parentId);
        if (node === this.currentNode) {
          this.currentNode = null;
        }
        parent.removeChild(node);
      }
    }
    append(data, parentData) {
      const parentNode = parentData ? this.getNode(parentData) : this.root;
      if (parentNode) {
        parentNode.insertChild({
          data
        });
      }
    }
    _initDefaultCheckedNodes() {
      const defaultCheckedKeys = this.defaultCheckedKeys || [];
      const nodesMap = this.nodesMap;
      let checkedKeyfromData = [];
      let totalCheckedKeys = [];
      for (let key in nodesMap) {
        let checked = getPropertyFromData(nodesMap[key], "checked") || false;
        checked && checkedKeyfromData.push(key);
      }
      totalCheckedKeys = Array.from(/* @__PURE__ */ new Set([...defaultCheckedKeys, ...checkedKeyfromData]));
      totalCheckedKeys.forEach((checkedKey) => {
        const node = nodesMap[checkedKey];
        if (node) {
          node.setChecked(true, !this.checkStrictly);
        }
      });
    }
    _initDefaultCheckedNode(node) {
      const defaultCheckedKeys = this.defaultCheckedKeys || [];
      if (defaultCheckedKeys.indexOf(node.key) !== -1) {
        node.setChecked(true, !this.checkStrictly);
      }
    }
    toggleExpendAll(isExpandAll) {
      const allNodes = this._getAllNodes();
      allNodes.forEach((item) => {
        const node = this.getNode(item.key);
        if (node)
          isExpandAll ? node.expand() : node.collapse();
      });
    }
    setCheckAll(isCkeckAll) {
      const allNodes = this._getAllNodes();
      allNodes.forEach((item) => {
        item.setChecked(isCkeckAll, false);
      });
    }
    setDefaultCheckedKey(newVal) {
      if (newVal !== this.defaultCheckedKeys) {
        this.defaultCheckedKeys = newVal;
        this._initDefaultCheckedNodes();
      }
    }
    registerNode(node) {
      const key = this.key;
      if (!key || !node || !node.data)
        return;
      const nodeKey = node.key;
      if (nodeKey !== void 0)
        this.nodesMap[node.key] = node;
    }
    deregisterNode(node) {
      const key = this.key;
      if (!key || !node || !node.data)
        return;
      let childNodes = node.getChildNodes(node.childNodesId);
      childNodes.forEach((child) => {
        this.deregisterNode(child);
      });
      delete this.nodesMap[node.key];
    }
    getNodePath(data) {
      if (!this.key)
        throw new Error("[Tree] nodeKey is required in getNodePath");
      const node = this.getNode(data);
      if (!node)
        return [];
      const path = [node.data];
      let parent = node.getParent(node.parentId);
      while (parent && parent !== this.root) {
        path.push(parent.data);
        parent = parent.getParent(parent.parentId);
      }
      return path.reverse();
    }
    getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
      const checkedNodes = [];
      const traverse = function(node) {
        const childNodes = node.root ? node.root.getChildNodes(node.root.childNodesId) : node.getChildNodes(node.childNodesId);
        childNodes.forEach((child) => {
          if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
            checkedNodes.push(child.data);
          }
          traverse(child);
        });
      };
      traverse(this);
      return checkedNodes;
    }
    getCheckedKeys(leafOnly = false, includeHalfChecked = false) {
      return this.getCheckedNodes(leafOnly, includeHalfChecked).map((data) => (data || {})[this.key]);
    }
    getHalfCheckedNodes() {
      const nodes = [];
      const traverse = function(node) {
        const childNodes = node.root ? node.root.getChildNodes(node.root.childNodesId) : node.getChildNodes(node.childNodesId);
        childNodes.forEach((child) => {
          if (child.indeterminate) {
            nodes.push(child.data);
          }
          traverse(child);
        });
      };
      traverse(this);
      return nodes;
    }
    getHalfCheckedKeys() {
      return this.getHalfCheckedNodes().map((data) => (data || {})[this.key]);
    }
    _getAllNodes() {
      const allNodes = [];
      const nodesMap = this.nodesMap;
      for (let nodeKey in nodesMap) {
        if (nodesMap.hasOwnProperty(nodeKey)) {
          allNodes.push(nodesMap[nodeKey]);
        }
      }
      return allNodes;
    }
    updateChildren(key, data) {
      const node = this.nodesMap[key];
      if (!node)
        return;
      const childNodes = node.getChildNodes(node.childNodesId);
      for (let i = childNodes.length - 1; i >= 0; i--) {
        const child = childNodes[i];
        this.remove(child.data);
      }
      for (let i = 0, j = data.length; i < j; i++) {
        const child = data[i];
        this.append(child, node.data);
      }
    }
    _setCheckedKeys(key, leafOnly = false, checkedKeys) {
      const allNodes = this._getAllNodes().sort((a, b) => b.level - a.level);
      const cache = /* @__PURE__ */ Object.create(null);
      const keys = Object.keys(checkedKeys);
      allNodes.forEach((node) => node.setChecked(false, false));
      for (let i = 0, j = allNodes.length; i < j; i++) {
        const node = allNodes[i];
        let nodeKey = node.data[key];
        if (typeof nodeKey === "undefined")
          continue;
        nodeKey = nodeKey.toString();
        let checked = keys.indexOf(nodeKey) > -1;
        if (!checked) {
          if (node.checked && !cache[nodeKey]) {
            node.setChecked(false, false);
          }
          continue;
        }
        let parent = node.getParent(node.parentId);
        while (parent && parent.level > 0) {
          cache[parent.data[key]] = true;
          parent = parent.getParent(parent.parentId);
        }
        if (node.isLeaf || this.checkStrictly) {
          node.setChecked(true, false);
          continue;
        }
        node.setChecked(true, true);
        if (leafOnly) {
          node.setChecked(false, false);
          const traverse = function(node2) {
            const childNodes = node2.getChildNodes(node2.childNodesId);
            childNodes.forEach((child) => {
              if (!child.isLeaf) {
                child.setChecked(false, false);
              }
              traverse(child);
            });
          };
          traverse(node);
        }
      }
    }
    setCheckedNodes(array, leafOnly = false) {
      const key = this.key;
      const checkedKeys = {};
      array.forEach((item) => {
        checkedKeys[(item || {})[key]] = true;
      });
      this._setCheckedKeys(key, leafOnly, checkedKeys);
    }
    setCheckedKeys(keys, leafOnly = false) {
      this.defaultCheckedKeys = keys;
      const key = this.key;
      const checkedKeys = {};
      keys.forEach((key2) => {
        checkedKeys[key2] = true;
      });
      this._setCheckedKeys(key, leafOnly, checkedKeys);
    }
    setDefaultExpandedKeys(keys) {
      keys = keys || [];
      this.defaultExpandedKeys = keys;
      keys.forEach((key) => {
        const node = this.getNode(key);
        if (node)
          node.expand(null, this.autoExpandParent);
      });
    }
    setChecked(data, checked, deep) {
      const node = this.getNode(data);
      if (node) {
        node.setChecked(!!checked, deep);
      }
    }
    getCurrentNode() {
      return this.currentNode;
    }
    setCurrentNode(currentNode) {
      const prevCurrentNode = this.currentNode;
      if (prevCurrentNode) {
        prevCurrentNode.isCurrent = false;
      }
      this.currentNode = currentNode;
      this.currentNode.isCurrent = true;
      this.expandCurrentNodeParent && this.currentNode.expand(null, true);
    }
    setUserCurrentNode(node) {
      const key = node[this.key];
      const currNode = this.nodesMap[key];
      this.setCurrentNode(currNode);
    }
    setCurrentNodeKey(key) {
      if (key === null || key === void 0) {
        this.currentNode && (this.currentNode.isCurrent = false);
        this.currentNode = null;
        return;
      }
      const node = this.getNode(key);
      if (node) {
        this.setCurrentNode(node);
      }
    }
  }
  const _sfc_main$r = {
    data() {
      return {
        classObj: {}
      };
    },
    props: {
      type: {
        type: String,
        validator(t) {
          return t === "radio" || t === "checkbox";
        }
      },
      checked: Boolean,
      disabled: Boolean,
      indeterminate: Boolean
    },
    created() {
      this.classObj = {
        wrapper: `ly-${this.type}`,
        input: `ly-${this.type}__input`,
        inner: `ly-${this.type}__inner`
      };
    },
    methods: {
      handleClick() {
        this.$emit("check", this.checked);
      }
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        class: vue.normalizeClass($data.classObj.wrapper),
        onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.handleClick && $options.handleClick(...args), ["stop"]))
      },
      [
        vue.createElementVNode(
          "text",
          {
            class: vue.normalizeClass([$data.classObj.input, { "is-indeterminate": $props.indeterminate, "is-checked": $props.checked, "is-disabled": $props.disabled }])
          },
          [
            vue.createElementVNode(
              "text",
              {
                class: vue.normalizeClass($data.classObj.inner)
              },
              null,
              2
              /* CLASS */
            )
          ],
          2
          /* CLASS */
        )
      ],
      2
      /* CLASS */
    );
  }
  const lyCheckbox = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__scopeId", "data-v-94b8cb88"], ["__file", "C:/ZXT/ZXTRentN/static/google20256/components/ly-tree/components/ly-checkbox.vue"]]);
  const _sfc_main$q = {
    name: "LyTreeNode",
    componentName: "LyTreeNode",
    components: {
      lyCheckbox
    },
    props: {
      nodeId: [Number, String],
      renderAfterExpand: {
        type: Boolean,
        default: true
      },
      checkOnlyLeaf: {
        type: Boolean,
        default: false
      },
      showCheckbox: {
        type: Boolean,
        default: false
      },
      showRadio: {
        type: Boolean,
        default: false
      },
      indent: Number,
      iconClass: String
    },
    data() {
      return {
        node: {
          indeterminate: false,
          checked: false,
          expanded: false
        },
        expanded: false,
        childNodeRendered: false,
        oldChecked: null,
        oldIndeterminate: null,
        highlightCurrent: false
      };
    },
    inject: ["tree"],
    computed: {
      checkboxVisible() {
        if (this.checkOnlyLeaf) {
          return this.showCheckbox && this.node.isLeaf;
        }
        return this.showCheckbox;
      },
      radioVisible() {
        if (this.checkOnlyLeaf) {
          return this.showRadio && this.node.isLeaf;
        }
        return this.showRadio;
      }
    },
    watch: {
      "node.indeterminate"(val) {
        this.handleSelectChange(this.node.checked, val);
      },
      "node.checked"(val) {
        this.handleSelectChange(val, this.node.indeterminate);
      },
      "node.expanded"(val) {
        this.$nextTick(() => this.expanded = val);
        if (val) {
          this.childNodeRendered = true;
        }
      }
    },
    methods: {
      getNodeKey(nodeId) {
        let node = this.tree.store.root.getChildNodes([nodeId])[0];
        return getNodeKey(this.tree.nodeKey, node.data);
      },
      handleSelectChange(checked, indeterminate) {
        if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
          if (this.checkOnlyLeaf && !this.node.isLeaf)
            return;
          if (this.checkboxVisible) {
            const allNodes = this.tree.store._getAllNodes();
            this.tree.$emit("check-change", {
              checked,
              indeterminate,
              node: this.node,
              data: this.node.data,
              checkedall: allNodes.every((item) => item.checked)
            });
          } else {
            this.tree.$emit("radio-change", {
              checked,
              node: this.node,
              data: this.node.data,
              checkedall: false
            });
          }
        }
        if (!this.expanded && this.tree.expandOnCheckNode && checked) {
          this.handleExpandIconClick();
        }
        this.oldChecked = checked;
        this.indeterminate = indeterminate;
      },
      handleClick() {
        this.tree.store.setCurrentNode(this.node);
        this.tree.$emit("current-change", {
          node: this.node,
          data: this.tree.store.currentNode ? this.tree.store.currentNode.data : null,
          currentNode: this.tree.store.currentNode
        });
        this.tree.currentNode = this.node;
        if (this.tree.expandOnClickNode) {
          this.handleExpandIconClick();
        }
        if (this.tree.checkOnClickNode && !this.node.disabled) {
          (this.checkboxVisible || this.radioVisible) && this.handleCheckChange(!this.node.checked);
        }
        this.tree.$emit("node-click", this.node);
      },
      handleExpandIconClick() {
        if (this.node.isLeaf)
          return;
        if (this.expanded) {
          this.tree.$emit("node-collapse", this.node);
          this.node.collapse();
        } else {
          this.node.expand();
          this.tree.$emit("node-expand", this.node);
          if (this.tree.accordion) {
            uni.$emit(`${this.tree.elId}-tree-node-expand`, this.node);
          }
        }
      },
      handleCheckChange(checked) {
        if (this.node.disabled)
          return;
        if (this.checkboxVisible) {
          this.node.setChecked(checked, !(this.tree.checkStrictly || this.checkOnlyLeaf));
        } else {
          this.node.setRadioChecked(checked);
        }
        this.$nextTick(() => {
          this.tree.$emit("check", {
            node: this.node,
            data: this.node.data,
            checkedNodes: this.tree.store.getCheckedNodes(),
            checkedKeys: this.tree.store.getCheckedKeys(),
            halfCheckedNodes: this.tree.store.getHalfCheckedNodes(),
            halfCheckedKeys: this.tree.store.getHalfCheckedKeys()
          });
        });
      },
      handleImageError() {
        this.node.icon = this.tree.defaultNodeIcon;
      }
    },
    created() {
      if (!this.tree) {
        throw new Error("Can not find node's tree.");
      }
      this.node = this.tree.store.nodesMap[this.nodeId];
      this.highlightCurrent = this.tree.highlightCurrent;
      if (this.node.expanded) {
        this.expanded = true;
        this.childNodeRendered = true;
      }
      const props = this.tree.props || {};
      const childrenKey = props["children"] || "children";
      this.$watch(`node.data.${childrenKey}`, () => {
        this.node.updateChildren();
      });
      if (this.tree.accordion) {
        uni.$on(`${this.tree.elId}-tree-node-expand`, (node) => {
          if (this.node.id !== node.id && this.node.level === node.level) {
            this.node.collapse();
          }
        });
      }
    },
    beforeDestroy() {
      this.$parent = null;
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ly_checkbox = vue.resolveComponent("ly-checkbox");
    const _component_ly_tree_node = vue.resolveComponent("ly-tree-node", true);
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock(
      "view",
      {
        ref: "node",
        name: "LyTreeNode",
        class: vue.normalizeClass(["ly-tree-node", {
          "is-expanded": $data.expanded,
          "is-hidden": !$data.node.visible,
          "is-checked": !$data.node.disabled && $data.node.checked
        }]),
        role: "treeitem",
        onClick: _cache[3] || (_cache[3] = vue.withModifiers((...args) => $options.handleClick && $options.handleClick(...args), ["stop"]))
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["ly-tree-node__content", {
              "is-current": $data.node.isCurrent && $data.highlightCurrent
            }]),
            style: vue.normalizeStyle({
              "padding-left": ($data.node.level - 1) * $props.indent + "px"
            })
          },
          [
            vue.createElementVNode(
              "text",
              {
                onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.handleExpandIconClick && $options.handleExpandIconClick(...args), ["stop"])),
                class: vue.normalizeClass([
                  {
                    "is-leaf": $data.node.isLeaf,
                    expanded: !$data.node.isLeaf && $data.node.expanded
                  },
                  "ly-tree-node__expand-icon",
                  $props.iconClass ? $props.iconClass : "ly-iconfont ly-icon-caret-right"
                ])
              },
              null,
              2
              /* CLASS */
            ),
            $options.checkboxVisible || $options.radioVisible ? (vue.openBlock(), vue.createBlock(_component_ly_checkbox, {
              key: 0,
              type: $options.checkboxVisible ? "checkbox" : "radio",
              checked: $data.node.checked,
              indeterminate: $data.node.indeterminate,
              disabled: !!$data.node.disabled,
              onCheck: _cache[1] || (_cache[1] = ($event) => $options.handleCheckChange(!$data.node.checked))
            }, null, 8, ["type", "checked", "indeterminate", "disabled"])) : vue.createCommentVNode("v-if", true),
            $data.node.loading ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 1,
              class: "ly-tree-node__loading-icon ly-iconfont ly-icon-loading"
            })) : vue.createCommentVNode("v-if", true),
            $data.node.icon && $data.node.icon.length > 0 ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 2 },
              [
                $data.node.icon.indexOf("/") !== -1 ? (vue.openBlock(), vue.createElementBlock("image", {
                  key: 0,
                  class: "ly-tree-node__icon",
                  mode: "widthFix",
                  src: $data.node.icon,
                  onError: _cache[2] || (_cache[2] = (...args) => $options.handleImageError && $options.handleImageError(...args))
                }, null, 40, ["src"])) : (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 1,
                    class: vue.normalizeClass(["ly-tree-node__icon", $data.node.icon])
                  },
                  null,
                  2
                  /* CLASS */
                ))
              ],
              64
              /* STABLE_FRAGMENT */
            )) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode(
              "text",
              { class: "ly-tree-node__label" },
              vue.toDisplayString($data.node.label),
              1
              /* TEXT */
            )
          ],
          6
          /* CLASS, STYLE */
        ),
        !$props.renderAfterExpand || $data.childNodeRendered ? vue.withDirectives((vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "ly-tree-node__children",
            role: "group"
          },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.node.childNodesId, (cNodeId) => {
                return vue.openBlock(), vue.createBlock(_component_ly_tree_node, {
                  nodeId: cNodeId,
                  "render-after-expand": $props.renderAfterExpand,
                  "show-checkbox": $props.showCheckbox,
                  "show-radio": $props.showRadio,
                  "check-only-leaf": $props.checkOnlyLeaf,
                  key: $options.getNodeKey(cNodeId),
                  indent: $props.indent,
                  "icon-class": $props.iconClass
                }, null, 8, ["nodeId", "render-after-expand", "show-checkbox", "show-radio", "check-only-leaf", "indent", "icon-class"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          512
          /* NEED_PATCH */
        )), [
          [vue.vShow, $data.expanded]
        ]) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    )), [
      [vue.vShow, $data.node.visible]
    ]);
  }
  const LyTreeNode = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-27d3dc07"], ["__file", "C:/ZXT/ZXTRentN/static/google20256/components/ly-tree/ly-tree-node.vue"]]);
  const _sfc_main$p = {
    name: "LyTree",
    componentName: "LyTree",
    components: {
      LyTreeNode
    },
    data() {
      return {
        updateKey: (/* @__PURE__ */ new Date()).getTime(),
        // 数据更新的时候，重新渲染树
        elId: `ly_${Math.ceil(Math.random() * 1e6).toString(36)}`,
        visible: true,
        store: {
          ready: false
        },
        currentNode: null,
        childNodesId: []
      };
    },
    provide() {
      return {
        tree: this
      };
    },
    props: {
      // 展示数据
      treeData: Array,
      // 自主控制loading加载，避免数据还没获取到的空档出现“暂无数据”字样
      ready: {
        type: Boolean,
        default: true
      },
      // 内容为空的时候展示的文本
      emptyText: {
        type: String,
        default: "暂无数据"
      },
      // 是否在第一次展开某个树节点后才渲染其子节点
      renderAfterExpand: {
        type: Boolean,
        default: true
      },
      // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
      nodeKey: String,
      // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
      checkStrictly: Boolean,
      // 是否默认展开所有节点
      defaultExpandAll: Boolean,
      // 切换全部展开、全部折叠
      toggleExpendAll: Boolean,
      // 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点
      expandOnClickNode: {
        type: Boolean,
        default: true
      },
      // 选中的时候展开节点
      expandOnCheckNode: {
        type: Boolean,
        default: true
      },
      // 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点
      checkOnClickNode: Boolean,
      checkDescendants: {
        type: Boolean,
        default: false
      },
      // 展开子节点的时候是否自动展开父节点
      autoExpandParent: {
        type: Boolean,
        default: true
      },
      // 默认勾选的节点的 key 的数组
      defaultCheckedKeys: Array,
      // 默认展开的节点的 key 的数组
      defaultExpandedKeys: Array,
      // 是否展开当前节点的父节点
      expandCurrentNodeParent: Boolean,
      // 当前选中的节点
      currentNodeKey: [String, Number],
      // 是否最后一层叶子节点才显示单选/多选框
      checkOnlyLeaf: {
        type: Boolean,
        default: false
      },
      // 节点是否可被选择
      showCheckbox: {
        type: Boolean,
        default: false
      },
      // 节点单选
      showRadio: {
        type: Boolean,
        default: false
      },
      // 配置选项
      props: {
        type: [Object, Function],
        default() {
          return {
            children: "children",
            // 指定子树为节点对象的某个属性值
            label: "label",
            // 指定节点标签为节点对象的某个属性值
            disabled: "disabled"
            //	指定节点选择框是否禁用为节点对象的某个属性值
          };
        }
      },
      // 是否懒加载子节点，需与 load 方法结合使用
      lazy: {
        type: Boolean,
        default: false
      },
      // 是否高亮当前选中节点，默认值是 false
      highlightCurrent: Boolean,
      // 加载子树数据的方法，仅当 lazy 属性为true 时生效
      load: Function,
      // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
      filterNodeMethod: Function,
      // 搜索时是否展示匹配项的所有子节点
      childVisibleForFilterNode: {
        type: Boolean,
        default: false
      },
      // 是否每次只打开一个同级树节点展开
      accordion: Boolean,
      // 相邻级节点间的水平缩进，单位为像素
      indent: {
        type: Number,
        default: 18
      },
      // 自定义树节点的展开图标
      iconClass: String,
      // 是否显示节点图标，如果配置为true,需要配置props中对应的图标属性名称
      showNodeIcon: {
        type: Boolean,
        default: false
      },
      // 当节点图标显示出错时，显示的默认图标
      defaultNodeIcon: {
        type: String,
        default: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/doc/github.svg"
      },
      // 如果数据量较大，建议不要在node节点中添加parent属性，会造成性能损耗
      isInjectParentInNode: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isEmpty() {
        if (this.store.root) {
          const childNodes = this.store.root.getChildNodes(this.childNodesId);
          return !childNodes || childNodes.length === 0 || childNodes.every(({ visible }) => !visible);
        }
        return true;
      },
      showLoading() {
        return !(this.store.ready && this.ready);
      }
    },
    watch: {
      toggleExpendAll(newVal) {
        this.store.toggleExpendAll(newVal);
      },
      defaultCheckedKeys(newVal) {
        this.store.setDefaultCheckedKey(newVal);
      },
      defaultExpandedKeys(newVal) {
        this.store.defaultExpandedKeys = newVal;
        this.store.setDefaultExpandedKeys(newVal);
      },
      checkStrictly(newVal) {
        this.store.checkStrictly = newVal || this.checkOnlyLeaf;
      },
      "store.root.childNodesId"(newVal) {
        this.childNodesId = newVal;
      },
      "store.root.visible"(newVal) {
        this.visible = newVal;
      },
      childNodesId() {
        this.$nextTick(() => {
          this.$emit("ly-tree-render-completed");
        });
      },
      treeData: {
        handler(newVal) {
          this.updateKey = (/* @__PURE__ */ new Date()).getTime();
          this.store.setData(newVal);
        },
        deep: true
      }
    },
    methods: {
      /*
       * @description 对树节点进行筛选操作
       * @method filter
       * @param {all} value 在 filter-node-method 中作为第一个参数
       * @param {Object} data 搜索指定节点的节点数据，不传代表搜索所有节点，假如要搜索A节点下面的数据，那么nodeData代表treeData中A节点的数据
      */
      filter(value, data) {
        if (!this.filterNodeMethod)
          throw new Error("[Tree] filterNodeMethod is required when filter");
        this.store.filter(value, data);
      },
      /*
       * @description 获取节点的唯一标识符
       * @method getNodeKey
       * @param {String, Number} nodeId
       * @return {String, Number} 匹配到的数据中的某一项数据
      */
      getNodeKey(nodeId) {
        let node = this.store.root.getChildNodes([nodeId])[0];
        return getNodeKey(this.nodeKey, node.data);
      },
      /*
       * @description 获取节点路径
       * @method getNodePath
       * @param {Object} data 节点数据
       * @return {Array} 路径数组
      */
      getNodePath(data) {
        return this.store.getNodePath(data);
      },
      /*
       * @description 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组
       * @method getCheckedNodes
       * @param {Boolean} leafOnly 是否只是叶子节点，默认false
       * @param {Boolean} includeHalfChecked 是否包含半选节点，默认false
       * @return {Array} 目前被选中的节点所组成的数组
      */
      getCheckedNodes(leafOnly, includeHalfChecked) {
        return this.store.getCheckedNodes(leafOnly, includeHalfChecked);
      },
      /*
       * @description 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
       * @method getCheckedKeys
       * @param {Boolean} leafOnly 是否只是叶子节点，默认false,若为 true 则仅返回被选中的叶子节点的 keys
       * @param {Boolean} includeHalfChecked 是否返回indeterminate为true的节点，默认false
       * @return {Array} 目前被选中的节点所组成的数组
      */
      getCheckedKeys(leafOnly, includeHalfChecked) {
        return this.store.getCheckedKeys(leafOnly, includeHalfChecked);
      },
      /*
       * @description 获取当前被选中节点的 data，若没有节点被选中则返回 null
       * @method getCurrentNode
       * @return {Object} 当前被选中节点的 data，若没有节点被选中则返回 null
      */
      getCurrentNode() {
        const currentNode = this.store.getCurrentNode();
        return currentNode ? currentNode.data : null;
      },
      /*
       * @description 获取当前被选中节点的 key，若没有节点被选中则返回 null
       * @method getCurrentKey
       * @return {all} 当前被选中节点的 key， 若没有节点被选中则返回 null
      */
      getCurrentKey() {
        const currentNode = this.getCurrentNode();
        return currentNode ? currentNode[this.nodeKey] : null;
      },
      /*
       * @description 设置全选/取消全选
       * @method setCheckAll
       * @param {Boolean} isCheckAll 选中状态,默认为true
      */
      setCheckAll(isCheckAll = true) {
        if (this.showRadio)
          throw new Error('You set the "show-radio" property, so you cannot select all nodes');
        if (!this.showCheckbox)
          formatAppLog("warn", "at components/ly-tree/ly-tree.vue:353", 'You have not set the property "show-checkbox". Please check your settings');
        this.store.setCheckAll(isCheckAll);
      },
      /*
       * @description 设置目前勾选的节点
       * @method setCheckedNodes
       * @param {Array} nodes 接收勾选节点数据的数组
       * @param {Boolean} leafOnly 是否只是叶子节点, 若为 true 则仅设置叶子节点的选中状态，默认值为 false
      */
      setCheckedNodes(nodes, leafOnly) {
        this.store.setCheckedNodes(nodes, leafOnly);
      },
      /*
       * @description 通过 keys 设置目前勾选的节点
       * @method setCheckedKeys
       * @param {Array} keys 勾选节点的 key 的数组 
       * @param {Boolean} leafOnly 是否只是叶子节点, 若为 true 则仅设置叶子节点的选中状态，默认值为 false
      */
      setCheckedKeys(keys, leafOnly) {
        if (!this.nodeKey)
          throw new Error("[Tree] nodeKey is required in setCheckedKeys");
        this.store.setCheckedKeys(keys, leafOnly);
      },
      /*
       * @description 通过 key / data 设置某个节点的勾选状态
       * @method setChecked
       * @param {all} data 勾选节点的 key 或者 data 
       * @param {Boolean} checked 节点是否选中
       * @param {Boolean} deep 是否设置子节点 ，默认为 false
      */
      setChecked(data, checked, deep) {
        this.store.setChecked(data, checked, deep);
      },
      /*
       * @description 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所组成的数组
       * @method getHalfCheckedNodes
       * @return {Array} 目前半选中的节点所组成的数组
      */
      getHalfCheckedNodes() {
        return this.store.getHalfCheckedNodes();
      },
      /*
       * @description 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
       * @method getHalfCheckedKeys
       * @return {Array} 目前半选中的节点的 key 所组成的数组
      */
      getHalfCheckedKeys() {
        return this.store.getHalfCheckedKeys();
      },
      /*
       * @description 通过 node 设置某个节点的当前选中状态
       * @method setCurrentNode
       * @param {Object} node 待被选节点的 node
      */
      setCurrentNode(node) {
        if (!this.nodeKey)
          throw new Error("[Tree] nodeKey is required in setCurrentNode");
        this.store.setUserCurrentNode(node);
      },
      /*
       * @description 通过 key 设置某个节点的当前选中状态
       * @method setCurrentKey
       * @param {all} key 待被选节点的 key，若为 null 则取消当前高亮的节点
      */
      setCurrentKey(key) {
        if (!this.nodeKey)
          throw new Error("[Tree] nodeKey is required in setCurrentKey");
        this.store.setCurrentNodeKey(key);
      },
      /*
       * @description 根据 data 或者 key 拿到 Tree 组件中的 node
       * @method getNode
       * @param {all} data 要获得 node 的 key 或者 data
      */
      getNode(data) {
        return this.store.getNode(data);
      },
      /*
       * @description 删除 Tree 中的一个节点
       * @method remove
       * @param {all} data 要删除的节点的 data 或者 node
      */
      remove(data) {
        this.store.remove(data);
      },
      /*
       * @description 为 Tree 中的一个节点追加一个子节点
       * @method append
       * @param {Object} data 要追加的子节点的 data 
       * @param {Object} parentNode 子节点的 parent 的 data、key 或者 node
      */
      append(data, parentNode) {
        this.store.append(data, parentNode);
      },
      /*
       * @description 为 Tree 的一个节点的前面增加一个节点
       * @method insertBefore
       * @param {Object} data 要增加的节点的 data 
       * @param {all} refNode 要增加的节点的后一个节点的 data、key 或者 node
      */
      insertBefore(data, refNode) {
        this.store.insertBefore(data, refNode);
      },
      /*
       * @description 为 Tree 的一个节点的后面增加一个节点
       * @method insertAfter
       * @param {Object} data 要增加的节点的 data 
       * @param {all} refNode 要增加的节点的前一个节点的 data、key 或者 node
      */
      insertAfter(data, refNode) {
        this.store.insertAfter(data, refNode);
      },
      /*
       * @description 通过 keys 设置节点子元素
       * @method updateKeyChildren
       * @param {String, Number} key 节点 key 
       * @param {Object} data 节点数据的数组
      */
      updateKeyChildren(key, data) {
        if (!this.nodeKey)
          throw new Error("[Tree] nodeKey is required in updateKeyChild");
        this.store.updateChildren(key, data);
      }
    },
    created() {
      this.isTree = true;
      let props = this.props;
      if (typeof this.props === "function")
        props = this.props();
      if (typeof props !== "object")
        throw new Error("props must be of object type.");
      this.store = new TreeStore({
        key: this.nodeKey,
        data: this.treeData,
        lazy: this.lazy,
        props,
        load: this.load,
        showCheckbox: this.showCheckbox,
        showRadio: this.showRadio,
        currentNodeKey: this.currentNodeKey,
        checkStrictly: this.checkStrictly || this.checkOnlyLeaf,
        checkDescendants: this.checkDescendants,
        expandOnCheckNode: this.expandOnCheckNode,
        defaultCheckedKeys: this.defaultCheckedKeys,
        defaultExpandedKeys: this.defaultExpandedKeys,
        expandCurrentNodeParent: this.expandCurrentNodeParent,
        autoExpandParent: this.autoExpandParent,
        defaultExpandAll: this.defaultExpandAll,
        filterNodeMethod: this.filterNodeMethod,
        childVisibleForFilterNode: this.childVisibleForFilterNode,
        showNodeIcon: this.showNodeIcon,
        isInjectParentInNode: this.isInjectParentInNode
      });
      this.childNodesId = this.store.root.childNodesId;
    },
    beforeDestroy() {
      if (this.accordion) {
        uni.$off(`${this.elId}-tree-node-expand`);
      }
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ly_tree_node = vue.resolveComponent("ly-tree-node");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      $options.showLoading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "ly-loader ly-flex-center"
      }, [
        vue.createElementVNode("view", { class: "ly-loader-inner" }, "加载中...")
      ])) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          $options.isEmpty || !$data.visible ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "ly-empty"
            },
            vue.toDisplayString($props.emptyText),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true),
          (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: $data.updateKey,
              class: vue.normalizeClass(["ly-tree", { "is-empty": $options.isEmpty || !$data.visible }]),
              role: "tree",
              name: "LyTreeExpand"
            },
            [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.childNodesId, (nodeId) => {
                  return vue.openBlock(), vue.createBlock(_component_ly_tree_node, {
                    nodeId,
                    "render-after-expand": $props.renderAfterExpand,
                    "show-checkbox": $props.showCheckbox,
                    "show-radio": $props.showRadio,
                    "check-only-leaf": $props.checkOnlyLeaf,
                    key: $options.getNodeKey(nodeId),
                    indent: $props.indent,
                    "icon-class": $props.iconClass
                  }, null, 8, ["nodeId", "render-after-expand", "show-checkbox", "show-radio", "check-only-leaf", "indent", "icon-class"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ],
            2
            /* CLASS */
          ))
        ],
        64
        /* STABLE_FRAGMENT */
      ))
    ]);
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-6722bdbe"], ["__file", "C:/ZXT/ZXTRentN/static/google20256/components/ly-tree/ly-tree.vue"]]);
  const _imports_1$7 = "/static/public/SetUp.png";
  const _imports_1$6 = "/static/public/_delete.png";
  const _sfc_main$o = {
    components: {
      CustomNavBar,
      LyTree: __easycom_0$1
    },
    data() {
      return {
        screenInfo: {},
        // 屏幕信息对象
        g_page: 1,
        // 当前页码
        g_items: [],
        // 角色列表数据
        g_activeTab: 1,
        // 当前激活的标签页(1:角色列表 2:新增觉)
        btnState: "新增",
        // 按钮显示文本
        params: {},
        props: function() {
          return {
            // 这里的label就可以使用函数进行自定义的渲染了
            label(data, node) {
              return node.data.name;
            }
          };
        },
        treeData: []
      };
    },
    onLoad(options) {
    },
    onShow() {
      this.initialRoleList();
      this.initialScreenInfo();
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      handleCheckChange(evt) {
        formatAppLog("log", "at pages/system/role/roleList/index.vue:158", evt);
      },
      handleSetUp(evt) {
        uni.navigateTo({
          url: "/pages/system/role/reserve/index?name=" + (evt == null ? void 0 : evt.name)
        });
      },
      // 编辑角色信息
      handleEdit(evt) {
        this.btnState = "修改";
        this.params = evt;
        this.g_activeTab = 2;
        this.$nextTick(() => {
          this.initGetMenuTree();
        });
      },
      // 切换标签页
      handleSwitchTab(evt) {
        this.g_activeTab = evt;
        if (evt == 1) {
          this.params = {};
          this.btnState = "新增";
        } else {
          this.$nextTick(() => {
            this.initGetMenuTree();
          });
        }
      },
      async initGetMenuTree() {
        try {
          const res = await u_getMenuTree$1({});
          this.treeData = (res == null ? void 0 : res.content) || [];
        } catch (error) {
          formatAppLog("error", "at pages/system/role/roleList/index.vue:193", "获取权限列表失败:", error);
        }
      },
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          formatAppLog("error", "at pages/system/role/roleList/index.vue:201", "[ScreenInfo] 获取屏幕信息失败:", error);
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 获取角色列表
      async initialRoleList() {
        try {
          const res = await u_roleapiList$1({});
          this.g_items = (res == null ? void 0 : res.content) || [];
        } catch (error) {
          formatAppLog("error", "at pages/system/role/roleList/index.vue:216", "获取角色列表失败:", error);
        }
      },
      // 编辑角色信息回调
      handleBindinput(evt, text) {
        this.params[text] = evt.detail.value;
      },
      // 确认修改
      async handleSubmit() {
        var _a, _b, _c;
        formatAppLog("log", "at pages/system/role/roleList/index.vue:227", this.params);
        const temp = {
          id: ((_a = this.params) == null ? void 0 : _a.id) || "",
          name: ((_b = this.params) == null ? void 0 : _b.name) || "",
          bak: ((_c = this.params) == null ? void 0 : _c.bak) || ""
        };
        try {
          const res = await u_roleapiaddOrUpdate$1({
            ...temp
          });
          this.g_activeTab = 1;
          this.$nextTick(() => {
            this.initialRoleList();
          });
        } catch (error) {
          formatAppLog("log", "at pages/system/role/roleList/index.vue:245", "新增失败");
        }
      },
      // 删除角色
      async handleDelete(evt) {
        formatAppLog("log", "at pages/system/role/roleList/index.vue:250", evt);
        try {
          const res = await u_roleapidel$1({
            id: evt == null ? void 0 : evt.id
          });
          this.$nextTick(() => {
            this.initialRoleList();
          });
        } catch (error) {
          formatAppLog("log", "at pages/system/role/roleList/index.vue:260", "删除失败");
        }
      }
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b;
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    const _component_ly_tree = resolveEasycom(vue.resolveDynamicComponent("ly-tree"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "container",
        style: vue.normalizeStyle({ height: `${$options.safeScreenHeight}px` })
      },
      [
        vue.createVNode(_component_CustomNavBar, { title: "个性化角色" }),
        vue.createCommentVNode(" 主容器 "),
        vue.createElementVNode(
          "view",
          {
            class: "record-container",
            style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
          },
          [
            vue.createCommentVNode(" 标签切换区域 "),
            vue.createElementVNode("view", { class: "record-tabs" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["record-tabs-item", $data.g_activeTab == 1 ? "tabs-active-1" : "tabs-no-active-1"]),
                  onClick: _cache[0] || (_cache[0] = ($event) => $options.handleSwitchTab(1))
                },
                "角色列表",
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["record-tabs-item", $data.g_activeTab == 2 ? "tabs-active-2" : "tabs-no-active-2"]),
                  onClick: _cache[1] || (_cache[1] = ($event) => $options.handleSwitchTab(2))
                },
                vue.toDisplayString($data.btnState) + "角色 ",
                3
                /* TEXT, CLASS */
              )
            ]),
            vue.createCommentVNode(" 角色列表区域 "),
            $data.g_activeTab == 1 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
              key: 0,
              style: { "height": "100vh" },
              "scroll-y": ""
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.g_items, (item, index) => {
                  var _a2;
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "content-item"
                  }, [
                    vue.createElementVNode("view", { class: "content-item-head" }, [
                      vue.createElementVNode("view", { class: "head-left" }, [
                        vue.createElementVNode("view", { class: "left-category" }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item.name),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "head-right" }, [
                        vue.createElementVNode("image", {
                          src: _imports_0$4,
                          "data-item": item,
                          onClick: ($event) => $options.handleEdit(item)
                        }, null, 8, ["data-item", "onClick"]),
                        vue.createElementVNode("image", {
                          src: _imports_1$7,
                          "data-item": item,
                          onClick: ($event) => $options.handleSetUp(item)
                        }, null, 8, ["data-item", "onClick"]),
                        vue.createElementVNode("image", {
                          src: _imports_1$6,
                          "data-id": item.id,
                          onClick: ($event) => $options.handleDelete(item)
                        }, null, 8, ["data-id", "onClick"])
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "content-item-info" }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass("info-item  " + (((_a2 = item == null ? void 0 : item.bak) == null ? void 0 : _a2.length) > 15 ? "long-info-item" : ""))
                        },
                        [
                          vue.createElementVNode("label", null, "说明:"),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString((item == null ? void 0 : item.bak) || "-"),
                            1
                            /* TEXT */
                          )
                        ],
                        2
                        /* CLASS */
                      )
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 新增车辆区域 "),
            $data.g_activeTab == 2 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
              key: 1,
              "scroll-y": "",
              style: { "height": "100vh" }
            }, [
              vue.createElementVNode("view", { class: "card-info" }, [
                vue.createElementVNode("view", { class: "card-head" }, [
                  vue.createElementVNode("text", null, "基础信息")
                ]),
                vue.createCommentVNode(" 角色名称 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode("label", { class: "form-label" }, [
                    vue.createTextVNode(" 角色名称"),
                    vue.createElementVNode("text", { class: "required-mark" }, "*")
                  ]),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: "请输入角色名称",
                    value: (_a = $data.params) == null ? void 0 : _a.name,
                    maxlength: "10",
                    "placeholder-style": "color: #999;",
                    onInput: _cache[2] || (_cache[2] = (e2) => $options.handleBindinput(e2, "name"))
                  }, null, 40, ["value"])
                ]),
                vue.createCommentVNode(" 说明 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode("label", null, "说明"),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: "请输入说明",
                    value: (_b = $data.params) == null ? void 0 : _b.bak,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[3] || (_cache[3] = (e2) => $options.handleBindinput(e2, "bak"))
                  }, null, 40, ["value"])
                ]),
                vue.createElementVNode("view", { class: "card-head" }, [
                  vue.createElementVNode("text", null, "权限设置")
                ]),
                vue.createVNode(_component_ly_tree, {
                  ref: "tree",
                  props: $data.props,
                  "tree-data": $data.treeData,
                  "node-key": "id",
                  "show-checkbox": "",
                  "expand-on-check-node": "",
                  "default-expand-all": "",
                  "check-strictly": false,
                  defaultCheckedKeys: [1],
                  onCheckChange: $options.handleCheckChange
                }, null, 8, ["props", "tree-data", "onCheckChange"])
              ]),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode(
                  "view",
                  {
                    onClick: _cache[4] || (_cache[4] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
                  },
                  "确认" + vue.toDisplayString($data.btnState),
                  1
                  /* TEXT */
                )
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesSystemRoleRoleListIndex = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/system/role/roleList/index.vue"]]);
  const _imports_1$5 = "/static/public/close.png";
  const _sfc_main$n = {
    components: {
      CustomNavBar,
      LyTree: __easycom_0$1
    },
    data() {
      return {
        title: "",
        screenInfo: {},
        // 屏幕信息对象
        g_page: 1,
        // 当前页码
        g_items: [],
        // 角色列表数据
        g_activeTab: 1,
        // 当前激活的标签页(1:车辆列表 2:新增车辆)
        props: function() {
          return {
            // 这里的label就可以使用函数进行自定义的渲染了
            label(data, node) {
              return node.data.name;
            }
          };
        },
        treeData: [],
        c_send_key_show_momal: false,
        user_text: "",
        g_uesr_details: {
          username: "",
          password: "",
          realname: "",
          mobile: ""
        },
        langs: {}
      };
    },
    onLoad(options) {
      formatAppLog("log", "at pages/system/role/reserve/index.vue:176", options);
      this.initGetTitle(options);
    },
    onShow() {
      this.initialScreenInfo();
      this.handleGetCurrentLanguage();
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      handleGetCurrentLanguage() {
        let currentLang2 = uni.getStorageSync("lang") || "zh-CN";
        this.langs = langs[currentLang2];
      },
      // 获取当前角色信息
      initGetTitle(evt) {
        if (evt == null ? void 0 : evt.name) {
          this.title = evt == null ? void 0 : evt.name;
          this.initialRoleList(evt == null ? void 0 : evt.name);
        }
      },
      handleCheckChange(evt) {
        formatAppLog("log", "at pages/system/role/reserve/index.vue:215", evt);
      },
      async initGetMenuTree(evt) {
        try {
          const res = await u_getMenuTree$1({
            roleId: evt
          });
          this.treeData = (res == null ? void 0 : res.content) || [];
        } catch (error) {
          formatAppLog("error", "at pages/system/role/reserve/index.vue:225", "获取权限列表失败:", error);
        }
      },
      // 编辑角色信息
      handleEdit(evt) {
        this.g_uesr_details = evt;
        this.c_send_key_show_momal = true;
        this.user_text = this.langs.update;
      },
      // 切换标签页
      handleSwitchTab(evt) {
        this.g_activeTab = evt;
      },
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          formatAppLog("error", "at pages/system/role/reserve/index.vue:246", "[ScreenInfo] 获取屏幕信息失败:", error);
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 根据角色名称获取角色ID
      async initialRoleList(evt) {
        var _a;
        try {
          const res = await u_roleapigetRole({
            roleName: evt,
            isAutoCreate: 1
          });
          this.role_id = (_a = res == null ? void 0 : res.content) == null ? void 0 : _a.id;
          this.$nextTick(() => {
            var _a2, _b;
            this.initChildUser((_a2 = res == null ? void 0 : res.content) == null ? void 0 : _a2.id);
            this.initGetMenuTree((_b = res == null ? void 0 : res.content) == null ? void 0 : _b.id);
          });
        } catch (error) {
          formatAppLog("error", "at pages/system/role/reserve/index.vue:268", "获取角色列表失败:", error);
        }
      },
      // 根据角色ID获取人员列表
      async initChildUser(evt) {
        try {
          const res = await u_childUserList({
            roleId: evt
          });
          formatAppLog("log", "at pages/system/role/reserve/index.vue:278", res);
          this.g_items = (res == null ? void 0 : res.content) || [];
        } catch (error) {
          formatAppLog("error", "at pages/system/role/reserve/index.vue:282", "获取角色列表失败:", error);
        }
      },
      // 确认修改
      async handleSubmit() {
      },
      // 点击出现弹窗
      handleJumpInfo() {
        this.c_send_key_show_momal = true;
      },
      // 点击关闭弹窗
      handleHideSengKeyModal() {
        this.c_send_key_show_momal = false;
        this.g_uesr_details = {};
        this.user_text = this.langs.create;
      },
      // 删除人员
      async handleDelete(evt) {
        try {
          const res = await u_delChildUser({
            id: evt == null ? void 0 : evt.id
          });
          this.$nextTick(() => {
            this.initChildUser(this.role_id);
          });
        } catch (error) {
          formatAppLog("error", "at pages/system/role/reserve/index.vue:310", "删除失败:", error);
        }
      },
      // 新增人员
      async handleFormSubmit(evt) {
        const temp = {
          ...evt.detail.value,
          roleId: this.role_id
        };
        formatAppLog("log", "at pages/system/role/reserve/index.vue:319", temp);
        try {
          const res = await u_addOrUpdateChildUser(temp);
          formatAppLog("log", "at pages/system/role/reserve/index.vue:322", res);
          if ((res == null ? void 0 : res.code) == 1e3) {
            uni.showToast({
              title: res.msg,
              // 提示的内容
              icon: "none",
              // 图标类型，可选值有"success"、"loading"、"none"
              duration: 2e3
              // 提示的持续时间，单位为毫秒
            });
            this.c_send_key_show_momal = false;
            this.g_uesr_details = {
              username: "",
              password: "",
              realname: "",
              mobile: ""
            };
            this.$nextTick(() => {
              this.initChildUser(this.role_id);
            });
          } else {
            uni.showToast({
              title: res.msg,
              // 提示的内容
              icon: "none",
              // 图标类型，可选值有"success"、"loading"、"none"
              duration: 2e3
              // 提示的持续时间，单位为毫秒
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/system/role/reserve/index.vue:347", "获取角色列表失败:", error);
        }
      }
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    const _component_ly_tree = resolveEasycom(vue.resolveDynamicComponent("ly-tree"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "container",
        style: vue.normalizeStyle({ height: `${$options.safeScreenHeight}px` })
      },
      [
        vue.createVNode(_component_CustomNavBar, { title: $data.title }, null, 8, ["title"]),
        vue.createCommentVNode(" 主容器 "),
        vue.createElementVNode(
          "view",
          {
            class: "record-container",
            style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
          },
          [
            vue.createCommentVNode(" 标签切换区域 "),
            vue.createElementVNode("view", { class: "record-tabs" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["record-tabs-item", $data.g_activeTab == 1 ? "tabs-active-1" : "tabs-no-active-1"]),
                  onClick: _cache[0] || (_cache[0] = ($event) => $options.handleSwitchTab(1))
                },
                vue.toDisplayString($data.langs.userdirectory),
                3
                /* TEXT, CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["record-tabs-item", $data.g_activeTab == 2 ? "tabs-active-2" : "tabs-no-active-2"]),
                  onClick: _cache[1] || (_cache[1] = ($event) => $options.handleSwitchTab(2))
                },
                vue.toDisplayString($data.langs.accesscontrol),
                3
                /* TEXT, CLASS */
              )
            ]),
            vue.createCommentVNode(" 角色列表区域 "),
            $data.g_activeTab == 1 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
              key: 0,
              style: { "height": "100vh" },
              "scroll-y": ""
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.g_items, (item, index) => {
                  var _a, _b, _c;
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "content-item"
                  }, [
                    vue.createElementVNode("view", { class: "content-item-head" }, [
                      vue.createElementVNode("view", { class: "head-left" }, [
                        vue.createElementVNode("view", { class: "left-category" }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item.realname),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "head-right" }, [
                        vue.createElementVNode("image", {
                          src: _imports_0$4,
                          "data-item": item,
                          onClick: ($event) => $options.handleEdit(item)
                        }, null, 8, ["data-item", "onClick"]),
                        vue.createElementVNode("image", {
                          src: _imports_1$6,
                          "data-id": item.id,
                          onClick: ($event) => $options.handleDelete(item)
                        }, null, 8, ["data-id", "onClick"])
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "content-item-info" }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass("info-item  " + (((_a = item == null ? void 0 : item.username) == null ? void 0 : _a.length) > 15 ? "long-info-item" : ""))
                        },
                        [
                          vue.createElementVNode(
                            "label",
                            null,
                            vue.toDisplayString($data.langs.account) + " : ",
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString((item == null ? void 0 : item.username) || "-"),
                            1
                            /* TEXT */
                          )
                        ],
                        2
                        /* CLASS */
                      ),
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass("info-item  " + (((_b = item == null ? void 0 : item.roleName) == null ? void 0 : _b.length) > 15 ? "long-info-item" : ""))
                        },
                        [
                          vue.createElementVNode(
                            "label",
                            null,
                            vue.toDisplayString($data.langs.role) + " : ",
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString((item == null ? void 0 : item.roleName) || "-"),
                            1
                            /* TEXT */
                          )
                        ],
                        2
                        /* CLASS */
                      ),
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass("info-item  " + (((_c = item == null ? void 0 : item.mobile) == null ? void 0 : _c.length) > 15 ? "long-info-item" : ""))
                        },
                        [
                          vue.createElementVNode(
                            "label",
                            null,
                            vue.toDisplayString($data.langs.mobile) + " : ",
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString((item == null ? void 0 : item.mobile) || "-"),
                            1
                            /* TEXT */
                          )
                        ],
                        2
                        /* CLASS */
                      )
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 新增车辆区域 "),
            $data.g_activeTab == 2 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
              key: 1,
              "scroll-y": "",
              style: { "height": "100vh" }
            }, [
              vue.createElementVNode("view", { class: "card-info" }, [
                vue.createElementVNode("view", { class: "card-head" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString($data.langs.permissionssettings),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createVNode(_component_ly_tree, {
                  ref: "tree",
                  props: $data.props,
                  "tree-data": $data.treeData,
                  "node-key": "id",
                  "show-checkbox": "",
                  "expand-on-check-node": "",
                  "default-expand-all": "",
                  "check-strictly": false,
                  defaultCheckedKeys: [1],
                  onCheckChange: $options.handleCheckChange
                }, null, 8, ["props", "tree-data", "onCheckChange"])
              ]),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode("view", {
                  onClick: _cache[2] || (_cache[2] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
                }, "确认修改")
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ],
          4
          /* STYLE */
        ),
        vue.createCommentVNode(" 一键操作按钮 "),
        vue.createElementVNode("view", {
          class: "levitation-button",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.handleJumpInfo && $options.handleJumpInfo(...args))
        }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($data.langs.adduser),
            1
            /* TEXT */
          )
        ]),
        $data.c_send_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "modal-mask",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.handleHideSengKeyModal && $options.handleHideSengKeyModal(...args))
        })) : vue.createCommentVNode("v-if", true),
        $data.c_send_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "modal-base-map"
        }, [
          vue.createElementVNode(
            "form",
            {
              onSubmit: _cache[6] || (_cache[6] = (...args) => $options.handleFormSubmit && $options.handleFormSubmit(...args))
            },
            [
              vue.createElementVNode("view", { class: "modal-container" }, [
                vue.createElementVNode("view", { class: "modal-container-head" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString($data.user_text || $data.langs.create) + vue.toDisplayString($data.langs.user),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("image", {
                    src: _imports_1$5,
                    onClick: _cache[5] || (_cache[5] = (...args) => $options.handleHideSengKeyModal && $options.handleHideSengKeyModal(...args))
                  })
                ]),
                vue.createElementVNode("view", { class: "modal-container-middle" }, [
                  vue.createElementVNode("view", { class: "middle-form-item" }, [
                    vue.createElementVNode(
                      "label",
                      null,
                      vue.toDisplayString($data.langs.account) + ":",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "modal-form-region" }, [
                      vue.createElementVNode("input", {
                        placeholder: $data.langs.pleaseaccount,
                        value: $data.g_uesr_details.username,
                        name: "username",
                        style: { "text-align": "right", "font-size": "28rpx" }
                      }, null, 8, ["placeholder", "value"])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "middle-form-item" }, [
                    vue.createElementVNode(
                      "label",
                      null,
                      vue.toDisplayString($data.langs.password) + ":",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "modal-form-region" }, [
                      vue.createElementVNode("input", {
                        placeholder: $data.langs.pleasepassword,
                        value: $data.g_uesr_details.password,
                        name: "password",
                        style: { "text-align": "right", "font-size": "28rpx" }
                      }, null, 8, ["placeholder", "value"])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "middle-form-item" }, [
                    vue.createElementVNode(
                      "label",
                      null,
                      vue.toDisplayString($data.langs.name) + ":",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "modal-form-region" }, [
                      vue.createElementVNode("input", {
                        placeholder: $data.langs.pleasename,
                        value: $data.g_uesr_details.realname,
                        name: "realname",
                        style: { "text-align": "right", "font-size": "28rpx" }
                      }, null, 8, ["placeholder", "value"])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "middle-form-item" }, [
                    vue.createElementVNode(
                      "label",
                      null,
                      vue.toDisplayString($data.langs.mobile) + ":",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "modal-form-region" }, [
                      vue.createElementVNode("input", {
                        placeholder: $data.langs.pleasemobile,
                        value: $data.g_uesr_details.mobile,
                        name: "mobile",
                        style: { "text-align": "right", "font-size": "28rpx" }
                      }, null, 8, ["placeholder", "value"])
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "modal-container-footer" }, [
                  vue.createElementVNode(
                    "button",
                    { formType: "submit" },
                    vue.toDisplayString($data.langs.confirm),
                    1
                    /* TEXT */
                  )
                ])
              ])
            ],
            32
            /* NEED_HYDRATION */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ],
      4
      /* STYLE */
    );
  }
  const PagesSystemRoleReserveIndex = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/system/role/reserve/index.vue"]]);
  const _sfc_main$m = {
    components: {
      CustomNavBar
    },
    data() {
      return {
        screenInfo: {},
        // 屏幕信息对象
        g_page: 1,
        // 当前页码
        g_items: [],
        // 车辆列表数据
        r_items: [],
        // 使用记录列表数据
        g_activeTab: 1,
        // 当前激活的标签页 (1:车辆列表 2:新增车辆)
        btnState: "新增",
        // 按钮显示文本
        c_send_key_show_momal: false,
        // 发送钥匙弹窗显示状态
        g_uesr_details: {},
        // 弹窗表单参数
        startDate: "",
        // 钥匙使用开始日期
        startTime: "",
        // 钥匙使用开始时间
        endDate: "",
        // 钥匙使用结束日期
        endTime: "",
        // 钥匙使用结束时间
        whether: false,
        // 标识当前操作是修改(true)还是新增(false)
        loading: false,
        // 加载状态标识（用于防止重复加载）
        langs: {}
      };
    },
    onLoad(options) {
    },
    onShow() {
      this.initialCarList();
      this.initialScreenInfo();
      this.initRentRecord();
      this.handleCurrentDate();
      this.handleGetCurrentLanguage();
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度（根据平台区分）
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      handleGetCurrentLanguage() {
        let currentLang2 = uni.getStorageSync("lang") || "zh-CN";
        this.langs = langs[currentLang2];
      },
      // 关闭发送钥匙弹窗
      handleHideSengKeyModal() {
        this.c_send_key_show_momal = false;
        this.g_uesr_details = {};
      },
      // 取消钥匙授权
      async handleCance(evt) {
        var _a, _b, _c;
        const controlCode = (_c = (_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.item) == null ? void 0 : _c.controlcode;
        if (!controlCode)
          return;
        try {
          const res = await u_cancelRentKey({
            controlCode
          });
          if (res.code === 1e3) {
            this.g_page = 1;
            this.g_items = [];
            this.$nextTick(() => {
              this.initialCarList();
              this.initRentRecord();
            });
          } else {
            uni.showToast({
              title: (res == null ? void 0 : res.msg) || "操作失败",
              icon: "none",
              duration: 2e3
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/carRental/sendElectronicKey/index.vue:309", "取消失败:", error);
          uni.showToast({
            title: "取消失败，请重试",
            icon: "none"
          });
        }
      },
      // 修改钥匙授权信息
      handleModify(evt) {
        var _a, _b;
        const itemData = ((_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.item) || {};
        this.whether = true;
        this.c_send_key_show_momal = true;
        this.g_uesr_details = {
          ...itemData,
          platenumber: itemData.platenumber,
          personName: itemData.personname,
          mobile: itemData.mobile
        };
        const splitDateTime = (datetime, fallback = ["", ""]) => {
          if (!datetime)
            return fallback;
          const [date = "", time = ""] = datetime.split(" ");
          return [date, time.split(":").slice(0, 2).join(":")];
        };
        [this.startDate, this.startTime] = splitDateTime(itemData.startdate);
        [this.endDate, this.endTime] = splitDateTime(itemData.enddate);
      },
      // 设置当前日期时间为默认值
      handleCurrentDate() {
        const now = /* @__PURE__ */ new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const formatDate = (date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        const formatTime = (date) => `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
        this.startDate = formatDate(now);
        this.startTime = formatTime(now);
        this.endDate = formatDate(tomorrow);
        this.endTime = formatTime(now);
      },
      // 复制简单码到剪贴板
      handleCopy(evt) {
        var _a, _b;
        const text = ((_b = (_a = evt == null ? void 0 : evt.currentTarget.dataset) == null ? void 0 : _a.item) == null ? void 0 : _b.simplecode) || "";
        if (!text)
          return;
        uni.setClipboardData({
          data: text,
          success: () => uni.showToast({
            title: "复制成功",
            icon: "none"
          }),
          fail: () => uni.showToast({
            title: "复制失败",
            icon: "none"
          })
        });
      },
      // 表单提交处理（发送/更新钥匙）
      async handleFormSubmit(evt) {
        var _a, _b, _c;
        const buildDateTime = (date, time) => `${date} ${time ? `${time}:00` : "00:00:00"}`.trim();
        const startDateTime = buildDateTime(this.startDate, this.startTime);
        const endDateTime = buildDateTime(this.endDate, this.endTime);
        try {
          let res;
          if (this.whether) {
            res = await u_updateRentKey({
              controlCode: (_a = this.g_uesr_details) == null ? void 0 : _a.controlcode,
              startDate: startDateTime,
              endDate: endDateTime
            });
          } else {
            const formData = ((_b = evt == null ? void 0 : evt.detail) == null ? void 0 : _b.value) || {};
            res = await u_sendRentKey({
              vehId: (_c = this.g_uesr_details) == null ? void 0 : _c.id,
              startDate: startDateTime,
              endDate: endDateTime,
              personName: formData.personName,
              mobile: formData.mobile
            });
          }
          if (res.code === 1e3) {
            this.handleHideSengKeyModal();
            this.g_page = 1;
            this.g_items = [];
            this.$nextTick(() => {
              this.initialCarList();
              this.initRentRecord();
            });
          } else {
            uni.showToast({
              title: (res == null ? void 0 : res.msg) || "操作失败",
              icon: "none",
              duration: 2e3
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/carRental/sendElectronicKey/index.vue:428", "操作失败:", error);
          uni.showToast({
            title: "操作失败，请重试",
            icon: "none"
          });
        }
      },
      // 时间选择器变更处理
      bindTimeChange(evt) {
        const type = evt.currentTarget.dataset.index;
        const value = evt.detail.value;
        this[type] = value;
      },
      // 选择车辆打开弹窗
      handleSelectVehicle(evt) {
        const itemData = evt.currentTarget.dataset.item || {};
        this.whether = false;
        this.c_send_key_show_momal = true;
        this.g_uesr_details = {
          ...itemData
        };
      },
      // 滚动到底部加载更多
      lower() {
        if (!this.loading) {
          this.loading = true;
          this.g_page++;
          setTimeout(async () => {
            await this.initialCarList();
            this.loading = false;
          }, 1e3);
        }
      },
      // 切换标签页
      handleSwitchTab(tabIndex) {
        this.g_activeTab = tabIndex;
        this.btnState = tabIndex === 1 ? "新增" : "其他状态";
      },
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          formatAppLog("error", "at pages/carRental/sendElectronicKey/index.vue:476", "获取屏幕信息失败:", error);
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 获取车辆列表（带分页）
      async initialCarList() {
        try {
          const res = await u_getCarList({
            page: this.g_page
          });
          if (this.g_page === 1) {
            this.g_items = (res == null ? void 0 : res.content) || [];
          } else {
            this.g_items = [...this.g_items, ...(res == null ? void 0 : res.content) || []];
          }
          if (this.g_page > 1 && res.content.length === 0) {
            uni.showToast({
              title: `已加载全部数据，共${this.g_items.length}条`,
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/carRental/sendElectronicKey/index.vue:506", "获取车辆列表失败:", error);
          uni.showToast({
            title: "数据加载失败",
            icon: "none"
          });
        }
      },
      // 获取车辆使用记录
      async initRentRecord() {
        try {
          const res = await u_rentRecord();
          const records = (res == null ? void 0 : res.content) || [];
          this.r_items = records.map((item) => ({
            ...item,
            list: [
              {
                time: item.startdate,
                title: item.startAddress
              },
              {
                time: item.enddate,
                title: item.endAddress
              }
            ].filter((entry) => entry.time)
            // 过滤空数据
          }));
        } catch (error) {
          formatAppLog("error", "at pages/carRental/sendElectronicKey/index.vue:534", "获取使用记录失败:", error);
          uni.showToast({
            title: "记录加载失败",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "container",
        style: vue.normalizeStyle({ height: `${$options.safeScreenHeight}px` })
      },
      [
        vue.createVNode(_component_CustomNavBar, {
          title: $data.langs.sendkey
        }, null, 8, ["title"]),
        vue.createCommentVNode(" 主容器 "),
        vue.createElementVNode(
          "view",
          {
            class: "record-container",
            style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
          },
          [
            vue.createCommentVNode(" 标签切换区域 "),
            vue.createElementVNode("view", { class: "record-tabs" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["record-tabs-item", $data.g_activeTab == 1 ? "tabs-active-1" : "tabs-no-active-1"]),
                  onClick: _cache[0] || (_cache[0] = ($event) => $options.handleSwitchTab(1))
                },
                vue.toDisplayString($data.langs.sendkey),
                3
                /* TEXT, CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["record-tabs-item", $data.g_activeTab == 2 ? "tabs-active-2" : "tabs-no-active-2"]),
                  onClick: _cache[1] || (_cache[1] = ($event) => $options.handleSwitchTab(2))
                },
                vue.toDisplayString($data.langs.usagelog),
                3
                /* TEXT, CLASS */
              )
            ]),
            vue.createCommentVNode(" 车辆列表区域 "),
            $data.g_activeTab == 1 ? (vue.openBlock(), vue.createElementBlock(
              "scroll-view",
              {
                key: 0,
                style: { "height": "100vh" },
                "scroll-y": "",
                onScrolltolower: _cache[3] || (_cache[3] = (...args) => $options.lower && $options.lower(...args))
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.g_items, (item, index) => {
                    var _a2, _b, _c, _d;
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      class: "content-item"
                    }, [
                      vue.createElementVNode("view", { class: "content-item-head" }, [
                        vue.createElementVNode("view", { class: "head-left" }, [
                          vue.createElementVNode("view", { class: "left-category" }, [
                            vue.createElementVNode("image", { src: _imports_0$5 }),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString(item == null ? void 0 : item.platenumber),
                              1
                              /* TEXT */
                            )
                          ]),
                          vue.createElementVNode("view", { class: "left-split_line" }),
                          vue.createElementVNode(
                            "view",
                            { class: "left-model" },
                            vue.toDisplayString((item == null ? void 0 : item.vehicleSerialName) || "-") + vue.toDisplayString((item == null ? void 0 : item.vehicleModeName) || ""),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "content-item-info" }, [
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass("info-item  " + (((_a2 = item == null ? void 0 : item.vin) == null ? void 0 : _a2.length) > 15 ? "long-info-item" : ""))
                          },
                          [
                            vue.createElementVNode(
                              "label",
                              null,
                              vue.toDisplayString($data.langs.vin) + " ：",
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString((item == null ? void 0 : item.vin) || "-"),
                              1
                              /* TEXT */
                            )
                          ],
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass("info-item  " + (((_b = item == null ? void 0 : item.xsgw) == null ? void 0 : _b.length) > 15 ? "long-info-item" : ""))
                          },
                          [
                            vue.createElementVNode(
                              "label",
                              null,
                              vue.toDisplayString($data.langs.fuel) + " ：",
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString((item == null ? void 0 : item.xsgw) ? item.xsgw + "L" : "-"),
                              1
                              /* TEXT */
                            )
                          ],
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode("view", { class: "info-item" }, [
                          vue.createElementVNode(
                            "label",
                            null,
                            vue.toDisplayString($data.langs.cartype) + " ：",
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString((item == null ? void 0 : item.sn) ? $data.langs.selfserve : $data.langs.fullservice),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass("info-item  " + (((_c = item == null ? void 0 : item.carOwnerName) == null ? void 0 : _c.length) > 15 ? "long-info-item" : ""))
                          },
                          [
                            vue.createElementVNode(
                              "label",
                              null,
                              vue.toDisplayString($data.langs.platform) + " ：",
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString((item == null ? void 0 : item.carOwnerName) || "-"),
                              1
                              /* TEXT */
                            )
                          ],
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass("info-item  " + (((_d = item == null ? void 0 : item.sn) == null ? void 0 : _d.length) > 15 ? "long-info-item" : ""))
                          },
                          [
                            vue.createElementVNode(
                              "label",
                              null,
                              vue.toDisplayString($data.langs.devID) + " ：",
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString((item == null ? void 0 : item.sn) || "-"),
                              1
                              /* TEXT */
                            )
                          ],
                          2
                          /* CLASS */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "content-item-footer" }, [
                        vue.createElementVNode("view", { class: "footer-right" }, [
                          vue.createElementVNode("view", {
                            class: "footer-right-btn",
                            "data-item": item,
                            onClick: _cache[2] || (_cache[2] = (...args) => $options.handleSelectVehicle && $options.handleSelectVehicle(...args))
                          }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString($data.langs.sendkey),
                              1
                              /* TEXT */
                            )
                          ], 8, ["data-item"])
                        ])
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              32
              /* NEED_HYDRATION */
            )) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 新增车辆区域 "),
            $data.g_activeTab == 2 ? (vue.openBlock(), vue.createElementBlock(
              "scroll-view",
              {
                key: 1,
                style: { "height": "100vh" },
                "scroll-y": "",
                onScrolltolower: _cache[7] || (_cache[7] = (...args) => $options.lower && $options.lower(...args))
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.r_items, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      class: "content-item"
                    }, [
                      vue.createElementVNode("view", { class: "content-item-head" }, [
                        vue.createElementVNode("view", { class: "head-left" }, [
                          vue.createElementVNode("view", { class: "left-category" }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString(item == null ? void 0 : item.platenumber),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString(item == null ? void 0 : item.personname),
                              1
                              /* TEXT */
                            )
                          ]),
                          vue.createElementVNode("view", { class: "left-split_line" }),
                          vue.createElementVNode(
                            "view",
                            { class: "left-model" },
                            vue.toDisplayString(item == null ? void 0 : item.mobile),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "head-right" }, [
                          item.status ? (vue.openBlock(), vue.createElementBlock(
                            "text",
                            {
                              key: 0,
                              style: { "color": "#333", "opacity": "0.4", "font-size": "26rpx" }
                            },
                            vue.toDisplayString($data.langs.cancelled),
                            1
                            /* TEXT */
                          )) : (vue.openBlock(), vue.createElementBlock(
                            "text",
                            {
                              key: 1,
                              style: { "color": "#333", "opacity": "1", "font-size": "26rpx" }
                            },
                            vue.toDisplayString($data.langs.inuse),
                            1
                            /* TEXT */
                          ))
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "content-item-info" }, [
                        vue.createElementVNode("view", { class: "timeline" }, [
                          (vue.openBlock(true), vue.createElementBlock(
                            vue.Fragment,
                            null,
                            vue.renderList(item == null ? void 0 : item.list, (itemTime, indexTime) => {
                              return vue.openBlock(), vue.createElementBlock("view", {
                                key: index,
                                class: "timeline-item"
                              }, [
                                vue.createCommentVNode(" 左侧时间线 "),
                                vue.createElementVNode("view", { class: "timeline-left" }, [
                                  vue.createElementVNode("view", { class: "timeline-node" }),
                                  indexTime !== (item == null ? void 0 : item.list.length) - 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                                    key: 0,
                                    class: "timeline-line"
                                  })) : vue.createCommentVNode("v-if", true)
                                ]),
                                vue.createCommentVNode(" 右侧内容 "),
                                vue.createElementVNode("view", { class: "timeline-content" }, [
                                  vue.createElementVNode(
                                    "view",
                                    { class: "timeline-time" },
                                    vue.toDisplayString(itemTime.time),
                                    1
                                    /* TEXT */
                                  ),
                                  vue.createElementVNode(
                                    "view",
                                    { class: "timeline-title" },
                                    vue.toDisplayString(itemTime.title),
                                    1
                                    /* TEXT */
                                  )
                                ])
                              ]);
                            }),
                            128
                            /* KEYED_FRAGMENT */
                          ))
                        ])
                      ]),
                      !item.status ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "content-item-footer"
                      }, [
                        vue.createElementVNode("view", {
                          class: "footer-right",
                          style: { "display": "flex", "gap": "20rpx" }
                        }, [
                          vue.createElementVNode("view", {
                            class: "footer-right-btn",
                            "data-item": item,
                            onClick: _cache[4] || (_cache[4] = (...args) => $options.handleModify && $options.handleModify(...args))
                          }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString($data.langs.update),
                              1
                              /* TEXT */
                            )
                          ], 8, ["data-item"]),
                          vue.createElementVNode("view", {
                            class: "footer-right-btn",
                            "data-item": item,
                            onClick: _cache[5] || (_cache[5] = (...args) => $options.handleCopy && $options.handleCopy(...args))
                          }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString($data.langs.copylink),
                              1
                              /* TEXT */
                            )
                          ], 8, ["data-item"]),
                          vue.createElementVNode("view", {
                            class: "footer-right-btn",
                            "data-item": item,
                            onClick: _cache[6] || (_cache[6] = (...args) => $options.handleCance && $options.handleCance(...args))
                          }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString($data.langs.cancelride),
                              1
                              /* TEXT */
                            )
                          ], 8, ["data-item"])
                        ])
                      ])) : vue.createCommentVNode("v-if", true)
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              32
              /* NEED_HYDRATION */
            )) : vue.createCommentVNode("v-if", true)
          ],
          4
          /* STYLE */
        ),
        $data.c_send_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "modal-mask",
          onClick: _cache[8] || (_cache[8] = (...args) => $options.handleHideSengKeyModal && $options.handleHideSengKeyModal(...args))
        })) : vue.createCommentVNode("v-if", true),
        $data.c_send_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "modal-base-map"
        }, [
          vue.createElementVNode(
            "form",
            {
              onSubmit: _cache[14] || (_cache[14] = (...args) => $options.handleFormSubmit && $options.handleFormSubmit(...args))
            },
            [
              vue.createElementVNode("view", { class: "modal-container" }, [
                vue.createElementVNode("view", { class: "modal-container-head" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString($data.whether ? $data.langs.update : $data.langs.sendkey),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("image", {
                    src: _imports_1$5,
                    onClick: _cache[9] || (_cache[9] = (...args) => $options.handleHideSengKeyModal && $options.handleHideSengKeyModal(...args))
                  })
                ]),
                vue.createElementVNode("view", { class: "modal-container-middle" }, [
                  vue.createElementVNode("view", { class: "middle-form-item" }, [
                    vue.createElementVNode(
                      "label",
                      null,
                      vue.toDisplayString($data.langs.plate),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "modal-form-region" },
                      vue.toDisplayString((_a = $data.g_uesr_details) == null ? void 0 : _a.platenumber),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "middle-form-item" }, [
                    vue.createElementVNode(
                      "label",
                      null,
                      vue.toDisplayString($data.langs.user),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "modal-form-region" }, [
                      vue.createElementVNode("input", {
                        placeholder: $data.langs.pleasename,
                        value: $data.g_uesr_details.personName,
                        name: "personName",
                        style: { "text-align": "right", "font-size": "28rpx" }
                      }, null, 8, ["placeholder", "value"])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "middle-form-item" }, [
                    vue.createElementVNode(
                      "label",
                      null,
                      vue.toDisplayString($data.langs.mobile),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "modal-form-region" }, [
                      $data.whether ? (vue.openBlock(), vue.createElementBlock(
                        "text",
                        { key: 0 },
                        vue.toDisplayString($data.g_uesr_details.mobile),
                        1
                        /* TEXT */
                      )) : (vue.openBlock(), vue.createElementBlock("input", {
                        key: 1,
                        placeholder: $data.langs.pleasemobile,
                        value: $data.g_uesr_details.mobile,
                        name: "mobile",
                        style: { "text-align": "right", "font-size": "28rpx" }
                      }, null, 8, ["placeholder", "value"]))
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "middle-form-item" }, [
                    vue.createElementVNode(
                      "label",
                      null,
                      vue.toDisplayString($data.langs.starttime),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "modal-form-region" }, [
                      vue.createElementVNode(
                        "picker",
                        {
                          mode: "date",
                          "data-index": "startDate",
                          onChange: _cache[10] || (_cache[10] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
                        },
                        [
                          vue.createElementVNode("view", { class: "form-item-text" }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString($data.startDate),
                              1
                              /* TEXT */
                            )
                          ])
                        ],
                        32
                        /* NEED_HYDRATION */
                      ),
                      vue.createElementVNode(
                        "picker",
                        {
                          mode: "time",
                          "data-index": "startTime",
                          onChange: _cache[11] || (_cache[11] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
                        },
                        [
                          vue.createElementVNode("view", { class: "form-item-text" }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString($data.startTime),
                              1
                              /* TEXT */
                            )
                          ])
                        ],
                        32
                        /* NEED_HYDRATION */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "middle-form-item" }, [
                    vue.createElementVNode(
                      "label",
                      null,
                      vue.toDisplayString($data.langs.endtime),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "modal-form-region" }, [
                      vue.createElementVNode(
                        "picker",
                        {
                          mode: "date",
                          "data-index": "endDate",
                          onChange: _cache[12] || (_cache[12] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
                        },
                        [
                          vue.createElementVNode("view", { class: "form-item-text" }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString($data.endDate),
                              1
                              /* TEXT */
                            )
                          ])
                        ],
                        32
                        /* NEED_HYDRATION */
                      ),
                      vue.createElementVNode(
                        "picker",
                        {
                          mode: "time",
                          "data-index": "endTime",
                          onChange: _cache[13] || (_cache[13] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
                        },
                        [
                          vue.createElementVNode("view", { class: "form-item-text" }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString($data.endTime),
                              1
                              /* TEXT */
                            )
                          ])
                        ],
                        32
                        /* NEED_HYDRATION */
                      )
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "modal-container-footer" }, [
                  vue.createElementVNode(
                    "button",
                    { formType: "submit" },
                    vue.toDisplayString($data.langs.confirm),
                    1
                    /* TEXT */
                  )
                ])
              ])
            ],
            32
            /* NEED_HYDRATION */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ],
      4
      /* STYLE */
    );
  }
  const PagesCarRentalSendElectronicKeyIndex = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/carRental/sendElectronicKey/index.vue"]]);
  const block0 = (Comp) => {
    (Comp.$wxs || (Comp.$wxs = [])).push("animateModule");
    (Comp.$wxsModules || (Comp.$wxsModules = {}))["animateModule"] = "5e756d3e";
  };
  const _sfc_main$l = {
    props: {
      pro: {
        type: Number,
        default: 0
      },
      //起始位置 0-1
      start: {
        type: Number,
        default: 0
      },
      //圆形大小
      size: {
        type: Number,
        default: 400
      },
      //线宽度
      border_width: {
        type: Number,
        default: 20
      },
      //线颜色
      border_color: {
        type: String,
        default: "#07C160"
      },
      //线背景色
      border_back_color: {
        type: String
      },
      //中心内容背景色
      background: {
        type: String
      },
      //单位
      unit: {
        type: String,
        default: "rpx"
      },
      //是否启用动画
      animate: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        cpro: 0
      };
    },
    watch: {
      pro(val) {
        this.cpro = val;
      }
    },
    mounted() {
      this.cpro = this.pro;
    },
    methods: {
      sunit(num) {
        if (typeof num === "number") {
          return num + this.unit;
        }
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "circle-progress-bar",
        style: vue.normalizeStyle({
          width: $options.sunit($props.size),
          height: $options.sunit($props.size)
        })
      },
      [
        vue.createElementVNode("view", {
          class: "circle",
          "change:prop": _ctx.animateModule.pro,
          prop: vue.wp($data.cpro),
          "data-animate": $props.animate,
          style: vue.normalizeStyle({
            transform: `rotate(${$props.start * 360 + 45}deg)`,
            border: `${$options.sunit($props.border_width)} solid ${$props.border_color}`
          })
        }, null, 12, ["change:prop", "prop", "data-animate"]),
        $props.background ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "bg",
            style: vue.normalizeStyle({
              background: $props.background
            })
          },
          null,
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true),
        $props.border_back_color ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 1,
            class: "border-back",
            style: vue.normalizeStyle({
              border: `calc(${$options.sunit($props.border_width)} - 1px) solid ${$props.border_back_color}`
            })
          },
          null,
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "center" }, [
          vue.renderSlot(_ctx.$slots, "default", { pro: $data.cpro }, void 0, true)
        ])
      ],
      4
      /* STYLE */
    );
  }
  if (typeof block0 === "function")
    block0(_sfc_main$l);
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-a213e374"], ["__file", "C:/ZXT/ZXTRentN/static/google20256/components/circle-progress-bar/circle-progress-bar.vue"]]);
  const _sfc_main$k = {
    components: {
      CustomNavBar,
      CircleProgressBar: __easycom_0
    },
    data() {
      return {
        screenInfo: {},
        // 屏幕信息对象
        g_items: [],
        // 油量检测记录列表
        vehicle_info: {},
        // 当前车辆信息
        c_send_key_show_momal: false,
        // 控制油量检测弹窗显示
        c_order_key_show_momal: false,
        // 控制订单选择弹窗显示
        c_oilNumber_key_show_momal: false,
        // 控制油号选择弹窗显示
        g_uesr_details: {},
        // 用户详情（未使用）
        remaining_oil_quantity: 0,
        // 当前检测的剩余油量（单位：升）
        proportion: 0,
        // 油量百分比（0-1之间的小数）
        c_order_items: [],
        // 可选的订单列表
        c_oil_items: [],
        // 可选的油号列表
        rentSignId: 0,
        // 选中的订单ID
        rentOilSignId: 0
        // 选中的油号ID
      };
    },
    onLoad(options) {
      this.vehicle_info = JSON.parse((options == null ? void 0 : options.info) || "{}");
      if (options == null ? void 0 : options.info) {
        this.initDipsticHistory();
      }
    },
    onShow() {
      this.initialScreenInfo();
    },
    computed: {
      // 当前用户信息（从本地存储获取）
      userInfo() {
        return uni.getStorageSync("user_info") || null;
      },
      // 用户公司名称
      userCompanyName() {
        var _a, _b;
        return ((_b = (_a = this.userInfo) == null ? void 0 : _a.companyName) == null ? void 0 : _b.trim()) || "未知";
      },
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度（根据平台区分）
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          formatAppLog("error", "at pages/oil/automatic/index.vue:314", "[ScreenInfo] 获取屏幕信息失败:", error);
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 跳转到车辆选择页面
      handleJumpVehicle() {
        uni.redirectTo({
          url: `/pages/carRental/vehicleList/index?souce=/pages/oil/automatic/index`
        });
      },
      // 初始化油量检测历史记录
      async initDipsticHistory() {
        var _a;
        try {
          const temp = {
            vehId: (_a = this.vehicle_info) == null ? void 0 : _a.id
            // 使用车辆ID查询
          };
          const res = await u_oilDipstickapiDipsticHistory(temp);
          this.g_items = (res == null ? void 0 : res.content) || [];
        } catch (error) {
          formatAppLog("error", "at pages/oil/automatic/index.vue:338", "[History] 获取记录失败:", error);
          uni.showToast({
            title: "获取记录失败",
            icon: "none"
          });
        }
      },
      // 处理油量检测按钮点击
      async handleGetOilButtonTap() {
        var _a, _b, _c;
        this.c_send_key_show_momal = true;
        try {
          const res = await u_dzBussinessMobileApiGetCarStatus({
            sn: (_a = this.vehicle_info) == null ? void 0 : _a.xsgw
            // 使用油箱容积作为参数
          });
          const info = (res == null ? void 0 : res.content) || {};
          let calculatedOil = 0;
          if ((info == null ? void 0 : info.typeOfReMailOil) === 1) {
            const oilPercentage = Math.max(0, Number((info == null ? void 0 : info.confirmOilRemainA) || 0));
            calculatedOil = Number(((_b = this.vehicle_info) == null ? void 0 : _b.xsgw) || 0) * (oilPercentage / 100);
          } else {
            calculatedOil = Math.max(0, Number((info == null ? void 0 : info.confirmOilRemainA) || 0));
          }
          this.remaining_oil_quantity = Number(calculatedOil.toFixed(1));
          const total = ((_c = this.vehicle_info) == null ? void 0 : _c.xsgw) || 0;
          const oilProgress = total > 0 ? this.remaining_oil_quantity / total : 0;
          this.proportion = Math.max(0, Math.min(1, oilProgress));
        } catch (error) {
          formatAppLog("error", "at pages/oil/automatic/index.vue:375", "[Oil Detection] 油量检测失败", error);
          uni.showToast({
            title: "油量检测失败，请重试",
            icon: "none",
            duration: 3e3
          });
          this.proportion = 0;
        }
      },
      // 隐藏油量检测弹窗
      handleHideSengKeyModal() {
        this.c_send_key_show_momal = false;
      },
      // 隐藏订单选择弹窗
      handleHideOrderModal() {
        this.c_order_key_show_momal = false;
      },
      // 处理起租操作
      async handleStartingLease() {
        var _a, _b;
        try {
          const temp = {
            vehId: (_a = this.vehicle_info) == null ? void 0 : _a.id,
            // 车辆ID
            sn: (_b = this.vehicle_info) == null ? void 0 : _b.sn,
            // 设备序列号
            oil: this.remaining_oil_quantity,
            // 当前油量
            checkerName: this.userCompanyName
            // 检测人（公司名称）
          };
          const res = await u_dzBussinessMobileApiRentStart(temp);
          if ((res == null ? void 0 : res.code) == 1e3) {
            this.initDipsticHistory();
            this.c_send_key_show_momal = false;
            uni.showModal({
              title: "提示",
              content: "起租成功",
              showCancel: false
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/oil/automatic/index.vue:416", "[Rent Start] 起租失败:", error);
          uni.showToast({
            title: "起租失败",
            icon: "none"
          });
        }
      },
      // 处理还租操作
      async handleStillRenting() {
        var _a, _b;
        this.c_order_key_show_momal = true;
        this.c_send_key_show_momal = false;
        try {
          const temp = {
            vehId: (_a = this.vehicle_info) == null ? void 0 : _a.id,
            // 车辆ID
            companyId: (_b = this.userInfo) == null ? void 0 : _b.fin3CompanyId,
            // 公司ID
            rentStatus: 0
            // 租赁状态
          };
          const res = await u_oilDipstickapiDipsticHistory(temp);
          this.c_order_items = (res == null ? void 0 : res.content) || [];
        } catch (error) {
          formatAppLog("error", "at pages/oil/automatic/index.vue:440", "[Order List] 获取订单失败:", error);
          uni.showToast({
            title: "获取订单失败",
            icon: "none"
          });
        }
      },
      // 处理订单选择变化
      handleRadioChange(evt) {
        var _a;
        this.rentSignId = (_a = evt == null ? void 0 : evt.detail) == null ? void 0 : _a.value;
      },
      // 处理油号选择变化
      handleOilRadioChange(evt) {
        var _a;
        this.rentOilSignId = (_a = evt == null ? void 0 : evt.detail) == null ? void 0 : _a.value;
      },
      // 直接还租（不选择订单）
      async handleStartRentingAgain() {
        var _a;
        try {
          const temp = {
            vehId: (_a = this.vehicle_info) == null ? void 0 : _a.id,
            // 车辆ID
            oil: this.remaining_oil_quantity,
            // 当前油量
            checkerName: this.userCompanyName
            // 检测人
          };
          const res = await u_oilDipstickapiRentEnd(temp);
          if ((res == null ? void 0 : res.code) == 1e3) {
            this.c_order_key_show_momal = false;
            uni.showModal({
              title: "提示",
              content: (res == null ? void 0 : res.msg) || "还租成功",
              showCancel: false
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/oil/automatic/index.vue:477", "[Rent End] 还租失败:", error);
          uni.showToast({
            title: "还租失败",
            icon: "none"
          });
        }
      },
      // 处理选择订单还租
      async handleStartOrder() {
        if (this.rentSignId) {
          try {
            const res = await u_oilDipstickapiGetOilPriceList();
            if ((res == null ? void 0 : res.code) == 1e3) {
              this.c_order_key_show_momal = false;
              this.c_oilNumber_key_show_momal = true;
              this.c_oil_items = (res == null ? void 0 : res.content) || [];
            }
          } catch (error) {
            formatAppLog("error", "at pages/oil/automatic/index.vue:497", "[Oil List] 获取油号失败:", error);
            uni.showToast({
              title: "获取油号失败",
              icon: "none"
            });
          }
        } else {
          uni.showToast({
            title: "请选择订单",
            icon: "none",
            duration: 2e3
          });
        }
      },
      // 处理油号选择后的还租操作
      async handleOilStartRentingAgain() {
        var _a;
        if (this.rentOilSignId) {
          try {
            const temp = {
              vehId: (_a = this.vehicle_info) == null ? void 0 : _a.id,
              // 车辆ID
              oil: this.remaining_oil_quantity,
              // 当前油量
              id: this.rentSignId,
              // 订单ID
              checkerName: this.userCompanyName,
              // 检测人
              oilPrice: this.rentOilSignId
              // 油号ID
            };
            const res = await u_oilDipstickapiRentEnd(temp);
            if ((res == null ? void 0 : res.code) == 1e3) {
              this.c_oilNumber_key_show_momal = false;
              uni.showModal({
                title: "提示",
                content: (res == null ? void 0 : res.msg) || "还租成功",
                showCancel: false
              });
            }
          } catch (error) {
            formatAppLog("error", "at pages/oil/automatic/index.vue:534", "[Rent End] 还租失败:", error);
            uni.showToast({
              title: "还租失败",
              icon: "none"
            });
          }
        } else {
          uni.showToast({
            title: "请选择油号",
            icon: "none",
            duration: 2e3
          });
        }
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b, _c, _d, _e, _f, _g;
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    const _component_circle_progress_bar = resolveEasycom(vue.resolveDynamicComponent("circle-progress-bar"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 主容器：设置高度为安全区域高度 "),
        vue.createElementVNode(
          "view",
          {
            class: "container",
            style: vue.normalizeStyle({ height: `${$options.safeScreenHeight}px` })
          },
          [
            vue.createCommentVNode(" 自定义导航栏组件 "),
            vue.createVNode(_component_CustomNavBar, { title: "油量自动检测" }),
            vue.createCommentVNode(" 记录容器：顶部留出导航栏高度 "),
            vue.createElementVNode(
              "view",
              {
                class: "record-container",
                style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
              },
              [
                vue.createCommentVNode(" 车辆信息卡片 "),
                vue.createElementVNode("view", { class: "card" }, [
                  vue.createCommentVNode(" 头部区域：车牌和车辆型号信息 "),
                  vue.createElementVNode("view", { class: "header" }, [
                    vue.createElementVNode("view", { class: "vehicle-info" }, [
                      vue.createElementVNode("view", { class: "license-plate" }, [
                        vue.createElementVNode("image", {
                          class: "car-icon",
                          src: _imports_0$5
                        }),
                        vue.createElementVNode(
                          "text",
                          null,
                          vue.toDisplayString(((_a = $data.vehicle_info) == null ? void 0 : _a.platenumber) || "-"),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "divider" }),
                      vue.createElementVNode(
                        "text",
                        { class: "vin-short" },
                        vue.toDisplayString((_b = $data.vehicle_info) == null ? void 0 : _b.vehicleSerialName) + vue.toDisplayString(((_c = $data.vehicle_info) == null ? void 0 : _c.vehicleModeName) || "-"),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createCommentVNode(" 重新选择车辆按钮 "),
                    vue.createElementVNode(
                      "view",
                      {
                        class: "reselect",
                        onClick: _cache[0] || (_cache[0] = (...args) => $options.handleJumpVehicle && $options.handleJumpVehicle(...args))
                      },
                      vue.toDisplayString(((_d = $data.vehicle_info) == null ? void 0 : _d.platenumber) ? "重新选择" : "选择车辆"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createCommentVNode(" 详细信息区域：车架号和油箱容积 "),
                  vue.createElementVNode("view", { class: "details" }, [
                    vue.createElementVNode("view", { class: "detail-item" }, [
                      vue.createElementVNode("label", null, "车架号："),
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(((_e = $data.vehicle_info) == null ? void 0 : _e.vin) || "-"),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "detail-item" }, [
                      vue.createElementVNode("label", null, "油箱容积："),
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(((_f = $data.vehicle_info) == null ? void 0 : _f.xsgw) || "-"),
                        1
                        /* TEXT */
                      )
                    ])
                  ])
                ]),
                vue.createCommentVNode(" 滚动容器：显示油量检测记录 "),
                vue.createElementVNode("scroll-view", {
                  "scroll-y": "",
                  class: "scroll-container",
                  style: { height: "80vh" }
                }, [
                  vue.createCommentVNode(" 遍历显示每一条油量检测记录 "),
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.g_items, (item, index) => {
                      var _a2, _b2, _c2, _d2, _e2;
                      return vue.openBlock(), vue.createElementBlock("view", { class: "record-card" }, [
                        vue.createCommentVNode(" 记录头部：车牌和车型信息 "),
                        vue.createElementVNode("view", { class: "record-header" }, [
                          vue.createElementVNode("view", { class: "vehicle-display" }, [
                            vue.createElementVNode("image", {
                              src: _imports_0$5,
                              class: "small-car-icon"
                            }),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString(item == null ? void 0 : item.platenumber),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              { class: "vehicle-model" },
                              vue.toDisplayString($data.vehicle_info.vehicleSerialName || "-") + vue.toDisplayString($data.vehicle_info.vehicleModeName || ""),
                              1
                              /* TEXT */
                            )
                          ])
                        ]),
                        vue.createCommentVNode(" 油量检测详情：左右分栏显示 "),
                        vue.createElementVNode("view", { class: "content-item-info" }, [
                          vue.createCommentVNode(" 左侧：起租信息 "),
                          vue.createElementVNode("view", { class: "content-item-info-left" }, [
                            vue.createElementVNode(
                              "view",
                              {
                                class: vue.normalizeClass(["info-item info-item-title", { "long-info-item": ((_a2 = item == null ? void 0 : item.startoil) == null ? void 0 : _a2.length) > 15 }])
                              },
                              [
                                vue.createElementVNode("label", null, "起租油量 ："),
                                vue.createElementVNode(
                                  "text",
                                  null,
                                  vue.toDisplayString((item == null ? void 0 : item.startoil) || 0) + "L",
                                  1
                                  /* TEXT */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            vue.createElementVNode(
                              "view",
                              {
                                class: vue.normalizeClass(["info-item", { "long-info-item": ((_b2 = item == null ? void 0 : item.startusername) == null ? void 0 : _b2.length) > 15 }])
                              },
                              [
                                vue.createElementVNode("label", null, "起租检测人 ："),
                                vue.createElementVNode(
                                  "text",
                                  null,
                                  vue.toDisplayString(item.startusername || "-"),
                                  1
                                  /* TEXT */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            vue.createElementVNode(
                              "view",
                              {
                                class: vue.normalizeClass(["info-item", { "long-info-item": ((_c2 = item == null ? void 0 : item.startsn) == null ? void 0 : _c2.length) > 15 }])
                              },
                              [
                                vue.createElementVNode("label", null, "检测设备 ："),
                                vue.createElementVNode(
                                  "text",
                                  null,
                                  vue.toDisplayString((item == null ? void 0 : item.startsn) || "-"),
                                  1
                                  /* TEXT */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            vue.createElementVNode("view", null, [
                              vue.createElementVNode("label", null, "检测时间 ："),
                              vue.createElementVNode(
                                "text",
                                null,
                                vue.toDisplayString((item == null ? void 0 : item.startdate) || "-"),
                                1
                                /* TEXT */
                              )
                            ])
                          ]),
                          vue.createCommentVNode(" 右侧：还租信息 "),
                          vue.createElementVNode("view", { class: "content-item-info-right" }, [
                            vue.createElementVNode(
                              "view",
                              {
                                class: vue.normalizeClass(["info-item info-item-title", { "long-info-item": ((_d2 = item == null ? void 0 : item.endoil) == null ? void 0 : _d2.length) > 15 }])
                              },
                              [
                                vue.createElementVNode("label", null, "还租油量 ："),
                                vue.createElementVNode(
                                  "text",
                                  null,
                                  vue.toDisplayString((item == null ? void 0 : item.endoil) || 0) + "L",
                                  1
                                  /* TEXT */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            vue.createElementVNode(
                              "view",
                              {
                                class: vue.normalizeClass(["info-item", { "long-info-item": ((_e2 = item == null ? void 0 : item.endusername) == null ? void 0 : _e2.length) > 15 }])
                              },
                              [
                                vue.createElementVNode("label", null, "还租检测人 ："),
                                vue.createElementVNode(
                                  "text",
                                  null,
                                  vue.toDisplayString((item == null ? void 0 : item.endusername) || "-"),
                                  1
                                  /* TEXT */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            vue.createElementVNode("view", { class: "long-info-item" }, [
                              vue.createElementVNode("label", null, "检测设备 ："),
                              vue.createElementVNode(
                                "text",
                                null,
                                vue.toDisplayString((item == null ? void 0 : item.endsn) || "-"),
                                1
                                /* TEXT */
                              )
                            ]),
                            vue.createElementVNode("view", { class: "long-info-item" }, [
                              vue.createElementVNode("label", null, "检测时间 ："),
                              vue.createElementVNode(
                                "text",
                                null,
                                vue.toDisplayString((item == null ? void 0 : item.enddate) || "-"),
                                1
                                /* TEXT */
                              )
                            ])
                          ])
                        ]),
                        vue.createCommentVNode(" 底部信息：油量差额和收费情况 "),
                        vue.createElementVNode("view", { class: "content-item-footer" }, [
                          vue.createElementVNode("view", { class: "footer-left" }, [
                            vue.createElementVNode("view", { class: "footer-section" }, [
                              vue.createElementVNode(
                                "view",
                                null,
                                "油量差额：" + vue.toDisplayString((item == null ? void 0 : item.diff) || 0) + "L",
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode(
                                "view",
                                { class: "footer-text" },
                                "收费状态：" + vue.toDisplayString((item == null ? void 0 : item.chargestatusname) || "-"),
                                1
                                /* TEXT */
                              )
                            ]),
                            vue.createElementVNode("view", { class: "footer-section" }, [
                              vue.createElementVNode(
                                "view",
                                null,
                                "预估服务费：" + vue.toDisplayString(item.cost || 0),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode(
                                "view",
                                { class: "footer-text" },
                                "实收服务费：" + vue.toDisplayString((item == null ? void 0 : item.realcost) || 0),
                                1
                                /* TEXT */
                              )
                            ])
                          ]),
                          vue.createElementVNode("view", { class: "footer-right" }, [
                            vue.createElementVNode("view", {
                              class: "footer-right-btn",
                              "data-item": "{{item}}",
                              bindtap: "handleMarkStatus"
                            }, [
                              vue.createElementVNode("text", null, "标记状态")
                            ])
                          ])
                        ])
                      ]);
                    }),
                    256
                    /* UNKEYED_FRAGMENT */
                  ))
                ]),
                vue.createCommentVNode(" 检测油量按钮 "),
                ((_g = $data.vehicle_info) == null ? void 0 : _g.platenumber) ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "detection_button",
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.handleGetOilButtonTap && $options.handleGetOilButtonTap(...args))
                }, [
                  vue.createElementVNode("text", null, "检测油量")
                ])) : vue.createCommentVNode("v-if", true)
              ],
              4
              /* STYLE */
            ),
            vue.createCommentVNode(" 油量检测结果弹窗 "),
            $data.c_send_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "modal-base-map"
            }, [
              vue.createElementVNode("form", null, [
                vue.createElementVNode("view", { class: "modal-container" }, [
                  vue.createElementVNode("view", { class: "modal-container-head" }, [
                    vue.createElementVNode("text", null, "检测完毕,请选择检测状态"),
                    vue.createElementVNode("image", {
                      src: _imports_1$5,
                      onClick: _cache[2] || (_cache[2] = (...args) => $options.handleHideSengKeyModal && $options.handleHideSengKeyModal(...args))
                    })
                  ]),
                  vue.createElementVNode("view", { class: "modal-container-middle" }, [
                    vue.createCommentVNode(" 圆形进度条组件：显示油量百分比 "),
                    vue.createVNode(_component_circle_progress_bar, {
                      pro: $data.proportion,
                      border_back_color: "#297DFE",
                      border_color: "#FB8F23"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("view", { style: { "font-size": "28rpx", "color": "#333width: 100%", "text-align": "center", "margin": "20rpx 0" } }, " 本次检测油量 "),
                        vue.createElementVNode(
                          "view",
                          { style: { "font-weight": "bold", "color": "#333", "font-size": "42rpx", "width": "100%", "text-align": "center", "margin": "20rpx 0" } },
                          vue.toDisplayString($data.remaining_oil_quantity) + "L ",
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "view",
                          { style: { "font-weight": "bold", "color": "#333", "font-size": "28rpx", "width": "100%", "text-align": "center", "margin-top": "20rpx" } },
                          vue.toDisplayString(Math.round($data.proportion * 100)) + "% ",
                          1
                          /* TEXT */
                        )
                      ]),
                      _: 1
                      /* STABLE */
                    }, 8, ["pro"])
                  ]),
                  vue.createElementVNode("view", { class: "modal-container-footer" }, [
                    vue.createElementVNode("button", {
                      style: { "background-color": "#fff", "color": "#297DFE" },
                      onClick: _cache[3] || (_cache[3] = (...args) => $options.handleStartingLease && $options.handleStartingLease(...args))
                    }, "起租"),
                    vue.createElementVNode("button", {
                      style: { "background-color": "#297DFE", "color": "#fff" },
                      onClick: _cache[4] || (_cache[4] = (...args) => $options.handleStillRenting && $options.handleStillRenting(...args))
                    }, "还租")
                  ])
                ])
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 还租订单选择弹窗 "),
            $data.c_order_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "modal-base-map"
            }, [
              vue.createElementVNode("form", null, [
                vue.createElementVNode("view", { class: "modal-container" }, [
                  vue.createElementVNode("view", { class: "modal-container-head" }, [
                    vue.createElementVNode("text", null, "请选择起租订单："),
                    vue.createElementVNode("image", {
                      src: _imports_1$5,
                      onClick: _cache[5] || (_cache[5] = (...args) => $options.handleHideOrderModal && $options.handleHideOrderModal(...args))
                    })
                  ]),
                  vue.createElementVNode("view", { class: "modal-container-middle" }, [
                    vue.createElementVNode(
                      "radio-group",
                      {
                        onChange: _cache[6] || (_cache[6] = (...args) => $options.handleRadioChange && $options.handleRadioChange(...args)),
                        style: { "display": "flex", "align-items": "center", "flex-direction": "column", "gap": "30rpx", "justify-content": "center" }
                      },
                      [
                        vue.createElementVNode("scroll-view", {
                          "scroll-y": "",
                          style: { "height": "100%" }
                        }, [
                          vue.createCommentVNode(" 遍历显示可用订单 "),
                          (vue.openBlock(true), vue.createElementBlock(
                            vue.Fragment,
                            null,
                            vue.renderList($data.c_order_items, (item, index) => {
                              return vue.openBlock(), vue.createElementBlock("label", {
                                key: item.id,
                                style: { "display": "flex", "flex-direction": "row", "align-items": "center", "justify-content": "center" }
                              }, [
                                vue.createElementVNode("radio", {
                                  style: { "transform": "scale(0.8)" },
                                  value: item.id
                                }, null, 8, ["value"]),
                                vue.createElementVNode(
                                  "view",
                                  { style: { "font-size": "28rpx" } },
                                  vue.toDisplayString(item.startdate + "   油量：" + item.startoil + "L"),
                                  1
                                  /* TEXT */
                                )
                              ]);
                            }),
                            128
                            /* KEYED_FRAGMENT */
                          ))
                        ])
                      ],
                      32
                      /* NEED_HYDRATION */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "modal-container-footer" }, [
                    vue.createElementVNode("button", {
                      style: { "background-color": "#fff", "color": "#297DFE" },
                      onClick: _cache[7] || (_cache[7] = (...args) => $options.handleStartRentingAgain && $options.handleStartRentingAgain(...args))
                    }, "直接还租"),
                    vue.createElementVNode("button", {
                      style: { "background-color": "#297DFE", "color": "#fff" },
                      onClick: _cache[8] || (_cache[8] = (...args) => $options.handleStartOrder && $options.handleStartOrder(...args))
                    }, "选订单还租")
                  ])
                ])
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 油号选择弹窗 "),
            $data.c_oilNumber_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "modal-base-map"
            }, [
              vue.createElementVNode("form", null, [
                vue.createElementVNode("view", { class: "modal-container" }, [
                  vue.createElementVNode("view", { class: "modal-container-head" }, [
                    vue.createElementVNode("text", null, "请选择油号"),
                    vue.createElementVNode("image", {
                      src: _imports_1$5,
                      onClick: _cache[9] || (_cache[9] = (...args) => _ctx.handleHideOilNumberModal && _ctx.handleHideOilNumberModal(...args))
                    })
                  ]),
                  vue.createElementVNode("view", { class: "modal-container-middle" }, [
                    vue.createElementVNode(
                      "radio-group",
                      {
                        onChange: _cache[10] || (_cache[10] = (...args) => $options.handleOilRadioChange && $options.handleOilRadioChange(...args)),
                        style: { "display": "flex", "align-items": "center", "flex-direction": "column", "gap": "30rpx", "justify-content": "center" }
                      },
                      [
                        vue.createElementVNode("scroll-view", {
                          "scroll-y": "",
                          style: { "height": "100%" }
                        }, [
                          vue.createCommentVNode(" 遍历显示油号选项 "),
                          (vue.openBlock(true), vue.createElementBlock(
                            vue.Fragment,
                            null,
                            vue.renderList($data.c_oil_items, (item, index) => {
                              return vue.openBlock(), vue.createElementBlock("label", {
                                key: item.id,
                                style: { "display": "flex", "flex-direction": "row", "align-items": "center", "justify-content": "center" }
                              }, [
                                vue.createElementVNode("radio", {
                                  style: { "transform": "scale(0.8)" },
                                  value: item.id
                                }, null, 8, ["value"]),
                                vue.createElementVNode(
                                  "view",
                                  { style: { "font-size": "28rpx" } },
                                  vue.toDisplayString(item == null ? void 0 : item.name),
                                  1
                                  /* TEXT */
                                )
                              ]);
                            }),
                            128
                            /* KEYED_FRAGMENT */
                          ))
                        ])
                      ],
                      32
                      /* NEED_HYDRATION */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "modal-container-footer" }, [
                    vue.createElementVNode("button", {
                      style: { "background-color": "#297DFE", "color": "#fff" },
                      onClick: _cache[11] || (_cache[11] = (...args) => $options.handleOilStartRentingAgain && $options.handleOilStartRentingAgain(...args))
                    }, "确认")
                  ])
                ])
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ],
          4
          /* STYLE */
        )
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesOilAutomaticIndex = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/oil/automatic/index.vue"]]);
  const _sfc_main$j = {
    data() {
      return {
        username: "",
        password: "",
        isSubmitting: false,
        init_qr_code: "",
        langs: {}
      };
    },
    components: {
      CustomNavBar
    },
    mounted() {
      this.infinityGetQrcodeImg();
    },
    onShow() {
      this.handleGetCurrentLanguage();
    },
    methods: {
      handleGetCurrentLanguage() {
        let currentLang2 = uni.getStorageSync("lang") || "zh-CN";
        this.langs = langs[currentLang2];
      },
      // 预览图片
      handlePreviewImage(evt) {
        uni.previewMedia({
          sources: [{
            url: this.init_qr_code,
            // 图片路径
            type: "image"
          }]
        });
      },
      handlePreviewImage() {
        if (this.init_qr_code) {
          uni.previewImage({
            urls: [this.init_qr_code],
            longPressActions: {
              itemList: ["保存图片到相册"],
              success: (data) => {
              }
            }
          });
        }
      },
      async infinityGetQrcodeImg() {
        var _a;
        formatAppLog("log", "at pages/login/login.vue:114", 111);
        try {
          const response = await u_getQrcodeImg();
          if ((response == null ? void 0 : response.code) == 1e3) {
            this.init_qr_code = (_a = response == null ? void 0 : response.content) == null ? void 0 : _a.img;
          }
        } catch (error) {
          uni.showToast({
            title: "查询失败",
            icon: "none"
          });
        }
      },
      async handleLogin() {
        if (!this.username || !this.password) {
          uni.showToast({
            title: "请输入用户名和密码",
            icon: "none"
          });
          return;
        }
        this.isSubmitting = true;
        try {
          const response = await login({
            username: this.username,
            password: this.password,
            type: 2
          });
          uni.setStorageSync("token", response.content.token);
          uni.setStorageSync("user_info", response.content);
          uni.reLaunch({
            url: "/pages/desk/desk"
          });
        } catch (error) {
          uni.showToast({
            title: "登录失败，请检查用户名和密码",
            icon: "none"
          });
        } finally {
          this.isSubmitting = false;
        }
      },
      handleRegister() {
        uni.navigateTo({
          url: "/pages/register/register"
        });
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" index.wxml "),
        vue.createElementVNode("view", { class: "container" }, [
          vue.createVNode(_component_CustomNavBar, { title: "登录" }),
          vue.createCommentVNode(" 上部分：登录区域 "),
          vue.createElementVNode("view", { class: "login-area" }, [
            vue.createCommentVNode(" Logo 区域 "),
            vue.createElementVNode("view", { class: "logo-container fade-in" }, [
              vue.createElementVNode("view", { class: "logo-wrapper" }, [
                vue.createElementVNode("image", {
                  src: _imports_0$7,
                  class: "logo-img"
                }),
                vue.createElementVNode("text", { class: "logo-text" }, "智信通wiselink")
              ]),
              vue.createElementVNode("text", { class: "slogan" }, "智信通汽车出行技术服务运营提供商")
            ]),
            vue.createCommentVNode(" 登录方式选择 "),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("view", { class: "input-item" }, [
                vue.createElementVNode(
                  "view",
                  { class: "input-label" },
                  vue.toDisplayString($data.langs.account),
                  1
                  /* TEXT */
                ),
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "input-field",
                  placeholder: $data.langs.pleaseaccount,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.username = $event)
                }, null, 8, ["placeholder"]), [
                  [vue.vModelText, $data.username]
                ])
              ]),
              vue.createElementVNode("view", { class: "input-item" }, [
                vue.createElementVNode(
                  "view",
                  { class: "input-label" },
                  vue.toDisplayString($data.langs.password),
                  1
                  /* TEXT */
                ),
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "input-field",
                  placeholder: $data.langs.pleasepassword,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.password = $event),
                  password: true
                }, null, 8, ["placeholder"]), [
                  [vue.vModelText, $data.password]
                ])
              ]),
              vue.createElementVNode("view", null, [
                vue.createElementVNode(
                  "button",
                  {
                    class: "login-btn",
                    onClick: _cache[2] || (_cache[2] = (...args) => $options.handleLogin && $options.handleLogin(...args))
                  },
                  vue.toDisplayString($data.langs.loginnow),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  {
                    class: "register",
                    onClick: _cache[3] || (_cache[3] = (...args) => $options.handleRegister && $options.handleRegister(...args))
                  },
                  vue.toDisplayString($data.langs.signup),
                  1
                  /* TEXT */
                )
              ])
            ])
          ]),
          vue.createCommentVNode(" 下部分：信息展示 "),
          vue.createElementVNode("view", { class: "info-area" }, [
            vue.createElementVNode("view", { class: "info-card" }, [
              vue.createElementVNode("text", { class: "product-name" }, "智前通wiselink"),
              vue.createElementVNode("view", { style: { "font-size": "26rpx", "color": "#575658" } }, "商务合作咨询、更多产品了解，请点击、长按官方群二维码，有专属客服服务！"),
              vue.createElementVNode("view", { style: { "display": "flex", "justify-content": "center" } }, [
                vue.createElementVNode("image", {
                  src: $data.init_qr_code,
                  style: { "width": "300rpx", "height": "300rpx" },
                  onClick: _cache[4] || (_cache[4] = (...args) => $options.handlePreviewImage && $options.handlePreviewImage(...args))
                }, null, 8, ["src"])
              ]),
              vue.createElementVNode("view", { class: "contact-info" }, [
                vue.createElementVNode("text", { class: "company-name" }, "智信通·中国北京")
              ])
            ])
          ])
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/login/login.vue"]]);
  const _sfc_main$i = {
    data() {
      return {
        username: "",
        password: "",
        confirmPassword: "",
        phone: "",
        smsCode: "",
        isSubmitting: false,
        smsDisabled: false,
        smsBtnText: "",
        countdown: 60,
        langs: {}
      };
    },
    components: {
      CustomNavBar
    },
    onShow() {
      this.handleGetCurrentLanguage();
    },
    methods: {
      handleGetCurrentLanguage() {
        let currentLang2 = uni.getStorageSync("lang") || "zh-CN";
        this.langs = langs[currentLang2];
      },
      // 表单验证
      validateForm() {
        if (!this.password) {
          uni.showToast({ title: "请输入密码", icon: "none" });
          return false;
        }
        if (this.password !== this.confirmPassword) {
          uni.showToast({ title: "两次输入的密码不一致", icon: "none" });
          return false;
        }
        if (!this.username) {
          uni.showToast({ title: "用户名", icon: "none" });
          return false;
        }
        return true;
      },
      // 注册处理
      async handleRegister() {
        if (this.isSubmitting)
          return;
        if (!this.validateForm())
          return;
        this.isSubmitting = true;
        try {
          const response = await u_register({
            password: this.password,
            username: this.username
          });
          formatAppLog("log", "at pages/register/register.vue:105", response);
          if (response.code === 1e3) {
            uni.showToast({ title: "注册成功" });
            setTimeout(() => {
              uni.navigateBack();
            }, 3e3);
          } else {
            uni.showToast({ title: response.msg || "注册失败", icon: "none" });
          }
        } catch (error) {
          uni.showToast({ title: "请求失败，请稍后重试", icon: "none" });
        } finally {
          this.isSubmitting = false;
        }
      },
      // 跳转到登录页面
      goToLogin() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createVNode(_component_CustomNavBar, { title: "注册账号" }),
      vue.createElementVNode("view", { class: "register-area" }, [
        vue.createCommentVNode(" Logo 区域 "),
        vue.createElementVNode("view", { class: "logo-container fade-in" }, [
          vue.createElementVNode("view", { class: "logo-wrapper" }, [
            vue.createElementVNode("image", {
              src: _imports_0$7,
              class: "logo-img"
            }),
            vue.createElementVNode("text", { class: "logo-text" }, "智信通wiselink")
          ]),
          vue.createElementVNode("text", { class: "slogan" }, "智信通汽车出行技术服务运营提供商")
        ]),
        vue.createCommentVNode(" 注册表单 "),
        vue.createElementVNode("view", { class: "input-group" }, [
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.createElementVNode(
              "view",
              { class: "input-label" },
              vue.toDisplayString($data.langs.username),
              1
              /* TEXT */
            ),
            vue.withDirectives(vue.createElementVNode("input", {
              class: "input-field",
              placeholder: $data.langs.pleaseusername,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.username = $event)
            }, null, 8, ["placeholder"]), [
              [vue.vModelText, $data.username]
            ])
          ]),
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.createElementVNode(
              "view",
              { class: "input-label" },
              vue.toDisplayString($data.langs.password),
              1
              /* TEXT */
            ),
            vue.withDirectives(vue.createElementVNode("input", {
              class: "input-field",
              placeholder: $data.langs.pleasepassword,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.password = $event),
              password: true
            }, null, 8, ["placeholder"]), [
              [vue.vModelText, $data.password]
            ])
          ]),
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.createElementVNode(
              "view",
              { class: "input-label" },
              vue.toDisplayString($data.langs.confirmpassword),
              1
              /* TEXT */
            ),
            vue.withDirectives(vue.createElementVNode("input", {
              class: "input-field",
              placeholder: $data.langs.Reenterpassword,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.confirmPassword = $event),
              password: true
            }, null, 8, ["placeholder"]), [
              [vue.vModelText, $data.confirmPassword]
            ])
          ]),
          vue.createElementVNode("button", {
            class: "register-btn",
            disabled: $data.isSubmitting,
            onClick: _cache[3] || (_cache[3] = (...args) => $options.handleRegister && $options.handleRegister(...args))
          }, vue.toDisplayString($data.langs.signup), 9, ["disabled"]),
          vue.createElementVNode("view", { class: "login-link" }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($data.langs.haveanaccount),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              {
                class: "link-text",
                onClick: _cache[4] || (_cache[4] = (...args) => $options.goToLogin && $options.goToLogin(...args))
              },
              vue.toDisplayString($data.langs.loginnow),
              1
              /* TEXT */
            )
          ])
        ])
      ])
    ]);
  }
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/register/register.vue"]]);
  const _sfc_main$h = {
    components: {
      CustomNavBar
    },
    data() {
      return {
        screenInfo: {},
        // 屏幕信息对象
        params: {},
        langs: {}
      };
    },
    onLoad(options) {
      this.souce = options == null ? void 0 : options.souce;
    },
    onShow() {
      this.initialScreenInfo();
      this.initGetInfo();
      this.handleGetCurrentLanguage();
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      handleGetCurrentLanguage() {
        let currentLang2 = uni.getStorageSync("lang") || "zh-CN";
        this.langs = langs[currentLang2];
      },
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      async initGetInfo() {
        try {
          const res = await u_companyInfo();
          this.params = res == null ? void 0 : res.content;
        } catch (error) {
          uni.showToast({
            title: "信息获取失败",
            icon: "none"
          });
        }
      },
      handleBindinput(evt, text) {
        this.params[text] = evt.detail.value;
      },
      // 确认修改
      async handleSubmit() {
        const {
          params
        } = this;
        const info = {
          name: (params == null ? void 0 : params.name) || "",
          chargename: (params == null ? void 0 : params.chargename) || "",
          chargemobile: (params == null ? void 0 : params.chargemobile) || "",
          bak: (params == null ? void 0 : params.bak) || "",
          invoiceHeader: (params == null ? void 0 : params.invoiceHeader) || "",
          invoiceNum: (params == null ? void 0 : params.invoiceNum) || "",
          invoiceMobile: (params == null ? void 0 : params.invoiceMobile) || "",
          invoiceAddress: (params == null ? void 0 : params.invoiceAddress) || "",
          accountsBank: (params == null ? void 0 : params.accountsBank) || "",
          bankCardNumber: (params == null ? void 0 : params.bankCardNumber) || ""
        };
        try {
          const res = await u_companyImprove({
            ...info
          });
          if (res.code === 1e3) {
            uni.showToast({
              title: "提交成功",
              icon: "success"
            });
            this.$nextTick(() => {
              this.initGetInfo();
            });
          } else {
            uni.showToast({
              title: res.msg || "提交失败",
              icon: "none"
            });
          }
        } catch (error) {
          uni.showToast({
            title: "网络异常，请重试",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "container",
        style: vue.normalizeStyle({ height: `${$options.safeScreenHeight}px` })
      },
      [
        vue.createVNode(_component_CustomNavBar, { title: "税务和发票资料" }),
        vue.createCommentVNode(" 主容器 "),
        vue.createElementVNode(
          "view",
          {
            class: "record-container",
            style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
          },
          [
            vue.createCommentVNode(" 新增车辆区域 "),
            vue.createElementVNode("scroll-view", {
              "scroll-y": "",
              style: { "height": "100vh" }
            }, [
              vue.createElementVNode("view", { class: "card-info" }, [
                vue.createCommentVNode(" 企业名称 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    { class: "form-label" },
                    vue.toDisplayString($data.langs.company),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.company_placeholder,
                    value: (_a = $data.params) == null ? void 0 : _a.name,
                    maxlength: "10",
                    "placeholder-style": "color: #999;",
                    onInput: _cache[0] || (_cache[0] = (e2) => $options.handleBindinput(e2, "name"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 联系人 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    { class: "form-label" },
                    vue.toDisplayString($data.langs.contact),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.contact_placeholder,
                    value: (_b = $data.params) == null ? void 0 : _b.chargename,
                    maxlength: "20",
                    "placeholder-style": "color: #999;",
                    onInput: _cache[1] || (_cache[1] = (e2) => $options.handleBindinput(e2, "chargename"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 联系电话 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.phone),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.phone_placeholder,
                    value: (_c = $data.params) == null ? void 0 : _c.chargemobile,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[2] || (_cache[2] = (e2) => $options.handleBindinput(e2, "chargemobile"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 备注 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.notes),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.notes_placeholder,
                    value: (_d = $data.params) == null ? void 0 : _d.bak,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[3] || (_cache[3] = (e2) => $options.handleBindinput(e2, "bak"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 开票名称 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.invoice_name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.invoice_name_placeholder,
                    value: (_e = $data.params) == null ? void 0 : _e.invoiceHeader,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[4] || (_cache[4] = (e2) => $options.handleBindinput(e2, "invoiceHeader"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 纳税人识别号 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.tax_id),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.tax_id_placeholder,
                    value: (_f = $data.params) == null ? void 0 : _f.invoiceNum,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[5] || (_cache[5] = (e2) => $options.handleBindinput(e2, "invoiceNum"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 电话 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.mobile),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.phone_number,
                    value: (_g = $data.params) == null ? void 0 : _g.invoiceMobile,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[6] || (_cache[6] = (e2) => $options.handleBindinput(e2, "invoiceMobile"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 地址 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.address),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.address_placeholder,
                    value: (_h = $data.params) == null ? void 0 : _h.invoiceAddress,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[7] || (_cache[7] = (e2) => $options.handleBindinput(e2, "invoiceAddress"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 开户行 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.bank),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.bank_placeholder,
                    value: (_i = $data.params) == null ? void 0 : _i.accountsBank,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[8] || (_cache[8] = (e2) => $options.handleBindinput(e2, "accountsBank"))
                  }, null, 40, ["placeholder", "value"])
                ]),
                vue.createCommentVNode(" 开户账号 "),
                vue.createElementVNode("view", { class: "card-info-item" }, [
                  vue.createElementVNode(
                    "label",
                    null,
                    vue.toDisplayString($data.langs.account),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("input", {
                    class: "form-input",
                    placeholder: $data.langs.account_placeholder,
                    value: (_j = $data.params) == null ? void 0 : _j.bankCardNumber,
                    "placeholder-style": "color: #999;",
                    onInput: _cache[9] || (_cache[9] = (e2) => $options.handleBindinput(e2, "bankCardNumber"))
                  }, null, 40, ["placeholder", "value"])
                ])
              ]),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode(
                  "view",
                  {
                    onClick: _cache[10] || (_cache[10] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
                  },
                  vue.toDisplayString($data.langs.confirm),
                  1
                  /* TEXT */
                )
              ])
            ])
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesImproveDataContactUsIndex = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/improveData/contactUs/index.vue"]]);
  const _sfc_main$g = {
    components: {
      CustomNavBar
    },
    data() {
      return {
        screenInfo: {},
        // 屏幕信息对象
        g_page: 1,
        // 当前页码
        g_items: [],
        // 车辆列表数据
        params: {},
        souce: null,
        langs: {}
      };
    },
    onLoad(options) {
      this.souce = options == null ? void 0 : options.souce;
    },
    onShow() {
      this.initialCarList();
      this.initialScreenInfo();
      this.handleGetCurrentLanguage();
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      handleGetCurrentLanguage() {
        let currentLang2 = uni.getStorageSync("lang") || "zh-CN";
        this.langs = langs[currentLang2];
      },
      // 滚动到底部加载更多
      lower(e2) {
        if (!this.loading) {
          this.loading = true;
          this.g_page++;
          setTimeout(() => {
            this.initialCarList();
            this.loading = false;
          }, 1e3);
        }
      },
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          formatAppLog("error", "at pages/improveData/installer/index.vue:123", "[ScreenInfo] 获取屏幕信息失败:", error);
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 获取车辆列表
      async initialCarList() {
        try {
          const res = await u_installerapiList({
            page: this.g_page
          });
          this.g_items = this.g_items.concat((res == null ? void 0 : res.content) || []);
        } catch (error) {
          formatAppLog("error", "at pages/improveData/installer/index.vue:143", "获取车辆列表失败:", error);
        }
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "container",
        style: vue.normalizeStyle({ height: `${$options.safeScreenHeight}px` })
      },
      [
        vue.createVNode(_component_CustomNavBar, { title: "安装商查询" }),
        vue.createCommentVNode(" 主容器 "),
        vue.createElementVNode(
          "view",
          {
            class: "record-container",
            style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
          },
          [
            vue.createCommentVNode(" 车辆列表区域 "),
            vue.createElementVNode(
              "scroll-view",
              {
                style: { "height": "100vh" },
                "scroll-y": "",
                onScrolltolower: _cache[0] || (_cache[0] = (...args) => $options.lower && $options.lower(...args))
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.g_items, (item, index) => {
                    var _a, _b;
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      class: "content-item"
                    }, [
                      vue.createElementVNode("view", { class: "content-item-head" }, [
                        vue.createElementVNode("view", { class: "head-left" }, [
                          vue.createElementVNode("view", { class: "left-category" }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString(item == null ? void 0 : item.name),
                              1
                              /* TEXT */
                            )
                          ])
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "content-item-info" }, [
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass("info-item  " + (((_a = item == null ? void 0 : item.linkperson) == null ? void 0 : _a.length) > 15 ? "long-info-item" : ""))
                          },
                          [
                            vue.createElementVNode(
                              "label",
                              null,
                              vue.toDisplayString($data.langs.contact) + " ：",
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString((item == null ? void 0 : item.linkperson) || "-"),
                              1
                              /* TEXT */
                            )
                          ],
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass("info-item  " + (((_b = item == null ? void 0 : item.linkmobile) == null ? void 0 : _b.length) > 15 ? "long-info-item" : ""))
                          },
                          [
                            vue.createElementVNode(
                              "label",
                              null,
                              vue.toDisplayString($data.langs.phone) + " ：",
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString((item == null ? void 0 : item.linkmobile) || "-"),
                              1
                              /* TEXT */
                            )
                          ],
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode("view", { class: "info-item long-info-item" }, [
                          vue.createElementVNode(
                            "label",
                            null,
                            vue.toDisplayString($data.langs.businesshours) + " ：",
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString((item == null ? void 0 : item.workinghours) || "-"),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "info-item long-info-item" }, [
                          vue.createElementVNode(
                            "label",
                            null,
                            vue.toDisplayString($data.langs.address) + " ：",
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item.province || "") + vue.toDisplayString(item.city || "") + vue.toDisplayString(item.area || "") + vue.toDisplayString(item.address || ""),
                            1
                            /* TEXT */
                          )
                        ])
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              32
              /* NEED_HYDRATION */
            )
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesImproveDataInstallerIndex = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/improveData/installer/index.vue"]]);
  const _sfc_main$f = {
    components: {
      CustomNavBar
    },
    data() {
      return {
        screenInfo: {},
        // 屏幕信息对象
        info: {}
      };
    },
    onLoad(options) {
    },
    onShow() {
      this.initialScreenInfo();
      this.initShops();
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      showModal() {
        uni.showModal({
          title: "输入内容",
          content: "",
          editable: true,
          // 开启输入框
          placeholderText: "请输入内容...",
          success: async (res) => {
            if (res.confirm) {
              const respone = await u_addMessage({
                message: res.content
              });
              if ((respone == null ? void 0 : respone.code) == 1e3) {
                uni.showToast({
                  title: respone == null ? void 0 : respone.msg,
                  icon: "none"
                });
              }
            }
          }
        });
      },
      // 预览二维码大图
      previewQrcode() {
        var _a;
        if ((_a = this.info) == null ? void 0 : _a.qrcode) {
          uni.previewImage({
            urls: [this.info.qrcode],
            longPressActions: {
              itemList: ["保存图片到相册"],
              success: (data) => {
                if (data.tapIndex === 0) {
                  this.saveImage();
                }
              }
            }
          });
        }
      },
      // 保存图片到相册
      saveImage() {
        uni.downloadFile({
          url: this.info.qrcode,
          success: (res) => {
            if (res.statusCode === 200) {
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  uni.showToast({
                    title: "保存成功",
                    icon: "success"
                  });
                },
                fail: () => {
                  uni.showToast({
                    title: "保存失败",
                    icon: "none"
                  });
                }
              });
            }
          }
        });
      },
      // 复制链接
      copyLink() {
        var _a;
        const link = ((_a = this.info) == null ? void 0 : _a.link) || "";
        uni.setClipboardData({
          data: link,
          success: () => {
            uni.showToast({
              title: "链接已复制",
              icon: "success"
            });
          }
        });
      },
      // 联系我们
      contactUs() {
        uni.makePhoneCall({
          phoneNumber: "133 3106 6554"
          // 替换为实际客服电话
        });
      },
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          formatAppLog("error", "at pages/improveData/shops/index.vue:166", "[ScreenInfo] 获取屏幕信息失败:", error);
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 获取车辆列表
      async initShops() {
        try {
          const res = await u_shopapiList();
          if ((res == null ? void 0 : res.code) == 1e3) {
            this.info = res == null ? void 0 : res.content;
          }
        } catch (error) {
          formatAppLog("error", "at pages/improveData/shops/index.vue:182", "获取车辆列表失败:", error);
        }
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "container",
        style: vue.normalizeStyle({ height: `${$options.safeScreenHeight}px` })
      },
      [
        vue.createVNode(_component_CustomNavBar, { title: "智信通商铺" }),
        vue.createCommentVNode(" 主容器 "),
        vue.createElementVNode(
          "view",
          {
            class: "record-container",
            style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
          },
          [
            vue.createElementVNode("view", { class: "title" }, "使用「抖音APP」扫码查看店铺"),
            vue.createCommentVNode(" 二维码容器，添加点击事件 "),
            vue.createElementVNode("view", {
              class: "qrcode-container",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.previewQrcode && $options.previewQrcode(...args))
            }, [
              vue.createElementVNode("image", {
                src: (_a = $data.info) == null ? void 0 : _a.qrcode,
                class: "qrcode-img"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "zoom-hint" }, "点击查看大图")
            ]),
            vue.createElementVNode("view", { class: "action-buttons" }, [
              vue.createElementVNode("button", {
                class: "action-btn",
                onClick: _cache[1] || (_cache[1] = (...args) => $options.copyLink && $options.copyLink(...args))
              }, "复制链接"),
              vue.createCommentVNode(" 可以使用contactUs方法直接拨打电话 "),
              vue.createElementVNode("button", {
                class: "action-btn contact-btn",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.showModal && $options.showModal(...args))
              }, "联系我们")
            ]),
            vue.createElementVNode("view", { class: "tip-text" }, [
              vue.createElementVNode("text", null, "可点击二维码放大长按保存到本地"),
              vue.createElementVNode("text", null, "分享给朋友、客户，二维码长期有效")
            ])
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesImproveDataShopsIndex = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/improveData/shops/index.vue"]]);
  const _imports_0$3 = "/static/public/add.png";
  const _imports_1$4 = "/static/public/reduce.png";
  const _sfc_main$e = {
    components: {
      CustomNavBar
    },
    data() {
      return {
        oilSetItems: [],
        fwSetItems: [{
          name: "服务费",
          value: "10"
        }, {
          name: "配送费",
          value: "5"
        }],
        screenInfo: {}
        // 屏幕信息对象
      };
    },
    onShow() {
      this.initialScreenInfo();
      this.initOilSet();
    },
    computed: {
      // 当前用户信息（从本地存储获取）
      userInfo() {
        return uni.getStorageSync("user_info") || null;
      },
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      // 保存设置
      async saveSettings() {
        var _a;
        const temp = {
          companyId: (_a = this.userInfo) == null ? void 0 : _a.fin3CompanyId,
          fwSet: this.fwSetItems,
          oilSet: this.oilSetItems
        };
        try {
          const res = await u_saveOilSet(temp);
          formatAppLog("log", "at pages/carRental/oilPrice/index.vue:120", 1122, res);
          if ((res == null ? void 0 : res.code) == 1e3) {
            uni.showToast({
              title: res == null ? void 0 : res.msg,
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/carRental/oilPrice/index.vue:129", "保存失败:", error);
        }
      },
      // 获取油价
      async initOilSet() {
        var _a, _b;
        try {
          const res = await u_getOilSet();
          if ((res == null ? void 0 : res.code) == 1e3) {
            const oilSet = (_a = res == null ? void 0 : res.content) == null ? void 0 : _a.oilSet;
            const fwSet = (_b = res == null ? void 0 : res.content) == null ? void 0 : _b.fwSet;
            this.oilSetItems = Object.entries(oilSet).map(([key, value]) => ({
              name: key,
              value
            }));
            this.fwSetItems = Object.entries(fwSet).map(([key, value]) => ({
              name: key,
              value
            }));
          }
        } catch (error) {
          formatAppLog("error", "at pages/carRental/oilPrice/index.vue:149", "获取数据失败:", error);
        }
      },
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          formatAppLog("error", "at pages/carRental/oilPrice/index.vue:157", "[ScreenInfo] 获取屏幕信息失败:", error);
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 统一处理输入事件
      handleInput(e2, dataset, index, field) {
        const value = e2.detail.value;
        const newArray = [...this[dataset]];
        newArray[index] = {
          ...newArray[index],
          [field]: value
        };
        this[dataset] = newArray;
      },
      // 添加汽油条目
      addOilItem() {
        this.oilSetItems.push({
          name: "",
          value: ""
        });
        this.setData({
          oilSetItems: this.oilSetItems
        });
      },
      // 添加服务条目
      addFwItem() {
        this.fwSetItems.push({
          name: "",
          value: ""
        });
        this.setData({
          fwSetItems: this.fwSetItems
        });
      },
      // 删除条目
      removeItem(dataset, index) {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这项内容吗？",
          success: (res) => {
            if (res.confirm) {
              this[dataset].splice(index, 1);
              this.setData({
                [dataset]: this[dataset]
              });
            }
          }
        });
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    const _component_uni_icons = vue.resolveComponent("uni-icons");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createVNode(_component_CustomNavBar, { title: "油价设定" }),
      vue.createCommentVNode(" 汽油价格区域 "),
      vue.createElementVNode(
        "view",
        {
          class: "section-header",
          style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
        },
        [
          vue.createElementVNode("view", { class: "title" }, "汽油价格"),
          vue.createElementVNode("view", {
            class: "add-btn",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.addOilItem && $options.addOilItem(...args))
          }, [
            vue.createElementVNode("image", {
              src: _imports_0$3,
              style: { "width": "30rpx", "height": "30rpx" }
            })
          ])
        ],
        4
        /* STYLE */
      ),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.oilSetItems, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: index,
            class: "input-row"
          }, [
            vue.createElementVNode("input", {
              class: "name-input",
              value: item.name,
              placeholder: "油号",
              onInput: ($event) => $options.handleInput($event, "oilSetItems", index, "name")
            }, null, 40, ["value", "onInput"]),
            vue.createElementVNode("input", {
              class: "price-input",
              type: "digit",
              value: item.value,
              placeholder: "元/升",
              onInput: ($event) => $options.handleInput($event, "oilSetItems", index, "value")
            }, null, 40, ["value", "onInput"]),
            index > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "del-btn",
              onClick: ($event) => $options.removeItem("oilSetItems", index)
            }, [
              vue.createElementVNode("image", {
                src: _imports_1$4,
                style: { "width": "30rpx", "height": "30rpx" }
              })
            ], 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      vue.createCommentVNode(" 服务价格区域 "),
      vue.createElementVNode("view", { class: "section-header" }, [
        vue.createElementVNode("view", { class: "title" }, "服务价格"),
        vue.createElementVNode("view", {
          class: "add-btn",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.addFwItem && $options.addFwItem(...args))
        }, [
          vue.createElementVNode("image", {
            src: _imports_0$3,
            style: { "width": "30rpx", "height": "30rpx" }
          })
        ])
      ]),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.fwSetItems, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: index,
            class: "input-row"
          }, [
            vue.createElementVNode("input", {
              class: "name-input",
              value: item.name,
              placeholder: "服务名称",
              onInput: ($event) => $options.handleInput($event, "fwSetItems", index, "name")
            }, null, 40, ["value", "onInput"]),
            vue.createElementVNode("input", {
              class: "price-input",
              type: "digit",
              value: item.value,
              placeholder: "服务价格",
              onInput: ($event) => $options.handleInput($event, "fwSetItems", index, "value")
            }, null, 40, ["value", "onInput"]),
            index > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "del-btn",
              onClick: ($event) => $options.removeItem("fwSetItems", index)
            }, [
              vue.createElementVNode("image", {
                src: _imports_1$4,
                style: { "width": "30rpx", "height": "30rpx" }
              })
            ], 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      vue.createCommentVNode(" 操作按钮 "),
      vue.createElementVNode("view", {
        class: "save-btn",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.saveSettings && $options.saveSettings(...args))
      }, [
        vue.createVNode(_component_uni_icons, {
          type: "checkmarkempty",
          size: "24",
          color: "#fff"
        }),
        vue.createElementVNode("text", null, "保存设置")
      ]),
      vue.createCommentVNode(" 计算公式说明 "),
      vue.createElementVNode("view", { class: "formula-section" }, [
        vue.createElementVNode("view", { class: "title" }, "补差价计算公式"),
        vue.createElementVNode("view", { class: "formula" }, "服务费1+服务费2+服务费3+油号单价×升数"),
        vue.createElementVNode("view", { class: "title" }, "补退计算公式"),
        vue.createElementVNode("view", { class: "formula" }, "油号单价×升数")
      ])
    ]);
  }
  const PagesCarRentalOilPriceIndex = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/carRental/oilPrice/index.vue"]]);
  const _sfc_main$d = {
    components: {
      CustomNavBar
    },
    data() {
      return {
        screenInfo: {},
        // 屏幕信息对象
        form: {},
        showOldPassword: false,
        // 控制原密码显示
        showNewPassword: false,
        // 控制新密码显示
        showConfirmPassword: false,
        // 控制确认密码显示
        submitting: false,
        // 防止重复提交
        g_activeTab: 1
      };
    },
    onLoad(options) {
    },
    onShow() {
      this.initialScreenInfo();
    },
    computed: {
      // 当前用户信息
      userInfo() {
        return uni.getStorageSync("user_info") || null;
      },
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          formatAppLog("error", "at pages/resetPassword/index.vue:138", "[ScreenInfo] 获取屏幕信息失败:", error);
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 切换标签页
      handleSwitchTab(evt) {
        this.g_activeTab = evt;
      },
      // 表单验证
      validateForm() {
        if (!this.form.oldPassword) {
          uni.showToast({
            title: "请输入原密码",
            icon: "none"
          });
          return false;
        }
        if (!this.form.newPassword) {
          uni.showToast({
            title: "请输入新密码",
            icon: "none"
          });
          return false;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(this.form.newPassword)) {
          uni.showToast({
            title: "密码需8-20位字母数字组合",
            icon: "none"
          });
          return false;
        }
        if (this.form.newPassword !== this.form.confirmPassword) {
          uni.showToast({
            title: "两次输入密码不一致",
            icon: "none"
          });
          return false;
        }
        if (this.form.oldPassword === this.form.newPassword) {
          uni.showToast({
            title: "新密码不能与原密码相同",
            icon: "none"
          });
          return false;
        }
        return true;
      },
      // 提交表单
      async handleSubmit() {
        if (this.submitting)
          return;
        this.submitting = true;
        try {
          if (this.g_activeTab === 1) {
            await this.handleUsernameUpdate();
          } else {
            await this.handlePasswordUpdate();
          }
        } finally {
          this.submitting = false;
        }
      },
      // 用户名修改逻辑
      async handleUsernameUpdate() {
        var _a, _b, _c;
        if (((_a = this.form) == null ? void 0 : _a.UserName) !== ((_b = this.form) == null ? void 0 : _b.newUserName)) {
          uni.showToast({
            title: "两次输入用户名不一致",
            icon: "none"
          });
          return;
        }
        const params = {
          newUserName: this.form.newUserName,
          userId: (_c = this.userInfo) == null ? void 0 : _c.id
        };
        await this.executeUpdate(
          u_updateUserName,
          params,
          "用户名修改成功",
          "用户名修改失败"
        );
      },
      // 密码修改逻辑
      async handlePasswordUpdate() {
        var _a;
        if (!this.validateForm())
          return;
        const params = {
          oldPassword: this.form.oldPassword,
          newPassword: this.form.newPassword,
          userId: (_a = this.userInfo) == null ? void 0 : _a.id
        };
        await this.executeUpdate(
          u_updatePassword,
          params,
          "密码修改成功",
          "密码修改失败"
        );
      },
      // 统一请求处理器
      async executeUpdate(apiFunc, params, successMsg, errorMsg) {
        try {
          const res = await apiFunc(params);
          if (res.code === 1e3) {
            this.showSuccessToast(successMsg);
          } else {
            uni.showToast({
              title: res.message || errorMsg,
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/resetPassword/index.vue:265", `${errorMsg}:`, error);
          uni.showToast({
            title: "请求失败，请稍后重试",
            icon: "none"
          });
        }
      },
      // 成功提示通用逻辑
      showSuccessToast(message) {
        uni.showToast({
          title: message,
          icon: "none",
          duration: 1500,
          success: () => {
            setTimeout(() => uni.navigateBack(), 1500);
          }
        });
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "container",
        style: vue.normalizeStyle({ height: `${$options.safeScreenHeight}px` })
      },
      [
        vue.createVNode(_component_CustomNavBar, { title: "修改用户名密码" }),
        vue.createCommentVNode(" 主容器 "),
        vue.createElementVNode(
          "view",
          {
            class: "record-container",
            style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
          },
          [
            vue.createElementVNode("view", { class: "record-tabs" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["record-tabs-item", $data.g_activeTab == 1 ? "tabs-active-1" : "tabs-no-active-1"]),
                  onClick: _cache[0] || (_cache[0] = ($event) => $options.handleSwitchTab(1))
                },
                "修改用户名",
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["record-tabs-item", $data.g_activeTab == 2 ? "tabs-active-2" : "tabs-no-active-2"]),
                  onClick: _cache[1] || (_cache[1] = ($event) => $options.handleSwitchTab(2))
                },
                " 修改密码 ",
                2
                /* CLASS */
              )
            ]),
            vue.createElementVNode("view", { class: "form-container" }, [
              $data.g_activeTab == 1 ? (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: 0 },
                [
                  vue.createElementVNode("view", { class: "input-group" }, [
                    vue.createElementVNode("text", { class: "label" }, "用户名"),
                    vue.createElementVNode("view", { class: "input-wrapper" }, [
                      vue.withDirectives(vue.createElementVNode(
                        "input",
                        {
                          class: "input",
                          type: "text",
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.form.UserName = $event),
                          placeholder: "请输入用户名",
                          "placeholder-class": "placeholder",
                          "password-icon": ""
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vModelText, $data.form.UserName]
                      ])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "input-group" }, [
                    vue.createElementVNode("text", { class: "label" }, "确认用户名"),
                    vue.createElementVNode("view", { class: "input-wrapper" }, [
                      vue.withDirectives(vue.createElementVNode(
                        "input",
                        {
                          class: "input",
                          type: "text",
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.form.newUserName = $event),
                          placeholder: "请再次输入用户名",
                          "placeholder-class": "placeholder",
                          "password-icon": ""
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vModelText, $data.form.newUserName]
                      ])
                    ])
                  ])
                ],
                64
                /* STABLE_FRAGMENT */
              )) : (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: 1 },
                [
                  vue.createElementVNode("view", { class: "input-group" }, [
                    vue.createElementVNode("text", { class: "label" }, "原密码"),
                    vue.createElementVNode("view", { class: "input-wrapper" }, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        class: "input",
                        type: $data.showOldPassword ? "text" : "password",
                        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.form.oldPassword = $event),
                        placeholder: "请输入原密码",
                        "placeholder-class": "placeholder",
                        "password-icon": ""
                      }, null, 8, ["type"]), [
                        [vue.vModelDynamic, $data.form.oldPassword]
                      ]),
                      vue.createElementVNode("image", {
                        src: $data.showOldPassword ? "/static/public/eye-open.png" : "/static/public/eye-close.png",
                        class: "eye-icon",
                        onClick: _cache[5] || (_cache[5] = ($event) => $data.showOldPassword = !$data.showOldPassword)
                      }, null, 8, ["src"])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "input-group" }, [
                    vue.createElementVNode("text", { class: "label" }, "新密码"),
                    vue.createElementVNode("view", { class: "input-wrapper" }, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        class: "input",
                        type: $data.showNewPassword ? "text" : "password",
                        "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.form.newPassword = $event),
                        placeholder: "8-20位字母数字组合",
                        "placeholder-class": "placeholder",
                        "password-icon": ""
                      }, null, 8, ["type"]), [
                        [vue.vModelDynamic, $data.form.newPassword]
                      ]),
                      vue.createElementVNode("image", {
                        src: $data.showNewPassword ? "/static/public/eye-open.png" : "/static/public/eye-close.png",
                        class: "eye-icon",
                        onClick: _cache[7] || (_cache[7] = ($event) => $data.showNewPassword = !$data.showNewPassword)
                      }, null, 8, ["src"])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "input-group" }, [
                    vue.createElementVNode("text", { class: "label" }, "确认密码"),
                    vue.createElementVNode("view", { class: "input-wrapper" }, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        class: "input",
                        type: $data.showConfirmPassword ? "text" : "password",
                        "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.form.confirmPassword = $event),
                        placeholder: "请再次输入新密码",
                        "placeholder-class": "placeholder",
                        "password-icon": ""
                      }, null, 8, ["type"]), [
                        [vue.vModelDynamic, $data.form.confirmPassword]
                      ]),
                      vue.createElementVNode("image", {
                        src: $data.showConfirmPassword ? "/static/public/eye-open.png" : "/static/public/eye-close.png",
                        class: "eye-icon",
                        onClick: _cache[9] || (_cache[9] = ($event) => $data.showConfirmPassword = !$data.showConfirmPassword)
                      }, null, 8, ["src"])
                    ])
                  ])
                ],
                64
                /* STABLE_FRAGMENT */
              )),
              vue.createElementVNode("button", {
                class: "submit-btn",
                disabled: $data.submitting,
                onClick: _cache[10] || (_cache[10] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
              }, vue.toDisplayString($data.submitting ? "提交中..." : "确认修改"), 9, ["disabled"])
            ])
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesResetPasswordIndex = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/resetPassword/index.vue"]]);
  var SCOPE_TYPE = {
    SCOPE_LOCATION: "scope.userLocation",
    SCOPE_CAMERA: "scope.camera",
    SCOPE_BLUETOOTH: "scope.bluetooth"
  };
  function showToast$1(msg) {
    uni.showToast({
      title: msg,
      icon: "none"
    });
  }
  function showSucessToast(msg) {
    uni.showToast({
      title: msg,
      icon: "success"
    });
  }
  function showLoading$1(msg) {
    uni.showLoading({
      title: msg,
      mask: true
    });
  }
  function hideLoading$1() {
    uni.hideLoading();
  }
  function showModal(msg, showCancel, behavior) {
    uni.showModal({
      title: "提示",
      content: msg,
      showCancel,
      success: function(res) {
        if (res.confirm) {
          behavior(true);
        } else if (res.cancel) {
          behavior(false);
        }
      }
    });
  }
  function getSystemInfo(systemInfo) {
    uni.getSystemInfo({
      success: function(res) {
        systemInfo(res);
      }
    });
  }
  function getSystemInfoComplete(systemInfo, complete) {
    uni.getSystemInfo({
      success: function(res) {
        systemInfo(res);
      },
      complete: function() {
        complete();
      }
    });
  }
  function getWXLocation(location) {
    uni.getLocation({
      type: "gcj02",
      //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        location(res);
      },
      fail: function(res) {
        location(res);
      }
    });
  }
  function getAuthState(scope, auth) {
    uni.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          auth(false);
        } else {
          auth(true);
        }
      }
    });
  }
  function authorize(scope, authorize2) {
    uni.authorize({
      scope,
      success() {
        authorize2(true);
      },
      fail() {
        authorize2(false);
      }
    });
  }
  function byGet$1(url, param, result) {
    var header = {};
    header["content-type"] = "application/x-www-form-urlencoded";
    var userInfo = getApp().globalData.data.userInfo;
    formatAppLog("log", "at utils/app-util.js:143", getApp());
    if (!isEmpty(userInfo)) {
      header["username"] = userInfo.username;
      header["token"] = userInfo.token;
      header["timestamp"] = Date.parse(/* @__PURE__ */ new Date());
    }
    printLog(url, param);
    param.version = getApp().globalData.data.version;
    return uni.request({
      url,
      data: param,
      header,
      success: function(res) {
        result(res);
        log(res.data);
      },
      fail: function(res) {
        result(res);
      }
    });
  }
  function printLog(url, param) {
    log(url);
    log(param);
  }
  function byPost$1(url, param, result) {
    var header = {};
    header["content-type"] = "application/x-www-form-urlencoded";
    var userInfo = getApp().globalData.data.userInfo;
    formatAppLog("log", "at utils/app-util.js:178", getApp());
    if (!isEmpty(userInfo)) {
      header["username"] = userInfo.username;
      header["token"] = userInfo.token;
      header["timestamp"] = Date.parse(/* @__PURE__ */ new Date());
    }
    printLog(url, param);
    return uni.request({
      timeout: 2e4,
      url,
      //仅为示例，并非真实的接口地址
      data: param,
      header,
      method: "POST",
      success: function(res) {
        result(res);
        log(res.data);
      },
      fail: function(res) {
        log(res);
        result(false);
      }
    });
  }
  function byPostJson(url, param, result) {
    var header = {};
    header["content-type"] = "application/json";
    var userInfo = getApp().globalData.data.userInfo;
    if (!isEmpty(userInfo)) {
      header["username"] = userInfo.username;
      header["token"] = userInfo.token;
      header["timestamp"] = Date.parse(/* @__PURE__ */ new Date());
    }
    printLog(url, param);
    return uni.request({
      timeout: 2e4,
      url,
      //仅为示例，并非真实的接口地址
      data: param,
      header,
      method: "POST",
      success: function(res) {
        result(res);
        log(res.data);
      },
      fail: function(res) {
        log(res);
        result(false);
      }
    });
  }
  function getStorage(key, data) {
    if (key) {
      uni.getStorage({
        key,
        success: function(res) {
          data(res.data);
        },
        fail: function(res) {
          data(false);
        }
      });
    } else {
      data("");
    }
  }
  function setStorage(key, value, result) {
    uni.setStorage({
      key,
      data: value,
      success() {
        result(true);
      },
      fail() {
        result(false);
      }
    });
  }
  function clearStorage() {
    uni.clearStorage();
  }
  function getNetworkType(getNetworkType2) {
    uni.getNetworkType({
      success: function(res) {
        getNetworkType2(res.networkType != "none");
      },
      fail: function(res) {
        getNetworkType2(true);
      }
    });
  }
  function onNetworkStatusChange(onNetworkStatusChange2) {
    uni.onNetworkStatusChange(function(res) {
      onNetworkStatusChange2(res);
    });
  }
  function openLocation(latitude, longitude, scale) {
    uni.openLocation({
      latitude,
      longitude,
      scale: scale ? scale : 18
    });
  }
  function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "" || !obj) {
      return true;
    } else {
      return false;
    }
  }
  function isNumber(obj) {
    var zz = /^[0-9]*$/;
    if (!zz.test(obj)) {
      return false;
    } else {
      return true;
    }
  }
  function navigateTo(url) {
    if (!isEmpty(url)) {
      uni.navigateTo({
        url
      });
    }
  }
  var SHOW_TYPE = {
    IDCARD_TYPE: 1,
    //只上传身份证
    DRIVINGCARD_TYPE: 2,
    //只上传驾驶证
    ALL_TYPE: 3
    //全部都上传
  };
  function chooseImageDefault(result) {
    uni.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success(res) {
        result(res);
      },
      fail(res) {
        result(false);
      }
    });
  }
  function getImageInfo(src, result) {
    uni.getImageInfo({
      src,
      success: function(res) {
        result(res);
      },
      fail: function() {
        result(false);
      }
    });
  }
  function takePhoto(ctx, result) {
    ctx.takePhoto({
      quality: "high",
      success: function(res) {
        result(res);
      },
      fail: function() {
        result(false);
      }
    });
  }
  function uploadFile(url, path, param, result) {
    printLog(url, param);
    return uni.uploadFile({
      url,
      filePath: path,
      name: "Filedata",
      header: {
        "content-type": "multipart/form-data"
      },
      formData: param,
      success(res) {
        log(res);
        result(res);
      },
      fail: function() {
        result(false);
      }
    });
  }
  function uploadFile2(url, fileName, path, param, result) {
    if (isEmpty(path)) {
      byPost$1(url, param, result);
    } else {
      var header = {};
      header["content-type"] = "multipart/form-data";
      var userInfo = getApp().globalData.data.userInfo;
      if (!isEmpty(userInfo)) {
        header["username"] = userInfo.username;
        header["token"] = userInfo.token;
        header["timestamp"] = Date.parse(/* @__PURE__ */ new Date());
      }
      printLog(url, param);
      return uni.uploadFile({
        url,
        filePath: path,
        name: fileName,
        header,
        formData: param,
        success(res) {
          log(res);
          result(res);
        },
        fail: function() {
          result(false);
          formatAppLog("log", "at utils/app-util.js:451", "上传发生错误");
        }
      });
    }
  }
  function jsDateFormatter(date) {
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
    return currentdate;
  }
  function log(obj) {
    if (getApp().globalData.data.isDebug) {
      formatAppLog("log", "at utils/app-util.js:476", obj);
    }
  }
  function isLogin() {
    var userInfo = getApp().globalData.data.userInfo;
    if (isEmpty(userInfo)) {
      return false;
    } else {
      return true;
    }
  }
  function byPostFormData(url, contentType, data, result) {
    var header = {};
    header["content-type"] = contentType;
    var userInfo = getApp().globalData.data.userInfo;
    if (!isEmpty(userInfo)) {
      header["username"] = userInfo.username;
      header["token"] = userInfo.token;
      header["timestamp"] = Date.parse(/* @__PURE__ */ new Date());
    }
    printLog(url, data);
    return uni.request({
      timeout: 2e4,
      url,
      //仅为示例，并非真实的接口地址
      data,
      header,
      method: "POST",
      success: function(res) {
        result(res);
        log(res.data);
      },
      fail: function(res) {
        log(res);
        result(false);
      }
    });
  }
  const appUtil$1 = {
    byPostFormData,
    showToast: showToast$1,
    showLoading: showLoading$1,
    hideLoading: hideLoading$1,
    showSucessToast,
    showModal,
    getSystemInfo,
    getSystemInfoComplete,
    getWXLocation,
    byGet: byGet$1,
    byPost: byPost$1,
    byPostJson,
    SCOPE_TYPE,
    getAuthState,
    authorize,
    getStorage,
    setStorage,
    clearStorage,
    getNetworkType,
    onNetworkStatusChange,
    openLocation,
    isEmpty,
    isNumber,
    navigateTo,
    SHOW_TYPE,
    chooseImageDefault,
    takePhoto,
    getImageInfo,
    uploadFile,
    uploadFile2,
    jsDateFormatter,
    log,
    isLogin
  };
  function e(tag, msg) {
    if (msg) {
      formatAppLog("log", "at utils/logger.js:6", tag, msg);
    } else {
      formatAppLog("log", "at utils/logger.js:8", tag);
    }
    {
      if (msg) {
        writeLogFile(getDataString(tag + " " + msg));
      } else {
        writeLogFile(getDataString(tag));
      }
    }
  }
  function clear() {
    uni.setStorage({
      key: "log",
      data: ""
    });
  }
  function getDataString(msg) {
    var d = /* @__PURE__ */ new Date();
    var formatData = "MM-dd HH:mm:ss SSS " + msg + "\n";
    var data = formatData.replace("yyyy", d.getFullYear()).replace("MM", fillZero(d.getMonth() + 1)).replace("dd", fillZero(d.getDate())).replace("HH", fillZero(d.getHours())).replace("mm", fillZero(d.getMinutes())).replace("ss", fillZero(d.getSeconds())).replace("SSS", d.getMilliseconds());
    return data;
  }
  function getDateString(timestamp) {
    var d = new Date(timestamp);
    var formatData = "yyyy-MM-dd HH:mm:ss";
    var data = formatData.replace("yyyy", d.getFullYear()).replace("MM", fillZero(d.getMonth() + 1)).replace("dd", fillZero(d.getDate())).replace("HH", fillZero(d.getHours())).replace("mm", fillZero(d.getMinutes())).replace("ss", fillZero(d.getSeconds())).replace("SSS", d.getMilliseconds());
    return data;
  }
  function fillZero(value) {
    if (value.toString().length < 2) {
      return "0" + value;
    }
    return value;
  }
  function writeLogFile(msg) {
    try {
      var value = uni.getStorageSync("log");
      if (value) {
        try {
          var data = value + msg;
          var length = data.length;
          if (length > 5120) {
            uni.setStorageSync("log", data.substring(4096));
          } else {
            uni.setStorageSync("log", data);
          }
        } catch (e2) {
          formatAppLog("log", "at utils/logger.js:71", "CatchClause", e2);
          formatAppLog("log", "at utils/logger.js:72", "CatchClause", e2);
        }
      } else {
        try {
          uni.setStorageSync("log", msg);
        } catch (e2) {
          formatAppLog("log", "at utils/logger.js:78", "CatchClause", e2);
          formatAppLog("log", "at utils/logger.js:79", "CatchClause", e2);
        }
      }
    } catch (e2) {
      formatAppLog("log", "at utils/logger.js:83", "CatchClause", e2);
      formatAppLog("log", "at utils/logger.js:84", "CatchClause", e2);
    }
  }
  const logger = {
    e,
    clear,
    getDateString
  };
  getApp();
  function hexStringToArray(s) {
    var typedArray = new Uint8Array(
      s.match(/[\da-f]{2}/gi).map(function(h) {
        return parseInt(h, 16);
      })
    );
    if (typedArray.length > 1) {
      return Array.apply(new Array(), typedArray);
    } else {
      return typedArray;
    }
  }
  function string2buffer(str) {
    let val = "";
    for (let i = 0; i < str.length; i++) {
      if (val === "") {
        val = str.charCodeAt(i).toString(16);
      } else {
        val += str.charCodeAt(i).toString(16);
      }
    }
    return new Uint8Array(
      val.match(/[\da-f]{2}/gi).map(function(h) {
        return parseInt(h, 16);
      })
    ).buffer;
  }
  function hexStringToArrayBuffer(s) {
    var typedArray = new Uint8Array(
      s.match(/[\da-f]{2}/gi).map(function(h) {
        return parseInt(h, 16);
      })
    );
    return typedArray;
  }
  function stringToBytes(str) {
    var ch;
    var st;
    var re = [];
    for (var i = 0; i < str.length; i++) {
      ch = str.charCodeAt(i);
      st = [];
      do {
        st.push(ch & 255);
        ch = ch >> 8;
      } while (ch);
      re = re.concat(st.reverse());
    }
    return re;
  }
  function shortToSingleBytes(s, asc) {
    var buf = new Array(1);
    buf[0] = s & 255;
    return buf;
  }
  function shortToBytes(s, asc) {
    var buf = new Array(2);
    if (asc) {
      for (var i = buf.length - 1; i >= 0; i--) {
        buf[i] = s & 255;
        s >>= 8;
      }
    } else {
      for (var i = 0; i < buf.length; i++) {
        buf[i] = s & 255;
        s >>= 8;
      }
    }
    return buf;
  }
  function intToBytes(s, asc) {
    var buf = new Array(4);
    if (asc) {
      for (var i = buf.length - 1; i >= 0; i--) {
        buf[i] = s & 255;
        s >>= 8;
      }
    } else {
      for (var i = 0; i < buf.length; i++) {
        buf[i] = s & 255;
        s >>= 8;
      }
    }
    return buf;
  }
  function checkCRC_XW(CRC_TABLE_XW, buff, start, length) {
    var crc = 65535;
    for (var i = 0; i < length; i++) {
      crc = crc >>> 8 ^ CRC_TABLE_XW[(crc ^ buff[start + i]) & 255];
    }
    return crc;
  }
  function crcEncrypt(CRC_TABLE_XW, content, header) {
    var crc = checkCRC_XW(CRC_TABLE_XW, content, 0, content.length);
    var crcByte = shortToBytes(crc, false);
    var len = content.length + crcByte.length;
    var lenByte = shortToBytes(len, true);
    return header.concat(lenByte).concat(content).concat(crcByte);
  }
  function crcEncrypt_KTQUpgrade(content) {
    var crc = 0;
    for (var i = 0; i < 128; i++) {
      crc = crc ^ content[3 + i] << 8;
      for (var j = 0; j < 8; j++) {
        if (crc & 32768) {
          crc = crc << 1 ^ 4129;
        } else {
          crc = crc << 1;
        }
      }
    }
    var crcByte = shortToBytes(crc, true);
    return crcByte;
  }
  function buf2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2)).join("");
  }
  function bytesToInt(b1, b2, b3, b4) {
    return b4 & 255 | (b3 & 255) << 8 | (b2 & 255) << 16 | (b1 & 255) << 24;
  }
  function converTude2Double(bytes, start) {
    var londu = bytes[start] & 255;
    var lonfen1 = bytes[start + 1] & 255;
    var lonfen2 = (bytes[start + 2] & 255) / 100;
    var lonfen3 = (bytes[start + 3] & 255) / 1e4;
    var lond = (lonfen1 + lonfen2 + lonfen3) / 60;
    return londu + lond;
  }
  function bytesToShort(b1, b2) {
    return bytesToInt(0, 0, b1, b2);
  }
  function getShortWith(data, asc) {
    if (data == null) {
      return 0;
    }
    var length = data.length;
    var r = 0;
    if (!asc) {
      for (var i = length - 1; i >= 0; i--) {
        r <<= 8;
        r |= data[i] & 255;
      }
    } else {
      for (var i = 0; i < length; i++) {
        r <<= 8;
        r |= data[i] & 255;
      }
    }
    return r;
  }
  function hexCharCodeToStr(hexCharCodeStr) {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
    var len = rawStr.length;
    if (len % 2 !== 0) {
      formatAppLog("log", "at utils/byte-util.js:231", "Illegal Format ASCII Code!");
      return "";
    }
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16);
      resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join("");
  }
  function buf2string(buffer) {
    var arr = Array.prototype.map.call(new Uint8Array(buffer), (x) => x);
    var str = "";
    for (var i = 0; i < arr.length; i++) {
      str += String.fromCharCode(arr[i]);
    }
    return str;
  }
  const utils = {
    // 十六进制转化Array()
    hexStringToArrayBuffer,
    // 十六进制转化ArrayBuffer
    hexStringToArray,
    // 字符串转ArrayBuffer
    string2buffer,
    // 字符串转字节数组
    stringToBytes,
    // 转化一个字节的数组
    shortToSingleBytes,
    // 转化两个字节的数组
    shortToBytes,
    // 转化4个字节数组
    intToBytes,
    // crc加密
    crcEncrypt,
    // ArrayBuffer转换为Hex
    buf2hex,
    //数组转化int
    bytesToInt,
    //数组转化short
    bytesToShort,
    //转经纬度
    converTude2Double,
    //数组转化short
    getShortWith,
    //十六进制转字符串
    hexCharCodeToStr,
    //arraybuffer 转 string
    buf2string,
    // crc加密(开通器升级)
    crcEncrypt_KTQUpgrade
  };
  var gWriteService = "";
  const WRITE_SERVICE_SHORTHAND = "6E400001";
  var gReadService = "";
  const READ_SERVICE_SHORTHAND = "6E400001";
  var gWriteCharacteristic = "";
  const WIRTE_CHARACTERISTIC_SHORTHAND = "6E400002";
  var gReadCharacteristic = "";
  const READ_CHARACTERISTIC_SHORTHAND = "6E400003";
  var gReadRandomCharacteristic = "";
  const READRANDOM_CHARACTERISTIC_SHORTHAND = "6E400004";
  var ReadServiceFixed = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
  var WriteServiceFixed = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
  var ReadCharacteristicFixed = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
  var WriteCharacteristicFixed = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
  var ReadRandomCharacteristicFixed = "6E400004-B5A3-F393-E0A9-E50E24DCCA9E";
  var gIdc = "";
  var gBluetoothState;
  var gOnReceiveValue;
  var deviceId = "";
  var available = false;
  var discovering = false;
  var isBLEAdapterOpen = false;
  var connected = false;
  var DEFAULT_BLUETOOTH_STATE = {
    //各种错误,可用来关闭dialog
    BLUETOOTH_ERROR: -2,
    //连接失败
    BLUETOOTH_CONNECT_FAILED: -1,
    //连接成功
    BLUETOOTH_CONNECT_SUCESS: 0,
    //蓝牙适配器不可用
    BLUETOOTH_ADAPTER_UNAVAILABLE: 1,
    //打开蓝牙扫描失败
    BLUETOOTH_DEVICES_DISCOVERY_FAILD: 2,
    //频繁调用
    BLUETOOTH_SEND_FREQUENTLY: 3,
    //开始调用senddata发送数据,可以用来显示dialog
    BLUETOOTH_PRE_EXECUTE: 4,
    //没有扫到设备
    BLUETOOTH_NOT_FOUND: 5,
    //不支持BLE
    BLUETOOTH_UNSUPPORTED: 6,
    //发送失败
    BLUETOOTH_SEND_FAILED: 7,
    //无响应
    BLUETOOTH_NO_RESPONSE: 8
  };
  function getBLEDataTime() {
    const date = /* @__PURE__ */ new Date();
    const MM = `${String(date.getMonth() + 1).padStart(2, "0")}`;
    const dd = `${String(date.getDate()).padStart(2, "0")}`;
    const hh = `${String(date.getHours()).padStart(2, "0")}`;
    const mm = `${String(date.getMinutes()).padStart(2, "0")}`;
    const ss = `${String(date.getSeconds()).padStart(2, "0")}`;
    const ii = `${String(date.getMilliseconds()).padStart(3, "0")}`;
    const formatted = MM + "/" + dd + " " + hh + ":" + mm + ":" + ss + "." + ii;
    return formatted;
  }
  function getBLEConnectionState() {
    return connected;
  }
  function getBLEConnectionID() {
    return gIdc;
  }
  function releaseData() {
    logger.e("释放deviceId");
    deviceId = "";
  }
  function releaseBle() {
    gIdc = "";
    if (discovering) {
      logger.e("停止扫描");
      stopScanBle();
    }
    if (connected) {
      logger.e("断开连接");
      disConnect();
    }
    if (isBLEAdapterOpen) {
      logger.e("关闭适配器");
      closeBluetoothAdapter();
    }
    releaseData();
    logger.e("关闭连接事件监听");
    uni.offBLEConnectionStateChange();
    logger.e("关闭特征变化监听");
    uni.offBLECharacteristicValueChange();
  }
  function isSupportedBLE(isSupported) {
    const deviceInfo = uni.getDeviceInfo();
    var brand = deviceInfo.brand;
    var platform = deviceInfo.platform;
    var system = deviceInfo.system;
    logger.e("手机型号:" + brand + ",系统信息:" + platform + ",系统版本:" + system);
    isSupported(true);
  }
  function isBLEAdapterAvailable(onResult) {
    if (isBLEAdapterOpen) {
      if (!available) {
        getBluetoothAdapterState(function(res) {
          setBLEAdapterState(res.available, res.discovering);
          onResult(res.available);
        });
      } else {
        onResult(available);
      }
    } else {
      openBluetoothAdapter(function(openSuccess) {
        if (openSuccess) {
          getBluetoothAdapterState(function(res) {
            setBLEAdapterState(res.available, res.discovering);
            onResult(res.available);
          });
        } else {
          onResult(openSuccess);
        }
      });
    }
  }
  function openBluetoothAdapter(cOpenBluetoothAdapter) {
    uni.openBluetoothAdapter({
      success: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:194", res);
        isBLEAdapterOpen = true;
        cOpenBluetoothAdapter(true);
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:199", res);
        isBLEAdapterOpen = false;
        setBLEAdapterState(false, false);
        cOpenBluetoothAdapter(false);
      }
    });
  }
  function setBLEAdapterState(ava, discovery) {
    available = ava;
    discovering = discovery;
  }
  function getBluetoothAdapterState(onBleAdapterState) {
    uni.getBluetoothAdapterState({
      success: function(res) {
        onBleAdapterState(res);
      },
      fail: function(res) {
        onBleAdapterState(res);
      }
    });
  }
  function onBluetoothAdapterStateChange() {
    uni.onBluetoothAdapterStateChange(function(res) {
      logger.e(`adapterState changed, now is`, res);
      setBLEAdapterState(res.available, res.discovering);
    });
  }
  function closeBluetoothAdapter() {
    uni.closeBluetoothAdapter({
      success: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:245", res);
        isBLEAdapterOpen = false;
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:249", res);
      }
    });
  }
  function startConnect() {
    uni.createBLEConnection({
      deviceId,
      success: function(res) {
        gWriteService = "";
        gWriteCharacteristic = "";
        gReadService = "";
        gReadCharacteristic = "";
        getBLEDeviceServices();
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:276", res);
        gBluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_CONNECT_FAILED);
      }
    });
  }
  function startConnectConnected() {
    getBLEDeviceServicesConnected();
  }
  function onBLEConnectionStateChange() {
    uni.onBLEConnectionStateChange(function(res) {
      logger.e(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
      connected = res.connected;
      if (gBluetoothState != void 0) {
        if (connected) {
          gBluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_CONNECT_SUCESS);
        } else {
          gBluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ERROR);
        }
      }
      if (res.deviceId == deviceId) {
        if (res.connected == true) {
          if (discovering) {
            stopScanBle();
          }
        }
      }
    });
  }
  function disConnect() {
    uni.closeBLEConnection({
      deviceId,
      success: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:319", res);
        connected = false;
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:323", res);
      }
    });
  }
  function startBluetoothDevicesDiscovery() {
    uni.startBluetoothDevicesDiscovery({
      success: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:339", res);
        discovering = res.isDiscovering;
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:343", res);
        discovering = res.isDiscovering;
        gBluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ERROR);
        gBluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_DEVICES_DISCOVERY_FAILD);
      }
    });
  }
  function onBluetoothDeviceFound() {
    uni.onBluetoothDeviceFound(function(devices) {
      if (devices.devices[0].name != "") {
        logger.e("device found:" + devices.devices[0].name);
      }
      if (gIdc == devices.devices[0].localName) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:360", devices);
        deviceId = devices.devices[0].deviceId;
        saveBLEDeviceInfo(gIdc);
        onBLEConnectionStateChange();
        onBluetoothAdapterStateChange();
        onBLECharacteristicValueChange();
        startConnect();
      }
    });
  }
  function onBluetoothDeviceFoundConnected() {
    onBluetoothAdapterStateChange();
    onBLECharacteristicValueChangeConnected();
    startConnectConnected();
  }
  function stopScanBle() {
    uni.stopBluetoothDevicesDiscovery({
      success: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:383", res);
        discovering = false;
        logger.e("stopScanBle-true discovering:" + discovering);
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:388", res);
        discovering = false;
        logger.e("stopScanBle-false discovering:" + discovering);
      }
    });
  }
  function getBLEDeviceServices() {
    uni.getBLEDeviceServices({
      deviceId,
      success: function(res) {
        for (var i = 0; i < res.services.length; i++) {
          formatAppLog("log", "at utils/BleKeyFun-utils-single.js:407", res);
          if (res.services[i].uuid.indexOf(WRITE_SERVICE_SHORTHAND) != -1) {
            gWriteService = res.services[i].uuid;
          }
          if (res.services[i].uuid.indexOf(READ_SERVICE_SHORTHAND) != -1) {
            gReadService = res.services[i].uuid;
          }
        }
        logger.e("device设备的读服务id:", gWriteService);
        logger.e("device设备的写服务id:", gReadService);
        if (gWriteService != "" && gReadService != "" && (gWriteCharacteristic == "" || gReadCharacteristic == "")) {
          getBLEDeviceWriteCharacteristics();
        }
      }
    });
  }
  function getBLEDeviceServicesConnected() {
    uni.getBLEDeviceServices({
      deviceId,
      success: function(res) {
        logger.e("device设备的读服务id:", WriteServiceFixed);
        logger.e("device设备的写服务id:", ReadServiceFixed);
        getBLEDeviceWriteCharacteristicsConnected();
      }
    });
  }
  function getBLEDeviceReadCharacteristics() {
    uni.getBLEDeviceCharacteristics({
      deviceId,
      serviceId: gReadService,
      success: function(res) {
        for (var i = 0; i < res.characteristics.length; i++) {
          if (res.characteristics[i].uuid.indexOf(READ_CHARACTERISTIC_SHORTHAND) != -1) {
            gReadCharacteristic = res.characteristics[i].uuid;
          }
          if (res.characteristics[i].uuid.indexOf(READRANDOM_CHARACTERISTIC_SHORTHAND) != -1) {
            gReadRandomCharacteristic = res.characteristics[i].uuid;
          }
        }
        logger.e("device设备的读特征值id:" + gReadCharacteristic);
        logger.e("device设备的读Random特征值id:" + gReadRandomCharacteristic);
        if (gReadCharacteristic != "") {
          notifyBLECharacteristicValueChange();
        }
        if (gReadRandomCharacteristic != "") {
          setTimeout(() => {
            readBLECharacteristicValue();
          }, 100);
        }
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:464", res);
      }
    });
  }
  function getBLEDeviceReadCharacteristicsConnected() {
    uni.getBLEDeviceCharacteristics({
      deviceId,
      serviceId: ReadServiceFixed,
      success: function(res) {
        logger.e("device设备的读特征值id:" + ReadCharacteristicFixed);
        logger.e("device设备的读Random特征值id:" + ReadRandomCharacteristicFixed);
        notifyBLECharacteristicValueChangeConnected();
        readBLECharacteristicValueConnected();
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:480", res);
      }
    });
  }
  function notifyBLECharacteristicValueChange() {
    uni.notifyBLECharacteristicValueChange({
      deviceId,
      serviceId: gReadService,
      characteristicId: gReadCharacteristic,
      state: true,
      success: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:495", res);
        appUtil$1.getSystemInfoComplete(
          function(res2) {
            var system = res2.system;
            var blankIndex = system.indexOf(" ");
            var pointIndex = system.indexOf(".");
            if (blankIndex != -1 && pointIndex != -1) {
              system.substring(0, blankIndex);
              system.substring(blankIndex + 1, pointIndex + 2);
            }
          },
          function() {
            uni.setBLEMTU({
              deviceId,
              mtu: 240,
              success: function(res2) {
                formatAppLog("log", "at utils/BleKeyFun-utils-single.js:511", "MTU modify success");
              },
              fail: function(res2) {
                formatAppLog("log", "at utils/BleKeyFun-utils-single.js:514", "MTU modify fail");
              }
            });
          }
        );
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:522", res);
      }
    });
  }
  function notifyBLECharacteristicValueChangeConnected() {
    uni.notifyBLECharacteristicValueChange({
      deviceId,
      serviceId: ReadServiceFixed,
      characteristicId: ReadCharacteristicFixed,
      state: true,
      success: function(res) {
        appUtil$1.getSystemInfoComplete(
          function(res2) {
            var system = res2.system;
            var blankIndex = system.indexOf(" ");
            var pointIndex = system.indexOf(".");
            if (blankIndex != -1 && pointIndex != -1) {
              system.substring(0, blankIndex);
              system.substring(blankIndex + 1, pointIndex + 2);
            }
          },
          function() {
            uni.setBLEMTU({
              deviceId,
              mtu: 240,
              success: function(res2) {
                formatAppLog("log", "at utils/BleKeyFun-utils-single.js:549", "MTU modify success");
              },
              fail: function(res2) {
                formatAppLog("log", "at utils/BleKeyFun-utils-single.js:552", "MTU modify fail");
              }
            });
          }
        );
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:559", res);
      }
    });
  }
  function readBLECharacteristicValue() {
    uni.readBLECharacteristicValue({
      deviceId,
      serviceId: gReadService,
      characteristicId: gReadRandomCharacteristic,
      state: true,
      success: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:571", res);
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:574", res);
      }
    });
  }
  function readBLECharacteristicValueConnected() {
    uni.readBLECharacteristicValue({
      deviceId,
      serviceId: ReadServiceFixed,
      characteristicId: ReadRandomCharacteristicFixed,
      state: true,
      success: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:586", res);
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:589", res);
      }
    });
  }
  function getBLEDeviceWriteCharacteristics() {
    uni.getBLEDeviceCharacteristics({
      deviceId,
      serviceId: gWriteService,
      success: function(res) {
        for (var j = 0; j < res.characteristics.length; j++) {
          if (res.characteristics[j].uuid.indexOf(WIRTE_CHARACTERISTIC_SHORTHAND) != -1) {
            gWriteCharacteristic = res.characteristics[j].uuid;
          }
        }
        logger.e("device设备的写特征值id:" + gWriteCharacteristic);
        if (gReadCharacteristic == "") {
          getBLEDeviceReadCharacteristics();
        }
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:614", res);
      }
    });
  }
  function getBLEDeviceWriteCharacteristicsConnected() {
    uni.getBLEDeviceCharacteristics({
      deviceId,
      serviceId: WriteServiceFixed,
      success: function(res) {
        logger.e("device设备的写特征值id:" + WriteCharacteristicFixed);
        getBLEDeviceReadCharacteristicsConnected();
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:628", res);
      }
    });
  }
  function onBLECharacteristicValueChange() {
    uni.onBLECharacteristicValueChange(function(characteristic) {
      var resultArrayBufferData = characteristic.value;
      var receiverHexData = utils.buf2hex(resultArrayBufferData);
      var arrayData = utils.hexStringToArray(receiverHexData);
      const formatted = getBLEDataTime();
      if (characteristic.characteristicId.indexOf(READRANDOM_CHARACTERISTIC_SHORTHAND) != -1) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:644", "随机指令接收:" + formatted + "  数据:" + receiverHexData);
        logger.e("随机指令数据:" + receiverHexData, false, false, true);
        gOnReceiveValue(0, arrayData, utils.hexCharCodeToStr(receiverHexData), receiverHexData);
      } else {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:648", "通知指令接收:" + formatted + "  数据:" + receiverHexData);
        logger.e("通知指令接收:" + receiverHexData, false, false, true);
        gOnReceiveValue(1, arrayData, utils.hexCharCodeToStr(receiverHexData), receiverHexData);
      }
    });
  }
  function onBLECharacteristicValueChangeConnected() {
    uni.onBLECharacteristicValueChange(function(characteristic) {
      var resultArrayBufferData = characteristic.value;
      var receiverHexData = utils.buf2hex(resultArrayBufferData);
      var arrayData = utils.hexStringToArray(receiverHexData);
      const formatted = getBLEDataTime();
      if (characteristic.characteristicId == ReadRandomCharacteristicFixed) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:663", "随机指令接收:" + formatted + "  数据:" + receiverHexData);
        logger.e("随机指令数据:" + receiverHexData, false, false, true);
        gOnReceiveValue(0, arrayData, utils.hexCharCodeToStr(receiverHexData), receiverHexData);
      } else {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:667", "通知指令接收:" + formatted + "  数据:" + receiverHexData);
        logger.e("通知指令接收:" + receiverHexData, false, false, true);
        gOnReceiveValue(1, arrayData, utils.hexCharCodeToStr(receiverHexData), receiverHexData);
      }
    });
  }
  function writeBLECharacteristicValue(buffer, writeBLECharacteristicValue2) {
    uni.writeBLECharacteristicValue({
      deviceId,
      serviceId: WriteServiceFixed,
      characteristicId: WriteCharacteristicFixed,
      value: buffer,
      success: function(res) {
        writeBLECharacteristicValue2(true);
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:687", res);
        writeBLECharacteristicValue2(false);
      }
    });
  }
  function initSendData(idc, pwd, sendType, bluetoothState, onReceiveValue) {
    if (gBluetoothState != bluetoothState) {
      gBluetoothState = bluetoothState;
    }
    if (gOnReceiveValue != onReceiveValue) {
      gOnReceiveValue = onReceiveValue;
    }
    if (gIdc != idc) {
      gIdc = idc;
    }
    onBluetoothDeviceFound();
  }
  function initSendDataConnected(idc, pwd, sendType, bluetoothState, onReceiveValue) {
    if (gBluetoothState != bluetoothState) {
      gBluetoothState = bluetoothState;
    }
    if (gOnReceiveValue != onReceiveValue) {
      gOnReceiveValue = onReceiveValue;
    }
    if (gIdc != idc) {
      gIdc = idc;
    }
    onBluetoothDeviceFoundConnected();
  }
  function connectBLE(idc, bluetoothState, onReceiveValue) {
    connectMyBLE(idc, bluetoothState, onReceiveValue);
  }
  function connectBLEConnected(idc, bluetoothState, onReceiveValue) {
    connectMyBLEConnected(idc, bluetoothState, onReceiveValue);
  }
  function connectMyBLE(idc, bluetoothState, onReceiveValue, isIntercept) {
    if (connected)
      ;
    else {
      isSupportedBLE(function(isSupported) {
        if (isSupported) {
          isBLEAdapterAvailable(function(ava) {
            if (ava) {
              initSendData(idc, "", "", bluetoothState, onReceiveValue);
              startBluetoothDevicesDiscovery();
            } else {
              gBluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ERROR);
              gBluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ADAPTER_UNAVAILABLE);
            }
          });
        } else {
          bluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ERROR);
          bluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_UNSUPPORTED);
        }
      });
    }
  }
  function connectMyBLEConnected(idc, bluetoothState, onReceiveValue, isIntercept) {
    isSupportedBLE(function(isSupported) {
      if (isSupported) {
        isBLEAdapterAvailable(function(ava) {
          if (ava) {
            initSendDataConnected(idc, "", "", bluetoothState, onReceiveValue);
          } else {
            bluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ERROR);
            bluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ADAPTER_UNAVAILABLE);
          }
        });
      } else {
        bluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ERROR);
        bluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_UNSUPPORTED);
      }
    });
  }
  function dispatcherSend2(sendData, noRepeat) {
    var data = sendData;
    delaySend2(data);
  }
  function delaySend2(data, noRepeat) {
    var d = data;
    setTimeout(function() {
      send2(d);
    }, 10);
  }
  function send2(hex, noRepeat) {
    var buffer = hex;
    writeBLECharacteristicValue(buffer, function(isSuccess) {
      const formatted = getBLEDataTime();
      var sendArrayBufferData = buffer;
      var sendHexData = utils.buf2hex(sendArrayBufferData);
      if (isSuccess) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:834", "指令发送成功:" + formatted + "  数据:" + sendHexData);
        logger.e("指令发送成功:" + sendHexData, false, false, true);
      } else {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:837", "!!!指令发送失败:" + formatted + "  数据:" + sendHexData);
        logger.e("!!!指令发送失败:" + sendHexData, false, false, true);
      }
    });
  }
  function makePair() {
    uni.makeBluetoothPair({
      deviceId,
      timeout: 2e4,
      success: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:852", res);
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:855", res);
      }
    });
  }
  function saveBLEDeviceInfo(deviceIDC) {
    formatAppLog("log", "at utils/BleKeyFun-utils-single.js:861", "saveBLEDeviceInfo");
    var param = {};
    param["deviceId"] = deviceId;
    param["readServiceUUID"] = gReadService;
    param["writeServiceUUID"] = gWriteService;
    param["readCharacUUID"] = gReadCharacteristic;
    param["writeCharacUUID"] = gWriteCharacteristic;
    param["randomServiceUUID"] = gReadService;
    param["randomCharacUUID"] = gReadRandomCharacteristic;
    var jparam = JSON.stringify(param);
    uni.setStorage({
      key: deviceIDC,
      data: jparam,
      success: function() {
      }
    });
  }
  function getBLEDeviceInfo(deviceIDC, result) {
    formatAppLog("log", "at utils/BleKeyFun-utils-single.js:879", "getBLEDeviceInfo");
    uni.getStorage({
      key: deviceIDC,
      success: function(res) {
        var param = JSON.parse(res.data);
        deviceId = param.deviceId;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:885", deviceId);
        gReadService = param.readServiceUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:887", gReadService);
        gWriteService = param.writeServiceUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:889", gWriteService);
        gReadCharacteristic = param.readCharacUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:891", gReadCharacteristic);
        gWriteCharacteristic = param.writeCharacUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:893", gWriteCharacteristic);
        gReadRandomCharacteristic = param.randomCharacUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:895", gReadRandomCharacteristic);
        result(true, param);
      },
      fail: function(res) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:900", res);
        result(false);
      }
    });
  }
  function clrBLEDeviceInfo(deviceIDC) {
    formatAppLog("log", "at utils/BleKeyFun-utils-single.js:907", "clrBLEDeviceInfo");
    uni.removeStorage({
      key: deviceIDC,
      success: function() {
      }
    });
  }
  const bleKeyManager = {
    connectBLE,
    releaseBle,
    dispatcherSend2,
    DEFAULT_BLUETOOTH_STATE,
    getBLEConnectionState,
    getBLEConnectionID,
    makePair,
    saveBLEDeviceInfo,
    getBLEDeviceInfo,
    clrBLEDeviceInfo,
    connectBLEConnected
  };
  const _imports_1$3 = "/static/privateCar/right_1.png";
  const VehicleCommand = {
    UNLOCK: 3,
    //开锁
    LOCK: 4,
    //关锁
    OPEN_TRUNK: 5,
    //尾箱
    FIND_CAR: 6,
    //寻车
    CONTROL_WINDOW: 7
    //操作车窗
  };
  const WindowAction = {
    RAISE: 3,
    //升窗
    LOWER: 4
    //降窗
  };
  const _sfc_main$c = {
    components: {
      CustomNavBar
    },
    data() {
      const baseUrl = "https://k3a.wiselink.net.cn/img/app/blue";
      return {
        screenInfo: {},
        // 屏幕信息对象
        // 设备唯一编号
        deviceIDC: "932505100228",
        // 通信密钥
        orgKey: [51, 71, 1, 130, 52, 51],
        // 原始密钥（用于跳转）
        orgKeyOld: "",
        // 蓝牙连接状态：未连接 / 已连接
        connectionState: "未连接",
        // 当前连接ID
        connectionID: "",
        // 是否点击蓝牙状态区域
        blue_tooth_state: false,
        // 解析的设备数据
        parsedData: {
          electric: "",
          // 电量
          induction: "",
          // 感应模式
          lock: ""
          // 锁状态
        },
        // 电池图标等级（100/75/50）
        voltage_image: "100",
        // 是否点击电池区域
        voltage_state: false,
        // 操作按钮列表
        controlItems: [
          {
            id: 1,
            name: "开锁",
            enabled: true,
            icon: `${baseUrl}/unlock_off.png`,
            ative: `${baseUrl}/unlock_on.png`,
            evt: "handleUnlock"
          },
          {
            id: 2,
            name: "关锁",
            enabled: true,
            icon: `${baseUrl}/lock_off.png`,
            ative: `${baseUrl}/lock_on.png`,
            evt: "handleLock"
          },
          {
            id: 3,
            name: "尾箱",
            enabled: true,
            icon: `${baseUrl}/box_off.png`,
            evt: "handleOpenTrunk"
          },
          {
            id: 4,
            name: "寻车",
            enabled: true,
            icon: `${baseUrl}/search_off.png`,
            evt: "handleFindCar"
          },
          {
            id: 5,
            name: "升窗",
            enabled: true,
            icon: `${baseUrl}/search_off.png`,
            evt: "handleRaiseTheWindow"
          },
          {
            id: 6,
            name: "降窗",
            enabled: true,
            icon: `${baseUrl}/search_off.png`,
            evt: "handleLowerTheWindow"
          }
        ],
        // 指令日志记录
        logs: [],
        // 手机系统信息
        deviceInfo: {},
        // 页面传参
        options: {},
        // 是否为分享用户
        netWork: false,
        // 轮询定时器ID
        pageInterval: 0,
        // 当前车辆信息
        bluetoothData: {
          platenumber: "",
          // 车牌号
          startDate: "",
          // 授权开始时间
          endDate: ""
          // 授权结束时间
        }
      };
    },
    onLoad(options) {
      this.options = options;
      this.initToConfigureCache();
      this.handleSystemInfo();
    },
    onShow: function() {
      this.initialScreenInfo();
      this.handleStart();
      this.startConnectionStatusPolling();
    },
    onHide: function() {
      this.cleanupResources();
    },
    onUnload: function() {
      this.cleanupResources();
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 统一清理页面资源
      cleanupResources() {
        if (this.pageInterval) {
          clearInterval(this.pageInterval);
          this.pageInterval = null;
        }
        this.connectionState = "未连接";
        this.connectionID = "";
        this.parsedData = {};
        uni.setKeepScreenOn({
          keepScreenOn: false
        });
        setTimeout(() => {
          bleKeyManager.releaseBle();
        }, 500);
      },
      // 手动操作区执行事件
      handleEvent(eventType) {
        const actions = {
          handleUnlock: () => {
            this.sendVehicleCommandFun(VehicleCommand.UNLOCK, "");
          },
          handleLock: () => {
            this.sendVehicleCommandFun(VehicleCommand.LOCK, "");
          },
          handleOpenTrunk: () => {
            this.sendVehicleCommandFun(VehicleCommand.OPEN_TRUNK, "");
          },
          handleFindCar: () => {
            this.sendVehicleCommandFun(VehicleCommand.FIND_CAR, "");
          },
          handleRaiseTheWindow: () => {
            this.sendVehicleCommandFun(VehicleCommand.CONTROL_WINDOW, WindowAction.RAISE);
          },
          handleLowerTheWindow: () => {
            this.sendVehicleCommandFun(VehicleCommand.CONTROL_WINDOW, WindowAction.LOWER);
          }
        };
        const action = actions[eventType];
        if (typeof action === "function") {
          action();
        }
      },
      // 点击操作手动区事件
      parseEventDynamicCode($, evt) {
        this.handleEvent(evt);
      },
      // 切换感应模式
      toggleSensorMode() {
        var _a;
        const induction = this.parsedData.induction;
        const isManualInduction = !induction || induction === "手动模式";
        if ((_a = this == null ? void 0 : this.bluetoothData) == null ? void 0 : _a.platenumber) {
          if (!isManualInduction) {
            uni.showModal({
              title: "提示",
              content: "确认关闭感应模式?",
              complete: (res) => {
                if (res.confirm) {
                  this.btnCmdSend(58, [0]);
                }
              }
            });
            return;
          }
          if (this.parsedData.induction != "感应模式") {
            uni.showModal({
              title: "提示",
              content: "请到开通设定-功能设置处完善设置",
              complete: (res) => {
                if (res.confirm) {
                  uni.redirectTo({
                    url: "/pages/listOfPrivateCars/list/index?tabs=3"
                  });
                }
              }
            });
          }
        } else {
          uni.showModal({
            title: "提示",
            content: "请先开通设定再到开通设定-功能设置处完善设置",
            confirmText: "立即开通",
            success: (res) => {
              if (res.confirm) {
                uni.redirectTo({
                  url: "/pages/listOfPrivateCars/list/index"
                });
              }
            }
          });
        }
      },
      // 获取设备信息
      handleSystemInfo() {
        uni.getSystemInfo({
          success: (res) => {
            const {
              brand,
              model,
              system,
              platform,
              screenWidth,
              screenHeight,
              pixelRatio,
              statusBarHeight
            } = res;
            this.deviceInfo = {
              brand,
              model,
              system,
              platform,
              screenWidth,
              screenHeight,
              pixelRatio,
              statusBarHeight
            };
            formatAppLog("log", "at pages/privateCar/VehicleControl/index.vue:402", "设备信息:", this.deviceInfo);
          },
          fail: console.error
        });
      },
      // 启动连接状态轮询
      startConnectionStatusPolling() {
        if (this.pageInterval) {
          return;
        }
        this.pageInterval = setInterval(() => {
          const isConnected = bleKeyManager.getBLEConnectionState();
          const connectionID = isConnected ? bleKeyManager.getBLEConnectionID() : "";
          this.connectionState = isConnected ? "已连接" : "未连接";
          this.connectionID = connectionID;
        }, 200);
      },
      // 蓝牙连接处理
      handleStart() {
        const that = this;
        const options = this.options;
        const handleData = (data) => {
          if (!data) {
            return;
          }
          that.deviceIDC = `${data == null ? void 0 : data.sn}`;
          that.orgKey = that.handleTransformation(data == null ? void 0 : data.bluetoothKey);
          that.orgKeyOld = data == null ? void 0 : data.bluetoothKey;
          that.bluetoothData = data;
          setTimeout(() => {
            that.btnStartConnect();
          }, 100);
        };
        if (options == null ? void 0 : options.scene) {
          u_getCarBluetoothKeyByCode({
            code: options == null ? void 0 : options.scene
          }).then((response) => {
            if (!(response == null ? void 0 : response.content)) {
              return;
            }
            this.netWork = true;
            handleData(response == null ? void 0 : response.content);
          });
        } else {
          uni.getStorage({
            key: "bluetoothData",
            success(res) {
              handleData(res.data);
            },
            fail(err) {
              const param = {
                page: 1
              };
              u_paivatecarList(param).then((response) => {
                var _a, _b;
                uni.setStorageSync("bluetoothData", (_a = response == null ? void 0 : response.content) == null ? void 0 : _a[0]);
                handleData((_b = response == null ? void 0 : response.content) == null ? void 0 : _b[0]);
              });
            }
          });
        }
      },
      // 认证加密算法 passwordSource 原始密码(6字节数组) random 随机数(6字节数组) returns 加密后的密码(8字节数
      auth_encrypt: function(passwordSource, random) {
        var passwordEncrypt = [0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < 6; i++) {
          passwordEncrypt[i] = passwordSource[i] ^ random[i] ^ 255;
        }
        return passwordEncrypt;
      },
      // 去绑定车辆
      handleBindVechi() {
        uni.redirectTo({
          url: "/pages/listOfPrivateCars/list/index"
        });
      },
      // 跳转到详细设置
      handleSelectJump() {
        var _a;
        if ((_a = this == null ? void 0 : this.bluetoothData) == null ? void 0 : _a.platenumber) {
          uni.redirectTo({
            url: `/pages/privateCar/SettingsDetail/index?sn=${this.deviceIDC}&bluetoothKey=${this.orgKeyOld}`
          });
        } else {
          uni.showModal({
            title: "提示",
            content: "请先绑定车辆",
            confirmText: "立即绑定",
            success: (res) => {
              if (res.confirm) {
                uni.redirectTo({
                  url: "/pages/listOfPrivateCars/list/index"
                });
              }
            }
          });
        }
      },
      // 点击蓝牙出现tips
      handleBlueToothState() {
        const _this = this;
        _this.blue_tooth_state = true;
        setTimeout(() => {
          _this.blue_tooth_state = false;
        }, 3e3);
      },
      // 点击电池出现tips
      handleVoltage() {
        const _this = this;
        _this.voltage_state = true;
        setTimeout(() => {
          _this.voltage_state = false;
        }, 3e3);
      },
      // 跳转安装手册
      handleJumpSc() {
        uni.redirectTo({
          url: "/pages/privateCar/pdf/index?flag=1"
        });
      },
      // 蓝牙状态执行对应操作
      bluetoothStateMonitor: function(state) {
        if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_PRE_EXECUTE == state)
          ;
        else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ERROR == state) {
          appUtil.hideLoading();
        } else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ADAPTER_UNAVAILABLE == state) {
          appUtil.showModal("请打开蓝牙", false, function(confirm) {
          });
        } else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_NOT_FOUND == state) {
          appUtil.showModal("没有发现设备", false, function(confirm) {
          });
        } else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_CONNECT_FAILED == state)
          ;
        else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_UNSUPPORTED == state) {
          appUtil.showModal("您的手机不支持低功耗蓝牙", false, function(confirm) {
          });
        } else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_SEND_FAILED == state) {
          appUtil.showModal("数据发送失败", false, function(confirm) {
          });
        } else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_NO_RESPONSE == state) {
          appUtil.showModal("设备超时无响应", false, function(confirm) {
          });
        } else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_CONNECT_SUCESS == state) {
          appUtil.hideLoading();
        }
      },
      // 解析数据+验证合法性
      bluetoothDataMonitor: function(type, arrayData, hexData, hexTextData) {
        const dataStr = hexTextData || "";
        if (type === 0) {
          this.btnCmdSend(16, arrayData);
          setTimeout(() => {
            this.PackAndSend(16, 8, [0, 0, 0, 0, 0, 0, 0, 0]);
          }, 1e3);
        }
        this.parseData(this.trimHexData(dataStr));
        this.handleLoggerapi(dataStr);
      },
      // 发送控制命令 type 命令类型 data 命令数据
      btnCmdSend: function(type, data) {
        const that = this;
        const defaultData = [0, 0, 0, 0, 0, 0, 0, 0];
        switch (type) {
          case 16:
            const orgKey = this.orgKey;
            that.PackAndSend(type, 8, that.auth_encrypt(orgKey, data));
            break;
          case 3:
          case 4:
          case 5:
          case 6:
            that.PackAndSend(type, 8, defaultData);
            break;
          case 34:
            that.PackAndSend(type, 8, data);
            break;
          case 7:
            that.PackAndSend07(type, 8, data);
            break;
          case 58:
            const flameoutData = data;
            this.PackAndSend3a(type, 12, flameoutData);
            break;
        }
      },
      /**
      			 * 数据打包与发送
      			 * @param {number} type 数据类型
      			 * @param {number} len 数据长度
      			 * @param {Array} data 数据内容
      			 */
      PackAndSend: function(type, len, data) {
        var packet = [36, type, len, ...data, 36];
        bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet));
      },
      // 打包并发送数据（支持动态数据体长度）
      PackAndSend3a(type, dataLength, data, sign) {
        const header = [36];
        const end = [36];
        const paddedData = [...data].concat(new Array(dataLength - data.length).fill(0)).slice(0, dataLength);
        const packet = dataLength == 8 ? [...header, type, dataLength, ...data, ...end] : [
          ...header,
          type,
          ...paddedData,
          ...end
        ];
        bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet));
      },
      // 升窗降窗指令封装
      PackAndSend07: function(type, len, data) {
        const defaultData = [0, 0, 0, 0, 0, 0, 0];
        var packet = [36, type, len, data, ...defaultData, 36];
        bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet));
      },
      /**
       * 数组转ArrayBuffer
       * @param {Array} array 原始数组
       * @param {number} elementSize 元素大小(默认1字节)
       * @returns {ArrayBuffer} 转换后的缓冲区
       */
      arrayToArrayBuffer: function(array, elementSize = 1) {
        const typedArray = new Uint8Array(array.length * elementSize);
        array.forEach((value, index) => typedArray[index * elementSize] = value);
        return typedArray.buffer;
      },
      handleTransformation(number) {
        if (!number) {
          return;
        }
        const numStr = number.toString();
        const bytes = [];
        for (let i = 0; i < numStr.length; i += 2) {
          const byteStr = numStr.substring(i, i + 2);
          bytes.push(parseInt(byteStr, 16));
        }
        return bytes;
      },
      // 转换电池剩余电量
      initVoltage(dy) {
        const thresholds = [4, 3.9, 3.8, 3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.1];
        const scores = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
        const index = thresholds.findIndex((threshold) => dy >= threshold);
        return index !== -1 ? scores[index] : 0;
      },
      // 剩余电量显示图片
      getBatteryImage(voltage) {
        const levels = [
          {
            min: 75,
            value: "100"
          },
          {
            min: 50,
            value: "75"
          },
          {
            min: 25,
            value: "50"
          },
          {
            min: 10,
            value: "25"
          }
        ];
        const level = levels.find((item) => voltage > item.min) || {
          value: "0"
        };
        this.voltage_image = level.value;
      },
      // 剩余电量处转换
      getBatteryLevel(voltage) {
        this.getBatteryImage(voltage);
        const thresholds = [90, 80, 70, 60, 50, 40, 30, 20, 10, 5];
        const values = ["100", "90", "80", "70", "60", "50", "40", "30", "20", "10"];
        const index = thresholds.findIndex((threshold) => voltage > threshold);
        return index !== -1 ? values[index] : "1";
      },
      /**
       * 解析16进制车辆状态数据
       * @param {string} hexString 30字符的16进制字符串
       * @returns {Array|null} 解析结果数组，格式为[{key: string, value: any}]
       */
      parseHexDataObject: function(hexString) {
        if (hexString.length !== 30) {
          return null;
        }
        const bytes = [];
        for (let i = 0; i < 30; i += 2) {
          bytes.push(parseInt(hexString.substr(i, 2), 16));
        }
        const resultObject = {};
        resultObject.lock = bytes[2] === 1 ? true : false;
        resultObject.voltage = (bytes[12] / 10).toFixed(1);
        resultObject.electric = this.getBatteryLevel(this.initVoltage((bytes[12] / 10).toFixed(
          1
        )));
        resultObject.supply = bytes[3];
        resultObject.induction = bytes[0] === 1 ? "感应模式" : "手动模式";
        return resultObject;
      },
      // 上传报文
      handleLoggerapi(evt) {
        var _a, _b;
        const MAX_LOGS_BEFORE_UPLOAD = 10;
        const {
          deviceInfo,
          deviceIDC,
          logs: currentLogs
        } = this;
        const userId = (_b = (_a = getApp().globalData.data) == null ? void 0 : _a.userInfo) == null ? void 0 : _b.id;
        const d = /* @__PURE__ */ new Date();
        const fmt = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0") + " " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + ":" + String(d.getSeconds()).padStart(2, "0");
        const newLogEntry = {
          userId,
          sn: deviceIDC,
          mobileinfo: `${(deviceInfo == null ? void 0 : deviceInfo.brand) || ""} ${(deviceInfo == null ? void 0 : deviceInfo.model) || ""} ${(deviceInfo == null ? void 0 : deviceInfo.platform) || ""} ${(deviceInfo == null ? void 0 : deviceInfo.system) || ""}`,
          content: `${evt}${JSON.stringify(this.parseHexDataObject(this.trimHexData(evt)))}`,
          logdate: fmt
        };
        const updatedLogs = [...currentLogs, newLogEntry];
        if (updatedLogs.length >= MAX_LOGS_BEFORE_UPLOAD) {
          u_paivateuploadLog(updatedLogs).then((response) => {
            formatAppLog("log", "at pages/privateCar/VehicleControl/index.vue:782", response);
            if ((response == null ? void 0 : response.code) === 1e3) {
              this.logs = [];
            } else {
              this.logs = updatedLogs;
            }
          }).catch(() => {
            this.logs = updatedLogs;
          });
        } else {
          this.logs = updatedLogs;
        }
      },
      /**
       * 数据解析按钮处理
       * @param {string} hexData 16进制数据字符串
       */
      parseData: function(hexData) {
        const parsedResult = this.parseHexDataObject(hexData);
        if (parsedResult) {
          this.parsedData = parsedResult;
        }
      },
      /**
       * 初始化蓝牙连接
       */
      btnStartConnect: function() {
        const that = this;
        if (that.connectionID == "") {
          bleKeyManager.connectBLE(
            that.deviceIDC,
            function(state) {
              that.bluetoothStateMonitor(state);
            },
            function(type, arrayData, hexData, hexTextData) {
              that.bluetoothDataMonitor(type, arrayData, hexData, hexTextData);
            }
          );
        } else {
          appUtil.showModal("已连接蓝牙", false, function(confirm) {
          });
        }
      },
      /**
       * 修剪16进制数据
       * @param {string} hexString 原始16进制字符串
       * @returns {string} 修剪后的有效数据部分
       */
      trimHexData: function(hexString) {
        if (typeof hexString !== "string" || !/^[0-9a-fA-F]+$/.test(hexString)) {
          throw new Error("无效的16进制字符串");
        }
        return hexString.slice(4, -2);
      },
      /**
       * 断开蓝牙连接
       */
      btnEndConnect: function() {
        bleKeyManager.releaseBle();
      },
      // 指令公共方法
      sendVehicleCommandFun: function(commandCode, code) {
        var _a, _b;
        if (!((_a = this == null ? void 0 : this.bluetoothData) == null ? void 0 : _a.platenumber)) {
          uni.showModal({
            title: "提示",
            content: "请先开通设定再到开通设定-功能设置处完善设置",
            confirmText: "立即开通",
            success: (res) => {
              if (res.confirm) {
                uni.redirectTo({
                  url: "/pages/listOfPrivateCars/list/index"
                });
              }
            }
          });
          return;
        }
        if (((_b = this == null ? void 0 : this.bluetoothData) == null ? void 0 : _b.platenumber) && this.connectionState == "已连接") {
          uni.showModal({
            title: "提示",
            content: commandCode == 3 || commandCode == 4 ? "确认下发指令" : "如原车钥匙不支持此功能请自行点击【更多钥匙功能】关闭",
            confirmText: commandCode == 3 || commandCode == 4 ? "确认" : "确认支持",
            complete: (res) => {
              if (res.confirm) {
                uni.showLoading({
                  title: "加载中...",
                  mask: true
                });
                this.btnCmdSend(commandCode, code);
                setTimeout(() => {
                  uni.hideLoading();
                }, 1e3);
                this.handleSendInfo(commandCode, code);
              }
            }
          });
          return;
        }
        if (this.connectionState == "未连接") {
          uni.showToast({
            title: "请等待蓝牙连接后重试",
            icon: "none"
          });
          return;
        }
      },
      // 发送控制命令
      handleSendInfo(commandCode, code) {
        var _a;
        const temp = {
          sn: this.deviceIDC,
          controltype: `${commandCode}${code}`,
          electricity: ((_a = this == null ? void 0 : this.parsedData) == null ? void 0 : _a.electric) || 0
        };
        u_paivatesendInfo(temp);
      },
      handleToConfigure: function() {
        uni.redirectTo({
          url: `/pages/privateCar/btSettings/index?sign=${4}`
        });
      },
      //跳转配置
      /**
       * 获取已连接设备信息
       */
      btnConnected: function() {
        bleKeyManager.connectedDevice();
      },
      // 初始化获取缓存内容
      initToConfigureCache() {
        const currentItems = this.controlItems || [];
        uni.getStorage({
          key: "controlItems",
          success: (res) => {
            const storageItems = res.data || [];
            const merged = [...currentItems, ...storageItems];
            const uniqueMap = /* @__PURE__ */ new Map();
            merged.forEach((item) => {
              const existing = uniqueMap.get(item.id);
              if (!existing) {
                uniqueMap.set(item.id, item);
              } else {
                if (item.enabled === false) {
                  uniqueMap.set(item.id, item);
                }
              }
            });
            const result = Array.from(uniqueMap.values());
            this.controlItems = result;
          }
        });
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "container",
        style: vue.normalizeStyle({ height: `${$options.safeScreenHeight}px` })
      },
      [
        vue.createVNode(_component_CustomNavBar, { title: "手机钥匙控车" }),
        vue.createCommentVNode(" 车辆信息卡片 "),
        vue.createElementVNode(
          "view",
          {
            class: "vehicle-card",
            style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
          },
          [
            vue.createCommentVNode(" 车牌与提示信息 "),
            vue.createElementVNode("view", { class: "license-plate-section" }, [
              vue.createElementVNode("view", { class: "license-plate-container" }, [
                $data.bluetoothData.platenumber ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 0,
                    class: "license-plate"
                  },
                  vue.toDisplayString($data.bluetoothData.platenumber),
                  1
                  /* TEXT */
                )) : (vue.openBlock(), vue.createElementBlock("text", {
                  key: 1,
                  class: "license-plate bind-vehicle",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.handleBindVechi && $options.handleBindVechi(...args))
                }, "请绑定车辆")),
                !$data.netWork ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 2,
                  class: "manual-tip",
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.handleJumpSc && $options.handleJumpSc(...args))
                }, [
                  vue.createElementVNode("icon", {
                    type: "info",
                    size: "14",
                    color: "#999"
                  }),
                  vue.createTextVNode(" 安装使用手册 ")
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              !$data.netWork ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "connection-tip",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.handleSelectJump && $options.handleSelectJump(...args))
              }, "详细设置")) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createCommentVNode(" 车辆图片 "),
            vue.createElementVNode("image", {
              class: "vehicle-image",
              src: "https://k3a.wiselink.net.cn/img/app/blue/privateCar.png",
              mode: "aspectFit"
            }),
            vue.createCommentVNode(" 电量与蓝牙状态行 "),
            vue.createElementVNode("view", {
              class: "status-row",
              style: { "position": "relative" }
            }, [
              vue.createElementVNode("view", {
                class: "battery-status",
                onClick: _cache[3] || (_cache[3] = (...args) => $options.handleVoltage && $options.handleVoltage(...args))
              }, [
                $data.voltage_state ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "tips_voltage",
                  style: { "top": "-80%", "right": "-50%" }
                }, "设备剩余电量")) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("image", {
                  src: "https://k3a.wiselink.net.cn/img/app/blue/battery_" + $data.voltage_image + ".png",
                  class: "battery-icon"
                }, null, 8, ["src"]),
                $data.parsedData.electric ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 1,
                    style: { "font-size": "28rpx" }
                  },
                  vue.toDisplayString($data.parsedData.electric || 100) + "%",
                  1
                  /* TEXT */
                )) : (vue.openBlock(), vue.createElementBlock("text", { key: 2 }, "--"))
              ]),
              $data.blue_tooth_state ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "tips_bluetooth"
                },
                vue.toDisplayString($data.connectionState == "已连接" ? "可开关锁" : "设备不可用"),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass("bluetooth-status " + ($data.connectionState == "已连接" ? "connected" : "disconnected")),
                  onClick: _cache[4] || (_cache[4] = (...args) => $options.handleBlueToothState && $options.handleBlueToothState(...args))
                },
                [
                  $data.connectionState == "已连接" ? (vue.openBlock(), vue.createElementBlock("icon", {
                    key: 0,
                    type: "success",
                    size: "16",
                    color: "#2d8cf0"
                  })) : (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "loading-icon"
                  })),
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString($data.connectionState == "已连接" ? "蓝牙已连接" : "蓝牙已断开"),
                    1
                    /* TEXT */
                  )
                ],
                2
                /* CLASS */
              )
            ]),
            vue.createCommentVNode(" 模式选择器 "),
            !$data.netWork ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "mode-selector"
            }, [
              vue.createCommentVNode(" 感应模式开关 "),
              vue.createElementVNode("view", {
                class: "GY-sensor-mode-wrapper",
                onClick: _cache[5] || (_cache[5] = (...args) => $options.toggleSensorMode && $options.toggleSensorMode(...args))
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass("GY-sensor-mode " + ($data.parsedData.induction == "感应模式" && $data.connectionState == "已连接" ? "on" : "off"))
                  },
                  [
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass("GY-ripple " + ($data.parsedData.induction == "感应模式" && $data.connectionState == "已连接" ? "active" : ""))
                      },
                      null,
                      2
                      /* CLASS */
                    ),
                    vue.createElementVNode("view", { class: "GY-icon" }),
                    vue.createElementVNode(
                      "view",
                      {
                        class: "GY-label",
                        style: vue.normalizeStyle("color:" + ($data.parsedData.induction == "感应模式" && $data.connectionState == "已连接" ? "#fff" : "#333") + ";")
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          null,
                          vue.toDisplayString($data.parsedData.induction == "感应模式" && $data.connectionState == "已连接" ? "感应模式已开启" : "感应模式已关闭"),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("image", {
                          src: $data.parsedData.induction == "感应模式" && $data.connectionState == "已连接" ? "https://k3a.wiselink.net.cn/img/app/blue/arrow.png" : "https://k3a.wiselink.net.cn/img/app/blue/arrow_01.png",
                          style: { "width": "37rpx", "height": "37rpx" }
                        }, null, 8, ["src"])
                      ],
                      4
                      /* STYLE */
                    )
                  ],
                  2
                  /* CLASS */
                )
              ])
            ])) : (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 1,
                class: "GY-grant"
              },
              "授权使用时间:" + vue.toDisplayString($data.bluetoothData.startDate) + "--" + vue.toDisplayString($data.bluetoothData.endDate),
              1
              /* TEXT */
            ))
          ],
          4
          /* STYLE */
        ),
        vue.createCommentVNode(" 控制功能区 - 每行3个大按钮 "),
        vue.createElementVNode("view", { class: "control-section" }, [
          vue.createElementVNode("view", { class: "control-title" }, [
            vue.createElementVNode("view", { class: "title-bold" }, "手动操作"),
            vue.createElementVNode("view", {
              class: "more-functions",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.handleToConfigure && $options.handleToConfigure(...args))
            }, [
              vue.createElementVNode("text", null, "更多钥匙功能"),
              vue.createElementVNode("image", { src: _imports_1$3 })
            ])
          ]),
          vue.createElementVNode("view", { class: "control-grid" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.controlItems, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "control-item",
                  key: index
                }, [
                  item.enabled ? (vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    { key: 0 },
                    [
                      vue.createElementVNode("view", {
                        class: "control-icon",
                        onClick: ($event) => $options.parseEventDynamicCode($event, item.evt),
                        "data-id": item.id
                      }, [
                        vue.createElementVNode("image", {
                          src: item.id === 1 || item.id === 2 ? (item.id === 1 ? $data.parsedData.lock : !$data.parsedData.lock) ? item.ative : item.icon : item.icon,
                          class: "control-icon-image"
                        }, null, 8, ["src"])
                      ], 8, ["onClick", "data-id"]),
                      vue.createElementVNode(
                        "text",
                        { class: "control-name" },
                        vue.toDisplayString(item.name),
                        1
                        /* TEXT */
                      )
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : vue.createCommentVNode("v-if", true)
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])
      ],
      4
      /* STYLE */
    );
  }
  const PagesPrivateCarVehicleControlIndex = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/privateCar/VehicleControl/index.vue"]]);
  const _imports_0$2 = "/static/public/car_icon.png";
  const _imports_1$2 = "/static/public/_edit.png";
  const _imports_2$1 = "/static/privateCar/_delete.png";
  const _imports_3 = "/static/privateCar/ss.png";
  const _sfc_main$b = {
    components: {
      CustomNavBar
    },
    data() {
      return {
        // 屏幕信息对象，当前为空
        screenInfo: {},
        // 标签页背景图片（未激活状态）
        s_background_tabs_1: "/static/privateCar/1-1.png",
        s_background_tabs_2: "/static/privateCar/1-2.png",
        // 标签页背景图片（激活状态）
        s_background_tabs_active_1: "/static/privateCar/2-1.png",
        s_background_tabs_active_2: "/static/privateCar/2-2",
        // 当前页面编号
        g_page: 1,
        // 项目列表，初始为空数组
        g_items: [],
        // 触发标识符，初始为false
        g_triggered: false,
        // 当前激活的标签页编号
        c_activeTab: 1,
        // 参数对象，包含车牌号、车辆序列名称等信息，初始值为空字符串
        params: {
          platenumber: "",
          vehicleSerialName: "",
          vehicleModeName: "",
          sn: "",
          code: ""
        },
        // 按钮状态文本，初始为“开通”
        btnState: "开通",
        // ID，初始为空字符串
        id: "",
        // 制动类型编号，初始为1
        brakingType: 1,
        // 图片加载状态宽度和高度，初始为“加载中...”
        imageWidth: "加载中...",
        imageHeight: "加载中...",
        // 黑名单列表，初始为空数组
        g_black: [],
        // 车牌号码列表，初始为空数组
        g_platenumbers: [],
        // 来源，初始为空字符串
        g_source: "",
        // 多标识符标记，初始为空字符串
        g_flagMulti: "",
        // 信息，初始为空字符串
        info: "",
        // 所有参数，初始为空字符串
        allParams: "",
        // 类型，初始为空字符串
        type: "",
        // 名称，初始为空字符串
        name: "",
        // 序列号，初始为空字符串
        sn: "",
        // 总计，初始为空字符串
        g_total: "",
        // 角色列表索引，初始为空字符串
        g_roleList_index: "",
        // 首页背景图片路径，初始为空字符串
        s_background_picture_of_the_front_page: ""
      };
    },
    onLoad(options) {
      this.initCarryParams(options);
      this.initList(options);
    },
    onShow() {
      this.initialScreenInfo();
      this.handleGet();
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none",
            duration: 3e3
          });
        }
      },
      handleChangeBlack(evt) {
        const {
          id
        } = evt.currentTarget.dataset.item;
        const {
          g_black,
          g_platenumbers,
          g_items
        } = this;
        const blackSet = new Set(g_black);
        const plateSet = new Set(g_platenumbers);
        const vehicle = g_items.find((item) => item.id === id);
        if (!vehicle) {
          return;
        }
        if (blackSet.has(id)) {
          blackSet.delete(id);
          plateSet.delete(vehicle.platenumber);
        } else {
          blackSet.add(id);
          plateSet.add(vehicle.platenumber);
        }
        this.g_black = [...blackSet];
        this.g_platenumbers = [...plateSet];
      },
      handleJumpBlackInfo() {
        uni.reLaunch({
          url: `${this.g_source}?black=${this.g_black}&type=${this.type}&name=${this.name}&platenumbers=${this.g_platenumbers}&info=${JSON.stringify(this.info)}`
        });
      },
      // 扫码按钮点击事件
      scanCode() {
        uni.scanCode({
          onlyFromCamera: false,
          // 是否只允许相机扫码（false表示允许从相册选择）
          scanType: ["qrCode", "barCode"],
          // 扫码类型：二维码、条形码
          success: (res) => {
            formatAppLog("log", "at pages/privateCar/VehicleList/index.vue:390", "扫码成功:", res);
            this.handleScanResult(res.result);
          },
          fail: (err) => {
            formatAppLog("error", "at pages/privateCar/VehicleList/index.vue:394", "扫码失败:", err);
            uni.showToast({
              title: "扫码失败",
              icon: "error"
            });
          }
        });
      },
      // 处理扫码结果
      handleScanResult(result) {
        const params = this.params;
        this.params = {
          ...params,
          sn: result
        };
      },
      initCarryParams(evt) {
        const {
          source,
          flagMulti,
          info,
          allParams,
          type,
          name
        } = evt;
        this.g_source = source;
        this.g_flagMulti = flagMulti;
        this.info = info && JSON.parse(info);
        this.allParams = allParams;
        this.type = type;
        this.name = name;
      },
      handleSelectJump(evt) {
        const {
          item
        } = evt.currentTarget.dataset;
        uni.navigateTo({
          url: `/pages/privateCar/SettingsDetail/index?sn=${item.sn}&bluetoothKey=${item.bluetoothKey}`
        });
      },
      handleSelectCar(evt) {
        var _a, _b, _c, _d, _e;
        this.sn = (_c = (_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.item) == null ? void 0 : _c.sn;
        uni.setStorage({
          key: "bluetoothData",
          data: (_e = (_d = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _d.dataset) == null ? void 0 : _e.item
        });
      },
      // 管控列表数据
      initList(evt) {
        uni.showLoading({
          title: "加载中..."
        });
        const param = {
          page: this.g_page
        };
        u_paivatecarList(param).then((response) => {
          if ((response == null ? void 0 : response.code) == 1e3) {
            if (this.g_page > 1 && response.content.length === 0) {
              uni.showToast({
                title: `已加载全部数据：共${this.g_items.length}条`,
                icon: "none",
                duration: 3e3
              });
            }
            this.g_items = this.g_items.concat(response.content);
            this.g_total = Number(response.count || 0).toLocaleString();
            setTimeout(() => {
              var _a;
              if (evt == null ? void 0 : evt.tabs) {
                this.c_activeTab = evt == null ? void 0 : evt.tabs;
              } else if (((_a = this.g_items) == null ? void 0 : _a.length) > 0) {
                this.c_activeTab = 1;
              } else {
                this.c_activeTab = 2;
              }
              uni.hideLoading();
            }, 1e3);
          } else {
            uni.showToast({
              title: "请求失败，请稍后再试",
              icon: "none",
              duration: 2e3
            });
            uni.hideLoading();
          }
        });
      },
      // 触底请求
      handleLower() {
        this.g_page = this.g_page + 1;
        setTimeout(() => {
          this.initList();
        }, 100);
      },
      // 内容输入回调
      handleBindinput(evt) {
        const {
          params
        } = this;
        params[evt.currentTarget.dataset.item] = evt.detail.value;
        this.params = {
          ...params
        };
      },
      //提交内容
      handleSubmit() {
        var _a;
        const param = {
          ...this.params,
          brakingType: this.brakingType,
          id: this.id || ""
        };
        const validations = [
          {
            field: "platenumber",
            message: "请填写车牌号"
          },
          {
            field: "sn",
            message: "请填写设备号"
          }
        ];
        for (const {
          field,
          message
        } of validations) {
          if (!((_a = param[field]) == null ? void 0 : _a.trim())) {
            uni.showToast({
              title: message,
              icon: "none",
              duration: 3e3
            });
            return;
          }
        }
        u_paivateAddOrUpdateCar(param).then((response) => {
          if ((response == null ? void 0 : response.code) == 1e3) {
            uni.showToast({
              title: response == null ? void 0 : response.msg,
              icon: "none",
              duration: 3e3,
              success: () => {
                this.c_activeTab = 1;
                this.params = {};
                this.brakingType = 1;
                this.g_page = 1;
                this.g_items = [];
                if (!this.id) {
                  uni.redirectTo({
                    url: "/pages/listOfPrivateCars/pdf/index"
                  });
                }
                this.initList();
              }
            });
          } else {
            uni.showToast({
              title: response == null ? void 0 : response.msg,
              icon: "none",
              duration: 3e3
            });
          }
        });
        return;
      },
      // 修改管控
      handleEdit(evt) {
        const info = evt.currentTarget.dataset.item;
        this.c_activeTab = 2;
        this.btnState = "修改";
        this.id = info == null ? void 0 : info.id;
        this.params = {
          vehicleSerialName: info == null ? void 0 : info.vehicleSerialName,
          vehicleModeName: info == null ? void 0 : info.vehicleModeName,
          ccdate: info == null ? void 0 : info.ccdate,
          introduction: info == null ? void 0 : info.introduction,
          platenumber: info == null ? void 0 : info.platenumber,
          vin: info == null ? void 0 : info.vin,
          xsgw: info == null ? void 0 : info.xsgw,
          sn: info == null ? void 0 : info.sn,
          code: info == null ? void 0 : info.code
        };
        this.brakingType = info == null ? void 0 : info.brakingType;
      },
      // 删除车辆
      handleDelete(evt) {
        uni.showModal({
          title: "提示",
          content: "确认删除？",
          complete: (res) => {
            if (res.confirm) {
              const info = evt.currentTarget.dataset.item;
              const param = {
                sn: info == null ? void 0 : info.sn,
                code: info == null ? void 0 : info.code
              };
              u_paivateCarapiDeleteCar(param).then((response) => {
                uni.hideLoading();
                if ((response == null ? void 0 : response.code) == 1e3) {
                  this.c_activeTab = 1;
                  this.g_page = 1;
                  this.g_items = [];
                  uni.showToast({
                    title: response == null ? void 0 : response.msg,
                    icon: "none",
                    duration: 3e3
                  });
                  this.initList();
                } else {
                  uni.showToast({
                    title: response == null ? void 0 : response.msg,
                    icon: "none",
                    duration: 3e3
                  });
                }
              });
              return;
            }
          }
        });
      },
      // 切换tabs标签
      handleSwitchTab(e2) {
        const flag = e2.target.dataset.flag;
        if (flag == "设备清单") {
          this.c_activeTab = 1;
          this.btnState = "开通";
          this.params = {};
          this.id = "";
          this.g_roleList_index = null;
        }
        if (flag == "开通设定" || flag == "修改设定") {
          if (this.c_activeTab != 2) {
            this.c_activeTab = 2;
          }
        }
        if (flag == "功能设置") {
          if (this.c_activeTab != 3) {
            this.c_activeTab = 3;
          }
        }
      },
      handleGet() {
        const _this = this;
        uni.getStorage({
          key: "bluetoothData",
          success(res) {
            _this.sn = (res == null ? void 0 : res.data.sn) || "";
          }
        });
      },
      // 导航到各个设置页面
      navigateToUserInfo(evt) {
        var _a, _b;
        const sign = ((_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.sign) || evt;
        const getActionMap = (item) => ({
          default: {
            url: `/pages/privateCar/btSettings/index?sign=${sign}&deviceIDC=${item == null ? void 0 : item.sn}&orgKey=${item == null ? void 0 : item.bluetoothKey}`
          }
        });
        const executeNavigation = (ele) => {
          const actionMap = getActionMap(ele);
          const action = actionMap[sign] || actionMap.default;
          if (action.url) {
            if (sign == 1) {
              uni.showModal({
                title: "提示",
                content: "如未与设备配对,请先执行蓝牙配对操作",
                success: (res) => {
                  if (res.confirm) {
                    uni.navigateTo(action);
                  }
                }
              });
            } else {
              uni.navigateTo(action);
            }
          } else {
            uni.showModal({
              title: action.title,
              editable: true,
              placeholderText: action.placeholderText,
              success: (res) => {
                var _a2, _b2;
                res.confirm ? (_a2 = action.callback) == null ? void 0 : _a2.call(action, res.content) : (_b2 = action.fallback) == null ? void 0 : _b2.call(action);
              }
            });
          }
        };
        uni.getStorage({
          key: "bluetoothData",
          success: (res) => {
            executeNavigation(res == null ? void 0 : res.data);
          },
          fail: () => {
            const param = {
              [u_carList.page]: 1
            };
            byGet("https://k1sw.wiselink.net.cn/" + u_carList.URL, param).then((response) => {
              var _a2;
              if (response.statusCode === 200) {
                executeNavigation((_a2 = response == null ? void 0 : response.data) == null ? void 0 : _a2.content[0]);
              }
            }).catch(() => {
            });
          }
        });
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createVNode(_component_CustomNavBar, { title: "设备清单" }),
      vue.createElementVNode(
        "view",
        {
          class: "record-container",
          style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
        },
        [
          vue.createCommentVNode(" 切换部分 "),
          vue.createElementVNode("view", { class: "record-tabs" }, [
            vue.createElementVNode(
              "view",
              {
                class: "record-tabs-item",
                "data-flag": "设备清单",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.handleSwitchTab && $options.handleSwitchTab(...args)),
                style: vue.normalizeStyle("background-image: url(" + ($data.c_activeTab == 1 ? $data.s_background_tabs_active_1 : $data.s_background_tabs_1) + ");")
              },
              " 设备清单",
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "view",
              {
                class: "record-tabs-item",
                "data-flag": "开通设定",
                onClick: _cache[1] || (_cache[1] = (...args) => $options.handleSwitchTab && $options.handleSwitchTab(...args)),
                style: vue.normalizeStyle("background-image: url(" + ($data.c_activeTab == 2 ? $data.s_background_tabs_2 : $data.s_background_tabs_active_2) + ");")
              },
              vue.toDisplayString($data.btnState) + "设定 ",
              5
              /* TEXT, STYLE */
            ),
            vue.createElementVNode(
              "view",
              {
                class: "record-tabs-item",
                "data-flag": "功能设置",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.handleSwitchTab && $options.handleSwitchTab(...args)),
                style: vue.normalizeStyle("background-image: url(" + ($data.c_activeTab == 3 ? $data.s_background_tabs_active_1 : $data.s_background_tabs_1) + ");")
              },
              " 功能设置",
              4
              /* STYLE */
            )
          ]),
          vue.createCommentVNode(" 详情区域部分 "),
          $data.c_activeTab == 1 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
            key: 0,
            "scroll-y": "",
            onScrolltolower: _cache[7] || (_cache[7] = (...args) => $options.handleLower && $options.handleLower(...args)),
            "refresher-triggered": $data.g_triggered
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.g_items, (item, index) => {
                return vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: index,
                    class: "content-item",
                    style: vue.normalizeStyle("border: " + ($data.sn == item.sn ? "1px solid #e4b6b6" : "") + ";")
                  },
                  [
                    vue.createElementVNode("view", { class: "content-item-head" }, [
                      vue.createElementVNode("view", { class: "head-left" }, [
                        vue.createElementVNode("view", { class: "left-category" }, [
                          vue.createElementVNode("image", { src: _imports_0$2 }),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item.platenumber),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "left-split_line" }),
                        vue.createElementVNode(
                          "view",
                          { class: "left-model" },
                          vue.toDisplayString(item.vehicleSerialName || "-") + vue.toDisplayString(item.vehicleModeName || ""),
                          1
                          /* TEXT */
                        )
                      ]),
                      !$data.g_flagMulti ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "head-right"
                      }, [
                        vue.createElementVNode("image", {
                          src: _imports_1$2,
                          "data-item": item,
                          onClick: _cache[3] || (_cache[3] = (...args) => $options.handleEdit && $options.handleEdit(...args))
                        }, null, 8, ["data-item"]),
                        vue.createElementVNode("image", {
                          src: _imports_2$1,
                          "data-item": item,
                          onClick: _cache[4] || (_cache[4] = (...args) => $options.handleDelete && $options.handleDelete(...args))
                        }, null, 8, ["data-item"])
                      ])) : vue.createCommentVNode("v-if", true)
                    ]),
                    vue.createElementVNode("view", { class: "content-item-info" }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass("info-item  " + (item.sn.length > 15 ? "long-info-item" : ""))
                        },
                        [
                          vue.createElementVNode("label", null, "设备号 ："),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item.sn || "-"),
                            1
                            /* TEXT */
                          )
                        ],
                        2
                        /* CLASS */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "content-item-footer" }, [
                      vue.createElementVNode("view", { class: "footer-left" }),
                      vue.createElementVNode("view", {
                        class: "footer-right",
                        style: { "gap": "20rpx" }
                      }, [
                        vue.createElementVNode("view", {
                          class: "footer-right-btn",
                          "data-item": item,
                          onClick: _cache[5] || (_cache[5] = (...args) => $options.handleSelectJump && $options.handleSelectJump(...args))
                        }, [
                          vue.createElementVNode("text", null, "设置")
                        ], 8, ["data-item"]),
                        $data.g_items.length > 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                          key: 0,
                          class: "footer-right-btn",
                          "data-item": item,
                          onClick: _cache[6] || (_cache[6] = (...args) => $options.handleSelectCar && $options.handleSelectCar(...args))
                        }, [
                          vue.createElementVNode("text", null, "选择此车")
                        ], 8, ["data-item"])) : vue.createCommentVNode("v-if", true)
                      ])
                    ])
                  ],
                  4
                  /* STYLE */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ], 40, ["refresher-triggered"])) : vue.createCommentVNode("v-if", true),
          $data.c_activeTab == 2 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
            key: 1,
            "scroll-y": ""
          }, [
            vue.createElementVNode("view", { class: "card-info" }, [
              vue.createCommentVNode(" 车牌号 "),
              vue.createElementVNode("view", { class: "card-info-item" }, [
                vue.createElementVNode("label", null, [
                  vue.createTextVNode(" 车牌号 "),
                  vue.createElementVNode("text", null, "*")
                ]),
                vue.createElementVNode("view", { class: "card-info-item-input" }, [
                  vue.createElementVNode("input", {
                    placeholder: "请输入车牌号",
                    value: $data.params.platenumber,
                    "data-item": "platenumber",
                    onInput: _cache[8] || (_cache[8] = (...args) => $options.handleBindinput && $options.handleBindinput(...args))
                  }, null, 40, ["value"])
                ])
              ]),
              vue.createCommentVNode(" 车系 "),
              vue.createElementVNode("view", { class: "card-info-item" }, [
                vue.createElementVNode("label", null, [
                  vue.createTextVNode(" 车系 "),
                  vue.createElementVNode("text", null, "*")
                ]),
                vue.createElementVNode("view", { class: "card-info-item-input" }, [
                  vue.createElementVNode("input", {
                    placeholder: "请输入车系",
                    value: $data.params.vehicleSerialName,
                    "data-item": "vehicleSerialName",
                    onInput: _cache[9] || (_cache[9] = (...args) => $options.handleBindinput && $options.handleBindinput(...args))
                  }, null, 40, ["value"])
                ])
              ]),
              vue.createCommentVNode(" 车型 "),
              vue.createElementVNode("view", { class: "card-info-item" }, [
                vue.createElementVNode("label", null, [
                  vue.createTextVNode(" 车型 "),
                  vue.createElementVNode("text", null, "*")
                ]),
                vue.createElementVNode("view", { class: "card-info-item-input" }, [
                  vue.createElementVNode("input", {
                    placeholder: "请输入车型",
                    value: $data.params.vehicleModeName,
                    "data-item": "vehicleModeName",
                    onInput: _cache[10] || (_cache[10] = (...args) => $options.handleBindinput && $options.handleBindinput(...args))
                  }, null, 40, ["value"])
                ])
              ]),
              vue.createCommentVNode(" 设备号 "),
              vue.createElementVNode("view", { class: "card-info-item" }, [
                vue.createElementVNode("label", null, [
                  vue.createTextVNode(" 设备号(sn) "),
                  vue.createElementVNode("text", null, "*")
                ]),
                vue.createElementVNode("view", {
                  class: "card-info-item-input",
                  style: { "display": "flex", "flex-direction": "row", "align-items": "center" }
                }, [
                  $data.id != "" ? (vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    { key: 0 },
                    [
                      $data.id != "" ? (vue.openBlock(), vue.createElementBlock(
                        "text",
                        {
                          key: 0,
                          style: { "font-size": "26rpx" }
                        },
                        vue.toDisplayString($data.params.sn || "空"),
                        1
                        /* TEXT */
                      )) : vue.createCommentVNode("v-if", true)
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : (vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    { key: 1 },
                    [
                      vue.createElementVNode("input", {
                        placeholder: "请输入设备号(SN)",
                        value: $data.params.sn,
                        "data-item": "sn",
                        onInput: _cache[11] || (_cache[11] = (...args) => $options.handleBindinput && $options.handleBindinput(...args))
                      }, null, 40, ["value"]),
                      vue.createElementVNode("image", {
                        src: _imports_3,
                        mode: "",
                        onClick: _cache[12] || (_cache[12] = (...args) => $options.scanCode && $options.scanCode(...args)),
                        style: { "width": "50rpx", "height": "50rpx" }
                      })
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  ))
                ])
              ]),
              vue.createElementVNode("view", { class: "card-info-item" }, [
                vue.createElementVNode("label", null, [
                  vue.createTextVNode("code "),
                  vue.createElementVNode("text", null, "*")
                ]),
                vue.createElementVNode("view", {
                  class: "card-info-item-input",
                  style: { "display": "flex", "flex-direction": "row", "align-items": "center" }
                }, [
                  $data.id != "" ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 0,
                      style: { "font-size": "26rpx" }
                    },
                    vue.toDisplayString($data.params.code || "空"),
                    1
                    /* TEXT */
                  )) : (vue.openBlock(), vue.createElementBlock("input", {
                    key: 1,
                    placeholder: "请输入code",
                    value: $data.params.code,
                    "data-item": "code",
                    onInput: _cache[13] || (_cache[13] = (...args) => $options.handleBindinput && $options.handleBindinput(...args))
                  }, null, 40, ["value"]))
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "card-footer" }, [
              vue.createElementVNode(
                "view",
                {
                  onClick: _cache[14] || (_cache[14] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
                },
                "确认" + vue.toDisplayString($data.btnState),
                1
                /* TEXT */
              )
            ])
          ])) : vue.createCommentVNode("v-if", true),
          $data.c_activeTab == 3 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
            key: 2,
            class: "settings-list",
            "scroll-y": ""
          }, [
            vue.createCommentVNode(" 感应设置 "),
            vue.createElementVNode("view", { class: "settings-group" }, [
              vue.createElementVNode("view", {
                class: "settings-item",
                "data-sign": "1",
                onClick: _cache[15] || (_cache[15] = (...args) => $options.navigateToUserInfo && $options.navigateToUserInfo(...args))
              }, [
                vue.createElementVNode("view", { class: "item-left" }, [
                  vue.createElementVNode("text", { class: "item-text" }, "感应开关锁设置"),
                  vue.createElementVNode("text", { class: "item-tips" }, "配置蓝牙自动感应参数，如开锁、关锁，感应灵敏度")
                ]),
                vue.createElementVNode("image", {
                  class: "item-arrow",
                  src: _imports_1$3
                })
              ])
            ]),
            vue.createCommentVNode(" 钥匙功能配置 "),
            vue.createElementVNode("view", { class: "settings-group" }, [
              vue.createElementVNode("view", {
                class: "settings-item",
                "data-sign": "4",
                onClick: _cache[16] || (_cache[16] = (...args) => $options.navigateToUserInfo && $options.navigateToUserInfo(...args))
              }, [
                vue.createElementVNode("view", { class: "item-left" }, [
                  vue.createElementVNode("text", { class: "item-text" }, "钥匙功能配置"),
                  vue.createElementVNode("text", { class: "item-tips" }, "开启：功能图标显示在主界面；关闭：图标隐藏")
                ]),
                vue.createElementVNode("image", {
                  class: "item-arrow",
                  src: _imports_1$3
                })
              ])
            ]),
            vue.createCommentVNode(" 按键设置 "),
            vue.createElementVNode("view", { class: "settings-group" }, [
              vue.createElementVNode("view", {
                class: "settings-item",
                "data-sign": "3",
                onClick: _cache[17] || (_cache[17] = (...args) => $options.navigateToUserInfo && $options.navigateToUserInfo(...args))
              }, [
                vue.createElementVNode("view", { class: "item-left" }, [
                  vue.createElementVNode("text", { class: "item-text" }, "按键功能设置"),
                  vue.createElementVNode("text", { class: "item-tips" }, "该设置用于配置钥匙各项指令对应的按键、时间、流程等")
                ]),
                vue.createElementVNode("image", {
                  class: "item-arrow",
                  src: _imports_1$3
                })
              ])
            ]),
            vue.createCommentVNode(" 工程模式 "),
            vue.createElementVNode("view", {
              class: "settings-group",
              style: { "display": "none" }
            }, [
              vue.createElementVNode("view", {
                class: "settings-item",
                "data-sign": "2",
                onClick: _cache[18] || (_cache[18] = (...args) => $options.navigateToUserInfo && $options.navigateToUserInfo(...args))
              }, [
                vue.createElementVNode("view", { class: "item-left" }, [
                  vue.createElementVNode("text", { class: "item-text" }, "工程模式")
                ]),
                vue.createElementVNode("image", {
                  class: "item-arrow",
                  src: _imports_1$3
                })
              ])
            ]),
            vue.createElementVNode("view", { class: "settings-group" }, [
              vue.createElementVNode("view", {
                class: "settings-item",
                "data-sign": "5",
                onClick: _cache[19] || (_cache[19] = (...args) => $options.navigateToUserInfo && $options.navigateToUserInfo(...args))
              }, [
                vue.createElementVNode("view", { class: "item-left" }, [
                  vue.createElementVNode("text", { class: "item-text" }, "其他个性设置")
                ]),
                vue.createElementVNode("image", {
                  class: "item-arrow",
                  src: _imports_1$3
                })
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ],
        4
        /* STYLE */
      ),
      $data.c_activeTab == 1 && $data.g_flagMulti && $data.g_black.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "levitation-button",
        onClick: _cache[20] || (_cache[20] = (...args) => $options.handleJumpBlackInfo && $options.handleJumpBlackInfo(...args))
      }, [
        vue.createElementVNode("text", null, "确定")
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesPrivateCarVehicleListIndex = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/privateCar/VehicleList/index.vue"]]);
  const _sfc_main$a = {
    components: {
      CustomNavBar
    },
    data() {
      return {
        screenInfo: {},
        // 屏幕信息对象
        deviceIDC: "",
        orgKey: [51, 105, 69, 34, 131, 120]
      };
    },
    onLoad: function(options) {
      this.deviceIDC = `${options == null ? void 0 : options.sn}`;
      this.orgKey = options == null ? void 0 : options.bluetoothKey;
      setTimeout(() => {
        if ((options == null ? void 0 : options.flag) == 1) {
          this.navigateToUserInfo(1);
        }
      }, 500);
    },
    onShow() {
      this.initialScreenInfo();
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    methods: {
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      handleTransformation(number) {
        const numStr = number.toString();
        const bytes = [];
        for (let i = 0; i < numStr.length; i += 2) {
          const byteStr = numStr.substring(i, i + 2);
          bytes.push(parseInt(byteStr, 16));
        }
        return bytes;
      },
      // 导航到各个设置页面
      navigateToUserInfo(evt) {
        var _a, _b;
        const sign = ((_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.sign) || evt;
        const actionMap = {
          2: {
            title: "工程模式",
            placeholderText: "请输入操作密码",
            callback: (content) => {
              if (content == "666888") {
                uni.navigateTo({
                  url: "/pages/listOfPrivateCars/engineering/index"
                });
              } else {
                uni.showToast({
                  title: "密码错误",
                  icon: "none"
                });
              }
            },
            fallback: () => formatAppLog("log", "at pages/privateCar/SettingsDetail/index.vue:150", "用户取消输入操作密码")
          },
          default: {
            url: `/pages/privateCar/btSettings/index?sign=${sign}&deviceIDC=${this.deviceIDC}&orgKey=${this.orgKey}`
          }
        };
        const action = actionMap[sign] || actionMap.default;
        if (action.url) {
          if (sign == 1) {
            uni.showModal({
              title: "提示",
              content: "如未与设备配对,请先执行蓝牙配对操作",
              complete: (res) => {
                if (res.confirm) {
                  uni.navigateTo(action);
                }
              }
            });
          } else {
            uni.navigateTo(action);
          }
        } else {
          uni.showModal({
            title: action.title,
            editable: true,
            placeholderText: action.placeholderText,
            success(res) {
              res.confirm ? action.callback(res.content) : action.fallback();
            }
          });
        }
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "settings-container" }, [
      vue.createVNode(_component_CustomNavBar, { title: "手机钥匙控车" }),
      vue.createCommentVNode(" 设置项列表 "),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "settings-list",
          "scroll-y": "",
          style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
        },
        [
          vue.createCommentVNode(" 感应设置 "),
          vue.createElementVNode("view", { class: "settings-group" }, [
            vue.createElementVNode("view", {
              class: "settings-item",
              "data-sign": "1",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateToUserInfo && $options.navigateToUserInfo(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-text" }, "感应开关锁设置"),
                vue.createElementVNode("text", { class: "item-tips" }, "配置蓝牙自动感应参数，如开锁、关锁，感应灵敏度")
              ]),
              vue.createElementVNode("image", {
                class: "item-arrow",
                src: _imports_1$3
              })
            ])
          ]),
          vue.createCommentVNode(" 个性设置 "),
          vue.createElementVNode("view", { class: "settings-group" }, [
            vue.createElementVNode("view", {
              class: "settings-item",
              "data-sign": "4",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.navigateToUserInfo && $options.navigateToUserInfo(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-text" }, "钥匙功能配置"),
                vue.createElementVNode("text", { class: "item-tips" }, "开启：功能图标显示在主界面；关闭：图标隐藏")
              ]),
              vue.createElementVNode("image", {
                class: "item-arrow",
                src: _imports_1$3
              })
            ])
          ]),
          vue.createCommentVNode(" 按键设置 "),
          vue.createElementVNode("view", { class: "settings-group" }, [
            vue.createElementVNode("view", {
              class: "settings-item",
              "data-sign": "3",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.navigateToUserInfo && $options.navigateToUserInfo(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-text" }, "按键功能设置"),
                vue.createElementVNode("text", { class: "item-tips" }, "该设置用于配置钥匙各项指令对应的按键、时间、流程等")
              ]),
              vue.createElementVNode("image", {
                class: "item-arrow",
                src: _imports_1$3
              })
            ])
          ]),
          vue.createCommentVNode(" 工程模式 "),
          vue.createElementVNode("view", {
            class: "settings-group",
            style: { "display": "none" }
          }, [
            vue.createElementVNode("view", {
              class: "settings-item",
              "data-sign": "2",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.navigateToUserInfo && $options.navigateToUserInfo(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-text" }, "工程模式")
              ]),
              vue.createElementVNode("image", {
                class: "item-arrow",
                src: _imports_1$3
              })
            ])
          ]),
          vue.createElementVNode("view", { class: "settings-group" }, [
            vue.createElementVNode("view", {
              class: "settings-item",
              "data-sign": "5",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.navigateToUserInfo && $options.navigateToUserInfo(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-text" }, "其他个性设置")
              ]),
              vue.createElementVNode("image", {
                class: "item-arrow",
                src: _imports_1$3
              })
            ])
          ])
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesPrivateCarSettingsDetailIndex = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/privateCar/SettingsDetail/index.vue"]]);
  const _sfc_main$9 = {
    data() {
      return {
        imageWidth: "加载中...",
        imageHeight: "加载中...",
        isBottomReached: false,
        // 全高度
        flag: 0
      };
    },
    onLoad(options) {
      this.flag = (options == null ? void 0 : options.flag) || 0;
      setTimeout(() => {
        this.hadleImage();
      }, 500);
    },
    methods: {
      // 当滚动到 scroll-view 底部时触发
      onScrollToLower() {
        this.isBottomReached = true;
      },
      // “开始使用”按钮点击事件
      startUsing() {
        uni.redirectTo({
          url: "/pages/privateCar/index"
        });
      },
      hadleImage() {
        uni.showLoading({
          title: "加载中..."
        });
        const imgUrl = "https://k3a.wiselink.net.cn/img/video/blueinstall.png";
        uni.getImageInfo({
          src: imgUrl,
          success: (res) => {
            const proportion = (res == null ? void 0 : res.width) / 750;
            this.imageWidth = res.width;
            this.imageHeight = res.height / proportion;
            uni.hideLoading();
          },
          fail: (err) => {
            formatAppLog("error", "at pages/privateCar/pdf/index.vue:69", "获取图片信息失败", err);
            this.imageWidth = "加载失败";
            this.imageHeight = "加载失败";
          }
        });
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 滚动区域 "),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": true,
          class: "scroll-container",
          onScrolltolower: _cache[0] || (_cache[0] = (...args) => $options.onScrollToLower && $options.onScrollToLower(...args))
        },
        [
          vue.createElementVNode("view", { class: "image-container" }, [
            vue.createElementVNode(
              "image",
              {
                src: "https://k3a.wiselink.net.cn/img/video/blueinstall.png",
                class: "image",
                style: vue.normalizeStyle("width:750rpx; height: " + $data.imageHeight + "rpx;")
              },
              null,
              4
              /* STYLE */
            )
          ])
        ],
        32
        /* NEED_HYDRATION */
      ),
      vue.createCommentVNode(" 固定在底部的按钮和提示 "),
      vue.createElementVNode(
        "view",
        {
          class: "bottom-section",
          style: vue.normalizeStyle("background-color: " + (!$data.isBottomReached && !$data.flag ? "rgba(75, 72, 72, 0.8)" : "transparent") + ";")
        },
        [
          vue.createCommentVNode(" 开始使用按钮，仅当滑动到底部后才可点击 "),
          $data.isBottomReached || $data.flag ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 0,
            type: "primary",
            class: "start-button",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.startUsing && $options.startUsing(...args))
          }, "开始使用")) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 提示信息，仅当未滑动到底部时显示 "),
          !$data.isBottomReached && !$data.flag ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "scroll-hint"
          }, "请滑动到底部，才可以点击“开始使用”")) : vue.createCommentVNode("v-if", true)
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesPrivateCarPdfIndex = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/privateCar/pdf/index.vue"]]);
  const _imports_1$1 = "/static/privateCar/down.png";
  const CONTROL_ITEMS = [
    {
      id: 3,
      name: "尾箱",
      enabled: true,
      icon: "https://k3a.wiselink.net.cn/img/app/blue/box_off.png",
      evt: "handleOpenTrunk"
    },
    {
      id: 4,
      name: "寻车",
      enabled: true,
      icon: "https://k3a.wiselink.net.cn/img/app/blue/search_off.png",
      evt: "handleFindCar"
    },
    {
      id: 5,
      name: "升窗",
      enabled: true,
      icon: "https://k3a.wiselink.net.cn/img/app/blue/search_off.png",
      evt: "handlRaiseTheWindow"
    },
    {
      id: 6,
      name: "降窗",
      enabled: true,
      icon: "https://k3a.wiselink.net.cn/img/app/blue/search_off.png",
      evt: "handleLowerTheWindow"
    }
  ];
  const _INSTRUCTIONS = [
    {
      id: 1,
      name: "开锁功能指令配置",
      useType: "",
      useTypeId: ""
    },
    {
      id: 2,
      name: "关锁功能指令配置",
      useType: "",
      useTypeId: ""
    },
    {
      id: 3,
      name: "寻车功能指令配置",
      useType: "",
      useTypeId: ""
    },
    {
      id: 4,
      name: "尾箱功能指令配置",
      useType: "",
      useTypeId: ""
    },
    // { id: 5, name: '左中门功能指令配置', useType: '', useTypeId: '', },
    // { id: 6, name: '右中门功能指令配置', useType: '', useTypeId: '', },
    {
      id: 7,
      name: "升窗功能指令配置",
      useType: "",
      useTypeId: ""
    },
    {
      id: 8,
      name: "降窗功能指令配置",
      useType: "",
      useTypeId: ""
    }
  ];
  const _OUTPUT = [
    // 开锁
    [
      {
        id: 1,
        name: "短按开锁键"
      },
      //输出次数1 输出时间500ms 输出间隔0
      {
        id: 2,
        name: "短按两次开锁键"
      }
      //输出次数2 输出时间500ms 输出间隔500ms
    ],
    // 关锁
    [
      {
        id: 1,
        name: "短按关锁键"
      }
      //输出次数1 输出时间500ms 输出间隔0
    ],
    // 寻车
    [
      {
        id: 1,
        name: "短按寻车键"
      },
      //寻车键：输出次数1 输出时间500ms 输出间隔0; 关锁键:输出次数3 输出时间500 输出间隔1000ms
      {
        id: 2,
        name: "短按关锁键"
      }
    ],
    // 尾箱
    [
      {
        id: 1,
        name: "短按两次尾箱键"
      },
      //输出次数2 输出时间500ms 输出间隔1000ms
      {
        id: 2,
        name: "长按三秒尾箱键"
      }
      //输出次数1 输出时间3000ms 输出间隔0
    ],
    // // 左中门
    // [{ id: 1, name: '短按左中门键' },//输出次数为1 输出时间为500ms 输出间隔0
    // { id: 2, name: '长按3秒左中门键' },//输出次数为1 输出时间为3000ms 输出间隔0
    // ],
    // // 右中门
    // [{ id: 1, name: '短按右中门键' },//输出次数为1 输出时间为500ms 输出间隔0
    // { id: 2, name: '长按3秒右中门键' },//输出次数为1 输出时间为3000ms 输出间隔0
    // ],
    // 升窗
    [
      {
        id: 1,
        name: "长按7秒关锁键"
      }
      //输出次数为1 输出时间为7000ms 输出间隔0
    ],
    // 降窗
    [
      {
        id: 1,
        name: "长按7秒开锁键"
      }
      //输出次数为1 输出时间为7000ms 输出间隔0
    ]
  ];
  const TITLE_MAP = {
    1: "感应设置",
    // 类型1对应标题
    4: "个性配置",
    // 类型4对应标题
    3: "按键设置",
    default: "设置"
    // 默认标题
  };
  const _sfc_main$8 = {
    components: {
      CustomNavBar
    },
    // 页面加载生命周期
    data() {
      return {
        screenInfo: {},
        // 导航栏高度(iOS和Android不同)
        sign: "",
        // 页面标识
        chs: [],
        // 蓝牙特征值列表
        controlItems: CONTROL_ITEMS,
        // 控制项列表
        pageInterval: 0,
        // 页面定时器ID
        connectionID: "",
        // 蓝牙连接ID
        deviceIDC: "",
        // 默认设备ID
        orgKey: [],
        // 原始密钥
        Radiochecked: 0,
        //手动和感应模式切换
        distance: false,
        //显示自动校准模块
        bigRadius: 60,
        // 大圈默认半径（45-90）
        smallRadius: 40,
        // 小圈默认半径（40-85）
        signalCache: [],
        //信号值集合
        keyInstructions: _INSTRUCTIONS,
        //指令集合
        instruction_type: 0,
        //是否展开开始设置
        //输出方式集合
        key_out_put: _OUTPUT,
        headerTitle: "",
        consolemsg: "",
        scrollTo2: "",
        connectionState: "",
        connectionDisplay: "",
        msg: "",
        parseLen: 0,
        scrollTo: "",
        parsedData: {
          unlock: "",
          lock: "",
          induction: "",
          toBreakOff: "",
          autoCloseWin: "",
          startSense: ""
        },
        s_background_picture_of_the_front_page: ""
      };
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    onLoad(options) {
      this.options = options;
      const sign = (options == null ? void 0 : options.sign) || "";
      this.sign = sign;
      this.headerTitle = this.getHeaderTitle(sign);
    },
    // 页面显示生命周期
    onShow() {
      this.initToConfigureCache();
      this.initialScreenInfo();
      this.handleInitializeBluetooth();
    },
    // 页面卸载生命周期
    onUnload() {
      formatAppLog("log", "at pages/privateCar/btSettings/index.vue:420", "debug page unload");
      setTimeout(() => {
        bleKeyManager.releaseBle();
      }, 500);
      clearInterval(this.pageInterval);
      uni.setKeepScreenOn({
        keepScreenOn: false
        // 关闭屏幕常亮
      });
    },
    methods: {
      handleInitializeBluetooth() {
        var _a, _b;
        const sign = this.sign;
        if (sign === "1" || sign == "3" || sign == "5") {
          uni.showLoading({
            title: "蓝牙连接中..."
          });
          this.deviceIDC = (_a = this.options) == null ? void 0 : _a.deviceIDC;
          this.orgKey = this.keyToHexArray((_b = this.options) == null ? void 0 : _b.orgKey);
          setTimeout(() => {
            this.handleRequest(this.options);
          }, 500);
        }
      },
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none",
            duration: 3e3
          });
        }
      },
      // 数据处理
      keyToHexArray(key) {
        return key.match(/.{1,2}/g).map((byte) => "0x" + byte);
      },
      // 是否开启距离校准
      handleDistance() {
        var _a;
        formatAppLog("log", "at pages/privateCar/btSettings/index.vue:465", this == null ? void 0 : this.parsedData);
        if (((_a = this == null ? void 0 : this.parsedData) == null ? void 0 : _a.unlock) > 0) {
          this.distance = true;
        } else {
          uni.showModal({
            title: "提示",
            content: "请先执行蓝牙配对"
          });
        }
      },
      // 更新大圈半径
      updateBigRadius(e2) {
        const newBigRadius = e2.detail.value;
        this.bigRadius = newBigRadius;
        this.smallRadius = Math.min(this.smallRadius, newBigRadius - 5);
        setTimeout(() => {
          this.btnCmdSend(17, 0, newBigRadius == null ? void 0 : newBigRadius.toString(16));
        }, 500);
      },
      // 更新小圈半径
      updateSmallRadius(e2) {
        this.smallRadius = Math.min(e2.detail.value, this.bigRadius - 5);
        setTimeout(
          () => {
            var _a;
            this.btnCmdSend(17, 1, (_a = Math.min(e2.detail.value, this.bigRadius - 5)) == null ? void 0 : _a.toString(16));
          },
          500
        );
      },
      // 初始化获取缓存内容
      initToConfigureCache() {
        uni.getStorage({
          key: "controlItems",
          success: (res) => {
            const storedData = (res == null ? void 0 : res.data) || [];
            const newItems = CONTROL_ITEMS.filter((controlItem) => !storedData.some((storedItem) => storedItem.id === controlItem.id));
            const mergedItems = [...storedData, ...newItems];
            this.controlItems = mergedItems;
          },
          fail: () => {
            this.controlItems = CONTROL_ITEMS;
          }
        });
      },
      // 配对按钮点击处理
      btnPair() {
        uni.getSystemInfoSync().platform;
        const that = this;
        const deviceInfo = uni.getDeviceInfo();
        if (that.connectionState == "已连接") {
          if (deviceInfo.system.toLowerCase().includes("android")) {
            that.btnCmdSend(34, [1, 0, 0, 0, 0, 0, 0, 0]);
            uni.showModal({
              title: "提示",
              content: `请跳转系统蓝牙列表点击设备名称为${this.deviceIDC}的设备`,
              showCancel: true,
              // 是否显示取消按钮，默认 true
              cancelText: "取消",
              // 取消按钮文字（最多4个字符）
              cancelColor: "#000000",
              // 取消按钮颜色
              confirmText: "确定",
              // 确认按钮文字（最多4个字符）
              confirmColor: "#3CC51F",
              // 确认按钮颜色
              success: (res) => {
                if (res.confirm) {
                  const Intent = plus.android.importClass("android.content.Intent");
                  const Settings = plus.android.importClass("android.provider.Settings");
                  const mainActivity = plus.android.runtimeMainActivity();
                  const intent = new Intent(Settings.ACTION_BLUETOOTH_SETTINGS);
                  mainActivity.startActivity(intent);
                }
              }
            });
          } else {
            that.btnCmdSend(34, [1, 0, 0, 0, 0, 0, 0, 0]);
            setTimeout(() => {
              that.btnCmdSend(34, [2, 0, 0, 0, 0, 0, 0, 0]);
              setTimeout(() => {
                that.btnEndConnect();
                const pairInteval = setInterval(() => {
                  if (!bleKeyManager.getBLEConnectionState()) {
                    clearInterval(pairInteval);
                    setTimeout(() => {
                      that.btnStartConnect();
                    }, 500);
                  }
                }, 500);
                setTimeout(() => {
                  clearInterval(pairInteval);
                }, 3e3);
              }, 200);
            }, 200);
          }
        } else {
          uni.showToast({
            title: "请等待蓝牙初始化",
            icon: "none"
          });
        }
      },
      // 数组转ArrayBuffer
      arrayToArrayBuffer(array, elementSize = 1) {
        const typedArray = new Uint8Array(array.length * elementSize);
        array.forEach((item, i) => {
          typedArray[i * elementSize] = item;
        });
        return typedArray.buffer;
      },
      // 控制台输出
      consoleOut(e2) {
        this.consolemsg = this.consolemsg + "\r\n" + e2;
        this.scrollTo2 = "hiddenview2";
      },
      // 处理请求
      handleRequest(options) {
        formatAppLog("log", "at pages/privateCar/btSettings/index.vue:604", options);
        formatAppLog("log", "at pages/privateCar/btSettings/index.vue:605", "debug page load");
        const that = this;
        that.btnStartConnect();
        that.pageInterval = setInterval(() => {
          if (bleKeyManager.getBLEConnectionState()) {
            this.connectionState = "已连接";
            this.connectionID = bleKeyManager.getBLEConnectionID();
            this.connectionDisplay = that.connectionID;
          } else {
            this.connectionState = "未连接";
            this.connectionID = "";
            this.connectionDisplay = "未连接";
          }
        }, 200);
        that.msg = "";
        that.consolemsg = "";
        that.parseLen = 0;
        uni.setKeepScreenOn({
          keepScreenOn: true
        });
      },
      // 打包并发送数据（支持动态数据体长度）
      PackAndSend(type, dataLength, data, sign) {
        formatAppLog("log", "at pages/privateCar/btSettings/index.vue:638", type, dataLength, data, sign);
        const header = [36];
        const end = [36];
        const paddedData = [...data].concat(new Array(dataLength - data.length).fill(0)).slice(0, dataLength);
        const packet = dataLength == 8 ? [...header, type, dataLength, ...data, ...end] : [
          ...header,
          type,
          ...paddedData,
          ...end
        ];
        bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet));
      },
      PackAndSendSet(type, data) {
        const packet = [36, type, ...data, ...Array(12 - data.length).fill(0), 36];
        formatAppLog("log", "at pages/privateCar/btSettings/index.vue:652", packet, Array(12 - data.length).fill(0));
        bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet));
      },
      // 自动校准数据处理
      PackAndSendspecial(type, dataLength, data, sign) {
        const packet = [
          36,
          // Header
          17,
          8,
          // Type and length
          parseInt(sign, 16) || 0,
          // Sign value (fallback to 0)
          data ? 1 : 0,
          // Data flag
          ...Array(6).fill(0),
          // Padding
          36
          // Footer
        ];
        bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet));
      },
      PackAndSendspecial04d(data) {
        const packet = [36, 77, 1, data, 36];
        bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet));
      },
      PackAndSendspecial063(data) {
        const packet = [36, 99, 1, data, 36];
        bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet));
      },
      // 认证加密
      auth_encrypt(passwordSource, random) {
        const passwordEncrypt = new Array(8).fill(0);
        for (let i = 0; i < 6; i++) {
          passwordEncrypt[i] = passwordSource[i] ^ random[i] ^ 255;
        }
        return passwordEncrypt;
      },
      // 发送命令（区分不同指令的数据体长度）
      btnCmdSend(type, data, sign) {
        formatAppLog("log", "at pages/privateCar/btSettings/index.vue:698", type);
        switch (type) {
          case 16:
            const orgKey = this.orgKey;
            const retKey = this.auth_encrypt(orgKey, data);
            this.PackAndSend(type, 8, retKey);
            break;
          case 3:
          case 4:
          case 5:
          case 6:
            this.PackAndSend(type, 8, new Array(8).fill(0));
            break;
          case 59:
          case 58:
            const flameoutData = data;
            this.PackAndSend(type, 12, flameoutData);
            break;
          case 34:
            this.PackAndSend(type, 8, data);
            break;
          case 17:
            this.PackAndSendspecial(type, 6, data, sign);
            break;
          case 77:
            this.PackAndSendspecial04d(data);
            break;
          case 99:
            this.PackAndSendspecial063(data);
            break;
        }
      },
      // 开始蓝牙连接
      btnStartConnect() {
        const that = this;
        if (!that.connectionID) {
          bleKeyManager.connectBLE(
            that.deviceIDC,
            (state) => {
              if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_PRE_EXECUTE === state)
                ;
              else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ERROR === state) {
                uni.hideLoading();
              } else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ADAPTER_UNAVAILABLE === state) {
                uni.showModal("请打开蓝牙", false, () => {
                });
              } else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_NOT_FOUND === state) {
                uni.showModal("没有发现设备", false, () => {
                });
              } else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_CONNECT_FAILED === state)
                ;
              else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_UNSUPPORTED === state) {
                uni.showModal("您的手机不支持低功耗蓝牙", false, () => {
                });
              } else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_SEND_FAILED === state) {
                uni.showModal("数据发送失败", false, () => {
                });
              } else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_NO_RESPONSE === state) {
                uni.showModal("设备超时无响应", false, () => {
                });
              } else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_CONNECT_SUCESS === state) {
                uni.hideLoading();
              }
            },
            (type, arrayData, hexData, hexTextData) => {
              uni.hideLoading();
              if (type === 0) {
                this.btnCmdSend(16, arrayData);
              } else {
                that.parseData(that.trimHexData(hexTextData));
              }
              this.msg = this.msg + "receive: type:" + type + ",data:" + hexTextData + "\r\n";
              this.scrollTo = "hiddenview";
            }
          );
        } else {
          uni.showModal({
            title: "提示",
            content: "蓝牙已连接"
          });
        }
      },
      /**
       * 修剪16进制数据
       * @param {string} hexString 原始16进制字符串
       * @returns {string} 修剪后的有效数据部分
       */
      trimHexData: function(hexString) {
        if (typeof hexString !== "string" || !/^[0-9a-fA-F]+$/.test(hexString)) {
          throw new Error("无效的16进制字符串");
        }
        return hexString.slice(4, -2);
      },
      handleCalibration() {
        const that = this;
        uni.showModal({
          title: "第一步",
          content: "请参考安装说明书将设备放置在要安装的位置",
          confirmText: "已安装",
          success: (cbRes_1) => {
            if (cbRes_1 == null ? void 0 : cbRes_1.confirm) {
              uni.showModal({
                title: "第二步",
                content: "请关好所有车窗及车门",
                confirmText: "已关闭",
                success: (cbRes_2) => {
                  if (cbRes_2 == null ? void 0 : cbRes_2.confirm) {
                    uni.showModal({
                      title: "第三步",
                      content: "请移步至离车头直线距离5米处",
                      confirmText: "立即校准",
                      success: (cbRes_3) => {
                        var _a;
                        if (cbRes_3 == null ? void 0 : cbRes_3.confirm) {
                          const signalCache = that.signalCache;
                          const sorted = [...signalCache].sort((a, b) => a - b);
                          const trimmed = sorted.slice(1, -1);
                          const avgA = Math.round(trimmed.reduce((a, b) => a + b) / trimmed.length);
                          this.btnCmdSend(17, 1, avgA == null ? void 0 : avgA.toString(16));
                          this.btnCmdSend(17, 0, (_a = avgA + 10) == null ? void 0 : _a.toString(16));
                        }
                      }
                    });
                  }
                }
              });
            }
          }
        });
      },
      /**
       * 数据解析按钮处理
       * @param {string} hexData 16进制数据字符串
       */
      parseData: function(hexData) {
        const parsedResult = this.parseHexDataObject(hexData);
        if (parsedResult) {
          const currentData = this.parsedData || {};
          const isEqual = JSON.stringify(parsedResult) === JSON.stringify(currentData);
          if (!isEqual) {
            this.parsedData = parsedResult;
          }
        }
      },
      /**
       * 解析16进制车辆状态数据
       * @param {string} hexString 30字符的16进制字符串
       * @returns {Array|null} 解析结果数组，格式为[{key: string, value: any}]
       */
      parseHexDataObject: function(hexString) {
        if (hexString.length !== 30) {
          return null;
        }
        const bytes = [];
        for (let i = 0; i < 30; i += 2) {
          bytes.push(parseInt(hexString.substr(i, 2), 16));
        }
        const resultObject = {};
        resultObject.lock = bytes[2] === 1 ? true : false;
        resultObject.supply = bytes[3];
        resultObject.induction = bytes[0] === 1 ? "感应模式" : "手动模式";
        resultObject.lock = bytes[8];
        resultObject.unlock = bytes[11];
        resultObject.toBreakOff = bytes[6] === 1;
        resultObject.signal = bytes[10];
        resultObject.autoCloseWin = (bytes[7] & 16) !== 0;
        resultObject.startSense = (bytes[13] & 2) !== 0;
        let signalCache = this.signalCache;
        signalCache.push(bytes[10]);
        if (signalCache.length > 10) {
          signalCache = signalCache.slice(-10);
        }
        this.bigRadius = bytes[8];
        this.smallRadius = bytes[11];
        this.signalCache = signalCache;
        return resultObject;
      },
      // 获取标题
      getHeaderTitle(evt) {
        return TITLE_MAP[evt] || TITLE_MAP.default;
      },
      // 设置 蓝牙断开自动断开锁车
      handleToBreakOff(e2) {
        var _a;
        const isEnabled = Boolean((_a = e2 == null ? void 0 : e2.detail) == null ? void 0 : _a.value);
        this.btnCmdSend(59, [isEnabled ? 1 : 0]);
      },
      handleAutoCloseTheWindow(e2) {
        var _a;
        const isEnabled = Boolean((_a = e2 == null ? void 0 : e2.detail) == null ? void 0 : _a.value);
        this.btnCmdSend(77, [isEnabled ? 1 : 0]);
      },
      handleStartSense(e2) {
        var _a;
        const isEnabled = Boolean((_a = e2 == null ? void 0 : e2.detail) == null ? void 0 : _a.value);
        this.btnCmdSend(99, [!isEnabled ? 1 : 0]);
      },
      // 设置 感应模式
      handleRadioChange(e2) {
        var _a;
        const isEnabled = (_a = e2 == null ? void 0 : e2.detail) == null ? void 0 : _a.value;
        this.btnCmdSend(58, [isEnabled == "1" ? 1 : 0]);
        this.Radiochecked = isEnabled;
      },
      //新增或减少配置
      handleToggleControl(evt) {
        var _a;
        const {
          index
        } = ((_a = evt.currentTarget) == null ? void 0 : _a.dataset) || {};
        const {
          value
        } = evt.detail || {};
        const {
          controlItems
        } = this;
        formatAppLog("log", "at pages/privateCar/btSettings/index.vue:958", controlItems);
        if (index == null || value == null || !(controlItems == null ? void 0 : controlItems[index])) {
          return;
        }
        const updatedItems = controlItems.map(
          (item, i) => i === index ? {
            ...item,
            enabled: Boolean(value)
          } : item
        );
        this.controlItems = updatedItems;
        formatAppLog("log", "at pages/privateCar/btSettings/index.vue:975", updatedItems);
        uni.setStorage({
          key: "controlItems",
          data: updatedItems
        });
      },
      // 设置按键指令
      handleKeyCommands(evt) {
        var _a, _b;
        const {
          id
        } = ((_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.item) || {};
        const {
          instruction_type: currentType
        } = this;
        const newInstructionType = id === currentType ? 0 : id;
        this.instruction_type = newInstructionType;
      },
      // 输出方式
      handleOutputMethod(evt) {
        var _a, _b, _c, _d;
        const {
          index,
          item: info
        } = ((_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) || {};
        const value = (_b = evt == null ? void 0 : evt.detail) == null ? void 0 : _b.value;
        if (index === void 0 || !info || value === void 0) {
          return;
        }
        const selectedOutput = (_d = (_c = this.key_out_put) == null ? void 0 : _c[index]) == null ? void 0 : _d[Number(value)];
        if (!(selectedOutput == null ? void 0 : selectedOutput.name)) {
          return;
        }
        const {
          keyInstructions
        } = this;
        const updateIndex = keyInstructions.findIndex((item) => (item == null ? void 0 : item.id) === info.id);
        if (updateIndex === -1) {
          return;
        }
        this.keyInstructions[updateIndex].useType = selectedOutput.name;
        this.keyInstructions[updateIndex].useTypeId = selectedOutput.id;
        setTimeout(() => {
          const updatedItem = keyInstructions[updateIndex];
          if (updatedItem == null ? void 0 : updatedItem.useTypeId) {
            this.handleInstructions(updatedItem);
          }
        }, 500);
      },
      // 快捷设置按键
      handleInstructions(evt) {
        const {
          id,
          useTypeId
        } = evt;
        const sendCommand = (cmd, data) => {
          this.PackAndSendSet(cmd, data);
        };
        const instructionMap = {
          1: {
            // 开锁键
            1: () => sendCommand(51, [51, 6, 1, 0, 0]),
            // 短按开锁键
            2: () => sendCommand(51, [51, 6, 2, 6, 0])
            // 短按两次开锁键
          },
          2: {
            // 关锁键
            1: () => sendCommand(52, [52, 6, 1, 0, 0])
            // 短按开锁键
          },
          3: {
            // 寻车键
            1: () => sendCommand(54, [54, 6, 1, 0, 0]),
            // 短按寻车键
            2: () => sendCommand(54, [52, 6, 3, 6, 0])
            // 三按关锁键
          },
          4: {
            // 尾箱键
            1: () => sendCommand(53, [53, 6, 2, 6, 0]),
            // 短按两次尾箱键
            2: () => sendCommand(53, [53, 30, 1, 0, 0])
            // 长按3秒尾箱键
          },
          5: {
            // 左中门
            1: () => sendCommand(80, [80, 6, 1, 0, 0]),
            // 短按左中门键
            2: () => sendCommand(80, [80, 30, 1, 0, 0])
            // 长按3秒左中门键
          },
          6: {
            // 右中门
            1: () => sendCommand(81, [81, 6, 1, 0, 0]),
            // 短按右中门键
            2: () => sendCommand(81, [81, 30, 1, 0, 0])
            // 长按3秒右中门键
          },
          7: {
            // 升窗
            1: () => sendCommand(82, [52, 70, 1, 0, 0])
            // 长按7秒关锁键
          },
          8: {
            // 降窗
            1: () => sendCommand(83, [51, 70, 1, 0, 0])
            // 长按7秒开锁键
          }
        };
        const idActions = instructionMap[id];
        if (!idActions) {
          return;
        }
        const action = idActions[useTypeId];
        if (action) {
          action();
        }
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "settings-container" }, [
      vue.createVNode(_component_CustomNavBar, { title: $data.headerTitle }, null, 8, ["title"]),
      vue.createCommentVNode(" 设置项列表 "),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "settings-list",
          "scroll-y": "",
          style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
        },
        [
          vue.createCommentVNode(" 感应设置 "),
          $data.sign == 1 && !$data.distance ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 0 },
            [
              vue.createElementVNode("view", { style: { "font-size": "24rpx", "display": "flex", "justify-content": "center", "flex-direction": "column", "align-items": "center", "padding": "20rpx", "gap": "20rpx" } }, [
                vue.createElementVNode("text", null, "*请检查蓝牙是否连接，是否已经站在车辆旁。连接蓝牙后才可进行配对。"),
                vue.createElementVNode("view", {
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.btnPair && $options.btnPair(...args)),
                  style: { "background-color": "#fff", "padding": "15rpx 100rpx", "font-size": "26rpx", "border-radius": "10rpx", "border": "1px solid #f0f0f0" }
                }, " 蓝牙配对"),
                vue.createElementVNode("text", null, "发起系统蓝牙与车载设备进行配对，将会弹出配对请求对话框，请点击【配对】。如果在手机系统蓝牙取消了配对，感应将会失效，需重新点击【蓝牙配对】进行配对")
              ]),
              vue.createElementVNode("view", { class: "settings-group" }, [
                vue.createElementVNode("view", { class: "settings-item" }, [
                  vue.createElementVNode("view", { class: "item-left" }, [
                    vue.createElementVNode("text", { class: "item-text" }, "感应设置"),
                    vue.createElementVNode("text", { class: "item-tips" }, "数值为信号档位，不代表实际距离")
                  ]),
                  vue.createElementVNode("view", {
                    style: { "display": "flex", "flex-direction": "row", "align-items": "center", "font-size": "26rpx" },
                    onClick: _cache[1] || (_cache[1] = (...args) => $options.handleDistance && $options.handleDistance(...args))
                  }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      "开锁" + vue.toDisplayString($data.parsedData.unlock || 0) + "，关锁" + vue.toDisplayString($data.parsedData.lock || 0),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("image", {
                      class: "item-arrow",
                      src: _imports_1$3
                    })
                  ])
                ]),
                vue.createElementVNode("view", { class: "settings-item" }, [
                  vue.createElementVNode("view", { class: "item-left" }, [
                    vue.createElementVNode("text", { class: "item-text" }, "感应模式"),
                    vue.createElementVNode("text", { class: "item-tips" }, "开启感应模式，将根据手机距离自动开锁/关锁（蓝牙连接有效），关闭则为手动模式需点击图标操作，两种模式离车均请注意锁车安全。")
                  ]),
                  vue.createElementVNode("switch", {
                    checked: $data.parsedData.induction == "感应模式",
                    onChange: _cache[2] || (_cache[2] = (...args) => $options.handleRadioChange && $options.handleRadioChange(...args)),
                    color: "#07C160"
                  }, null, 40, ["checked"])
                ])
              ])
            ],
            64
            /* STABLE_FRAGMENT */
          )) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 个性配置 "),
          $data.sign == 4 ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createElementVNode("view", { class: "settings-tip" }, "请参照车辆原有功能设置功能按键"),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.controlItems, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "settings-group",
                    key: index
                  }, [
                    vue.createElementVNode("view", { class: "settings-item" }, [
                      vue.createElementVNode("view", { class: "item-left" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "item-text" },
                          vue.toDisplayString(item.name),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("switch", {
                        checked: item.enabled,
                        onChange: _cache[3] || (_cache[3] = (...args) => $options.handleToggleControl && $options.handleToggleControl(...args)),
                        "data-index": index,
                        color: "#07C160"
                      }, null, 40, ["checked", "data-index"])
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ],
            64
            /* STABLE_FRAGMENT */
          )) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 自动校准 "),
          $data.distance ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 2 },
            [
              vue.createElementVNode("view", {
                class: "controls",
                style: { "padding": "0" },
                onClick: _cache[4] || (_cache[4] = (...args) => $options.handleCalibration && $options.handleCalibration(...args))
              }, [
                vue.createElementVNode("view", { class: "settings-item" }, [
                  vue.createElementVNode("view", { class: "item-left" }, [
                    vue.createElementVNode("text", {
                      class: "item-text",
                      style: { "font-size": "30rpx" }
                    }, "自动校准")
                  ]),
                  vue.createElementVNode("view", { style: { "display": "flex", "flex-direction": "row", "align-items": "center", "font-size": "26rpx" } }, [
                    vue.createElementVNode(
                      "text",
                      { style: { "font-size": "24rpx", "color": "#999" } },
                      "当前所在位置距离设备信号值 : " + vue.toDisplayString($data.signalCache[$data.signalCache.length - 1]),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("image", {
                      class: "item-arrow",
                      src: _imports_1$3
                    })
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "container" }, [
                vue.createCommentVNode(" 大圈（B圆） "),
                vue.createElementVNode(
                  "view",
                  {
                    class: "circle big-circle",
                    style: vue.normalizeStyle("width: " + $data.bigRadius * 3 + "px; height: " + $data.bigRadius * 3 + "px;")
                  },
                  null,
                  4
                  /* STYLE */
                ),
                vue.createCommentVNode(" 小圈（A圆） "),
                vue.createElementVNode(
                  "view",
                  {
                    class: "circle small-circle",
                    style: vue.normalizeStyle("width: " + $data.smallRadius * 3 + "px; height: " + $data.smallRadius * 3 + "px;")
                  },
                  null,
                  4
                  /* STYLE */
                ),
                vue.createCommentVNode(" 车图标 "),
                vue.createElementVNode("view", { class: "car-icon" }, [
                  vue.createElementVNode("image", {
                    src: "https://k3a.wiselink.net.cn/img/app/blue/car.png",
                    style: { "width": "120px", "height": "120px" }
                  })
                ])
              ]),
              vue.createCommentVNode(" 动态调整滑块 "),
              vue.createElementVNode("view", { class: "controls" }, [
                vue.createElementVNode("view", { style: { "color": "28rpx" } }, [
                  vue.createTextVNode(" 手动校准 : "),
                  vue.createElementVNode("text", { class: "item-tips" }, "左右滑动图中白点可调节距离信号")
                ]),
                vue.createElementVNode("view", { class: "slider-container" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "slider-label" },
                    "开锁信号值：" + vue.toDisplayString($data.smallRadius) + " (范围:40-" + vue.toDisplayString($data.bigRadius - 5) + ")",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("slider", {
                    value: $data.smallRadius,
                    min: "40",
                    max: $data.bigRadius - 5,
                    activeColor: "#e74c3c",
                    "block-size": "12",
                    onChange: _cache[5] || (_cache[5] = (...args) => $options.updateSmallRadius && $options.updateSmallRadius(...args))
                  }, null, 40, ["value", "max"])
                ]),
                vue.createElementVNode("view", { class: "slider-container" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "slider-label" },
                    "关锁信号值：" + vue.toDisplayString($data.bigRadius) + " (范围:45-90)",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("slider", {
                    value: $data.bigRadius,
                    min: "45",
                    max: "90",
                    activeColor: "#3498db",
                    "block-size": "12",
                    onChange: _cache[6] || (_cache[6] = (...args) => $options.updateBigRadius && $options.updateBigRadius(...args))
                  }, null, 40, ["value"])
                ])
              ])
            ],
            64
            /* STABLE_FRAGMENT */
          )) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 按键设置 "),
          $data.sign == 3 ? (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            { key: 3 },
            vue.renderList($data.keyInstructions, (item, index) => {
              return vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: index },
                [
                  vue.createElementVNode("view", {
                    class: "settings-group",
                    "data-item": item,
                    onClick: _cache[7] || (_cache[7] = (...args) => $options.handleKeyCommands && $options.handleKeyCommands(...args))
                  }, [
                    vue.createElementVNode("view", { class: "settings-item" }, [
                      vue.createElementVNode("view", { class: "item-left" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "item-text" },
                          vue.toDisplayString(item.name),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", null, [
                        $data.instruction_type == item.id ? (vue.openBlock(), vue.createElementBlock("image", {
                          key: 0,
                          class: "item-arrow",
                          src: _imports_1$1
                        })) : (vue.openBlock(), vue.createElementBlock("image", {
                          key: 1,
                          class: "item-arrow",
                          src: _imports_1$3
                        }))
                      ])
                    ])
                  ], 8, ["data-item"]),
                  $data.instruction_type == item.id ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "key-control"
                  }, [
                    vue.createElementVNode("view", { class: "settings-group" }, [
                      vue.createElementVNode("picker", {
                        "data-item": item,
                        "data-index": index,
                        onChange: _cache[8] || (_cache[8] = (...args) => $options.handleOutputMethod && $options.handleOutputMethod(...args)),
                        range: $data.key_out_put[index],
                        "range-key": "name"
                      }, [
                        vue.createElementVNode("view", { class: "settings-item" }, [
                          vue.createElementVNode("view", { class: "item-left" }, [
                            vue.createElementVNode("text", { class: "item-text text-color" }, "控制方式")
                          ]),
                          vue.createElementVNode("view", { class: "key-control-picker" }, [
                            vue.createElementVNode(
                              "text",
                              { class: "text-color" },
                              vue.toDisplayString(item.useType),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode("image", {
                              class: "item-arrow",
                              src: _imports_1$3
                            })
                          ])
                        ])
                      ], 40, ["data-item", "data-index", "range"])
                    ])
                  ])) : vue.createCommentVNode("v-if", true)
                ],
                64
                /* STABLE_FRAGMENT */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          )) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 其他个性设置 "),
          $data.sign == 5 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 4,
            class: "settings-group"
          }, [
            vue.createElementVNode("view", { class: "settings-item" }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-text" }, "蓝牙断开自动锁车"),
                vue.createElementVNode("text", { class: "item-tips" }, "启用后，若在开锁状态下与车载蓝牙断开，设备将自动执行一次关锁")
              ]),
              vue.createElementVNode("switch", {
                checked: $data.parsedData.toBreakOff,
                onChange: _cache[9] || (_cache[9] = (...args) => $options.handleToBreakOff && $options.handleToBreakOff(...args)),
                color: "#07C160"
              }, null, 40, ["checked"])
            ]),
            vue.createElementVNode("view", { class: "settings-item" }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-text" }, "锁车自动升窗"),
                vue.createElementVNode("text", { class: "item-tips" }, "启用后，按关锁按钮将执行升窗。需提前配置升窗动作")
              ]),
              vue.createElementVNode("switch", {
                checked: $data.parsedData.autoCloseWin,
                onChange: _cache[10] || (_cache[10] = (...args) => $options.handleAutoCloseTheWindow && $options.handleAutoCloseTheWindow(...args)),
                color: "#07C160"
              }, null, 40, ["checked"])
            ]),
            vue.createElementVNode("view", { class: "settings-item" }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-text" }, "启动状态蓝牙感应是否生效"),
                vue.createElementVNode("text", { class: "item-tips" }, "开启后，行车时将自动禁用感应开车门功能")
              ]),
              vue.createElementVNode("switch", {
                checked: !$data.parsedData.startSense,
                onChange: _cache[11] || (_cache[11] = (...args) => $options.handleStartSense && $options.handleStartSense(...args)),
                color: "#07C160"
              }, null, 40, ["checked"])
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesPrivateCarBtSettingsIndex = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/privateCar/btSettings/index.vue"]]);
  const _sfc_main$7 = {
    data() {
      return {};
    },
    props: {
      events: {
        type: Array,
        default: () => []
      }
    },
    methods: {},
    created: function() {
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "timeline-container" }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($props.events, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: index,
            class: "timeline-item"
          }, [
            $props.events.length - 1 != index ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "timeline-dot"
            })) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", {
              class: "timeline-content",
              style: { "border-color": "#bdbdbd" }
            }),
            vue.createElementVNode("view", { class: "timeline-content-evevt" }, [
              vue.createElementVNode(
                "text",
                { class: "timeline-title" },
                vue.toDisplayString(item.content),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "timeline-date" },
                vue.toDisplayString(item.createdate),
                1
                /* TEXT */
              )
            ])
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const timeLine = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-3085ce19"], ["__file", "C:/ZXT/ZXTRentN/static/google20256/components/timeline/timeline.vue"]]);
  const _imports_0$1 = "/static/public/car_01.png";
  const _sfc_main$6 = {
    components: {
      CustomNavBar,
      timeLine
    },
    data() {
      return {
        screenInfo: {},
        // 标签页背景图片（未激活状态）
        s_background_tabs_1: "/static/privateCar/1-1.png",
        s_background_tabs_2: "/static/privateCar/1-2.png",
        // 标签页背景图片（激活状态）
        s_background_tabs_active_1: "/static/privateCar/2-1.png",
        s_background_tabs_active_2: "/static/privateCar/2-2",
        //tabs背景
        searchBarHeight: 80,
        // 总导航高度 = 状态栏高度 + 导航栏高度
        g_page: 1,
        //列表页码
        g_items: [],
        //列表数据
        y_items: [],
        y_page: 1,
        y_triggered: false,
        c_tabs: [
          {
            name: "",
            value: "1"
          },
          {
            name: "",
            value: "2"
          }
        ],
        //tabs切换签
        c_activeTab: 1,
        params: {},
        file: null,
        g_triggered: false,
        //下拉刷新状态
        c_send_key_show_momal: false,
        startDate: "2025-03-20",
        //历史轨迹查询时间
        startTime: "19:00",
        //历史轨迹查询时间
        endDate: "2025-03-20",
        //历史轨迹查询时间
        endTime: "19:00",
        //历史轨迹查询时间
        copied: false,
        controlcode: "",
        c_edit_key_show_momal: false,
        g_edit_info: {
          platenumber: "",
          personname: "",
          mobile: "",
          bak: ""
        },
        oilendDate: "",
        oilendTime: "",
        cellData: {
          platenumber: ""
        },
        vehId: "",
        g_total: "",
        comParam: "",
        y_total: "",
        category: "",
        bak: "",
        s_background_picture_of_the_front_page: "",
        btnState: ""
      };
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    onLoad(options) {
      this.getOrderList();
      this.getKeySendingList();
    },
    onReady() {
      this.handleCurrentDate();
    },
    onShow() {
      this.initialScreenInfo();
      this.handleCurrentDate();
    },
    onShareAppMessage() {
      return {
        title: `请前往${this.bak || "车主指定位置"}寻找车辆`,
        path: "/pages/desk/desk?scene=" + this.controlcode
      };
    },
    methods: {
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none",
            duration: 3e3
          });
        }
      },
      // 获取当前年月日 时分
      handleCurrentDate() {
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
        };
        const formatTime = (date) => {
          const hours = date.getHours();
          const minutes = date.getMinutes();
          return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
        };
        const now = /* @__PURE__ */ new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const currentDate = formatDate(now);
        const tomorrowDate = formatDate(tomorrow);
        const currentTime = formatTime(now);
        this.oilendDate = currentDate;
        this.oilendTime = currentTime;
        this.startDate = currentDate;
        this.endDate = tomorrowDate;
        this.startTime = currentTime;
        this.endTime = currentTime;
      },
      // 获取当前年月日 时分
      handleCurrentDate() {
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
        };
        const formatTime = (date) => {
          const hours = date.getHours();
          const minutes = date.getMinutes();
          return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
        };
        const now = /* @__PURE__ */ new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const currentDate = formatDate(now);
        const tomorrowDate = formatDate(tomorrow);
        const currentTime = formatTime(now);
        this.startDate = currentDate;
        this.endDate = tomorrowDate;
        this.startTime = currentTime;
        this.endTime = currentTime;
      },
      // 发送电子钥匙弹窗
      handleShowSendKeyModal(evt) {
        formatAppLog("log", "at pages/privateCar/keySharing/index.vue:510", evt, "1111");
        const info = evt.currentTarget.dataset.item;
        this.cellData = info;
        this.c_send_key_show_momal = true;
        this.vehId = info.id;
      },
      handleHideSengKeyModal() {
        this.cellData = {};
        this.c_send_key_show_momal = false;
      },
      handleHideEditKeyModal() {
        this.c_edit_key_show_momal = false;
        this.g_edit_info = {};
      },
      // 切换tabs标签
      handleSwitchTab(e2) {
        const flag = e2.currentTarget.dataset;
        formatAppLog("log", "at pages/privateCar/keySharing/index.vue:533", flag);
        if ((flag == null ? void 0 : flag.index) == 1 && this.c_activeTab != 1) {
          this.c_activeTab = 1;
        }
        if ((flag == null ? void 0 : flag.index) == 2 && this.c_activeTab != 2) {
          this.c_activeTab = 2;
        }
      },
      // 触底执行
      handleLower() {
        this.g_page + 1;
        setTimeout(() => {
          this.getOrderList();
        }, 300);
      },
      // 电子钥匙发送记录到底执行
      handleKeyLower() {
        const page = this.y_page;
        this.y_page = page + 1;
        setTimeout(() => {
          this.getKeySendingList();
        }, 300);
      },
      // 下拉操作执行
      handleRefresh() {
        this.g_triggered = false;
        this.g_page = 1;
        this.g_items = [];
        setTimeout(() => {
          this.getOrderList();
        }, 300);
      },
      handleKeyRefresh() {
        this.y_triggered = false;
        this.y_page = 1;
        this.y_items = [];
        setTimeout(() => {
          this.getKeySendingList();
        }, 300);
      },
      // 请求车辆列表
      getOrderList() {
        uni.showLoading({
          title: "加载中..."
        });
        const param = {
          page: this.g_page
        };
        u_paivateCarList(param).then((response) => {
          if (response.code == 1e3) {
            if (this.g_page > 1 && response.content.length === 0) {
              uni.showToast({
                title: `已加载全部数据：共${this.g_items.length}条`,
                icon: "none",
                duration: 1500
              });
            }
            this.g_items = this.g_items.concat(response.content);
            this.g_total = Number(response.count || 0).toLocaleString();
            setTimeout(() => {
              uni.hideLoading();
            }, 300);
          } else {
            uni.hideLoading();
          }
        });
      },
      // 搜索记录
      bindblurSea(evt) {
        this.comParam = evt.detail.value;
        this.y_triggered = false;
        this.y_page = 1;
        this.y_items = [];
        setTimeout(() => {
          this.getKeySendingList();
        }, 300);
      },
      // 请求发送记录列表
      getKeySendingList: async function(evt) {
        uni.showLoading({
          title: "加载中..."
        });
        const params = {
          page: this.y_page
        };
        u_paivateRentRecord(params).then((response) => {
          if (this.y_page > 1 && response.content.length === 0) {
            uni.showToast({
              title: `已加载全部数据：共${this.y_items.length}条`,
              icon: "none",
              duration: 1500
            });
            return;
          }
          this.y_total = response.count || 0;
          this.y_items = [...this.y_items, ...response.content];
          formatAppLog("log", "at pages/privateCar/keySharing/index.vue:653", [...this.y_items, ...response.content]);
        });
      },
      // 提交发送钥匙
      handleFormSubmit(evt) {
        const {
          startDate,
          startTime,
          endDate,
          endTime,
          vehId
        } = this;
        const formData = evt.detail.value;
        const validations = [
          {
            field: formData.personName,
            message: "请输入使用人"
          },
          {
            field: formData.mobile,
            message: "请输入手机号"
          }
        ];
        const validationError = validations.find(({
          field
        }) => !field);
        if (validationError) {
          uni.showToast({
            title: validationError.message,
            icon: "none",
            duration: 1500
          });
          return;
        }
        const buildDateTime = (date, time) => `${date || ""} ${time ? `${time}:00` : "00:00:00"}`.trim();
        const requestParams = {
          vehId,
          startDate: buildDateTime(startDate, startTime),
          endDate: buildDateTime(endDate, endTime),
          personName: formData.personName,
          mobile: formData.mobile,
          bak: formData.bak
        };
        const API_ENDPOINTS = {
          baseURL: getApp().globalData.data.k1swUrl,
          sendRentKey: u_paivateSendRentKey
        };
        const submitRequest = async () => {
          try {
            const response = await byGet(
              `${API_ENDPOINTS.baseURL}${API_ENDPOINTS.sendRentKey}`,
              requestParams
            );
            if (response.data.code !== 1e3) {
              throw new Error(response.data.msg);
            }
            uni.showToast({
              title: "发送成功",
              icon: "none",
              duration: 1500
            });
            this.c_send_key_show_momal = false;
            this.g_items = [];
            this.y_items = [];
            this.y_page = 1;
            setTimeout(() => {
              this.getKeySendingList();
              this.getOrderList();
            }, 100);
          } catch (error) {
            formatAppLog("log", "at pages/privateCar/keySharing/index.vue:724", "CatchClause", error);
            formatAppLog("log", "at pages/privateCar/keySharing/index.vue:725", "CatchClause", error);
            uni.showToast({
              title: error.message || "请求失败，请稍后重试",
              icon: "none",
              duration: 1500
            });
          }
        };
        submitRequest();
      },
      bindTimeChange(evt) {
        const category = evt.currentTarget.dataset.index;
        const value = evt.detail.value;
        this[category] = value;
      },
      handleCance(evt) {
        ({
          controlCode: evt.currentTarget.dataset.item.controlcode
        });
        u_paivateCancelRentKey().then((response) => {
          if (response.code == 1e3) {
            this.c_send_key_show_momal = false, this.g_items = [], this.y_items = [], this.y_page = 1;
            setTimeout(() => {
              this.getKeySendingList();
              this.getOrderList();
            }, 300);
          } else {
            uni.showToast({
              title: response.msg,
              icon: "none",
              duration: 1500
            });
          }
        });
      },
      handleCopy(evt) {
        const text = evt.currentTarget.dataset.item.simplecode;
        uni.setClipboardData({
          data: text,
          success: () => {
            this.copied = true;
          }
        });
      },
      handleForward(evt) {
        var _a, _b, _c;
        formatAppLog("log", "at pages/privateCar/keySharing/index.vue:782", evt);
        const controlcode = evt.currentTarget.dataset.item.controlcode;
        const bak = (_c = (_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.item) == null ? void 0 : _c.bak;
        this.controlcode = controlcode, this.bak = bak;
      },
      handleEditKey(evt) {
        formatAppLog("log", "at pages/privateCar/keySharing/index.vue:792", evt.currentTarget.dataset.item);
        this.c_edit_key_show_momal = true;
        this.g_edit_info = evt.currentTarget.dataset.item;
      },
      handleFormEdit() {
        const {
          startDate,
          startTime,
          endDate,
          endTime,
          g_edit_info
        } = this;
        const buildDateTime = (date, time) => `${date || ""} ${time ? `${time}:00` : "00:00:00"}`.trim();
        const requestParams = {
          controlCode: g_edit_info.controlcode,
          startDate: buildDateTime(startDate, startTime),
          endDate: buildDateTime(endDate, endTime)
        };
        byPost(
          `${getApp().globalData.data.k1swUrl}${u_paivateUpdateRentKey.URL}`,
          requestParams,
          (response) => {
            if (response.data.code == 1e3) {
              this.g_edit_info = {};
              this.c_edit_key_show_momal = false;
              this.y_triggered = false;
              this.y_page = 1;
              this.y_items = [];
              setTimeout(() => {
                this.getKeySendingList();
              }, 300);
            }
          },
          (error) => {
          }
        );
        formatAppLog("log", "at pages/privateCar/keySharing/index.vue:832", requestParams);
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    const _component_time_line = vue.resolveComponent("time-line");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("view", { class: "container" }, [
        vue.createVNode(_component_CustomNavBar, { title: "发送电子钥匙" }),
        vue.createElementVNode(
          "view",
          {
            class: "record-container",
            style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
          },
          [
            vue.createCommentVNode(" 切换部分 "),
            vue.createElementVNode("view", { class: "record-tabs" }, [
              vue.createElementVNode(
                "view",
                {
                  class: "record-tabs-item",
                  "data-index": "1",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.handleSwitchTab && $options.handleSwitchTab(...args)),
                  style: vue.normalizeStyle("background-image: url(" + ($data.c_activeTab == 1 ? $data.s_background_tabs_active_1 : $data.s_background_tabs_1) + ");")
                },
                " 发送钥匙",
                4
                /* STYLE */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: "record-tabs-item",
                  "data-index": "2",
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.handleSwitchTab && $options.handleSwitchTab(...args)),
                  style: vue.normalizeStyle("background-image: url(" + ($data.c_activeTab == 2 ? $data.s_background_tabs_2 : $data.s_background_tabs_active_2) + ");")
                },
                vue.toDisplayString($data.btnState) + "使用记录 ",
                5
                /* TEXT, STYLE */
              )
            ]),
            vue.createCommentVNode(" 详情区域部分 "),
            $data.c_activeTab == 1 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
              key: 0,
              "scroll-y": "",
              onScrolltolower: _cache[3] || (_cache[3] = (...args) => $options.handleLower && $options.handleLower(...args)),
              onRefresherrefresh: _cache[4] || (_cache[4] = (...args) => $options.handleRefresh && $options.handleRefresh(...args)),
              "refresher-enabled": true,
              "refresher-triggered": $data.g_triggered
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.g_items, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "content-item"
                  }, [
                    vue.createElementVNode("view", { class: "content-item-head" }, [
                      vue.createElementVNode("view", { class: "head-left" }, [
                        vue.createElementVNode("view", { class: "left-category" }, [
                          vue.createElementVNode("image", { src: _imports_0$1 }),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item.platenumber),
                            1
                            /* TEXT */
                          )
                        ]),
                        !item.bluetoothKey ? (vue.openBlock(), vue.createElementBlock(
                          "view",
                          {
                            key: 0,
                            class: "left-model"
                          },
                          vue.toDisplayString(item.vehicleSerialName || "-") + vue.toDisplayString(item.vehicleModeName || "") + "111 ",
                          1
                          /* TEXT */
                        )) : vue.createCommentVNode("v-if", true)
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "content-item-info" }, [
                      !item.bluetoothKey ? (vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          key: 0,
                          class: vue.normalizeClass("info-item  " + (item.vin.length > 15 ? "long-info-item" : ""))
                        },
                        [
                          vue.createElementVNode("label", null, "车架号 ："),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item.vin || "-"),
                            1
                            /* TEXT */
                          )
                        ],
                        2
                        /* CLASS */
                      )) : vue.createCommentVNode("v-if", true),
                      !item.bluetoothKey ? (vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          key: 1,
                          class: vue.normalizeClass("info-item  " + (item.xsgw.length > 15 ? "long-info-item" : ""))
                        },
                        [
                          vue.createElementVNode("label", null, "油箱容积 ："),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item.xsgw ? item.xsgw + "L" : "-"),
                            1
                            /* TEXT */
                          )
                        ],
                        2
                        /* CLASS */
                      )) : vue.createCommentVNode("v-if", true),
                      !item.bluetoothKey ? (vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          key: 2,
                          class: vue.normalizeClass("info-item  " + (item.carOwnerName.length > 15 ? "long-info-item" : ""))
                        },
                        [
                          vue.createElementVNode("label", null, "设备平台 ："),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item.carOwnerName || "-"),
                            1
                            /* TEXT */
                          )
                        ],
                        2
                        /* CLASS */
                      )) : vue.createCommentVNode("v-if", true),
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass("info-item  " + (item.sn.length > 15 ? "long-info-item" : ""))
                        },
                        [
                          vue.createElementVNode("label", null, "设备号 ："),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item.sn || "-"),
                            1
                            /* TEXT */
                          )
                        ],
                        2
                        /* CLASS */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "content-item-footer" }, [
                      vue.createElementVNode("view", { class: "footer-left" }),
                      vue.createElementVNode("view", { class: "footer-right" }, [
                        vue.createElementVNode("view", {
                          class: "footer-right-btn",
                          "data-item": item,
                          onClick: _cache[2] || (_cache[2] = (...args) => $options.handleShowSendKeyModal && $options.handleShowSendKeyModal(...args))
                        }, [
                          vue.createElementVNode("text", null, "发送钥匙")
                        ], 8, ["data-item"])
                      ])
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ], 40, ["refresher-triggered"])) : vue.createCommentVNode("v-if", true),
            $data.c_activeTab == 2 ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 1 },
              [
                vue.createCommentVNode(` <scroll-view class="content-container" :scroll-y="true" @scrolltolower="handleKeyLower"\r
						@refresherrefresh="handleKeyRefresh" :refresher-enabled="true"\r
						:refresher-triggered="y_triggered">\r
						<block v-for="(item, index) in y_items" :key="index">\r
							<view class="content-card">\r
								<view class="card-head">\r
									<view class="card-head-left">\r
										<text>{{ item.platenumber }}</text>\r
										<text>{{ item.personname }}</text>\r
										<text class="split-line"></text>\r
										<text class="phone-text">{{ item.mobile }}</text>\r
									</view>\r
									<view class="card-head-right">\r
										<text v-if="item.status" style="color: #7b7b7c">已取消</text>\r
										<text v-else>使用中</text>\r
									</view>\r
								</view>\r
								<view class="card-info">\r
									<time-line\r
										:events="[{ createdate: item.startdate || '-' }, { createdate: item.enddate || '-' }]" />\r
								</view>\r
								<view class="card-footer1" v-if="!item.status"\r
									style="display: flex; justify-content: space-between">\r
									<view>\r
										<text @tap="handleEditKey" :data-item="item" style="float: left">修改</text>\r
									</view>\r
									<view style="display: flex; flex-direction: row">\r
										<button :data-item="item" open-type="share" @tap="handleForward">一键转发</button>\r
										<text @tap="handleCopy" :data-item="item">{{ copied ? '已复制' : '复制链接' }}</text>\r
										<text @tap="handleCance" :data-item="item">取消用车</text>\r
									</view>\r
								</view>\r
							</view>\r
						</block>\r
					</scroll-view> `),
                vue.createElementVNode("scroll-view", {
                  "scroll-y": "",
                  onScrolltolower: _cache[9] || (_cache[9] = (...args) => $options.handleLower && $options.handleLower(...args)),
                  onRefresherrefresh: _cache[10] || (_cache[10] = (...args) => $options.handleRefresh && $options.handleRefresh(...args)),
                  "refresher-enabled": true,
                  "refresher-triggered": $data.g_triggered
                }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.y_items, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        key: index,
                        class: "content-card"
                      }, [
                        vue.createElementVNode("view", { class: "card-head" }, [
                          vue.createElementVNode("view", { class: "card-head-left" }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString(item.platenumber),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString(item.personname),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode("text", { class: "split-line" }),
                            vue.createElementVNode(
                              "text",
                              { class: "phone-text" },
                              vue.toDisplayString(item.mobile),
                              1
                              /* TEXT */
                            )
                          ]),
                          vue.createElementVNode("view", { class: "card-head-right" }, [
                            item.status ? (vue.openBlock(), vue.createElementBlock("text", {
                              key: 0,
                              style: { "color": "#7b7b7c" }
                            }, "已取消")) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "使用中"))
                          ])
                        ]),
                        vue.createElementVNode("view", { class: "card-info" }, [
                          vue.createVNode(_component_time_line, {
                            events: [{ createdate: item.startdate || "-" }, { createdate: item.enddate || "-" }]
                          }, null, 8, ["events"])
                        ]),
                        !item.status ? (vue.openBlock(), vue.createElementBlock("view", {
                          key: 0,
                          class: "card-footer1",
                          style: { "display": "flex", "justify-content": "space-between" }
                        }, [
                          vue.createElementVNode("view", null, [
                            vue.createElementVNode("text", {
                              onClick: _cache[5] || (_cache[5] = (...args) => $options.handleEditKey && $options.handleEditKey(...args)),
                              "data-item": item,
                              style: { "float": "left" }
                            }, "修改", 8, ["data-item"])
                          ]),
                          vue.createElementVNode("view", { style: { "display": "flex", "flex-direction": "row" } }, [
                            vue.createElementVNode("button", {
                              "data-item": item,
                              "open-type": "share",
                              onClick: _cache[6] || (_cache[6] = (...args) => $options.handleForward && $options.handleForward(...args))
                            }, "一键转发", 8, ["data-item"]),
                            vue.createElementVNode("text", {
                              onClick: _cache[7] || (_cache[7] = (...args) => $options.handleCopy && $options.handleCopy(...args)),
                              "data-item": item
                            }, vue.toDisplayString($data.copied ? "已复制" : "复制链接"), 9, ["data-item"]),
                            vue.createElementVNode("text", {
                              onClick: _cache[8] || (_cache[8] = (...args) => $options.handleCance && $options.handleCance(...args)),
                              "data-item": item
                            }, "取消用车", 8, ["data-item"])
                          ])
                        ])) : vue.createCommentVNode("v-if", true)
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ], 40, ["refresher-triggered"])
              ],
              64
              /* STABLE_FRAGMENT */
            )) : vue.createCommentVNode("v-if", true)
          ],
          4
          /* STYLE */
        )
      ]),
      vue.createCommentVNode(" 发送电子钥匙弹窗 "),
      $data.c_send_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal-mask",
        onClick: _cache[11] || (_cache[11] = (...args) => $options.handleHideSengKeyModal && $options.handleHideSengKeyModal(...args))
      })) : vue.createCommentVNode("v-if", true),
      $data.c_send_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal-base-map"
      }, [
        vue.createElementVNode(
          "form",
          {
            onSubmit: _cache[17] || (_cache[17] = (...args) => $options.handleFormSubmit && $options.handleFormSubmit(...args))
          },
          [
            vue.createElementVNode("view", { class: "modal-container" }, [
              vue.createElementVNode("view", { class: "modal-container-head" }, [
                vue.createElementVNode("text", null, "发送电子钥匙"),
                vue.createElementVNode("image", {
                  src: _imports_1$3,
                  onClick: _cache[12] || (_cache[12] = (...args) => $options.handleHideSengKeyModal && $options.handleHideSengKeyModal(...args))
                })
              ]),
              vue.createElementVNode("view", { class: "modal-container-middle" }, [
                vue.createElementVNode("view", { class: "middle-form-item" }, [
                  vue.createElementVNode("label", null, "车牌号"),
                  vue.createElementVNode(
                    "view",
                    { class: "modal-form-region" },
                    vue.toDisplayString($data.cellData.platenumber),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "middle-form-item" }, [
                  vue.createElementVNode("label", null, "使用人"),
                  vue.createElementVNode("view", { class: "modal-form-region" }, [
                    vue.createElementVNode("input", {
                      placeholder: "请输入使用人",
                      name: "personName",
                      style: { "text-align": "right", "font-size": "28rpx" }
                    })
                  ])
                ]),
                vue.createElementVNode("view", { class: "middle-form-item" }, [
                  vue.createElementVNode("label", null, "手机号"),
                  vue.createElementVNode("view", { class: "modal-form-region" }, [
                    vue.createElementVNode("input", {
                      placeholder: "请输入手机号",
                      name: "mobile",
                      style: { "text-align": "right", "font-size": "28rpx" }
                    })
                  ])
                ]),
                vue.createElementVNode("view", { class: "middle-form-item" }, [
                  vue.createElementVNode("label", null, "开始时间"),
                  vue.createElementVNode("view", { class: "modal-form-region" }, [
                    vue.createElementVNode(
                      "picker",
                      {
                        mode: "date",
                        "data-index": "startDate",
                        onChange: _cache[13] || (_cache[13] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
                      },
                      [
                        vue.createElementVNode("view", { class: "form-item-text" }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString($data.startDate),
                            1
                            /* TEXT */
                          )
                        ])
                      ],
                      32
                      /* NEED_HYDRATION */
                    ),
                    vue.createElementVNode(
                      "picker",
                      {
                        mode: "time",
                        "data-index": "startTime",
                        onChange: _cache[14] || (_cache[14] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
                      },
                      [
                        vue.createElementVNode("view", { class: "form-item-text" }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString($data.startTime),
                            1
                            /* TEXT */
                          )
                        ])
                      ],
                      32
                      /* NEED_HYDRATION */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "middle-form-item" }, [
                  vue.createElementVNode("label", null, "结束时间"),
                  vue.createElementVNode("view", { class: "modal-form-region" }, [
                    vue.createElementVNode(
                      "picker",
                      {
                        mode: "date",
                        "data-index": "endDate",
                        onChange: _cache[15] || (_cache[15] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
                      },
                      [
                        vue.createElementVNode("view", { class: "form-item-text" }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString($data.endDate),
                            1
                            /* TEXT */
                          )
                        ])
                      ],
                      32
                      /* NEED_HYDRATION */
                    ),
                    vue.createElementVNode(
                      "picker",
                      {
                        mode: "time",
                        "data-index": "endTime",
                        onChange: _cache[16] || (_cache[16] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
                      },
                      [
                        vue.createElementVNode("view", { class: "form-item-text" }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString($data.endTime),
                            1
                            /* TEXT */
                          )
                        ])
                      ],
                      32
                      /* NEED_HYDRATION */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "middle-form-item" }, [
                  vue.createElementVNode("label", null, "备注"),
                  vue.createElementVNode("view", { class: "modal-form-region" }, [
                    vue.createElementVNode("input", {
                      placeholder: "请输入车位号或车辆位置",
                      name: "bak",
                      style: { "text-align": "right", "font-size": "28rpx" }
                    })
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "modal-container-footer" }, [
                vue.createElementVNode("button", { formType: "submit" }, "确认")
              ])
            ])
          ],
          32
          /* NEED_HYDRATION */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 修改电子钥匙 "),
      $data.c_edit_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "modal-mask",
        onClick: _cache[18] || (_cache[18] = (...args) => $options.handleHideEditKeyModal && $options.handleHideEditKeyModal(...args))
      })) : vue.createCommentVNode("v-if", true),
      $data.c_edit_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "modal-base-map"
      }, [
        vue.createElementVNode(
          "form",
          {
            onSubmit: _cache[24] || (_cache[24] = (...args) => $options.handleFormEdit && $options.handleFormEdit(...args))
          },
          [
            vue.createElementVNode("view", { class: "modal-container" }, [
              vue.createElementVNode("view", { class: "modal-container-head" }, [
                vue.createElementVNode("text", null, "修改"),
                vue.createElementVNode("image", {
                  src: _imports_1$3,
                  onClick: _cache[19] || (_cache[19] = (...args) => $options.handleHideEditKeyModal && $options.handleHideEditKeyModal(...args))
                })
              ]),
              vue.createElementVNode("view", { class: "modal-container-middle" }, [
                vue.createElementVNode("view", { class: "middle-form-item" }, [
                  vue.createElementVNode("label", null, "车牌号"),
                  vue.createElementVNode(
                    "view",
                    { class: "modal-form-region" },
                    vue.toDisplayString($data.g_edit_info.platenumber),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "middle-form-item" }, [
                  vue.createElementVNode("label", null, "使用人"),
                  vue.createElementVNode("view", { class: "modal-form-region" }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString($data.g_edit_info.personname),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "middle-form-item" }, [
                  vue.createElementVNode("label", null, "手机号"),
                  vue.createElementVNode("view", { class: "modal-form-region" }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString($data.g_edit_info.mobile),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "middle-form-item" }, [
                  vue.createElementVNode("label", null, "开始时间"),
                  vue.createElementVNode("view", { class: "modal-form-region" }, [
                    vue.createElementVNode(
                      "picker",
                      {
                        mode: "date",
                        "data-index": "startDate",
                        onChange: _cache[20] || (_cache[20] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
                      },
                      [
                        vue.createElementVNode("view", { class: "form-item-text" }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString($data.startDate),
                            1
                            /* TEXT */
                          )
                        ])
                      ],
                      32
                      /* NEED_HYDRATION */
                    ),
                    vue.createElementVNode(
                      "picker",
                      {
                        mode: "time",
                        "data-index": "startTime",
                        onChange: _cache[21] || (_cache[21] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
                      },
                      [
                        vue.createElementVNode("view", { class: "form-item-text" }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString($data.startTime),
                            1
                            /* TEXT */
                          )
                        ])
                      ],
                      32
                      /* NEED_HYDRATION */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "middle-form-item" }, [
                  vue.createElementVNode("label", null, "结束时间"),
                  vue.createElementVNode("view", { class: "modal-form-region" }, [
                    vue.createElementVNode(
                      "picker",
                      {
                        mode: "date",
                        "data-index": "endDate",
                        onChange: _cache[22] || (_cache[22] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
                      },
                      [
                        vue.createElementVNode("view", { class: "form-item-text" }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString($data.endDate),
                            1
                            /* TEXT */
                          )
                        ])
                      ],
                      32
                      /* NEED_HYDRATION */
                    ),
                    vue.createElementVNode(
                      "picker",
                      {
                        mode: "time",
                        "data-index": "endTime",
                        onChange: _cache[23] || (_cache[23] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
                      },
                      [
                        vue.createElementVNode("view", { class: "form-item-text" }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString($data.endTime),
                            1
                            /* TEXT */
                          )
                        ])
                      ],
                      32
                      /* NEED_HYDRATION */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "middle-form-item" }, [
                  vue.createElementVNode("label", null, "备注"),
                  vue.createElementVNode("view", { class: "modal-form-region" }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString($data.g_edit_info.bak || "-"),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "modal-container-footer" }, [
                vue.createElementVNode("button", { formType: "submit" }, "确认")
              ])
            ])
          ],
          32
          /* NEED_HYDRATION */
        )
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesPrivateCarKeySharingIndex = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/privateCar/keySharing/index.vue"]]);
  const _sfc_main$5 = {
    components: {
      CustomNavBar
    },
    data() {
      return {
        mp4_url: "",
        title: "",
        danmuList: [],
        duration: 0
      };
    },
    onLoad(options) {
      formatAppLog("log", "at pages/watchVideos/index.vue:45", options.url);
      if (options.url) {
        this.mp4_url = options.url;
        this.title = options.title;
      }
    },
    methods: {
      // 视频元数据加载完成时获取时长
      onVideoLoaded(e2) {
        const videoContext = uni.createVideoContext("myVideo", this);
        setTimeout(() => {
          videoContext.getDuration({
            success: (res) => {
              this.duration = res.duration;
            }
          });
        }, 100);
      },
      // 格式化时长显示
      formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      },
      videoErrorCallback(e2) {
        formatAppLog("log", "at pages/watchVideos/index.vue:73", "视频播放错误:", e2);
      },
      bindVideoEnterPictureInPicture() {
        formatAppLog("log", "at pages/watchVideos/index.vue:77", "进入画中画模式");
      },
      bindVideoLeavePictureInPicture() {
        formatAppLog("log", "at pages/watchVideos/index.vue:81", "退出画中画模式");
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 自定义头部 "),
      vue.createVNode(_component_CustomNavBar, { title: "视频播放" }),
      vue.createElementVNode("view", { class: "content-container" }, [
        vue.createElementVNode("view", { class: "video-wrapper" }, [
          $data.mp4_url ? (vue.openBlock(), vue.createElementBlock("video", {
            key: 0,
            id: "myVideo",
            src: $data.mp4_url,
            onError: _cache[0] || (_cache[0] = (...args) => $options.videoErrorCallback && $options.videoErrorCallback(...args)),
            "danmu-list": $data.danmuList,
            "enable-danmu": "",
            "danmu-btn": "",
            "show-center-play-btn": false,
            "show-play-btn": true,
            controls: "",
            "picture-in-picture-mode": ["push", "pop"],
            onEnterpictureinpicture: _cache[1] || (_cache[1] = (...args) => $options.bindVideoEnterPictureInPicture && $options.bindVideoEnterPictureInPicture(...args)),
            onLeavepictureinpicture: _cache[2] || (_cache[2] = (...args) => $options.bindVideoLeavePictureInPicture && $options.bindVideoLeavePictureInPicture(...args)),
            onLoadedmetadata: _cache[3] || (_cache[3] = (...args) => $options.onVideoLoaded && $options.onVideoLoaded(...args)),
            class: "video-player"
          }, null, 40, ["src", "danmu-list"])) : vue.createCommentVNode("v-if", true),
          $data.duration ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 1,
              class: "video-duration"
            },
            "时长: " + vue.toDisplayString($options.formatDuration($data.duration)),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true)
        ])
      ])
    ]);
  }
  const PagesWatchVideosIndex = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/watchVideos/index.vue"]]);
  const _imports_2 = "/static/public/right.png";
  const _sfc_main$4 = {
    data() {
      return {
        screenInfo: {},
        navBarHeight: uni.getSystemInfoSync().platform == "ios" ? 49 : 44,
        searchBarHeight: 80,
        g_page: 1,
        g_items: [],
        g_triggered: false,
        c_activeTab: 1,
        params: {},
        btnState: "新增",
        id: "",
        c_send_key_show_momal: false,
        g_uesr_details: {},
        user_text: "新增",
        new_role: {},
        roleArray: [],
        g_total: 0,
        s_background_picture_of_the_front_page: ""
      };
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    onLoad(options) {
      this.initList();
    },
    onShow() {
      this.handleRole();
      this.initialScreenInfo();
    },
    components: {
      CustomNavBar
    },
    methods: {
      // 滚动到底部加载更多
      lower(e2) {
        if (!this.loading) {
          this.loading = true;
          this.g_page++;
          setTimeout(() => {
            this.initList();
            this.loading = false;
          }, 1e3);
        }
      },
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          formatAppLog("error", "at pages/roleSeparation/index.vue:170", "[ScreenInfo] 获取屏幕信息失败:", error);
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 人员列表
      async initList() {
        const response = await u_user_childUserList({});
        formatAppLog("log", "at pages/roleSeparation/index.vue:181", response == null ? void 0 : response.content);
        if ((response == null ? void 0 : response.code) == 1e3) {
          this.g_items = response == null ? void 0 : response.content;
          this.g_total = Number((response == null ? void 0 : response.count) || 0).toLocaleString();
        }
      },
      // 修改人员
      handleEdit(info) {
        this.c_send_key_show_momal = true;
        this.g_uesr_details = info;
        this.user_text = "修改";
        this.new_role = {
          id: info == null ? void 0 : info.roleId,
          name: info == null ? void 0 : info.roleName
        };
      },
      // 删除列表数据
      handleDelete(id) {
        const _this = this;
        uni.showModal({
          title: "提示",
          content: "确认删除当前人员吗？",
          success: async (res) => {
            if (res.confirm) {
              const params = {
                id
              };
              u_user_delChildUser(params).then((allRes) => {
                formatAppLog("log", "at pages/roleSeparation/index.vue:211", allRes, "9999");
                if ((allRes == null ? void 0 : allRes.code) == 1e3) {
                  _this.g_triggered = false;
                  _this.g_page = 1;
                  _this.g_items = [];
                  _this.initList();
                  uni.showToast({
                    title: "删除成功"
                  });
                }
              });
            }
          }
        });
      },
      // 新增人员
      handleJumpInfo() {
        this.c_send_key_show_momal = true;
      },
      // 取消弹窗
      handleHideSengKeyModal() {
        this.c_send_key_show_momal = false;
        this.user_text = "新增";
        this.g_uesr_details = {};
        this.new_role = {};
      },
      // 提交用户数据的统一方法
      async submitUserUpdate(params, successCallback = () => {
      }) {
        var _a;
        if (!params.realname && !((_a = this.new_role) == null ? void 0 : _a.id)) {
          uni.showToast({
            title: "用户信息不完整，无法保存"
          });
          return;
        }
        const response = await u_user_addOrUpdateChildUser(params);
        formatAppLog("log", "at pages/roleSeparation/index.vue:253", response);
        if ((response == null ? void 0 : response.code) == 1e3) {
          successCallback(response);
        } else {
          uni.showToast({
            title: response == null ? void 0 : response.msg
          });
        }
      },
      // 表单提交：新增或编辑用户
      handleFormSubmit(evt) {
        var _a, _b;
        const formData = evt.detail.value;
        const params = {
          ...formData,
          id: ((_a = this.g_uesr_details) == null ? void 0 : _a.id) || "",
          roleId: (_b = this.new_role) == null ? void 0 : _b.id
        };
        this.submitUserUpdate(params, () => {
          this.c_send_key_show_momal = false;
          this.g_uesr_details = {};
          this.new_role = {};
          this.initList();
          showToast("操作成功");
        });
      },
      // 选择角色时更新用户角色
      handleBindPickerChange(evt) {
        const roleIndex = evt.detail.value;
        const role = this.roleArray[roleIndex];
        if (!role) {
          showToast("请选择有效的角色");
          return;
        }
        this.new_role = role;
      },
      // 请求角色列表
      async handleRole() {
        const response = await u_user_roleapiList({});
        if ((response == null ? void 0 : response.code) == 1e3) {
          this.roleArray = response == null ? void 0 : response.content;
        }
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "container",
        style: vue.normalizeStyle({ height: `${$options.safeScreenHeight}px` })
      },
      [
        vue.createVNode(_component_CustomNavBar, { title: "人员角色设定" }),
        vue.createElementVNode(
          "view",
          {
            class: "record-container",
            style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
          },
          [
            vue.createElementVNode(
              "scroll-view",
              {
                "scroll-y": "",
                onScrolltolower: _cache[0] || (_cache[0] = (...args) => $options.lower && $options.lower(...args)),
                style: vue.normalizeStyle("height:" + ($options.safeScreenHeight - ($options.navBarHeight + $options.statusBarHeight + 10)) + "px;")
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.g_items, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      class: "content-item"
                    }, [
                      vue.createElementVNode("view", { class: "content-item-head" }, [
                        vue.createElementVNode("view", { class: "head-left" }, [
                          vue.createElementVNode("view", { class: "left-category" }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString(item.realname),
                              1
                              /* TEXT */
                            ),
                            item.acquiescent ? (vue.openBlock(), vue.createElementBlock("text", {
                              key: 0,
                              class: "admin-tag"
                            }, "超级管理员")) : vue.createCommentVNode("v-if", true)
                          ])
                        ]),
                        vue.createElementVNode("view", { class: "head-right" }, [
                          vue.createElementVNode("image", {
                            src: _imports_0$4,
                            onClick: ($event) => $options.handleEdit(item)
                          }, null, 8, ["onClick"]),
                          vue.createElementVNode("image", {
                            src: _imports_1$6,
                            onClick: ($event) => $options.handleDelete(item.id)
                          }, null, 8, ["onClick"])
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "content-item-info" }, [
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass(["info-item", { "long-info-item": item.username && item.username.length > 15 }])
                          },
                          [
                            vue.createElementVNode("label", null, "账号 ："),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString(item.username || "-"),
                              1
                              /* TEXT */
                            )
                          ],
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass(["info-item", { "long-info-item": item.roleName && item.roleName.length > 15 }]),
                            style: { "display": "flex", "flex-direction": "row" }
                          },
                          [
                            vue.createElementVNode("label", null, "角色 ："),
                            item.roleName ? (vue.openBlock(), vue.createElementBlock(
                              "text",
                              { key: 0 },
                              vue.toDisplayString(item.roleName),
                              1
                              /* TEXT */
                            )) : vue.createCommentVNode("v-if", true)
                          ],
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass(["info-item", { "long-info-item": item.mobile && item.mobile.length > 15 }])
                          },
                          [
                            vue.createElementVNode("label", null, "手机号 ："),
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString(item.mobile || "-"),
                              1
                              /* TEXT */
                            )
                          ],
                          2
                          /* CLASS */
                        )
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                $data.g_items.length < 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "no-data"
                }, " 无数据 ")) : vue.createCommentVNode("v-if", true)
              ],
              36
              /* STYLE, NEED_HYDRATION */
            ),
            vue.createElementVNode("view", {
              class: "levitation-button",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.handleJumpInfo && $options.handleJumpInfo(...args))
            }, [
              vue.createElementVNode("text", null, "新增人员")
            ])
          ],
          4
          /* STYLE */
        ),
        vue.createCommentVNode(" 新增人员弹窗 "),
        $data.c_send_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "modal-mask",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.handleHideSengKeyModal && $options.handleHideSengKeyModal(...args))
        })) : vue.createCommentVNode("v-if", true),
        $data.c_send_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "modal-base-map"
        }, [
          vue.createElementVNode(
            "form",
            {
              onSubmit: _cache[5] || (_cache[5] = (...args) => $options.handleFormSubmit && $options.handleFormSubmit(...args))
            },
            [
              vue.createElementVNode("view", { class: "modal-container" }, [
                vue.createElementVNode("view", { class: "modal-container-head" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString($data.user_text) + "人员",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("image", {
                    src: _imports_2,
                    onClick: _cache[3] || (_cache[3] = (...args) => $options.handleHideSengKeyModal && $options.handleHideSengKeyModal(...args))
                  })
                ]),
                vue.createElementVNode("view", { class: "modal-container-middle" }, [
                  vue.createElementVNode("view", { class: "middle-form-item" }, [
                    vue.createElementVNode("label", null, "姓名"),
                    vue.createElementVNode("view", { class: "modal-form-region" }, [
                      vue.createElementVNode("input", {
                        placeholder: "请输入姓名",
                        value: $data.g_uesr_details.realname,
                        name: "realname",
                        style: { "text-align": "right", "font-size": "28rpx" }
                      }, null, 8, ["value"])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "middle-form-item" }, [
                    vue.createElementVNode("label", null, "手机号"),
                    vue.createElementVNode("view", { class: "modal-form-region" }, [
                      vue.createElementVNode("input", {
                        placeholder: "请输入手机号",
                        value: $data.g_uesr_details.mobile,
                        name: "mobile",
                        style: { "text-align": "right", "font-size": "28rpx" }
                      }, null, 8, ["value"])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "middle-form-item" }, [
                    vue.createElementVNode("label", null, "角色"),
                    vue.createElementVNode("view", { class: "modal-form-region" }, [
                      vue.createElementVNode("picker", {
                        mode: "selector",
                        range: $data.roleArray,
                        "range-key": "name",
                        onChange: _cache[4] || (_cache[4] = (...args) => $options.handleBindPickerChange && $options.handleBindPickerChange(...args))
                      }, [
                        vue.createElementVNode(
                          "view",
                          {
                            class: "picker",
                            style: { "font-size": "28rpx", "color": "#575656" }
                          },
                          vue.toDisplayString($data.new_role.name ? $data.new_role.name : "请选择角色"),
                          1
                          /* TEXT */
                        )
                      ], 40, ["range"])
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "modal-container-footer" }, [
                  vue.createElementVNode("button", { "form-type": "submit" }, "确认")
                ])
              ])
            ],
            32
            /* NEED_HYDRATION */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ],
      4
      /* STYLE */
    );
  }
  const PagesRoleSeparationIndex = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-78aff5be"], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/roleSeparation/index.vue"]]);
  const _imports_0 = "/static/assets/images/home/_edit.png";
  const _imports_1 = "/static/assets/images/home/_delete.png";
  const _sfc_main$3 = {
    components: {
      CustomNavBar
    },
    data() {
      return {
        // 导航栏高度，默认值
        s_background_tabs_1: "",
        //tabs背景
        s_background_tabs_2: "",
        //tabs背景
        s_background_tabs_active_1: "",
        //tabs背景
        s_background_tabs_active_2: "",
        //tabs背景
        searchBarHeight: 80,
        // 总导航高度 = 状态栏高度 + 导航栏高度
        g_page: 1,
        //列表页码
        g_items: [],
        //列表数据
        g_triggered: false,
        //下拉刷新状态
        c_tabs: [
          {
            name: "账号列表",
            value: "1"
          },
          {
            name: "新增账号",
            value: "2"
          }
        ],
        //tabs切换签
        c_activeTab: 2,
        // 默认选中的Tab索引
        params: {
          name: "",
          bak: ""
        },
        //新增管控数据部分字段
        btnState: "新增",
        id: "",
        //修改标志
        tree: [],
        g_total: "",
        s_background_picture_of_the_front_page: ""
      };
    },
    onLoad(options) {
      if (options.status) {
        this.setData(
          {
            c_activeTab: 2
          },
          () => {
            this.inittMenuTree();
          }
        );
      }
      this.initList();
    },
    onShow() {
      this.initialiImageBaseConversion();
      this.inittMenuTree();
    },
    methods: {
      // 切换复选框状态
      handleCheck(e2) {
        const id = e2.currentTarget.dataset.id;
        const tree = this.tree;
        this.toggleCheck(tree, id);
        this.updateParentStates(tree);
        this.setData({
          tree: [...tree]
        });
      },
      // 切换展开状态
      toggleExpand(e2) {
        const id = e2.currentTarget.dataset.id;
        const tree = this.tree;
        this.toggleNodeExpand(tree, id);
        this.setData({
          tree: [...tree]
        });
      },
      // 递归切换节点展开状态
      toggleNodeExpand(nodes, targetId) {
        nodes.forEach((node) => {
          if (node.id === targetId) {
            node.isExpanded = !node.isExpanded;
          } else if (node.children) {
            this.toggleNodeExpand(node.children, targetId);
          }
        });
      },
      // 递归切换选中状态
      toggleCheck(nodes, targetId) {
        nodes.forEach((node) => {
          if (node.id === targetId) {
            node.checked = !node.checked;
            this.toggleChildren(node.children, node.checked);
          } else if (node.children) {
            this.toggleCheck(node.children, targetId);
          }
        });
      },
      // 切换子节点状态
      toggleChildren(children, checked) {
        if (!children) {
          return;
        }
        children.forEach((child) => {
          child.checked = checked;
          this.toggleChildren(child.children, checked);
        });
      },
      // 更新所有父节点状态
      updateParentStates(nodes) {
        nodes.forEach((node) => {
          if (node.children && node.children.length) {
            this.checkParentState(node);
            this.updateParentStates(node.children);
          }
        });
      },
      // 计算父节点状态
      checkParentState(node) {
        const children = node.children;
        const allChecked = children.every((child) => child.checked);
        const someChecked = children.some((child) => child.checked || child.indeterminate);
        node.checked = allChecked;
        node.indeterminate = !allChecked && someChecked;
      },
      // 全屏背景图
      initialiImageBaseConversion() {
        const _this = this;
        const imageMap = [
          {
            path: "/static/assets/images/home/car-bg.png",
            key: "s_background_picture_of_the_front_page"
          },
          {
            path: "/static/assets/images/home/1-1.png",
            key: "s_background_tabs_1"
          },
          {
            path: "/static/assets/images/home/2-1.png",
            key: "s_background_tabs_active_1"
          },
          {
            path: "/static/assets/images/home/1-2.png",
            key: "s_background_tabs_2"
          },
          {
            path: "/static/assets/images/home/2-2.png",
            key: "s_background_tabs_active_2"
          }
        ];
        const promises = imageMap.map(
          (item) => new Promise((resolve, reject) => {
            uni.getFileSystemManager().readFile({
              filePath: item.path,
              encoding: "base64",
              success: (res) => {
                resolve({
                  [item.key]: `data:image/png;base64,${res.data}`
                });
              }
            });
          })
        );
        Promise.all(promises).then((results) => {
          const dataToUpdate = results.reduce(
            (acc, curr) => ({
              ...acc,
              ...curr
            }),
            {}
          );
          _this.setData(dataToUpdate);
        });
      },
      // 管控列表数据
      initList() {
        showLoading();
        const param = {
          // [u_roleapiList.page]: this.data.g_page,
        };
        byPost(
          `${getApp().globalData.data.k1swUrl}${u_roleapiList.URL}`,
          param,
          (response) => {
            if (response.data.code == 1e3) {
              if (this.g_page > 1 && response.data.content.length === 0) {
                showToast(`已加载全部数据：共${this.g_items.length}条`);
              }
              this.setData(
                {
                  g_items: this.g_items.concat(response.data.content),
                  g_total: Number(response.data.count || 0).toLocaleString()
                },
                () => {
                  hideLoading();
                }
              );
            }
          },
          (error) => {
            hideLoading();
          }
        );
      },
      // 触底请求
      handleLower() {
      },
      // 下拉刷新
      handleRefresh() {
        this.setData(
          {
            g_triggered: false,
            g_page: 1,
            g_items: []
          },
          () => {
            this.initList();
          }
        );
      },
      // 新增账号字段输入回调
      handleBindinput(evt) {
        const {
          params
        } = this;
        params[evt.currentTarget.dataset.item] = evt.detail.value;
        this.setData({
          params: {
            ...params
          }
        });
      },
      //  处理提交的权限树数据
      getCheckedIds(treeData) {
        const checkedIds = [];
        function traverse(nodes) {
          nodes.forEach((node) => {
            if (node.checked === true) {
              checkedIds.push(node.id);
            }
            if (node.children && node.children.length > 0) {
              traverse(node.children);
            }
          });
        }
        traverse(treeData);
        return checkedIds;
      },
      // 设置权限
      handleSetMenuTree(evt) {
        const checkedIds = this.getCheckedIds(this.tree).toString();
        const params = {
          [u_setMenuTree.roleId]: evt,
          [u_setMenuTree.menuIds]: checkedIds
        };
        byPost(
          `${getApp().globalData.data.k1swUrl}${u_setMenuTree.URL}`,
          params,
          (response) => {
            if (response.data.code == 1e3)
              ;
          },
          (error) => {
          }
        );
      },
      //提交内容
      handleSubmit() {
        const {
          params,
          id
        } = this;
        const requiredFields = [{
          key: "name",
          message: "请输入角色名称"
        }];
        for (const {
          key,
          message
        } of requiredFields) {
          if (!(params == null ? void 0 : params[key])) {
            showToast(message);
            return;
          }
        }
        showLoading();
        byPost(
          `${getApp().globalData.data.k1swUrl}${u_roleapiaddOrUpdate.URL}`,
          {
            ...params,
            id
          },
          (response) => {
            var _a, _b;
            hideLoading();
            if (((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.code) != 1e3) {
              showToast((_b = response == null ? void 0 : response.data) == null ? void 0 : _b.msg);
              return;
            }
            showToast("添加成功");
            this.setData(
              {
                c_activeTab: 1,
                params: {},
                btnState: "新增",
                g_triggered: false,
                g_page: 1,
                g_items: []
              },
              () => {
                var _a2, _b2;
                this.initList();
                this.handleSetMenuTree((_b2 = (_a2 = response == null ? void 0 : response.data) == null ? void 0 : _a2.content) == null ? void 0 : _b2.id);
              }
            );
          },
          (error) => {
            hideLoading();
            showToast("提交失败，请稍后重试");
          }
        );
      },
      // 修改管控
      handleEdit(evt) {
        const info = evt.currentTarget.dataset.item;
        formatAppLog("log", "at pages/Jurisdiction/index.vue:604", info);
        this.setData(
          {
            ...info,
            c_activeTab: 2,
            btnState: "修改",
            id: info == null ? void 0 : info.id,
            params: {
              name: info.name,
              bak: info.bak
            }
          },
          () => {
            this.inittMenuTree();
          }
        );
      },
      // 设置
      handleSetUp(evt) {
        formatAppLog("log", "at pages/Jurisdiction/index.vue:623", evt.currentTarget.dataset);
        const info = evt.currentTarget.dataset.item;
        uni.navigateTo({
          url: `/pages/system/roleSeparation/index?type=${info == null ? void 0 : info.id}&name=${info.name}`
        });
      },
      // 切换tabs标签
      handleSwitchTab(e2) {
        const flag = e2._relatedInfo.anchorTargetText;
        if (flag == "角色列表") {
          this.setData({
            c_activeTab: 1,
            btnState: "新增",
            params: {},
            id: ""
          });
        }
        if (flag == "新增角色" || flag == "修改角色") {
          if (this.c_activeTab != 2) {
            this.setData(
              {
                c_activeTab: 2
              },
              () => {
                this.inittMenuTree();
              }
            );
          }
        }
      },
      // 删除列表数据
      handleDelete(evt) {
        const _this = this;
        const id = evt == null ? void 0 : evt.currentTarget.dataset.id;
        const params = {
          [u_roleapidel.id]: id
        };
        byGet(`${getApp().globalData.data.k1swUrl}${u_roleapidel.URL}`, params).then((allRes) => {
          var _a;
          if (((_a = allRes == null ? void 0 : allRes.data) == null ? void 0 : _a.code) == 1e3) {
            _this.setData(
              {
                g_triggered: false,
                g_page: 1,
                g_items: []
              },
              () => {
                _this.initList();
              }
            );
          }
        });
      },
      // 处理权限数据
      convertMenuData(originalData) {
        const convertNode = (node) => {
          const converted = {
            id: node.id,
            name: node.name,
            checked: node == null ? void 0 : node.checked,
            indeterminate: false,
            isExpanded: true,
            children: []
          };
          if (node.children && node.children.length > 0) {
            node.children.forEach((child) => {
              const convertedChild = convertNode(child);
              if (convertedChild) {
                converted.children.push(convertedChild);
              }
            });
          }
          return converted;
        };
        const result = [{
          id: 1,
          name: "全部",
          checked: false,
          indeterminate: false,
          isExpanded: true,
          children: []
        }];
        originalData.forEach((item) => {
          if (item.parentid === -1 && item.isdelete === 0) {
            const converted = convertNode(item);
            if (converted) {
              result[0].children.push(converted);
            }
          }
        });
        return result;
      },
      // 获取权限树数据
      inittMenuTree() {
        byGet(getApp().globalData.data.k1swUrl + u_getMenuTree.URL, {
          roleId: this.id || ""
        }).then((response) => {
          if (response.statusCode == 200) {
            const list = response.data.content;
            const convertedData = this.convertMenuData(list);
            this.setData({
              tree: convertedData
            });
          } else {
            showToast("请求失败，请稍后再试");
            hideLoading();
          }
        });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "container",
        style: vue.normalizeStyle("background-image: url(" + $data.s_background_picture_of_the_front_page + ");height: " + _ctx.c_screen_height + "px;")
      },
      [
        vue.createVNode(_component_CustomNavBar, { title: "角色列表与权限绑定" }),
        vue.createCommentVNode(" index.wxml "),
        vue.createElementVNode(
          "view",
          {
            class: "record-container",
            style: vue.normalizeStyle("height: " + (_ctx.c_screen_height - (_ctx.navBarHeight + _ctx.statusBarHeight)) + "px;margin-top: " + (_ctx.navBarHeight + _ctx.statusBarHeight) + "px;")
          },
          [
            vue.createCommentVNode(" 切换部分 "),
            vue.createElementVNode("view", {
              class: "record-tabs",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.handleSwitchTab && $options.handleSwitchTab(...args))
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: "record-tabs-item",
                  style: vue.normalizeStyle("background-image: url(" + ($data.c_activeTab == 1 ? $data.s_background_tabs_active_1 : $data.s_background_tabs_1) + ");")
                },
                " 角色列表",
                4
                /* STYLE */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: "record-tabs-item",
                  style: vue.normalizeStyle("background-image: url(" + ($data.c_activeTab == 2 ? $data.s_background_tabs_2 : $data.s_background_tabs_active_2) + ");")
                },
                vue.toDisplayString($data.btnState) + "角色 ",
                5
                /* TEXT, STYLE */
              )
            ]),
            vue.createCommentVNode(" 详情区域部分 "),
            $data.c_activeTab == 1 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
              key: 0,
              "scroll-y": "",
              style: vue.normalizeStyle("height:" + (_ctx.c_screen_height - (_ctx.navBarHeight + _ctx.statusBarHeight + 10 + 50)) + "px;"),
              onScrolltolower: _cache[3] || (_cache[3] = (...args) => $options.handleLower && $options.handleLower(...args)),
              onRefresherrefresh: _cache[4] || (_cache[4] = (...args) => $options.handleRefresh && $options.handleRefresh(...args)),
              "refresher-enabled": true,
              "refresher-triggered": $data.g_triggered
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.g_items, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "content-item"
                  }, [
                    vue.createElementVNode("view", { class: "content-item-head" }, [
                      vue.createElementVNode("view", { class: "head-left" }, [
                        vue.createElementVNode("view", { class: "left-category" }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item.name),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "head-right" }, [
                        vue.createElementVNode("image", {
                          src: _imports_0,
                          "data-item": item,
                          onClick: _cache[1] || (_cache[1] = (...args) => $options.handleEdit && $options.handleEdit(...args))
                        }, null, 8, ["data-item"]),
                        vue.createCommentVNode(' <image src="/assets/images/home/SetUp.png" data-item="{{item}}" bindtap="handleSetUp" /> '),
                        vue.createElementVNode("image", {
                          src: _imports_1,
                          "data-id": item.id,
                          onClick: _cache[2] || (_cache[2] = (...args) => $options.handleDelete && $options.handleDelete(...args))
                        }, null, 8, ["data-id"])
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "content-item-info" }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass("info-item  " + (item.bak.length > 15 ? "long-info-item" : ""))
                        },
                        [
                          vue.createElementVNode("label", null, "说明 ："),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item.bak || "-"),
                            1
                            /* TEXT */
                          )
                        ],
                        2
                        /* CLASS */
                      )
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ], 44, ["refresher-triggered"])) : vue.createCommentVNode("v-if", true),
            $data.c_activeTab == 2 ? (vue.openBlock(), vue.createElementBlock(
              "scroll-view",
              {
                key: 1,
                "scroll-y": "",
                style: vue.normalizeStyle("height:" + (_ctx.c_screen_height - (_ctx.navBarHeight + _ctx.statusBarHeight + 10 + 50)) + "px;")
              },
              [
                vue.createElementVNode("view", { class: "long-range-control-car" }, [
                  vue.createElementVNode("template", null, [
                    vue.createElementVNode("view", { class: "card-head" }, [
                      vue.createElementVNode("text", null, "基础信息")
                    ]),
                    vue.createCommentVNode(" 标题 "),
                    vue.createElementVNode("view", { class: "long-range-control-car-subitem" }, [
                      vue.createElementVNode("label", null, [
                        vue.createTextVNode(" 角色名称 "),
                        vue.createElementVNode("text", null, "*")
                      ]),
                      vue.createElementVNode("view", { class: "card-info-item-input" }, [
                        vue.createElementVNode("input", {
                          placeholder: "请输入角色名称",
                          value: $data.params.name,
                          "data-item": "name",
                          onInput: _cache[5] || (_cache[5] = (...args) => $options.handleBindinput && $options.handleBindinput(...args))
                        }, null, 40, ["value"])
                      ])
                    ]),
                    vue.createCommentVNode(" 密码 "),
                    vue.createElementVNode("view", { class: "long-range-control-car-subitem" }, [
                      vue.createElementVNode("label", null, "说明"),
                      vue.createElementVNode("view", { class: "card-info-item-input" }, [
                        vue.createElementVNode("input", {
                          placeholder: "请输入说明",
                          value: $data.params.bak,
                          "data-item": "bak",
                          onInput: _cache[6] || (_cache[6] = (...args) => $options.handleBindinput && $options.handleBindinput(...args))
                        }, null, 40, ["value"])
                      ])
                    ])
                  ]),
                  vue.createElementVNode("view", { style: { "height": "30rpx" } }),
                  vue.createElementVNode("template", null, [
                    vue.createElementVNode("view", { class: "card-head" }, [
                      vue.createElementVNode("text", null, "权限设置")
                    ]),
                    vue.createElementVNode("view", { class: "long-range-control-car-subitem" }, [
                      vue.createElementVNode("view", { class: "tree-container" }, [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList($data.tree, (item, index) => {
                            return vue.openBlock(), vue.createElementBlock("view", {
                              key: index,
                              class: "node"
                            }, [
                              vue.createCommentVNode(" 一级节点 "),
                              vue.createElementVNode("view", { class: "node-header" }, [
                                item.children.length ? (vue.openBlock(), vue.createElementBlock("view", {
                                  key: 0,
                                  class: vue.normalizeClass("arrow " + (item.isExpanded ? "expanded" : "")),
                                  onClick: _cache[7] || (_cache[7] = (...args) => $options.toggleExpand && $options.toggleExpand(...args)),
                                  "data-id": item.id
                                }, " ▶ ", 10, ["data-id"])) : vue.createCommentVNode("v-if", true),
                                vue.createElementVNode("view", {
                                  class: vue.normalizeClass("checkbox " + (item.checked ? "checked" : "") + " " + (item.indeterminate ? "indeterminate" : "")),
                                  "data-id": item.id,
                                  onClick: _cache[8] || (_cache[8] = (...args) => $options.handleCheck && $options.handleCheck(...args))
                                }, [
                                  item.checked ? (vue.openBlock(), vue.createElementBlock("view", {
                                    key: 0,
                                    class: "checkmark"
                                  }, "✓")) : vue.createCommentVNode("v-if", true),
                                  item.indeterminate ? (vue.openBlock(), vue.createElementBlock("view", {
                                    key: 1,
                                    class: "indeterminate-line"
                                  })) : vue.createCommentVNode("v-if", true)
                                ], 10, ["data-id"]),
                                vue.createElementVNode(
                                  "text",
                                  { class: "node-name" },
                                  vue.toDisplayString(item.name),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              vue.createCommentVNode(" 二级节点 "),
                              item.children.length && item.isExpanded ? (vue.openBlock(), vue.createElementBlock("view", {
                                key: 0,
                                class: "children"
                              }, [
                                (vue.openBlock(true), vue.createElementBlock(
                                  vue.Fragment,
                                  null,
                                  vue.renderList(item.children, (item2, index1) => {
                                    return vue.openBlock(), vue.createElementBlock("view", {
                                      key: index1,
                                      class: "child-node"
                                    }, [
                                      vue.createElementVNode("view", { class: "node-header" }, [
                                        item2.children.length ? (vue.openBlock(), vue.createElementBlock("view", {
                                          key: 0,
                                          class: vue.normalizeClass("arrow " + (item2.isExpanded ? "expanded" : "")),
                                          onClick: _cache[9] || (_cache[9] = (...args) => $options.toggleExpand && $options.toggleExpand(...args)),
                                          "data-id": item2.id
                                        }, " ▶ ", 10, ["data-id"])) : vue.createCommentVNode("v-if", true),
                                        vue.createElementVNode("view", {
                                          class: vue.normalizeClass("checkbox " + (item2.checked ? "checked" : "") + " " + (item2.indeterminate ? "indeterminate" : "")),
                                          "data-id": item2.id,
                                          onClick: _cache[10] || (_cache[10] = (...args) => $options.handleCheck && $options.handleCheck(...args))
                                        }, [
                                          item2.checked ? (vue.openBlock(), vue.createElementBlock("view", {
                                            key: 0,
                                            class: "checkmark"
                                          }, "✓")) : vue.createCommentVNode("v-if", true),
                                          item2.indeterminate ? (vue.openBlock(), vue.createElementBlock("view", {
                                            key: 1,
                                            class: "indeterminate-line"
                                          })) : vue.createCommentVNode("v-if", true)
                                        ], 10, ["data-id"]),
                                        vue.createElementVNode(
                                          "text",
                                          { class: "node-name" },
                                          vue.toDisplayString(item2.name),
                                          1
                                          /* TEXT */
                                        )
                                      ]),
                                      vue.createCommentVNode(" 三级节点 "),
                                      item2.children.length && item2.isExpanded ? (vue.openBlock(), vue.createElementBlock("view", {
                                        key: 0,
                                        class: "children"
                                      }, [
                                        (vue.openBlock(true), vue.createElementBlock(
                                          vue.Fragment,
                                          null,
                                          vue.renderList(item2.children, (item3, index2) => {
                                            return vue.openBlock(), vue.createElementBlock("view", {
                                              key: index2,
                                              class: "child-node"
                                            }, [
                                              vue.createElementVNode("view", { class: "node-header" }, [
                                                item3.children.length ? (vue.openBlock(), vue.createElementBlock("view", {
                                                  key: 0,
                                                  class: vue.normalizeClass("arrow " + (item3.isExpanded ? "expanded" : "")),
                                                  onClick: _cache[11] || (_cache[11] = (...args) => $options.toggleExpand && $options.toggleExpand(...args)),
                                                  "data-id": item3.id
                                                }, " ▶ ", 10, ["data-id"])) : vue.createCommentVNode("v-if", true),
                                                vue.createElementVNode("view", {
                                                  class: vue.normalizeClass(
                                                    "checkbox " + (item3.checked ? "checked" : "") + " " + (item3.indeterminate ? "indeterminate" : "")
                                                  ),
                                                  "data-id": item3.id,
                                                  onClick: _cache[12] || (_cache[12] = (...args) => $options.handleCheck && $options.handleCheck(...args))
                                                }, [
                                                  item3.checked ? (vue.openBlock(), vue.createElementBlock("view", {
                                                    key: 0,
                                                    class: "checkmark"
                                                  }, " ✓")) : vue.createCommentVNode("v-if", true),
                                                  item3.indeterminate ? (vue.openBlock(), vue.createElementBlock("view", {
                                                    key: 1,
                                                    class: "indeterminate-line"
                                                  })) : vue.createCommentVNode("v-if", true)
                                                ], 10, ["data-id"]),
                                                vue.createElementVNode(
                                                  "text",
                                                  { class: "node-name" },
                                                  vue.toDisplayString(item3.name),
                                                  1
                                                  /* TEXT */
                                                )
                                              ]),
                                              vue.createCommentVNode(" 四级节点 "),
                                              item3.children.length && item3.isExpanded ? (vue.openBlock(), vue.createElementBlock("view", {
                                                key: 0,
                                                class: "children"
                                              }, [
                                                (vue.openBlock(true), vue.createElementBlock(
                                                  vue.Fragment,
                                                  null,
                                                  vue.renderList(item3.children, (item4, index3) => {
                                                    return vue.openBlock(), vue.createElementBlock("view", {
                                                      key: index3,
                                                      class: "child-node"
                                                    }, [
                                                      vue.createElementVNode("view", { class: "node-header" }, [
                                                        item4.children.length ? (vue.openBlock(), vue.createElementBlock("view", {
                                                          key: 0,
                                                          class: vue.normalizeClass("arrow " + (item4.isExpanded ? "expanded" : "")),
                                                          onClick: _cache[13] || (_cache[13] = (...args) => $options.toggleExpand && $options.toggleExpand(...args)),
                                                          "data-id": item4.id
                                                        }, " ▶ ", 10, ["data-id"])) : vue.createCommentVNode("v-if", true),
                                                        vue.createElementVNode("view", {
                                                          class: vue.normalizeClass(
                                                            "checkbox " + (item4.checked ? "checked" : "") + " " + (item4.indeterminate ? "indeterminate" : "")
                                                          ),
                                                          "data-id": item4.id,
                                                          onClick: _cache[14] || (_cache[14] = (...args) => $options.handleCheck && $options.handleCheck(...args))
                                                        }, [
                                                          item4.checked ? (vue.openBlock(), vue.createElementBlock("view", {
                                                            key: 0,
                                                            class: "checkmark"
                                                          }, "✓")) : vue.createCommentVNode("v-if", true),
                                                          item4.indeterminate ? (vue.openBlock(), vue.createElementBlock("view", {
                                                            key: 1,
                                                            class: "indeterminate-line"
                                                          })) : vue.createCommentVNode("v-if", true)
                                                        ], 10, ["data-id"]),
                                                        vue.createElementVNode(
                                                          "text",
                                                          { class: "node-name" },
                                                          vue.toDisplayString(item4.name),
                                                          1
                                                          /* TEXT */
                                                        )
                                                      ]),
                                                      vue.createCommentVNode(" 五级节点 "),
                                                      item4.children.length && item4.isExpanded ? (vue.openBlock(), vue.createElementBlock("view", {
                                                        key: 0,
                                                        class: "children"
                                                      }, [
                                                        (vue.openBlock(true), vue.createElementBlock(
                                                          vue.Fragment,
                                                          null,
                                                          vue.renderList(item4.children, (item5, index4) => {
                                                            return vue.openBlock(), vue.createElementBlock("view", {
                                                              key: index4,
                                                              class: "child-node"
                                                            }, [
                                                              vue.createElementVNode("view", { class: "node-header" }, [
                                                                vue.createElementVNode("view", {
                                                                  class: vue.normalizeClass("checkbox " + (item5.checked ? "checked" : "")),
                                                                  "data-id": item5.id,
                                                                  onClick: _cache[15] || (_cache[15] = (...args) => $options.handleCheck && $options.handleCheck(...args))
                                                                }, [
                                                                  item5.checked ? (vue.openBlock(), vue.createElementBlock("view", {
                                                                    key: 0,
                                                                    class: "checkmark"
                                                                  }, " ✓")) : vue.createCommentVNode("v-if", true)
                                                                ], 10, ["data-id"]),
                                                                vue.createElementVNode(
                                                                  "text",
                                                                  { class: "node-name" },
                                                                  vue.toDisplayString(item5.name),
                                                                  1
                                                                  /* TEXT */
                                                                )
                                                              ])
                                                            ]);
                                                          }),
                                                          128
                                                          /* KEYED_FRAGMENT */
                                                        ))
                                                      ])) : vue.createCommentVNode("v-if", true)
                                                    ]);
                                                  }),
                                                  128
                                                  /* KEYED_FRAGMENT */
                                                ))
                                              ])) : vue.createCommentVNode("v-if", true)
                                            ]);
                                          }),
                                          128
                                          /* KEYED_FRAGMENT */
                                        ))
                                      ])) : vue.createCommentVNode("v-if", true)
                                    ]);
                                  }),
                                  128
                                  /* KEYED_FRAGMENT */
                                ))
                              ])) : vue.createCommentVNode("v-if", true)
                            ]);
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "card-footer" }, [
                    vue.createElementVNode(
                      "view",
                      {
                        onClick: _cache[16] || (_cache[16] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
                      },
                      "确认" + vue.toDisplayString($data.btnState),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ],
              4
              /* STYLE */
            )) : vue.createCommentVNode("v-if", true)
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesJurisdictionIndex = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/Jurisdiction/index.vue"]]);
  const filter_sort = [
    {
      value: "asc",
      name: "升序"
    },
    {
      value: "desc",
      name: "降序"
    }
  ];
  const filter_type = [
    {
      value: "",
      name: "全部"
    },
    {
      value: 1,
      name: "图片"
    },
    {
      value: 2,
      name: "视频"
    },
    {
      value: 3,
      name: "文档"
    },
    {
      value: 4,
      name: "其他"
    }
  ];
  const _sfc_main$2 = {
    data() {
      return {
        screenInfo: {},
        navBarHeight: uni.getSystemInfoSync().platform == "ios" ? 49 : 44,
        // 导航栏高度，默认值
        searchBarHeight: 80,
        // 搜索框高度，默认值
        g_page: 1,
        //列表页码
        g_items: [],
        //列表数据
        g_param: {},
        //筛选字段
        g_triggered: false,
        //下拉刷新状态
        pageType: 0,
        filter_industry: [],
        filter_aggregate: [
          {
            id: 1,
            name: "默认排序",
            btnRender: false,
            params: "a",
            filter_work_status: filter_sort
          },
          {
            id: 2,
            name: "所有类型",
            btnRender: false,
            params: "a",
            filter_work_status: filter_type
          },
          {
            id: 3,
            name: "所有行业",
            btnRender: false,
            params: "a",
            filter_work_status: []
          }
        ],
        s_background_picture_of_the_front_page: "",
        g_total: 0
      };
    },
    components: {
      CustomNavBar
    },
    computed: {
      // 状态栏高度
      statusBarHeight() {
        return this.screenInfo.statusBarHeight || 0;
      },
      // 导航栏高度
      navBarHeight() {
        return this.screenInfo.platform === "ios" ? 49 : 44;
      },
      // 导航栏总高度（状态栏+导航栏）
      navbarTotalHeight() {
        return this.statusBarHeight + this.navBarHeight;
      },
      // 安全区域高度
      safeScreenHeight() {
        return this.screenInfo.screenHeight || 667;
      }
    },
    onLoad(options) {
      this.pageType = (options == null ? void 0 : options.type) || 0;
      this.$nextTick(() => {
        this.initList(options == null ? void 0 : options.type);
      });
    },
    onShow() {
      this.initialiImageBaseConversion();
      this.initialQuickEntry();
      this.initialScreenInfo();
    },
    onReady() {
    },
    methods: {
      // 获取屏幕信息
      async initialScreenInfo() {
        try {
          this.screenInfo = await info_screen();
        } catch (error) {
          formatAppLog("error", "at pages/useGuide/index.vue:201", "[ScreenInfo] 获取屏幕信息失败:", error);
          uni.showToast({
            title: "设备信息获取失败",
            icon: "none"
          });
        }
      },
      // 查询行业数据
      async initialQuickEntry() {
        const params = {
          terminalId: -1
        };
        await u_industryList(params).then((response) => {
          formatAppLog("log", "at pages/useGuide/index.vue:215", response);
          const content = (response == null ? void 0 : response.content) || [];
          const info = content.map(({
            id,
            name
          }) => ({
            value: id,
            name
          }));
          const infoWithAll = [{
            value: "",
            name: "全部"
          }, ...info];
          const {
            filter_aggregate
          } = this;
          if (Array.isArray(filter_aggregate) && filter_aggregate[2]) {
            const updatedFilterAggregate = [...filter_aggregate];
            updatedFilterAggregate[2] = {
              ...updatedFilterAggregate[2],
              filter_work_status: infoWithAll
            };
            this.filter_aggregate = updatedFilterAggregate;
            this.filter_industry = infoWithAll;
          }
        });
      },
      // 全屏背景图
      initialiImageBaseConversion() {
        const imageMap = [{
          path: "/static/images/home/car-bg.png",
          key: "s_background_picture_of_the_front_page"
        }];
        const promises = imageMap.map(
          (item) => new Promise((resolve, reject) => {
            resolve({
              [item.key]: item.path
            });
          })
        );
        Promise.all(promises).then((results) => {
          const dataToUpdate = results.reduce((acc, curr) => ({
            ...acc,
            ...curr
          }), {});
          Object.keys(dataToUpdate).forEach((key) => {
            this[key] = dataToUpdate[key];
          });
        });
      },
      bindPickerChange(evt) {
        var _a, _b, _c;
        const flag = (_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.id;
        const key = (_c = evt == null ? void 0 : evt.detail) == null ? void 0 : _c.key;
        const {
          g_param,
          filter_aggregate,
          filter_industry
        } = this;
        const config = {
          "1": {
            targetKey: "sort",
            sourceList: filter_sort
          },
          "2": {
            targetKey: "fileType",
            sourceList: filter_type
          },
          "3": {
            targetKey: "industry",
            sourceList: filter_industry
          }
        };
        const setting = config[flag];
        if (!setting)
          return;
        const {
          targetKey,
          sourceList
        } = setting;
        const selectedItem = sourceList == null ? void 0 : sourceList[key];
        if (!selectedItem)
          return;
        const newGParam = {
          ...g_param,
          [targetKey]: selectedItem.value
        };
        const newFilterAggregate = [...filter_aggregate];
        const index = newFilterAggregate.findIndex((item) => item.id == flag);
        if (index !== -1) {
          newFilterAggregate[index] = {
            ...newFilterAggregate[index],
            name: selectedItem.name
            // 👈 关键：复用 name 字段
          };
        }
        this.g_param = newGParam;
        this.filter_aggregate = newFilterAggregate;
        this.g_page = 1;
        this.g_items = [];
        this.$nextTick(() => {
          this.initList();
        });
      },
      handleBlur(evt) {
        var _a;
        const inputValue = ((_a = evt == null ? void 0 : evt.detail) == null ? void 0 : _a.value) ?? "";
        const {
          g_param
        } = this;
        this.g_param = {
          ...g_param,
          name: inputValue
        };
        this.g_page = 1;
        this.g_items = [];
        this.$nextTick(() => {
          this.initList();
        });
      },
      // 列表数据
      async initList(evt) {
        formatAppLog("log", "at pages/useGuide/index.vue:357", this.g_param);
        const param = {
          page: this.g_page,
          ...this.g_param
        };
        const handle = evt ? u_promotionalApiWxBooklist : u_promotionalApi;
        await handle(param).then((response) => {
          formatAppLog("log", "at pages/useGuide/index.vue:364", response);
          if (response.code == 1e3) {
            if (this.g_page > 1 && response.content.length === 0) {
              uni.showToast({
                title: `已加载全部数据：共${this.g_items.length}条`,
                icon: "none"
              });
            }
            this.g_items = this.g_items.concat(response.content);
            this.g_total = Number(response.count || 0).toLocaleString();
          } else {
            uni.showToast({
              title: "请求失败，请稍后再试",
              icon: "none"
            });
          }
        });
      },
      // 触底请求
      handleLower() {
        this.g_page = this.g_page + 1;
        this.$nextTick(() => {
          this.initList(this.pageType);
        });
      },
      /**
       * 根据链接后缀判断类型：图片、视频、文档 或 其他
       * @param {string} url - 链接地址
       * @returns {string} 返回类型：'image' | 'video' | 'document' | 'unknown'
       */
      getLinkTypeByExtension(url) {
        const match = url.match(/\.([a-zA-Z0-9]+)(\?|#|$)/);
        if (!match)
          return "unknown";
        const ext = match[1].toLowerCase();
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "ico"];
        const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "flv", "mkv"];
        const documentExtensions = [
          "pdf",
          "doc",
          "docx",
          "ppt",
          "pptx",
          "xls",
          "xlsx",
          "txt",
          "rtf",
          "md",
          "zip",
          "rar"
        ];
        if (imageExtensions.includes(ext))
          return "image";
        if (videoExtensions.includes(ext))
          return "video";
        if (documentExtensions.includes(ext))
          return "document";
        return "unknown";
      },
      hadleCopyLink(evt) {
        var _a, _b;
        const info = (_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.item;
        uni.setClipboardData({
          data: `${info == null ? void 0 : info.title} https://k3a.wiselink.net.cn/img/${encodeURI(info.filepath)}`,
          success: function() {
            uni.showToast({
              title: "已复制到剪贴板",
              icon: "none"
            });
          },
          fail: function(err) {
            uni.showToast({
              title: "复制失败",
              icon: "none"
            });
            formatAppLog("error", "at pages/useGuide/index.vue:431", "复制失败:", err);
          }
        });
      },
      hadleView(evt) {
        var _a, _b;
        const path = `https://k3a.wiselink.net.cn/img/${(_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.item.filepath}`;
        this.getLinkTypeByExtension(path);
        uni.navigateTo({
          url: `/pages/agreementWebView/agreementWebView?url=${path}`
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createVNode(_component_CustomNavBar, {
        title: $data.pageType ? "使用指南" : "视频物料"
      }, null, 8, ["title"]),
      vue.createCommentVNode(" index.wxml "),
      vue.createElementVNode(
        "view",
        {
          class: "header-content",
          style: vue.normalizeStyle("margin-top: " + $options.navbarTotalHeight + "px;")
        },
        [
          vue.createCommentVNode(' <view class="search-drop">\r\n				<view v-for="(item, index) in filter_aggregate" :key="index">\r\n					<drop-filter-com :data-id="item.id" :range="item.filter_work_status" :filter="item.name"\r\n						@Transmit="bindPickerChange" />\r\n				</view>\r\n			</view> '),
          vue.createElementVNode("view", { class: "search-box" }, [
            vue.createElementVNode(
              "input",
              {
                placeholder: "请输入名称",
                onBlur: _cache[0] || (_cache[0] = (...args) => $options.handleBlur && $options.handleBlur(...args)),
                class: "search-input"
              },
              null,
              32
              /* NEED_HYDRATION */
            )
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "record-container" }, [
        vue.createCommentVNode(" 详情区域部分 "),
        vue.createElementVNode("scroll-view", { "scroll-y": "" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.g_items, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "content-item"
              }, [
                vue.createElementVNode("view", { class: "content-item-head" }, [
                  vue.createElementVNode("view", { class: "head-left" }, [
                    vue.createElementVNode("view", { class: "left-category" }, [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(item.title),
                        1
                        /* TEXT */
                      )
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "content-item-info" }, [
                  !$data.pageType ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "info-item"
                  }, [
                    vue.createElementVNode("label", null, "主/子序号 ："),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.dsx || "-") + "/" + vue.toDisplayString(item.xsx),
                      1
                      /* TEXT */
                    )
                  ])) : vue.createCommentVNode("v-if", true),
                  !$data.pageType ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 1,
                      class: vue.normalizeClass(["info-item", item.createusername && item.createusername.length > 15 ? "long-info-item" : ""])
                    },
                    [
                      vue.createElementVNode("label", null, "创建人 ："),
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(item.createusername || "-"),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  )) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["info-item", item.fileTypeName && item.fileTypeName.length > 15 ? "long-info-item" : ""])
                    },
                    [
                      vue.createElementVNode("label", null, "类型 ："),
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(item.fileTypeName || "-"),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["info-item", item.industryName && item.industryName.length > 15 ? "long-info-item" : ""])
                    },
                    [
                      vue.createElementVNode("label", null, "行业 ："),
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(item.industryName || "-"),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  ),
                  vue.createElementVNode("view", { class: "info-item long-info-item" }, [
                    vue.createElementVNode("label", null, "创建时间 ："),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.createdate || "-"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-item long-info-item" }, [
                    vue.createElementVNode("label", null, "备注 ："),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.bak || "-"),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "content-item-footer" }, [
                  vue.createElementVNode("view", { class: "footer-left" }),
                  vue.createElementVNode("view", {
                    class: "footer-right",
                    style: { "display": "flex", "gap": "10rpx" }
                  }, [
                    vue.createElementVNode("view", {
                      class: "footer-right-btn",
                      "data-item": item,
                      onClick: _cache[1] || (_cache[1] = (...args) => $options.hadleView && $options.hadleView(...args))
                    }, [
                      vue.createElementVNode("text", null, "查看")
                    ], 8, ["data-item"])
                  ])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesUseGuideIndex = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-1c4b2df1"], ["__file", "C:/ZXT/ZXTRentN/static/google20256/pages/useGuide/index.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  const ComponentsDropFilterComIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/ZXT/ZXTRentN/static/google20256/components/DropFilterCom/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/carRental/vehicleList/index", PagesCarRentalVehicleListIndex);
  __definePage("pages/system/account/transfer/index", PagesSystemAccountTransferIndex);
  __definePage("pages/system/role/roleList/index", PagesSystemRoleRoleListIndex);
  __definePage("pages/system/role/reserve/index", PagesSystemRoleReserveIndex);
  __definePage("pages/carRental/sendElectronicKey/index", PagesCarRentalSendElectronicKeyIndex);
  __definePage("pages/oil/automatic/index", PagesOilAutomaticIndex);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/register/register", PagesRegisterRegister);
  __definePage("pages/improveData/contactUs/index", PagesImproveDataContactUsIndex);
  __definePage("pages/improveData/installer/index", PagesImproveDataInstallerIndex);
  __definePage("pages/improveData/shops/index", PagesImproveDataShopsIndex);
  __definePage("pages/carRental/oilPrice/index", PagesCarRentalOilPriceIndex);
  __definePage("pages/resetPassword/index", PagesResetPasswordIndex);
  __definePage("pages/privateCar/VehicleControl/index", PagesPrivateCarVehicleControlIndex);
  __definePage("pages/privateCar/VehicleList/index", PagesPrivateCarVehicleListIndex);
  __definePage("pages/privateCar/SettingsDetail/index", PagesPrivateCarSettingsDetailIndex);
  __definePage("pages/privateCar/pdf/index", PagesPrivateCarPdfIndex);
  __definePage("pages/privateCar/btSettings/index", PagesPrivateCarBtSettingsIndex);
  __definePage("pages/privateCar/keySharing/index", PagesPrivateCarKeySharingIndex);
  __definePage("pages/watchVideos/index", PagesWatchVideosIndex);
  __definePage("pages/roleSeparation/index", PagesRoleSeparationIndex);
  __definePage("pages/Jurisdiction/index", PagesJurisdictionIndex);
  __definePage("pages/useGuide/index", PagesUseGuideIndex);
  __definePage("components/DropFilterCom/index", ComponentsDropFilterComIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/ZXT/ZXTRentN/static/google20256/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
