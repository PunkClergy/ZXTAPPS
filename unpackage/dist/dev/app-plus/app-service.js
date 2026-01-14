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
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const getInstructions = () => {
    return [
      { id: 1, name: "开锁功能指令配置", useType: "短按开锁键", useTypeId: "" },
      { id: 2, name: "关锁功能指令配置", useType: "短按关锁键", useTypeId: "" },
      { id: 3, name: "寻车功能指令配置", useType: "短按寻车键", useTypeId: "" },
      { id: 4, name: "尾箱功能指令配置", useType: "长按三秒尾箱键", useTypeId: "" },
      { id: 7, name: "升窗功能指令配置", useType: "长按7秒关锁键", useTypeId: "" },
      { id: 8, name: "降窗功能指令配置", useType: "长按7秒开锁键", useTypeId: "" }
    ];
  };
  const getOutputConfig = (customConfigs) => {
    const defaultConfigs = [
      {
        key: "unlock",
        // 功能标识（便于维护）
        items: [
          { id: 1, name: "短按开锁键" },
          //输出次数1 输出时间500ms 输出间隔0
          { id: 2, name: "短按两次开锁键" }
          //输出次数2 输出时间500ms 输出间隔500ms
        ]
      },
      {
        key: "lock",
        items: [
          { id: 1, name: "短按关锁键" }
          //输出次数1 输出时间500ms 输出间隔0
        ]
      },
      {
        key: "findCar",
        items: [
          { id: 1, name: "短按寻车键" },
          //寻车键：输出次数1 输出时间500ms 输出间隔0; 关锁键:输出次数3 输出时间500 输出间隔1000ms
          { id: 2, name: "短按关锁键" }
        ]
      },
      {
        key: "trunk",
        items: [
          { id: 1, name: "短按两次尾箱键" },
          //输出次数2 输出时间500ms 输出间隔1000ms
          { id: 2, name: "长按三秒尾箱键" }
          //输出次数1 输出时间3000ms 输出间隔0
        ]
      },
      {
        key: "windowUp",
        items: [
          { id: 1, name: "长按7秒关锁键" }
          //输出次数为1 输出时间为7000ms 输出间隔0
        ]
      },
      {
        key: "windowDown",
        items: [
          { id: 1, name: "长按7秒开锁键" }
          //输出次数为1 输出时间为7000ms 输出间隔0
        ]
      }
    ];
    const finalConfigs = customConfigs ? [...defaultConfigs, ...customConfigs] : defaultConfigs;
    return finalConfigs.map((config) => config.items);
  };
  const getControlItems = () => {
    const baseItems = [
      {
        id: 1,
        name: "开锁",
        enabled: true,
        icon: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/unlock@2x.png",
        ative: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/colour-unlock.png",
        evt: "handleUnlock"
      },
      {
        id: 2,
        name: "关锁",
        enabled: true,
        icon: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/lock@2x.png",
        ative: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/colour-lock.png",
        evt: "handleLock"
      },
      {
        id: 3,
        name: "尾箱",
        enabled: true,
        icon: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/tail_box@2x.png",
        evt: "handleOpenTrunk"
      },
      {
        id: 4,
        name: "寻车",
        enabled: true,
        icon: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/seek_car@2x.png",
        evt: "handleFindCar"
      },
      {
        id: 5,
        name: "升窗",
        enabled: true,
        icon: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/rise.png",
        evt: "handlRaiseTheWindow"
      },
      {
        id: 6,
        name: "降窗",
        enabled: true,
        icon: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/drop.png",
        evt: "handleLowerTheWindow"
      }
    ];
    return baseItems;
  };
  const initVoltage = (dy) => {
    const thresholds = [4, 3.9, 3.8, 3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.1];
    const scores = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
    const index = thresholds.findIndex((threshold) => dy >= threshold);
    return index !== -1 ? scores[index] : 0;
  };
  const getBatteryLevel = (voltage) => {
    const thresholds = [90, 80, 70, 60, 50, 40, 30, 20, 10, 5];
    const values = ["100", "90", "80", "70", "60", "50", "40", "30", "20", "10"];
    const index = thresholds.findIndex((threshold) => voltage > threshold);
    return index !== -1 ? values[index] : "1";
  };
  const getParseHexDataObject = (hexString) => {
    if (!hexString || hexString.length !== 30) {
      return null;
    }
    let dataBodyHex = hexString;
    if (hexString.length === 32) {
      dataBodyHex = hexString.substr(4, 24);
    }
    const bytes = [];
    for (let i = 0; i < dataBodyHex.length; i += 2) {
      bytes.push(parseInt(dataBodyHex.substr(i, 2), 16));
    }
    const result = {};
    result.inductionEnable = bytes[0] === 1;
    result.inductionMode = bytes[0] === 1 ? true : false;
    result.accStatus = bytes[1] === 1;
    result.lock = bytes[2] === 1;
    result.powerOffRemainTime = bytes[3];
    result.powerOffRemainTimeDesc = bytes[3] === 255 ? "不断电" : `${bytes[3]}分钟`;
    result.inductionCheckTimes = bytes[4];
    result.autoInductionMode = bytes[5];
    result.autoInductionModeDesc = {
      0: "操作后失效",
      1: "一直有效",
      2: "操作后失效"
    }[bytes[5]] || "未知模式";
    result.bleDisconnectLock = bytes[6] === 1;
    const d7 = bytes[7];
    result.carWashMode = (d7 & 1) === 1;
    result.bleBroadcastMode = d7 >> 1 & 1;
    result.modeType = d7 >> 2 & 1;
    result.modeTypeDesc = d7 >> 2 & 1 ? "内置模式" : "外置模式";
    result.oilCircuitStatus = d7 >> 3 & 1;
    result.oilCircuitStatusDesc = d7 >> 3 & 1 ? "油路关" : "油路开";
    result.lockWindowUp = d7 >> 4 & 1;
    result.serialBroadcast = d7 >> 5 & 1 ? "关" : "开";
    result.workMode = d7 >> 6 & 1;
    result.workModeDesc = d7 >> 6 & 1 ? "网约车模式" : "正常模式";
    result.netCarControl = d7 >> 7 & 1;
    result.netCarControlDesc = d7 >> 7 & 1 ? "可控制" : "不可控制";
    result.inductionLockSignal = bytes[8];
    result.inductionHandle = bytes[9] === 1;
    result.signalValue = Math.abs(bytes[10]);
    result.inductionUnlockSignal = bytes[11];
    if (bytes.length >= 13) {
      result.voltage = (bytes[12] / 10).toFixed(1) + "V";
      result.electric = getBatteryLevel(initVoltage((bytes[12] / 10).toFixed(1)));
    } else {
      result.voltage = "未知";
      result.electric = 0;
    }
    if (bytes.length >= 14) {
      const d13 = bytes[13];
      result.alwaysPower = (d13 & 1) === 1;
      result.startInductionEnable = d13 >> 1 & 1 ? "失效" : "生效";
      result.remoteInductionEnable = d13 >> 2 & 1;
      result.keyWorkMode = d13 >> 3 & 1;
      result.keyAlwaysPower = d13 >> 4 & 1;
      result.pairStatus = d13 >> 5 & 1 ? "未配对" : "已配对";
    } else {
      result.alwaysPower = false;
      result.startInductionEnable = "未知";
      result.remoteInductionEnable = false;
      result.keyWorkMode = 0;
      result.keyAlwaysPower = false;
      result.pairStatus = "未知";
    }
    if (bytes.length >= 15) {
      const d14 = bytes[14];
      result.pairConnectIndex = d14 & 7;
      result.reservedBit3 = d14 >> 3 & 1;
    } else {
      result.pairConnectIndex = 0;
      result.reservedBit3 = 0;
    }
    result.supply = bytes[3];
    return result;
  };
  const getInstructionMap = (sendCommand) => {
    return {
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
        // 短按关锁键（原注释笔误修正）
      },
      3: {
        // 寻车键
        1: () => sendCommand(54, [54, 6, 1, 0, 0]),
        // 短按寻车键
        2: () => sendCommand(54, [52, 6, 3, 6, 0])
        // 三按关锁键（原注释对应功能）
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
        // 长按7秒关锁键（升窗功能）
      },
      8: {
        // 降窗
        1: () => sendCommand(83, [51, 70, 1, 0, 0])
        // 长按7秒开锁键（降窗功能）
      }
    };
  };
  var dist = {
    getInstructions,
    //设置按键指令集合
    getOutputConfig,
    //获取输出配置列表
    getControlItems,
    //钥匙按钮常量
    getParseHexDataObject,
    //解析蓝牙广播值
    getInstructionMap
    //获取指令映射表的函数
  };
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
        let res2 = response;
        if (typeof this.interceptor.response === "function") {
          res2 = this.interceptor.response(response);
        }
        if (res2.statusCode === 200) {
          return res2.data;
        } else {
          formatAppLog("error", "at utils/request/http.js:90", "接口返回异常:", res2);
          return Promise.reject(res2.data);
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
      if (errMsg.includes("timeout"))
        ;
      else if (errMsg.includes("abort")) {
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
      header["funAreaId"] = 1978;
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
          url: "/pages/login/index"
        });
      }
      return response;
    }
  });
  const u_navlist20 = (data) => http.get("/deskapi/navlist20", data);
  const u_carList$1 = (data) => http.get("/carapi/getCarList", data);
  const u_sendInfo = (data) => http.postFormData("/renterApi/uploadControlRecord", data);
  const u_uploadLog = (data) => http.post("/loggerapi/uploadLog", data);
  const u_bannerlist20 = (data) => http.get("/deskapi/bannerlist20", data);
  const u_getQrcodeImg = (data) => http.get("/deskapi/getQrcodeImg", data);
  const u_getHomeArea = (data) => http.get("/deskapi/homeArea", data);
  const u_booklist = (data) => http.get("/deskapi/booklist", data);
  const u_mylist = (data) => http.get("/deskapi/mylist", data);
  const u_paivatecarList = (data) => http.get("/carapi/getCarList", data);
  const u_paivateAddOrUpdateCar = (data) => http.postFormData("/carapi/addOrUpdateCar", data);
  const u_paivateCarapiDeleteCar = (data) => http.postFormData("/carapi/deleteCar", data);
  const u_paivateCarList = (data) => http.get("/carapi/getCarList", data);
  const u_paivateRentRecord = (data) => http.get("/rentKeyApi/rentRecord", data);
  const u_paivateCancelRentKey = (data) => http.get("/rentKeyApi/cancelRentKey", data);
  const u_promotionalApi = (data) => http.get("/promotionalApi/list", data);
  const u_promotionalApiWxBooklist = (data) => http.get("/promotionalApi/wxFilelist", data);
  const u_industryList = (data) => http.get("/promotionalApi/industryList", data);
  const login = (data) => http.postFormData("/api/login", data);
  const u_register = (data) => http.postFormData("/userapi/userReg", data);
  const u_sendRentKey = (data) => http.get("/rentKeyApi/sendRentKey", data);
  const u_updateRentKey = (data) => http.postFormData("/rentKeyApi/updateRentKey", data);
  const enUS = {
    privateVehicle: "private vehicle",
    privateTitle: "mobile car connect key(MCCK)",
    pleaseLogIn: "please login",
    InstInstall: "Inst Install",
    MoreSettings: "More Settings",
    battery: "battery",
    btStatus: "btStatus",
    connected: "connected",
    disConn: "disConn",
    btPairing: "btPairing",
    unpaired: "unpaired",
    mcckDeviceBattery: "mcckDeviceBattery",
    mcckBtConnManual: "mcckBtConnManual",
    mcckBtPairingInductive: "mcckBtPairingInductive",
    InductiveLock: "Inductive Lock",
    On: "Auto lock/unlock without waiting or checking",
    Off: "Manual operation required: Go to My Phone Car Key to lock/unlock",
    MyLocation: "My Loc",
    UnlockSensitivity: "Unlock Sens",
    LockSensitivity: "Lock Sens",
    Rule: "Rule",
    MyLocationdes: "Bluetooth signal: Lower = stronger",
    UnlockSensitivitydes: "Unlock when signal < this value",
    LockSensitivitydes: "Lock when signal > this value",
    Ruledes: '"My Loc": Value updates in real time as phone moves'
  };
  const zhCN = {
    privateVehicle: "私家车",
    privateTitle: "智信通手机汽车互联钥匙",
    pleaseLogIn: "请登录",
    InstInstall: "安装说明",
    MoreSettings: "更多设置",
    battery: "电量",
    btStatus: "蓝牙状态",
    connected: "已连接",
    disConn: "未连接",
    btPairing: "蓝牙配对",
    unpaired: "未配对",
    mcckDeviceBattery: "MCCK 设备当前电量",
    mcckBtConnManual: "MCCK 蓝牙连接（支持手动）",
    mcckBtPairingInductive: "MCCK 蓝牙配对（感应生效）",
    InductiveLock: "感应开关锁",
    On: "开启：实现开门不罚站 关门不回头，无感自动开关锁。",
    Off: "关闭：需手动操作： 在「我的手机汽车钥匙功能」区域-完成开关门操作。",
    MyLocation: "我的位置",
    UnlockSensitivity: "开锁敏感值",
    LockSensitivity: "关锁敏感值",
    Rule: "变化规则",
    MyLocationdes: "我的位置",
    UnlockSensitivitydes: "开锁敏感值",
    LockSensitivitydes: "关锁敏感值",
    Ruledes: "变化规则"
  };
  const bilingualData = {
    en_US: enUS,
    zh_CN: zhCN
  };
  const getSystemInfoComplete = (systemInfo, complete) => {
    uni.getSystemInfo({
      success: systemInfo,
      complete
    });
  };
  const appUtil = {
    getSystemInfoComplete
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
  function isDeviceConnected(deviceIDC, param) {
    isBLEAdapterAvailable(function(ava) {
      if (ava) {
        logger.e("查询已连接设备,适配器已开启");
        getBLEDeviceInfo(deviceIDC, function(status) {
          if (status) {
            logger.e("查询已连接设备,已获取蓝牙设备信息");
            formatAppLog("log", "at utils/BleKeyFun-utils-single.js:149", status);
            onBLEConnectionStateChange();
            uni.createBLEConnection({
              deviceId,
              timeout: 3e3,
              success: function(result) {
                logger.e("查询已连接设备,已成功建立连接");
                param(true, result);
              },
              fail: function(result) {
                logger.e("查询已连接设备,未成功建立连接!!!", result);
                param(false, result);
              }
            });
          } else {
            logger.e("查询已连接设备,未获取蓝牙设备信息!!!");
            formatAppLog("log", "at utils/BleKeyFun-utils-single.js:169", status);
            param(false, status);
          }
        });
      } else {
        logger.e("查询已连接设备,适配器未开启!!!");
        param(false, res);
      }
    });
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
        getBluetoothAdapterState(function(res2) {
          setBLEAdapterState(res2.available, res2.discovering);
          onResult(res2.available);
        });
      } else {
        onResult(available);
      }
    } else {
      openBluetoothAdapter(function(openSuccess) {
        if (openSuccess) {
          getBluetoothAdapterState(function(res2) {
            setBLEAdapterState(res2.available, res2.discovering);
            onResult(res2.available);
          });
        } else {
          onResult(openSuccess);
        }
      });
    }
  }
  function openBluetoothAdapter(cOpenBluetoothAdapter) {
    uni.openBluetoothAdapter({
      success: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:231", res2);
        isBLEAdapterOpen = true;
        cOpenBluetoothAdapter(true);
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:236", res2);
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
      success: function(res2) {
        onBleAdapterState(res2);
      },
      fail: function(res2) {
        onBleAdapterState(res2);
      }
    });
  }
  function onBluetoothAdapterStateChange() {
    uni.onBluetoothAdapterStateChange(function(res2) {
      logger.e(`adapterState changed, now is`, res2);
      setBLEAdapterState(res2.available, res2.discovering);
    });
  }
  function closeBluetoothAdapter() {
    uni.closeBluetoothAdapter({
      success: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:282", res2);
        isBLEAdapterOpen = false;
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:286", res2);
      }
    });
  }
  function startConnect() {
    uni.createBLEConnection({
      deviceId,
      success: function(res2) {
        gWriteService = "";
        gWriteCharacteristic = "";
        gReadService = "";
        gReadCharacteristic = "";
        getBLEDeviceServices();
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:313", res2);
        gBluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_CONNECT_FAILED);
      }
    });
  }
  function startConnectConnected() {
    getBLEDeviceServicesConnected();
  }
  function onBLEConnectionStateChange() {
    uni.onBLEConnectionStateChange(function(res2) {
      logger.e(`device ${res2.deviceId} state has changed, connected: ${res2.connected}`);
      connected = res2.connected;
      if (gBluetoothState != void 0) {
        if (connected) {
          gBluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_CONNECT_SUCESS);
        } else {
          gBluetoothState(DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ERROR);
        }
      }
      if (res2.deviceId == deviceId) {
        if (res2.connected == true) {
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
      success: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:356", res2);
        connected = false;
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:360", res2);
      }
    });
  }
  function startBluetoothDevicesDiscovery() {
    uni.startBluetoothDevicesDiscovery({
      success: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:376", res2);
        discovering = res2.isDiscovering;
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:380", res2);
        discovering = res2.isDiscovering;
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
      if (gIdc == devices.devices[0].name || gIdc == devices.devices[0].localName) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:397", devices);
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
      success: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:420", res2);
        discovering = false;
        logger.e("stopScanBle-true discovering:" + discovering);
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:425", res2);
        discovering = false;
        logger.e("stopScanBle-false discovering:" + discovering);
      }
    });
  }
  function getBLEDeviceServices() {
    uni.getBLEDeviceServices({
      deviceId,
      success: function(res2) {
        for (var i = 0; i < res2.services.length; i++) {
          formatAppLog("log", "at utils/BleKeyFun-utils-single.js:444", res2);
          if (res2.services[i].uuid.indexOf(WRITE_SERVICE_SHORTHAND) != -1) {
            gWriteService = res2.services[i].uuid;
          }
          if (res2.services[i].uuid.indexOf(READ_SERVICE_SHORTHAND) != -1) {
            gReadService = res2.services[i].uuid;
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
      success: function(res2) {
        logger.e("device设备的读服务id:", WriteServiceFixed);
        logger.e("device设备的写服务id:", ReadServiceFixed);
        setTimeout(() => {
          getBLEDeviceWriteCharacteristicsConnected();
        }, 1e3);
      }
    });
  }
  function getBLEDeviceReadCharacteristics() {
    uni.getBLEDeviceCharacteristics({
      deviceId,
      serviceId: gReadService,
      success: function(res2) {
        for (var i = 0; i < res2.characteristics.length; i++) {
          if (res2.characteristics[i].uuid.indexOf(READ_CHARACTERISTIC_SHORTHAND) != -1) {
            gReadCharacteristic = res2.characteristics[i].uuid;
          }
          if (res2.characteristics[i].uuid.indexOf(READRANDOM_CHARACTERISTIC_SHORTHAND) != -1) {
            gReadRandomCharacteristic = res2.characteristics[i].uuid;
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
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:504", res2);
      }
    });
  }
  function getBLEDeviceReadCharacteristicsConnected() {
    uni.getBLEDeviceCharacteristics({
      deviceId,
      serviceId: ReadServiceFixed,
      success: function(res2) {
        logger.e("device设备的读特征值id:" + ReadCharacteristicFixed);
        logger.e("device设备的读Random特征值id:" + ReadRandomCharacteristicFixed);
        notifyBLECharacteristicValueChangeConnected();
        setTimeout(() => {
          readBLECharacteristicValueConnected();
        }, 100);
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:523", res2);
      }
    });
  }
  function notifyBLECharacteristicValueChange() {
    uni.notifyBLECharacteristicValueChange({
      deviceId,
      serviceId: gReadService,
      characteristicId: gReadCharacteristic,
      state: true,
      success: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:538", res2);
        appUtil.getSystemInfoComplete(
          function(res3) {
            var system = res3.system;
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
              success: function(res3) {
                formatAppLog("log", "at utils/BleKeyFun-utils-single.js:554", "MTU modify success");
              },
              fail: function(res3) {
                formatAppLog("log", "at utils/BleKeyFun-utils-single.js:557", "MTU modify fail");
              }
            });
          }
        );
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:565", res2);
      }
    });
  }
  function notifyBLECharacteristicValueChangeConnected() {
    uni.notifyBLECharacteristicValueChange({
      deviceId,
      serviceId: ReadServiceFixed,
      characteristicId: ReadCharacteristicFixed,
      state: true,
      success: function(res2) {
        appUtil.getSystemInfoComplete(
          function(res3) {
            var system = res3.system;
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
              success: function(res3) {
                formatAppLog("log", "at utils/BleKeyFun-utils-single.js:592", "MTU modify success");
              },
              fail: function(res3) {
                formatAppLog("log", "at utils/BleKeyFun-utils-single.js:595", "MTU modify fail");
              }
            });
          }
        );
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:602", res2);
      }
    });
  }
  function readBLECharacteristicValue() {
    uni.readBLECharacteristicValue({
      deviceId,
      serviceId: gReadService,
      characteristicId: gReadRandomCharacteristic,
      state: true,
      success: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:614", res2);
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:617", res2);
      }
    });
  }
  function readBLECharacteristicValueConnected() {
    uni.readBLECharacteristicValue({
      deviceId,
      serviceId: ReadServiceFixed,
      characteristicId: ReadRandomCharacteristicFixed,
      state: true,
      success: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:629", res2);
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:632", res2);
      }
    });
  }
  function getBLEDeviceWriteCharacteristics() {
    uni.getBLEDeviceCharacteristics({
      deviceId,
      serviceId: gWriteService,
      success: function(res2) {
        for (var j = 0; j < res2.characteristics.length; j++) {
          if (res2.characteristics[j].uuid.indexOf(WIRTE_CHARACTERISTIC_SHORTHAND) != -1) {
            gWriteCharacteristic = res2.characteristics[j].uuid;
          }
        }
        logger.e("device设备的写特征值id:" + gWriteCharacteristic);
        if (gReadCharacteristic == "") {
          getBLEDeviceReadCharacteristics();
        }
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:657", res2);
      }
    });
  }
  function getBLEDeviceWriteCharacteristicsConnected() {
    uni.getBLEDeviceCharacteristics({
      deviceId,
      serviceId: WriteServiceFixed,
      success: function(res2) {
        logger.e("device设备的写特征值id:" + WriteCharacteristicFixed);
        getBLEDeviceReadCharacteristicsConnected();
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:671", res2);
      }
    });
  }
  function onBLECharacteristicValueChange() {
    uni.onBLECharacteristicValueChange(function(characteristic) {
      var resultArrayBufferData = characteristic.value;
      var receiverHexData = utils.buf2hex(resultArrayBufferData);
      var arrayData = utils.hexStringToArray(receiverHexData);
      getBLEDataTime();
      if (characteristic.characteristicId.indexOf(READRANDOM_CHARACTERISTIC_SHORTHAND) != -1) {
        gOnReceiveValue(0, arrayData, utils.hexCharCodeToStr(receiverHexData), receiverHexData);
      } else {
        gOnReceiveValue(1, arrayData, utils.hexCharCodeToStr(receiverHexData), receiverHexData);
      }
    });
  }
  function onBLECharacteristicValueChangeConnected() {
    uni.onBLECharacteristicValueChange(function(characteristic) {
      var resultArrayBufferData = characteristic.value;
      var receiverHexData = utils.buf2hex(resultArrayBufferData);
      var arrayData = utils.hexStringToArray(receiverHexData);
      getBLEDataTime();
      if (characteristic.characteristicId == ReadRandomCharacteristicFixed) {
        gOnReceiveValue(0, arrayData, utils.hexCharCodeToStr(receiverHexData), receiverHexData);
      } else {
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
      success: function(res2) {
        writeBLECharacteristicValue2(true);
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:730", res2);
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
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:877", "指令发送成功:" + formatted + "  数据:" + sendHexData);
        logger.e("指令发送成功:" + sendHexData, false, false, true);
      } else {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:880", "!!!指令发送失败:" + formatted + "  数据:" + sendHexData);
        logger.e("!!!指令发送失败:" + sendHexData, false, false, true);
      }
    });
  }
  function makePair() {
    uni.makeBluetoothPair({
      deviceId,
      timeout: 2e4,
      success: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:895", res2);
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:898", res2);
      }
    });
  }
  function saveBLEDeviceInfo(deviceIDC) {
    formatAppLog("log", "at utils/BleKeyFun-utils-single.js:904", "saveBLEDeviceInfo");
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
    formatAppLog("log", "at utils/BleKeyFun-utils-single.js:922", "getBLEDeviceInfo");
    uni.getStorage({
      key: deviceIDC,
      success: function(res2) {
        var param = JSON.parse(res2.data);
        deviceId = param.deviceId;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:928", deviceId);
        gReadService = param.readServiceUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:930", gReadService);
        gWriteService = param.writeServiceUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:932", gWriteService);
        gReadCharacteristic = param.readCharacUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:934", gReadCharacteristic);
        gWriteCharacteristic = param.writeCharacUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:936", gWriteCharacteristic);
        gReadRandomCharacteristic = param.randomCharacUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:938", gReadRandomCharacteristic);
        result(true, param);
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:943", res2);
        result(false);
      }
    });
  }
  function clrBLEDeviceInfo(deviceIDC) {
    formatAppLog("log", "at utils/BleKeyFun-utils-single.js:950", "clrBLEDeviceInfo");
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
    connectBLEConnected,
    isDeviceConnected
  };
  const _imports_0$4 = "/static/assets/images/home/right_1.png";
  const _imports_0$3 = "/static/privateCar/car_icon.png";
  const _imports_2$1 = "/static/privateCar/close.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
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
  const _sfc_main$a = {
    components: {},
    data() {
      return {
        // 屏幕总高度（动态计算赋值）
        g_screenTotalHeight: "",
        // 底部tabbar固定高度（单位：px）
        g_tabBarHeight: 80,
        // 手机状态栏高度（单位：px）
        g_height_from_head: 44,
        // 自定义导航栏固定高度（单位：px）
        g_head_height: 84,
        // 胶囊按钮到右侧的距离（动态计算赋值，单位：px/百分比）
        g_capsule_distance_to_the_right: "",
        // 核心内容区域上部固定高度（可根据业务需求自定义，单位：px）
        bottomHeight: 90,
        // 核心内容区域下部固定高度（可根据业务需求自定义，单位：px）
        // 开锁判定阈值 - 感应信号范围（0-100），信号值在此范围内触发开锁逻辑
        unlockRange: 50,
        // 关锁判定阈值 - 感应信号范围（0-100），信号值在此范围内触发关锁逻辑
        lockRange: 60,
        // 人物位置标识（界面展示用，百分比/像素值）
        myPosition: 60,
        // 开锁范围滑块样式 - 左侧偏移量（界面展示定位）
        unlockThumbStyle: "left: 44%",
        // 关锁范围滑块样式 - 左侧偏移量（界面展示定位）
        lockThumbStyle: "left: 54%",
        // 人物位置展示样式 - 左侧偏移量（界面展示定位）
        myPositionStyle: "left: 30%",
        // ===================== 蓝牙通信相关 =====================
        // 蓝牙设备标识（连接成功后赋值，唯一标识设备）
        dc: "",
        // 蓝牙通信-待发送/接收的原始数据（二进制/字符串格式）
        data: "",
        // 蓝牙通信-消息日志（存储交互过程中的提示/错误信息）
        msg: "",
        // 默认蓝牙设备ID（出厂预设/常用设备ID，用于快速连接）
        deviceIDC: "932505100228",
        // 蓝牙通信-原始加密密钥（数组格式，用于数据加解密）
        orgKey: [51, 71, 1, 130, 52, 51],
        // 设备所有者标识（true：是所有者，false：非所有者，影响操作权限）
        isOwner: false,
        // 蓝牙连接ID（系统分配的连接句柄，用于管理连接）
        connectionID: "",
        // ===================== 数据解析相关 =====================
        // 页面滚动目标锚点（指定滚动到的DOM元素ID，如'hiddenview'）
        scrollTo: "hiddenview",
        // 解析蓝牙数据的长度（记录已解析的字节数，用于数据分片处理）
        parseLen: 0,
        // 蓝牙数据解析后的数据对象（存储解析后的设备状态信息）
        parsedData: {
          electric: "",
          // 设备电量（百分比/数值）
          pairStatus: "",
          // 配对状态（已配对/未配对）
          inductionMode: "",
          // 感应模式（开启/关闭）
          inductionUnlockSignal: "",
          // 感应开锁信号（原始值）
          signalValue: "",
          // 实时感应信号值（0-100）
          inductionLockSignal: "",
          // 感应关锁信号（原始值）
          lock: "",
          // 锁体状态（上锁/解锁）
          bleDisconnectLock: "",
          // 蓝牙断开自动锁状态（开启/关闭）
          lockWindowUp: ""
          // 车窗锁状态（升起/降下）
        },
        // ===================== 定时器相关 =====================
        // 设备状态检查定时器ID（循环检查蓝牙/设备状态，用于清除定时器）
        pageInterval: 0,
        // 网络状态标识（true：已联网，false：断网）
        netWork: false,
        // ===================== 界面控制相关 =====================
        // 控制按钮配置项（通过getControlItems()获取，包含按钮ID/名称/图标等）
        controlItems: dist.getControlItems(),
        // 控制按钮面板配置（存储面板展示的按钮列表）
        controlItemspanel: [],
        // 蓝牙通信报文日志（存储所有交互的原始报文，用于调试/展示）
        logs: [],
        // 设备信息对象（存储蓝牙设备的型号/固件版本/名称等信息）
        deviceInfo: {},
        // 底部tabbar高度（冗余字段，与g_tabBarHeight一致，界面适配兼容用）
        tabBarHeight: 80,
        // 底部tabbar列表（存储tab项的名称/路径/图标等配置）
        tabList: [],
        // 底部tabbar当前选中索引（默认选中第2个tab，索引从0开始）
        currentTab: 1,
        // 系统原始链接（基础接口地址/跳转链接）
        c_link: "https://k1sw.wiselink.net.cn/",
        // 设置弹窗显示状态（true：显示，false：隐藏）
        modalisShow: false,
        // 更多钥匙功能展示标志（true：展开，false：收起）
        key_settings: false,
        // 更多功能展示标志（true：展开，false：收起）
        all_settings: false,
        // 钥匙指令集合（通过getInstructions()获取，包含指令ID/名称/功能描述）
        keyInstructions: dist.getInstructions(),
        // 输出方式配置集合（通过getOutputConfig()获取，包含输出类型/参数等）
        key_out_put: dist.getOutputConfig(),
        // 状态检查定时器ID（页面卸载时清除，防止内存泄漏）
        checkTimer: null,
        // 临时存储-配置选项（通用临时变量，存储各类配置参数）
        options: "",
        // 设备固件版本（存储蓝牙设备的固件版本号）
        firmware: "",
        // 账号信息（当前登录账号标识/信息）
        account: "",
        // 原始密钥备份（存储修改前的加密密钥，用于回滚/对比）
        orgKeyOld: "",
        // 蓝牙设备扩展数据（存储车牌号等设备关联信息）
        bluetoothData: {
          platenumber: ""
          // 车牌号（设备绑定的车辆号牌）
        },
        // 临时存储-验证码/授权码（通用临时变量）
        code: "",
        // 控制按钮临时对象（存储当前操作的按钮信息）
        control: {
          id: "",
          // 按钮ID
          enabled: "",
          // 启用状态（true/false）
          ative: "",
          // 激活状态（true/false，拼写可能为active笔误）
          icon: "",
          // 按钮图标
          name: ""
          // 按钮名称
        },
        // 控制按钮当前选中索引（用于标识当前操作的按钮位置）
        controlIndex: 0,
        // 点击滑动模块最后的时间
        lastPairTime: Date.now(),
        // 当前语种
        isDropdownOpen: false,
        // 支持的语言列表（可根据需求扩展）
        languageList: [
          {
            label: "中文",
            value: "zh_CN"
          },
          {
            label: "English",
            value: "en_US"
          }
        ],
        // 当前选中的语言（默认中文）
        currentLanguage: {
          label: "中文",
          value: "zh_CN"
        },
        bilingualData
      };
    },
    onLoad: function(options) {
      this.initScreenAndSystemInfo();
      this.initBottomDirectory();
      this.initToConfigureCache();
      this.handleSystemInfo();
      this.options = options;
    },
    onShow: function() {
      this.handleStart();
      this.startConnectionStatusPolling();
      this.initBilingual();
    },
    onHide: function() {
      const that = this;
      setTimeout(() => bleKeyManager.releaseBle(), 1500);
      this.connectionID = "";
      this.parsedData = {};
      clearInterval(that.pageInterval);
      uni.setKeepScreenOn({
        keepScreenOn: false
      });
    },
    onUnload: function() {
      const that = this;
      setTimeout(() => bleKeyManager.releaseBle(), 500);
      clearInterval(that.pageInterval);
      clearInterval(this.checkTimer);
      uni.setKeepScreenOn({
        keepScreenOn: false
      });
    },
    onReady() {
      this.initLoginStatus();
    },
    methods: {
      // 获取当前设置语种
      initbilingual() {
        uni.getStorage({
          key: "bilingual",
          success: (res2) => {
            this.bilingual = res2 == null ? void 0 : res2.data;
          }
        });
      },
      // 切换下拉菜单显示/隐藏
      toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
      },
      // 选择语言并切换
      handleLanguageChange(lang) {
        this.currentLanguage = lang;
        this.isDropdownOpen = false;
        formatAppLog("log", "at pages/index/index.vue:627", "切换到语言：", lang.value);
        uni.setStorage({
          key: "bilingual",
          data: lang,
          success: () => {
            formatAppLog("log", "at pages/index/index.vue:632", "token缓存设置成功");
          }
        });
      },
      initBilingual() {
        uni.getStorage({
          key: "bilingual",
          success: (res2) => {
            formatAppLog("log", "at pages/index/index.vue:641", "获取到的token：", res2.data);
          }
        });
      },
      // 双语切换
      handleBilingual() {
        uni.setStorage({
          key: "bilingual",
          data: "2",
          success: () => {
            formatAppLog("log", "at pages/index/index.vue:651", "token缓存设置成功");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/index/index.vue:654", "缓存设置失败：", err);
          }
        });
      },
      // 获取当前登录状态
      initLoginStatus() {
        uni.getStorage({
          key: "user_info",
          success: (res2) => {
            var _a, _b;
            formatAppLog("log", "at pages/index/index.vue:663", res2);
            this.account = ((_a = res2 == null ? void 0 : res2.data) == null ? void 0 : _a.companyName) || ((_b = res2 == null ? void 0 : res2.data) == null ? void 0 : _b.username);
            this.initCheckTimer();
          },
          fail(err) {
            formatAppLog("error", "at pages/index/index.vue:670", "获取失败", err);
          }
        });
      },
      // 点击操作手动区事件
      handleParseEventDynamicCode($, evt) {
        this.handleEvent(evt);
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
      // 切换底部导航
      handleSwitchTabNavigation(evt) {
        const {
          currentTarget: {
            dataset: {
              index: idx = null
            } = {}
          } = {}
        } = evt ?? {};
        if (idx === null) {
          return;
        }
        const {
          tabList = []
        } = this;
        const {
          pagePath: targetUrl
        } = tabList[idx] ?? {};
        if (!targetUrl) {
          return;
        }
        const [currentPage] = getCurrentPages().slice(-1);
        const {
          route: currentPath
        } = currentPage ?? {};
        if (!currentPath) {
          return;
        }
        const targetPurePath = targetUrl.split("?")[0];
        formatAppLog("log", "at pages/index/index.vue:737", currentPath, targetPurePath);
        if (currentPath !== targetPurePath) {
          if (targetPurePath == "pages/privateCar/index") {
            uni.redirectTo({
              url: "/pages/index/index"
            });
          } else {
            uni.redirectTo({
              url: `/${targetUrl}`
            });
          }
        }
      },
      // 获取底部导航数据
      async initBottomDirectory() {
        const res2 = await u_navlist20();
        if ((res2 == null ? void 0 : res2.code) == 1e3) {
          this.tabList = res2 == null ? void 0 : res2.content;
        }
      },
      // 配对按钮点击处理
      btnPair() {
        var _a, _b;
        uni.getSystemInfoSync().platform;
        const that = this;
        const deviceInfo = uni.getDeviceInfo();
        if (Number((_a = that.parsedData) == null ? void 0 : _a.electric) > 10 && ((_b = that.parsedData) == null ? void 0 : _b.pairStatus) != "已配对") {
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
              success: (res2) => {
                if (res2.confirm) {
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
      // 切换感应模式
      handleToggleSensorMode(e2) {
        var _a;
        const {
          parsedData = {}
        } = this || {};
        const {
          inductionMode: oldFlag = false,
          pairStatus = "未配对"
        } = parsedData;
        const newFlag = ((_a = e2 == null ? void 0 : e2.detail) == null ? void 0 : _a.value) ?? false;
        if (!oldFlag && pairStatus === "未配对") {
          this.btnPair();
          return;
        }
        const cmdValue = newFlag ? 1 : 0;
        this.btnCmdSend(58, [cmdValue]);
      },
      // 获取设备信息
      handleSystemInfo() {
        uni.getSystemInfo({
          success: (res2) => {
            const {
              brand,
              model,
              system,
              platform,
              screenWidth,
              screenHeight,
              pixelRatio,
              statusBarHeight
            } = res2;
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
            formatAppLog("log", "at pages/index/index.vue:863", "设备信息:", this.deviceInfo);
          },
          fail: console.error
        });
      },
      // 启动连接状态轮询
      startConnectionStatusPolling() {
        formatAppLog("log", "at pages/index/index.vue:871", this.pageInterval);
        if (this.pageInterval) {
          return;
        }
        this.pageInterval = setInterval(() => {
          const isConnected = bleKeyManager.getBLEConnectionState();
          const connectionID = isConnected ? bleKeyManager.getBLEConnectionID() : "";
          const firmware = isConnected ? this.firmware : "";
          this.connectionID = connectionID;
          this.firmware = firmware;
        }, 200);
      },
      // 初始化屏幕及系统头部相关信息
      initScreenAndSystemInfo() {
        const {
          screenHeight = 0
        } = uni.getWindowInfo() || {};
        this.g_capsule_distance_to_the_right = 0;
        this.g_screenTotalHeight = screenHeight;
      },
      // 初始化钥匙按钮内容
      initContro() {
        this.controlItemspanel = this.splitArray(dist.getControlItems(), 4);
        formatAppLog("log", "at pages/index/index.vue:899", this.splitArray(dist.getControlItems(), 4));
      },
      initCheckTimer() {
        if (this.checkTimer) {
          clearInterval(this.checkTimer);
        }
        const timer = setInterval(() => {
          if (this.connectionID == "") {
            this.handleStart();
          }
        }, 3e3);
        this.checkTimer = timer;
      },
      // 蓝牙连接处理
      async handleStart() {
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
          formatAppLog("log", "at pages/index/index.vue:929", that);
          setTimeout(() => {
            that.handleBule();
          }, 500);
        };
        const fetchBluetoothData = (code) => {
          byGet("https://k1sw.wiselink.net.cn/" + u_getCarBluetoothKeyByCode.URL, {
            code
          }).then((response) => {
            var _a;
            if (!((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.content)) {
              return;
            }
            that.netWork = true;
            that.code = code;
            handleData(response.data.content);
          }).catch((err) => {
            formatAppLog("error", "at pages/index/index.vue:949", "获取蓝牙数据失败:", err);
          });
        };
        if (options == null ? void 0 : options.scene) {
          formatAppLog("log", "at pages/index/index.vue:956", "处理URL参数:", options.scene);
          fetchBluetoothData(options.scene);
          uni.setStorage({
            key: "scene",
            data: options.scene
          });
        } else {
          uni.getStorage({
            key: "scene",
            success: (res2) => {
              fetchBluetoothData(res2.data);
            },
            fail: () => {
              uni.getStorage({
                key: "bluetoothData",
                success: (evt_response) => {
                  handleData(evt_response.data);
                },
                // 3. 缓存也不存在时处理车辆列表数据
                fail: async () => {
                  const response = await u_carList$1();
                  if ((response == null ? void 0 : response.code) == 1e3) {
                    const firstCar = response.content[0];
                    uni.setStorageSync("bluetoothData", firstCar);
                    handleData(firstCar);
                  }
                }
              });
            }
          });
        }
      },
      auth_encrypt(passwordSource, random) {
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
        if (!isLogin()) {
          uni.navigateTo({
            url: "/pages/system/managerLoginView/loginView"
          });
          return;
        }
        if ((_a = this == null ? void 0 : this.bluetoothData) == null ? void 0 : _a.platenumber) {
          uni.redirectTo({
            url: `/pages/listOfPrivateCars/index?sn=${this.deviceIDC}&bluetoothKey=${this.orgKeyOld}`
          });
        } else {
          uni.showModal({
            title: "提示",
            content: "请先绑定车辆",
            confirmText: "立即绑定",
            success: (res2) => {
              if (res2.confirm) {
                uni.redirectTo({
                  url: "/pages/listOfPrivateCars/list/index"
                });
              }
            }
          });
        }
      },
      // 调整安装手册
      handleJumpSc() {
        if (!isLogin()) {
          uni.navigateTo({
            url: "/pages/system/managerLoginView/loginView"
          });
          return;
        }
        uni.redirectTo({
          url: "/pages/listOfPrivateCars/pdf/index?flag=1"
        });
      },
      // 处理蓝牙连接状态：检查设备是否已连接，决定执行连接或重连逻辑
      handleBule() {
        formatAppLog("log", "at pages/index/index.vue:1060", "idc", this.deviceIDC);
        bleKeyManager.isDeviceConnected(this.deviceIDC, (status, param) => {
          formatAppLog("log", "at pages/index/index.vue:1062", "222222222--2-2-2-22-2-", status);
          if (status) {
            this.btnStartConnectConnected();
          } else {
            this.btnStartConnect();
          }
        });
      },
      // 设备已连接，执行已连接逻辑
      btnStartConnectConnected() {
        if (this.connectionID == "") {
          bleKeyManager.connectBLEConnected(
            this.deviceIDC,
            (state) => {
              this.bluetoothStateMonitor(state);
            },
            (type, arrayData, hexData, hexTextData) => {
              this.bluetoothDataMonitor(type, arrayData, hexData, hexTextData);
            }
          );
        }
      },
      // 蓝牙状态执行对应操作
      bluetoothStateMonitor: function(state) {
        if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_PRE_EXECUTE == state)
          ;
        else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ERROR == state)
          ;
        else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ADAPTER_UNAVAILABLE == state)
          ;
        else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_NOT_FOUND == state)
          ;
        else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_CONNECT_FAILED == state)
          ;
        else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_UNSUPPORTED == state)
          ;
        else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_SEND_FAILED == state)
          ;
        else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_NO_RESPONSE == state)
          ;
        else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_CONNECT_SUCESS == state)
          ;
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
        const newMsg = this.msg + `receive: type:${type}, data:${dataStr}\r
`;
        const scrollTarget = "hiddenview";
        this.msg = newMsg;
        this.scrollTo = scrollTarget;
      },
      // 发送控制命令
      btnCmdSend: function(type, data, sign) {
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
          case 17:
            this.PackAndSendspecial(type, 6, data, sign);
            break;
          case 59:
          case 58:
            const flameoutData = data;
            this.PackAndSend3a(type, 12, flameoutData);
            break;
          case 77:
            this.PackAndSendspecial04d(data);
            break;
          case 99:
            this.PackAndSendspecial063(data);
            break;
        }
      },
      PackAndSendspecial04d(data) {
        const packet = [36, 77, 1, data, 36];
        bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet));
      },
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
        formatAppLog("log", "at pages/index/index.vue:1223", type, dataLength, data, sign);
        const header = [36];
        const end = [36];
        const paddedData = [...data].concat(new Array(dataLength - data.length).fill(0)).slice(
          0,
          dataLength
        );
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
        formatAppLog("log", "at pages/index/index.vue:1240", packet);
        bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet));
      },
      // 数组转ArrayBuffer
      arrayToArrayBuffer: function(array, elementSize = 1) {
        const typedArray = new Uint8Array(array.length * elementSize);
        array.forEach((value, index) => typedArray[index * elementSize] = value);
        return typedArray.buffer;
      },
      // 处理密钥
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
          content: `${evt}${JSON.stringify(dist.getParseHexDataObject(this.trimHexData(evt)))}`,
          logdate: fmt
        };
        const updatedLogs = [...currentLogs, newLogEntry];
        if (updatedLogs.length >= MAX_LOGS_BEFORE_UPLOAD) {
          const response = u_uploadLog(updatedLogs);
          if ((response == null ? void 0 : response.code) === 1e3) {
            this.logs = [];
          } else {
            this.logs = updatedLogs;
          }
          return;
        } else {
          this.logs = updatedLogs;
        }
      },
      //  数据解析按钮处理
      parseData: function(hexData) {
        formatAppLog("log", "at pages/index/index.vue:1321", "hexData", hexData);
        const parsedResult = dist.getParseHexDataObject(hexData);
        formatAppLog("log", "at pages/index/index.vue:1323", "parsedResult", parsedResult);
        if (parsedResult) {
          this.parsedData = parsedResult;
          this.updateMyPositionStyles();
        }
      },
      // 初始化蓝牙连接
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
        }
      },
      // 修剪16进制数据
      trimHexData: function(hexString) {
        if (typeof hexString !== "string" || !/^[0-9a-fA-F]+$/.test(hexString)) {
          throw new Error("无效的16进制字符串");
        }
        return hexString.slice(4, -2);
      },
      // 断开蓝牙连接
      btnEndConnect() {
        bleKeyManager.releaseBle();
      },
      // 指令公共方法
      sendVehicleCommandFun: function(commandCode, code) {
        var _a, _b, _c, _d;
        if (!((_a = this == null ? void 0 : this.bluetoothData) == null ? void 0 : _a.platenumber)) {
          uni.showModal({
            title: "提示",
            content: "请先开通设定再到开通设定-功能设置处完善设置",
            confirmText: "立即开通",
            success: (res2) => {
              if (res2.confirm) {
                uni.redirectTo({
                  url: "/pages/listOfPrivateCars/list/index"
                });
              }
            }
          });
          return;
        }
        if (((_b = this == null ? void 0 : this.bluetoothData) == null ? void 0 : _b.platenumber) && ((_c = this.parsedData) == null ? void 0 : _c.electric) > 10) {
          uni.showModal({
            title: "提示",
            content: commandCode == 3 || commandCode == 4 ? "确认下发指令" : "如原车钥匙不支持此功能请自行点击【更多钥匙功能】关闭",
            confirmText: commandCode == 3 || commandCode == 4 ? "确认" : "确认支持",
            complete: (res2) => {
              if (res2.confirm) {
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
        if (((_d = this.parsedData) == null ? void 0 : _d.electric) < 10) {
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
        u_sendInfo(temp);
      },
      handleToConfigure: function() {
        if (!isLogin()) {
          uni.navigateTo({
            url: "/pages/system/managerLoginView/loginView"
          });
          return;
        }
        uni.redirectTo({
          url: "/pages/listOfPrivateCars/setting/index?sign=4"
        });
      },
      //跳转配置
      /**
       * 获取已连接设备信息
       */
      btnConnected: function() {
        bleKeyManager.connectedDevice();
      },
      // 返回上一页面
      handleBackHome() {
        uni.redirectTo({
          url: "/pages/index/index"
        });
      },
      // 初始化获取缓存内容
      initToConfigureCache() {
        const currentItems = this.controlItems || [];
        uni.getStorage({
          key: "controlItems",
          success: (res2) => {
            const storageItems = res2.data || [];
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
            formatAppLog("log", "at pages/index/index.vue:1474", "合并并优先保留 enabled=false 的结果：", result);
            this.controlItems = result;
            setTimeout(() => {
              this.controlItemspanel = this.splitArray(result, 4);
            }, 500);
          },
          fail: (err) => {
            this.initContro();
          }
        });
      },
      // 更新滑块和填充层样式（核心）
      updateSliderStyles() {
        const val = this.parsedData;
        const {
          inductionUnlockSignal,
          inductionLockSignal
        } = val;
        this.unlockThumbStyle = `left: ${inductionUnlockSignal || 44}%;`;
        this.lockThumbStyle = `left: ${(inductionLockSignal || 54) / 2}%;`;
        this.unlockRange = inductionUnlockSignal || 50;
        this.lockRange = (inductionLockSignal || 60) / 2;
      },
      // 更新人物位置样式
      updateMyPositionStyles() {
        const val = this.parsedData;
        const {
          signalValue
        } = val;
        this.myPositionStyle = `left: ${signalValue / 2}%;`;
      },
      // 获取轨道尺寸（用于计算滑动位置）
      getTrackInfo(trackId) {
        return new Promise((resolve) => {
          const query = uni.createSelectorQuery().in(this);
          query.select(`#${trackId}`).boundingClientRect();
          query.exec((res2) => {
            resolve(
              (res2 == null ? void 0 : res2[0]) ? {
                width: res2[0].width,
                left: res2[0].left
              } : null
            );
          });
        });
      },
      // 滑块拖动事件
      async onlockSlide(e2) {
        var _a, _b;
        formatAppLog("log", "at pages/index/index.vue:1532", e2, "wwwww");
        if (((_a = this.parsedData) == null ? void 0 : _a.pairStatus) == "未配对") {
          const now = Date.now();
          if (now - this.lastPairTime < 3e3)
            return;
          this.btnPair();
          this.lastPairTime = now;
          return;
        }
        const {
          currentTarget: target,
          touches = []
        } = e2 || {};
        const touch = touches[0];
        if (!target || !touch) {
          return;
        }
        const trackId = (_b = target.dataset) == null ? void 0 : _b.id;
        const validTrackIds = /* @__PURE__ */ new Set(["lockTrack", "unlockTrack"]);
        if (!validTrackIds.has(trackId)) {
          return;
        }
        const trackInfo = await this.getTrackInfo(trackId);
        if (!(trackInfo == null ? void 0 : trackInfo.left) || !(trackInfo == null ? void 0 : trackInfo.width)) {
          return;
        }
        const touchX = touch.clientX;
        const relativeX = touchX - trackInfo.left;
        formatAppLog("log", "at pages/index/index.vue:1569", `${trackId} - 判断滑动值`);
        const trackConfig = {
          lockTrack: {
            maxProgress: 200,
            cmdParam: 0
          },
          unlockTrack: {
            maxProgress: 100,
            cmdParam: 1
          }
        };
        const {
          maxProgress,
          cmdParam
        } = trackConfig[trackId];
        const progress = Math.max(0, Math.min(maxProgress, Math.round(relativeX / trackInfo.width * maxProgress)));
        const THRESHOLD_CONFIG = {
          unlock: {
            defaultSignal: 100,
            min: 40,
            maxOffset: -10
            // 最大阈值 = 感应信号 + 偏移量
          },
          lock: {
            defaultSignal: 40,
            max: 180,
            minOffset: 10
            // 最小阈值 = 感应信号 + 偏移量
          }
        };
        const getParsedSignal = (context, trackType) => {
          const {
            data = {}
          } = context;
          const {
            parsedData = {}
          } = data;
          const config = THRESHOLD_CONFIG[trackType];
          const signalKey = trackType === "unlock" ? "inductionLockSignal" : "inductionUnlockSignal";
          return Number(parsedData[signalKey]) || config.defaultSignal;
        };
        const calculateValidProgress = (progress2, trackType) => {
          const config = THRESHOLD_CONFIG[trackType];
          const signal = getParsedSignal(this, trackType);
          const thresholds = trackType === "unlock" ? {
            min: config.min,
            max: signal + config.maxOffset
          } : {
            min: signal + config.minOffset,
            max: config.max
          };
          thresholds.min = Math.max(0, thresholds.min);
          thresholds.max = Math.min(255, thresholds.max);
          if (thresholds.min > thresholds.max) {
            thresholds.min = thresholds.max;
          }
          const validProgress = Math.max(thresholds.min, Math.min(thresholds.max, progress2));
          return {
            validProgress,
            ...thresholds
          };
        };
        const showThresholdTip = (progress2, thresholds, trackType) => {
          const typeText = trackType === "unlock" ? "开锁" : "锁定";
          let tipText;
          if (progress2 < thresholds.min) {
            tipText = `${typeText}进度不能小于${thresholds.min}，已自动修正为${thresholds.min}`;
          } else if (progress2 > thresholds.max) {
            tipText = `${typeText}进度不能大于${thresholds.max}，已自动修正为${thresholds.max}`;
          }
          if (tipText) {
            if (typeof (wx == null ? void 0 : wx.showToast) === "function") {
              uni.showToast({
                title: tipText,
                icon: "none",
                duration: 1500
              });
            } else {
              formatAppLog("warn", "at pages/index/index.vue:1651", "[提示]", tipText);
            }
          }
        };
        const toTwoHex = (num) => {
          return num.toString(16).padStart(2, "0").toUpperCase();
        };
        if (["unlockTrack", "lockTrack"].includes(trackId)) {
          const trackType = trackId.replace("Track", "");
          const progressNum = Number(progress) || 0;
          const {
            validProgress,
            min,
            max
          } = calculateValidProgress(progressNum, trackType);
          if (progressNum < min || progressNum > max) {
            showThresholdTip(
              progressNum,
              {
                min,
                max
              },
              trackType
            );
          }
          formatAppLog("log", "at pages/index/index.vue:1676", trackId, trackType);
          if (trackType == "lock") {
            this.lockThumbStyle = `left: ${validProgress / 2}%;`;
            this.lockRange = validProgress / 2;
          }
          if (trackType == "unlock") {
            this.unlockThumbStyle = `left: ${validProgress}%;`;
            this.unlockRange = validProgress || 50;
          }
          const hexProgress = toTwoHex(validProgress);
          this.btnCmdSend(17, cmdParam, hexProgress);
        }
      },
      // DIY恢复出厂设置
      initToTwoHex(num) {
        return num.toString(16).padStart(2, "0").toUpperCase();
      },
      handleRestoreSettings() {
        const CONST = {
          // 敏感值配置
          DEFAULT_UNLOCK_SENSITIVITY: 50,
          // 默认开锁敏感值
          DEFAULT_LOCK_SENSITIVITY: 70,
          // 默认关锁敏感值
          CMD_SET_SENSITIVITY: 17,
          // 设置敏感值指令码
          // 状态与路径
          LOGIN_PAGE: "/pages/system/managerLoginView/loginView",
          CONNECTION_STATE_UNCONNECTED: "未连接",
          PAIR_STATUS_UNPAIRED: "未配对",
          // 提示文本
          TOAST_BLUETOOTH_UNCONNECTED: "请等待蓝牙连接后重试",
          TOAST_SET_SUCCESS: "设置成功",
          MODAL_TITLE: "温馨提示",
          MODAL_CONTENT: "关锁敏感值不得低于开锁敏感值，使用默认关锁值前，需先将开锁敏感值设为默认值。",
          // 错误日志
          ERROR_MSG_UNLOCK: "设置开锁敏感值默认值失败：",
          ERROR_MSG_LOCK: "设置关锁敏感值默认值失败："
        };
        uni.showModal({
          title: "确认重置",
          content: "是否将开关锁敏感值恢复到出厂设置？",
          confirmText: "确认",
          success: (res2) => {
            if (res2 == null ? void 0 : res2.confirm) {
              const checkBluetooth = () => {
                if (this.connectionState === CONST.CONNECTION_STATE_UNCONNECTED) {
                  uni.showToast({
                    title: CONST.TOAST_BLUETOOTH_UNCONNECTED,
                    icon: "none"
                  });
                  return false;
                }
                return true;
              };
              const checkPair = (parsedData2) => {
                const {
                  inductionMode = false,
                  pairStatus = CONST.PAIR_STATUS_UNPAIRED
                } = parsedData2 || {};
                if (!inductionMode && pairStatus === CONST.PAIR_STATUS_UNPAIRED) {
                  this.btnPair();
                  return false;
                }
                return true;
              };
              const setSensitivity = (sensitivity, type, errorMsg) => {
                try {
                  this.btnCmdSend(CONST.CMD_SET_SENSITIVITY, type, this.initToTwoHex(
                    sensitivity
                  ));
                  uni.showToast({
                    title: CONST.TOAST_SET_SUCCESS,
                    icon: "none",
                    duration: 1500
                  });
                } catch (e2) {
                  formatAppLog("error", "at pages/index/index.vue:1777", errorMsg, e2);
                }
              };
              if (!checkBluetooth())
                return;
              const parsedData = this.parsedData || {};
              if (!checkPair(parsedData))
                return;
              setSensitivity(CONST.DEFAULT_LOCK_SENSITIVITY, 0, CONST.ERROR_MSG_LOCK);
              setSensitivity(CONST.DEFAULT_UNLOCK_SENSITIVITY, 1, CONST.ERROR_MSG_UNLOCK);
            }
          }
        });
      },
      // 更多设置弹窗
      /**
       * 处理更多设置点击事件
       * @param {Event} evt - 点击事件对象
       */
      handleMoreSettings(evt) {
        const {
          currentTarget = {}
        } = evt || {};
        const {
          dataset = {}
        } = currentTarget;
        const key = dataset.key;
        this.modalisShow = true;
        this.key_settings = key == "key_settings";
        this.all_settings = key == "all_settings";
      },
      // 关闭弹出窗
      handleMaskTap() {
        this.modalisShow = false;
        this.key_settings = false;
        this.all_settings = false;
      },
      // 设置 蓝牙断开自动断开锁车
      handleToBreakOff(e2) {
        var _a;
        const isEnabled = Boolean((_a = e2 == null ? void 0 : e2.detail) == null ? void 0 : _a.value);
        this.btnCmdSend(59, [isEnabled ? 1 : 0]);
      },
      // 锁车自动升窗
      handleAutoCloseTheWindow(e2) {
        var _a;
        const isEnabled = Boolean((_a = e2 == null ? void 0 : e2.detail) == null ? void 0 : _a.value);
        this.btnCmdSend(77, [isEnabled ? 1 : 0]);
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
        this.$nextTick(() => {
          const updatedItem = this.keyInstructions[updateIndex];
          if (updatedItem == null ? void 0 : updatedItem.useTypeId) {
            this.handleInstructions(updatedItem);
          }
        });
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
        const instructionMap = dist.getInstructionMap(sendCommand);
        const idActions = instructionMap[id];
        formatAppLog("log", "at pages/index/index.vue:1884", idActions);
        if (!idActions) {
          return;
        }
        const action = idActions[useTypeId];
        if (action) {
          action();
        }
      },
      // 处理快捷设置按键命令
      PackAndSendSet(type, data) {
        const packet = [36, type, ...data, ...Array(12 - data.length).fill(0), 36];
        bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet));
      },
      splitArray(arr, n = 4) {
        const filteredArr = arr.filter((item) => item.enabled);
        const result = [];
        for (let i = 0; i < filteredArr.length; i += n) {
          result.push(filteredArr.slice(i, i + n));
        }
        return result;
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
        this.$nextTick(() => {
          this.controlItemspanel = this.splitArray(updatedItems, 4);
        });
        uni.setStorage({
          key: "controlItems",
          data: updatedItems
        });
      },
      // 调整安装手册
      handleJumpSc() {
        if (!isLogin()) {
          uni.navigateTo({
            url: "/pages/system/managerLoginView/loginView"
          });
          return;
        }
        uni.redirectTo({
          url: "/pages/listOfPrivateCars/pdf/index?flag=1"
        });
      },
      handleOnExistingAccountTap() {
        formatAppLog("log", "at pages/index/index.vue:1957", "占位：函数 handleOnExistingAccountTap 未声明");
        uni.redirectTo({
          url: "/pages/login/index"
        });
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia, _ja, _ka, _la, _ma, _na, _oa, _pa, _qa, _ra, _sa, _ta, _ua, _va, _wa, _xa, _ya, _za, _Aa;
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" 自定义头部区域：使用custom-header样式 "),
      vue.createElementVNode(
        "view",
        {
          class: "custom-header",
          style: vue.normalizeStyle("padding-top: " + $data.g_height_from_head + "px;height: " + $data.g_head_height + "px;")
        },
        [
          vue.createElementVNode("view", { class: "custom-header-outer-layer" }, [
            vue.createElementVNode("view", { class: "custom-header-outer-layer-title" }, [
              vue.createElementVNode(
                "view",
                { class: "custom-header-outer-layer-title" },
                vue.toDisplayString((_c = (_b = $data.bilingualData) == null ? void 0 : _b[(_a = $data.currentLanguage) == null ? void 0 : _a.value]) == null ? void 0 : _c.privateVehicle),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { style: { "color": "#bbb", "font-size": "20rpx" } },
                vue.toDisplayString((_f = (_e = $data.bilingualData) == null ? void 0 : _e[(_d = $data.currentLanguage) == null ? void 0 : _d.value]) == null ? void 0 : _f.privateTitle),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "custom-header-outer-layer-user_name" }, [
              $data.account ? (vue.openBlock(), vue.createElementBlock(
                "text",
                { key: 0 },
                vue.toDisplayString($data.account),
                1
                /* TEXT */
              )) : (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: 1 },
                [
                  vue.createElementVNode(
                    "text",
                    {
                      onClick: _cache[0] || (_cache[0] = (...args) => $options.handleOnExistingAccountTap && $options.handleOnExistingAccountTap(...args))
                    },
                    vue.toDisplayString((_i = (_h = $data.bilingualData) == null ? void 0 : _h[(_g = $data.currentLanguage) == null ? void 0 : _g.value]) == null ? void 0 : _i.pleaseLogIn),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("image", {
                    onClick: _cache[1] || (_cache[1] = (...args) => $options.handleOnExistingAccountTap && $options.handleOnExistingAccountTap(...args)),
                    src: _imports_0$4
                  })
                ],
                64
                /* STABLE_FRAGMENT */
              ))
            ]),
            vue.createElementVNode("view", { class: "language-selector" }, [
              vue.createCommentVNode(" 下拉菜单触发按钮 "),
              vue.createElementVNode(
                "view",
                {
                  onClick: _cache[2] || (_cache[2] = (...args) => $options.toggleDropdown && $options.toggleDropdown(...args)),
                  class: "selector-btn"
                },
                vue.toDisplayString($data.currentLanguage.label) + " ▼ ",
                1
                /* TEXT */
              ),
              vue.createCommentVNode(" 下拉菜单选项列表 "),
              vue.withDirectives(vue.createElementVNode(
                "view",
                { class: "dropdown-list" },
                [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.languageList, (lang, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        key: index,
                        onClick: ($event) => $options.handleLanguageChange(lang),
                        class: vue.normalizeClass(["dropdown-item", { active: lang.value === $data.currentLanguage.value }])
                      }, vue.toDisplayString(lang.label), 11, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ],
                512
                /* NEED_PATCH */
              ), [
                [vue.vShow, $data.isDropdownOpen]
              ])
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createCommentVNode(" 核心区域：使用container样式 "),
      vue.createElementVNode(
        "view",
        {
          class: "container",
          style: vue.normalizeStyle("height: " + ($data.g_screenTotalHeight - $data.g_tabBarHeight - $data.g_head_height) + "px; top: " + $data.g_head_height + "px;")
        },
        [
          vue.createElementVNode("view", { class: "top-fixed" }, [
            vue.createElementVNode("view", { class: "top-fixed-basics" }, [
              vue.createElementVNode("view", { class: "top-fixed-basics-plate" }, [
                vue.createElementVNode(
                  "view",
                  { class: "top-fixed-basics-plate-text" },
                  vue.toDisplayString($data.bluetoothData.platenumber),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "top-fixed-basics-plate-btn" }, [
                  vue.createElementVNode("view", { class: "top-fixed-basics-plate-btn-install" }, [
                    vue.createElementVNode("view", { class: "top-fixed-basics-plate-btn-install-iconfont" }, [
                      vue.createElementVNode("icon", {
                        type: "warn",
                        size: "14",
                        color: "#909090"
                      })
                    ]),
                    vue.createElementVNode(
                      "view",
                      {
                        class: "top-fixed-basics-plate-btn-install-tip",
                        onClick: _cache[3] || (_cache[3] = (...args) => $options.handleJumpSc && $options.handleJumpSc(...args))
                      },
                      vue.toDisplayString((_l = (_k = $data.bilingualData) == null ? void 0 : _k[(_j = $data.currentLanguage) == null ? void 0 : _j.value]) == null ? void 0 : _l.InstInstall),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", {
                    class: "top-fixed-basics-plate-btn-more",
                    "data-key": "all_settings",
                    onClick: _cache[4] || (_cache[4] = (...args) => $options.handleMoreSettings && $options.handleMoreSettings(...args))
                  }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString((_o = (_n = $data.bilingualData) == null ? void 0 : _n[(_m = $data.currentLanguage) == null ? void 0 : _m.value]) == null ? void 0 : _o.MoreSettings),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "top-fixed-signal" }, [
                vue.createElementVNode("view", { class: "top-fixed-signal-layar" }, [
                  vue.createElementVNode("image", {
                    src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/battery-01.png",
                    style: { "width": "46rpx", "height": "25rpx" }
                  }),
                  vue.createElementVNode("view", { class: "top-fixed-signal-layar-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "top-fixed-signal-layar-title" },
                      vue.toDisplayString((_r = (_q = $data.bilingualData) == null ? void 0 : _q[(_p = $data.currentLanguage) == null ? void 0 : _p.value]) == null ? void 0 : _r.battery) + "：",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "top-fixed-signal-text" },
                      vue.toDisplayString($data.parsedData.electric || 100) + "%",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "view",
                    { style: { "color": "#bbb", "font-size": "20rpx", "text-align": "left" } },
                    vue.toDisplayString((_u = (_t = $data.bilingualData) == null ? void 0 : _t[(_s = $data.currentLanguage) == null ? void 0 : _s.value]) == null ? void 0 : _u.mcckDeviceBattery),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "top-fixed-signal-layar" }, [
                  vue.createElementVNode("image", {
                    src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/bluetooth@2x.png",
                    style: { "width": "30rpx", "height": "33rpx" }
                  }),
                  vue.createElementVNode("view", { class: "top-fixed-signal-layar-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "top-fixed-signal-layar-title" },
                      vue.toDisplayString((_x = (_w = $data.bilingualData) == null ? void 0 : _w[(_v = $data.currentLanguage) == null ? void 0 : _v.value]) == null ? void 0 : _x.btStatus) + "：",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "top-fixed-signal-text" },
                      vue.toDisplayString($data.parsedData.electric ? (_A = (_z = $data.bilingualData) == null ? void 0 : _z[(_y = $data.currentLanguage) == null ? void 0 : _y.value]) == null ? void 0 : _A.connected : (_D = (_C = $data.bilingualData) == null ? void 0 : _C[(_B = $data.currentLanguage) == null ? void 0 : _B.value]) == null ? void 0 : _D.disConn),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "view",
                    { style: { "color": "#bbb", "font-size": "20rpx", "text-align": "left" } },
                    vue.toDisplayString((_G = (_F = $data.bilingualData) == null ? void 0 : _F[(_E = $data.currentLanguage) == null ? void 0 : _E.value]) == null ? void 0 : _G.mcckBtConnManual),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "top-fixed-signal-layar" }, [
                  vue.createElementVNode("image", {
                    src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/pair@2x.png",
                    style: { "width": "33rpx", "height": "23rpx" }
                  }),
                  vue.createElementVNode("view", { class: "top-fixed-signal-layar-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "top-fixed-signal-layar-title" },
                      vue.toDisplayString((_J = (_I = $data.bilingualData) == null ? void 0 : _I[(_H = $data.currentLanguage) == null ? void 0 : _H.value]) == null ? void 0 : _J.btPairing) + "：",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "top-fixed-signal-text" },
                      vue.toDisplayString($data.parsedData.pairStatus || "未配对"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "view",
                    { style: { "color": "#bbb", "font-size": "20rpx", "text-align": "left" } },
                    vue.toDisplayString((_M = (_L = $data.bilingualData) == null ? void 0 : _L[(_K = $data.currentLanguage) == null ? void 0 : _K.value]) == null ? void 0 : _M.mcckBtPairingInductive),
                    1
                    /* TEXT */
                  )
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "middle-scroll" }, [
            vue.createElementVNode("view", { class: "middle-title" }, [
              vue.createElementVNode("view", { style: { "display": "flex", "flex-direction": "column" } }, [
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString((_P = (_O = $data.bilingualData) == null ? void 0 : _O[(_N = $data.currentLanguage) == null ? void 0 : _N.value]) == null ? void 0 : _P.InductiveLock),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { style: { "font-size": "20rpx", "color": "#bbb" } },
                  vue.toDisplayString((_S = (_R = $data.bilingualData) == null ? void 0 : _R[(_Q = $data.currentLanguage) == null ? void 0 : _Q.value]) == null ? void 0 : _S.On) + " " + vue.toDisplayString((_V = (_U = $data.bilingualData) == null ? void 0 : _U[(_T = $data.currentLanguage) == null ? void 0 : _T.value]) == null ? void 0 : _V.Off),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("switch", {
                onChange: _cache[5] || (_cache[5] = (...args) => $options.handleToggleSensorMode && $options.handleToggleSensorMode(...args)),
                checked: $data.parsedData.inductionMode,
                color: "#1B64B1",
                style: { "transform": "scale(0.8)" }
              }, null, 40, ["checked"])
            ]),
            vue.createElementVNode("view", { class: "signal-card" }, [
              vue.createElementVNode("view", { class: "signal-info-group" }, [
                vue.createElementVNode(
                  "view",
                  { class: "signal-info-item" },
                  vue.toDisplayString((_Y = (_X = $data.bilingualData) == null ? void 0 : _X[(_W = $data.currentLanguage) == null ? void 0 : _W.value]) == null ? void 0 : _Y.MyLocation) + " :" + vue.toDisplayString($data.parsedData.signalValue || 40),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "signal-info-item" },
                  vue.toDisplayString((_$ = (__ = $data.bilingualData) == null ? void 0 : __[(_Z = $data.currentLanguage) == null ? void 0 : _Z.value]) == null ? void 0 : _$.UnlockSensitivity) + ":" + vue.toDisplayString($data.parsedData.inductionUnlockSignal || 50),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "signal-info-item" },
                  vue.toDisplayString((_ca = (_ba = $data.bilingualData) == null ? void 0 : _ba[(_aa = $data.currentLanguage) == null ? void 0 : _aa.value]) == null ? void 0 : _ca.LockSensitivity) + ":" + vue.toDisplayString($data.parsedData.inductionLockSignal || 60),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "signal-desc-group" }, [
                vue.createElementVNode(
                  "view",
                  { class: "signal-desc-item" },
                  "【" + vue.toDisplayString((_fa = (_ea = $data.bilingualData) == null ? void 0 : _ea[(_da = $data.currentLanguage) == null ? void 0 : _da.value]) == null ? void 0 : _fa.MyLocation) + "】: " + vue.toDisplayString((_ia = (_ha = $data.bilingualData) == null ? void 0 : _ha[(_ga = $data.currentLanguage) == null ? void 0 : _ga.value]) == null ? void 0 : _ia.MyLocationdes),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "signal-desc-item" },
                  "【" + vue.toDisplayString((_la = (_ka = $data.bilingualData) == null ? void 0 : _ka[(_ja = $data.currentLanguage) == null ? void 0 : _ja.value]) == null ? void 0 : _la.Rule) + "】: " + vue.toDisplayString((_oa = (_na = $data.bilingualData) == null ? void 0 : _na[(_ma = $data.currentLanguage) == null ? void 0 : _ma.value]) == null ? void 0 : _oa.Ruledes),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "signal-desc-item" },
                  "【" + vue.toDisplayString((_ra = (_qa = $data.bilingualData) == null ? void 0 : _qa[(_pa = $data.currentLanguage) == null ? void 0 : _pa.value]) == null ? void 0 : _ra.UnlockSensitivity) + "】: " + vue.toDisplayString((_ua = (_ta = $data.bilingualData) == null ? void 0 : _ta[(_sa = $data.currentLanguage) == null ? void 0 : _sa.value]) == null ? void 0 : _ua.UnlockSensitivitydes),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "signal-desc-item" },
                  "【" + vue.toDisplayString((_xa = (_wa = $data.bilingualData) == null ? void 0 : _wa[(_va = $data.currentLanguage) == null ? void 0 : _va.value]) == null ? void 0 : _xa.LockSensitivity) + "】: " + vue.toDisplayString((_Aa = (_za = $data.bilingualData) == null ? void 0 : _za[(_ya = $data.currentLanguage) == null ? void 0 : _ya.value]) == null ? void 0 : _Aa.LockSensitivitydes),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { style: { "font-size": "24rpx", "color": "#5B5959", "margin-top": "10rpx" } }, "温馨提示：默认设置若不合预期（开关锁位置/距离），请在个下方性化 DIY 处调整开关锁值")
            ]),
            vue.createElementVNode("view", { class: "middle-concrete-content" }, [
              vue.createElementVNode("view", { class: "middle-concrete-content-debugging" }, [
                vue.createElementVNode("view", { style: { "display": "flex", "flex-direction": "row", "justify-content": "space-between", "border-bottom": "1rpx solid #f1f1f1", "padding": "15rpx 0rpx" } }, [
                  vue.createElementVNode("view", { style: { "font-size": "25rpx", "font-weight": "bold" } }, "舒适进入个性化DIY"),
                  vue.createElementVNode("view", {
                    onClick: _cache[6] || (_cache[6] = (...args) => $options.handleRestoreSettings && $options.handleRestoreSettings(...args)),
                    style: { "font-size": "20rpx", "border": "1rpx solid #bbb", "background-color": "#3b82f6", "padding": "10rpx 10rpx", "border-radius": "10rpx", "color": "#fff" }
                  }, " 恢复出厂设置")
                ]),
                vue.createCommentVNode(" 开锁 "),
                vue.createElementVNode("view", {
                  class: "middle-concrete-content-debugging-title",
                  style: { "display": "flex", "flex-direction": "row", "justify-content": "space-between" }
                }, [
                  vue.createElementVNode("view", null, "开锁DIY")
                ]),
                vue.createElementVNode("view", {
                  class: "middle-concrete-content-debugging-slider-track tarck-unlock",
                  id: "unlockTrack"
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "middle-concrete-content-debugging-slider-fill fill-unlock",
                      style: vue.normalizeStyle("width: " + ($data.unlockRange + "%"))
                    },
                    null,
                    4
                    /* STYLE */
                  ),
                  vue.createElementVNode("view", { class: "middle-concrete-content-debugging-car-icon" }, [
                    vue.createElementVNode("view", { class: "middle-concrete-content-debugging-info" }, [
                      vue.createElementVNode("image", {
                        class: "middle-concrete-content-debugging-info-image",
                        src: _imports_0$3
                      }),
                      vue.createElementVNode(
                        "text",
                        { class: "middle-concrete-content-debugging-info-text" },
                        "敏感值: " + vue.toDisplayString($data.parsedData.inductionUnlockSignal || 50),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode(
                    "view",
                    {
                      class: "middle-concrete-content-debugging-slider-thumb",
                      style: vue.normalizeStyle($data.unlockThumbStyle),
                      "data-id": "unlockTrack",
                      onTouchmove: _cache[7] || (_cache[7] = (...args) => $options.onlockSlide && $options.onlockSlide(...args))
                    },
                    [
                      vue.createElementVNode("image", { src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/open@2x.png" })
                    ],
                    36
                    /* STYLE, NEED_HYDRATION */
                  )
                ]),
                vue.createElementVNode("view", { class: "middle-concrete-content-debugging-tip" }, ' 如开锁距离过远，则滑动"锁"图标调小数值，如开锁距离过近，则滑动"锁"图标调大数值。 '),
                vue.createCommentVNode(" 关锁 "),
                vue.createElementVNode("view", { style: { "font-weight": "bold", "font-size": "23rpx", "color": "#BA2B2B" } }, "关锁DIY"),
                vue.createElementVNode("view", {
                  class: "middle-concrete-content-debugging-slider-track tarck-lock",
                  id: "lockTrack"
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "middle-concrete-content-debugging-slider-fill fill-lock",
                      style: vue.normalizeStyle("width: " + ($data.lockRange + "%"))
                    },
                    null,
                    4
                    /* STYLE */
                  ),
                  vue.createElementVNode("view", { class: "middle-concrete-content-debugging-car-icon" }, [
                    vue.createElementVNode("view", { class: "middle-concrete-content-debugging-info" }, [
                      vue.createElementVNode("image", {
                        src: _imports_0$3,
                        class: "middle-concrete-content-debugging-info-image"
                      }),
                      vue.createElementVNode(
                        "text",
                        { class: "middle-concrete-content-debugging-info-text" },
                        "敏感值: " + vue.toDisplayString($data.parsedData.inductionLockSignal || 60),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode(
                    "view",
                    {
                      class: "middle-concrete-content-debugging-slider-thumb",
                      style: vue.normalizeStyle($data.lockThumbStyle),
                      "data-id": "lockTrack",
                      onTouchmove: _cache[8] || (_cache[8] = (...args) => $options.onlockSlide && $options.onlockSlide(...args))
                    },
                    [
                      vue.createElementVNode("image", { src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/shut@2x.png" })
                    ],
                    36
                    /* STYLE, NEED_HYDRATION */
                  )
                ]),
                vue.createElementVNode("view", { class: "middle-concrete-content-debugging-tip" }, ' 如关锁距离过远，则滑动"锁"图标调小数值，如关锁距离过近，则滑动"锁"图标调大数值。 '),
                vue.createCommentVNode(" 开车期间频繁开关锁调整DIY "),
                vue.createElementVNode("view", { style: { "font-weight": "bold", "font-size": "23rpx", "color": "#BA2B2B" } }, "开车期间频繁开关锁调整DIY"),
                vue.createElementVNode("view", {
                  class: "middle-concrete-content-debugging-slider-track tarck-special",
                  id: "unlockTrack"
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "middle-concrete-content-debugging-slider-fill fill-special",
                      style: vue.normalizeStyle("width: " + ($data.lockRange + "%"))
                    },
                    null,
                    4
                    /* STYLE */
                  ),
                  vue.createElementVNode("view", { class: "middle-concrete-content-debugging-car-icon" }, [
                    vue.createElementVNode("view", { class: "middle-concrete-content-debugging-info" }, [
                      vue.createElementVNode("image", {
                        src: _imports_0$3,
                        class: "middle-concrete-content-debugging-info-image"
                      }),
                      vue.createElementVNode(
                        "text",
                        { class: "middle-concrete-content-debugging-info-text" },
                        "敏感值: " + vue.toDisplayString($data.parsedData.inductionLockSignal || 60),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode(
                    "view",
                    {
                      class: "middle-concrete-content-debugging-slider-thumb",
                      style: vue.normalizeStyle($data.lockThumbStyle),
                      "data-id": "lockTrack",
                      onTouchmove: _cache[9] || (_cache[9] = (...args) => $options.onlockSlide && $options.onlockSlide(...args))
                    },
                    [
                      vue.createElementVNode("image", { src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/special@2x.png" })
                    ],
                    36
                    /* STYLE, NEED_HYDRATION */
                  )
                ]),
                vue.createElementVNode("view", { class: "middle-concrete-content-debugging-tip" }, " 如开车期间频繁开关锁，建议调大数值～调整后关锁数值会同步更新，关门敏感度会降低。 ")
              ])
            ])
          ]),
          vue.createElementVNode(
            "view",
            {
              class: "bottom-fixed",
              style: vue.normalizeStyle("height: " + $data.bottomHeight + "px;")
            },
            [
              vue.createElementVNode("view", { class: "bottom-fixed-identification" }, [
                vue.createElementVNode("text", { class: "bottom-fixed-identification-title" }, "我的手机汽车钥匙功能"),
                vue.createElementVNode("text", {
                  class: "bottom-fixed-identification-more",
                  "data-key": "key_settings",
                  onClick: _cache[10] || (_cache[10] = (...args) => $options.handleMoreSettings && $options.handleMoreSettings(...args))
                }, "更多钥匙功能 >")
              ]),
              vue.createElementVNode("swiper", {
                class: "bottom-fixed-swiper",
                "indicator-dots": true
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.controlItemspanel, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("swiper-item", {
                      class: "bottom-fixed-swiper-item",
                      key: index
                    }, [
                      vue.createCommentVNode(" 内层循环遍历每个子数组的控制项 "),
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(item, (control, controlIndex) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            class: "bottom-fixed-swiper-item-control",
                            onClick: ($event) => $options.handleParseEventDynamicCode($event, control.evt),
                            "data-id": control.id,
                            key: controlIndex
                          }, [
                            control.enabled ? (vue.openBlock(), vue.createElementBlock(
                              vue.Fragment,
                              { key: 0 },
                              [
                                vue.createElementVNode("image", {
                                  src: control.id === 1 || control.id === 2 ? (control.id === 1 ? $data.parsedData.lock : !$data.parsedData.lock) ? control.ative : control.icon : control.icon,
                                  style: { "width": "29rpx", "height": "36rpx" }
                                }, null, 8, ["src"]),
                                vue.createElementVNode(
                                  "text",
                                  null,
                                  vue.toDisplayString(control.name),
                                  1
                                  /* TEXT */
                                )
                              ],
                              64
                              /* STABLE_FRAGMENT */
                            )) : vue.createCommentVNode("v-if", true)
                          ], 8, ["onClick", "data-id"]);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
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
      ),
      vue.createCommentVNode(" 固定底部导航栏区域：使用tabbar样式，高度自适应 "),
      vue.createElementVNode(
        "view",
        {
          class: "tabbar",
          style: vue.normalizeStyle("height: " + $data.tabBarHeight + "px;")
        },
        [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.tabList, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: vue.normalizeClass("tab-item " + ($data.currentTab === index ? "active" : "")),
                onClick: _cache[11] || (_cache[11] = (...args) => $options.handleSwitchTabNavigation && $options.handleSwitchTabNavigation(...args)),
                "data-index": index,
                key: index
              }, [
                $data.currentTab === index ? (vue.openBlock(), vue.createElementBlock("image", {
                  key: 0,
                  src: "https://k1sw.wiselink.net.cn/img/" + item.selectedIconPath,
                  class: "tab-icon",
                  mode: "widthFix"
                }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("image", {
                  key: 1,
                  src: "https://k1sw.wiselink.net.cn/img/" + item.iconPath,
                  class: "tab-icon",
                  mode: "widthFix"
                }, null, 8, ["src"])),
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString(item.text),
                  1
                  /* TEXT */
                )
              ], 10, ["data-index"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ],
        4
        /* STYLE */
      ),
      vue.createCommentVNode(" 更多功能弹出区域 "),
      $data.modalisShow ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal-container"
      }, [
        vue.createElementVNode("view", {
          class: "modal-mask",
          onClick: _cache[12] || (_cache[12] = (...args) => $options.handleMaskTap && $options.handleMaskTap(...args))
        }),
        vue.createElementVNode("view", {
          class: "modal-content",
          style: { "background-color": "#eef1f4" }
        }, [
          vue.createElementVNode(
            "view",
            {
              style: vue.normalizeStyle("margin-top: " + $data.g_height_from_head + "px;"),
              onClick: _cache[13] || (_cache[13] = (...args) => $options.handleMaskTap && $options.handleMaskTap(...args))
            },
            [
              vue.createElementVNode("image", {
                src: _imports_2$1,
                style: { "width": "50rpx", "height": "50rpx" }
              })
            ],
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "modal-body",
              style: vue.normalizeStyle("margin-top: " + $data.g_height_from_head + "px;")
            },
            [
              $data.all_settings ? (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: 0 },
                [
                  vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card" }, [
                    vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer" }, [
                      vue.createElementVNode("text", { class: "modal-body-outer-layer-of-card-layer-title" }, "功能设置")
                    ]),
                    vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer-info" }, [
                      vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer-settings-item" }, [
                        vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer-item-left" }, [
                          vue.createElementVNode("text", { class: "modal-body-outer-layer-of-card-layer-item-text" }, "蓝牙断开自动锁车"),
                          vue.createElementVNode("switch", {
                            checked: $data.parsedData.bleDisconnectLock,
                            onChange: _cache[14] || (_cache[14] = (...args) => $options.handleToBreakOff && $options.handleToBreakOff(...args)),
                            color: "#07C160",
                            style: { "transform": "scale(0.7)" }
                          }, null, 40, ["checked"])
                        ]),
                        vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer-item-tips" }, " 启用后，若在开锁状态下与车载蓝牙断开，设备将自动执行一次关锁")
                      ]),
                      vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer-settings-item" }, [
                        vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer-item-left" }, [
                          vue.createElementVNode("text", { class: "modal-body-outer-layer-of-card-layer-item-text" }, "锁车自动升窗"),
                          vue.createElementVNode("switch", {
                            checked: $data.parsedData.lockWindowUp,
                            onChange: _cache[15] || (_cache[15] = (...args) => $options.handleAutoCloseTheWindow && $options.handleAutoCloseTheWindow(...args)),
                            color: "#07C160",
                            style: { "transform": "scale(0.7)" }
                          }, null, 40, ["checked"])
                        ]),
                        vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer-item-tips" }, " 启用后，按关锁按钮将执行升窗。需要提前配置升窗动作")
                      ])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card" }, [
                    vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer" }, [
                      vue.createElementVNode("text", { class: "modal-body-outer-layer-of-card-layer-title" }, "按键功能设置")
                    ]),
                    vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer-info" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList($data.keyInstructions, (item, index) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            class: "modal-body-outer-layer-of-card-layer-settings-item",
                            key: index
                          }, [
                            vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer-item-left" }, [
                              vue.createElementVNode(
                                "text",
                                { class: "modal-body-outer-layer-of-card-layer-item-text" },
                                vue.toDisplayString(item.name),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode("picker", {
                                "data-item": item,
                                "data-index": index,
                                onChange: _cache[16] || (_cache[16] = (...args) => $options.handleOutputMethod && $options.handleOutputMethod(...args)),
                                range: $data.key_out_put[index],
                                "range-key": "name"
                              }, [
                                vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer-picker" }, [
                                  vue.createElementVNode(
                                    "text",
                                    null,
                                    vue.toDisplayString(item.useType),
                                    1
                                    /* TEXT */
                                  ),
                                  vue.createElementVNode("image", { src: _imports_0$4 })
                                ])
                              ], 40, ["data-item", "data-index", "range"])
                            ])
                          ]);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])
                  ])
                ],
                64
                /* STABLE_FRAGMENT */
              )) : vue.createCommentVNode("v-if", true),
              $data.key_settings ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "modal-body-outer-layer-of-card"
              }, [
                vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer" }, [
                  vue.createElementVNode("text", { class: "modal-body-outer-layer-of-card-layer-title" }, "更多按键设置")
                ]),
                vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer-info" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.controlItems, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "modal-body-outer-layer-of-card-layer-settings-item",
                        key: index
                      }, [
                        vue.createElementVNode("view", { class: "modal-body-outer-layer-of-card-layer-item-left" }, [
                          vue.createElementVNode(
                            "text",
                            { class: "modal-body-outer-layer-of-card-layer-item-text" },
                            vue.toDisplayString(item.name),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode("switch", {
                            checked: item.enabled,
                            onChange: _cache[17] || (_cache[17] = (...args) => $options.handleToggleControl && $options.handleToggleControl(...args)),
                            "data-index": index,
                            color: "#07C160",
                            style: { "transform": "scale(0.7)" }
                          }, null, 40, ["checked", "data-index"])
                        ])
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])) : vue.createCommentVNode("v-if", true)
            ],
            4
            /* STYLE */
          )
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "C:/Users/PC/Documents/wslink/ZXTAPPS/pages/index/index.vue"]]);
  const _imports_1$3 = "/static/assets/images/index/useGuideIcon.png";
  const _sfc_main$9 = {
    data() {
      return {
        // 底部tabbar高度
        tabBarHeight: 80,
        // 当前选中的底部tabbar索引
        currentTab: 0,
        // 原始链接
        c_link: "https://k1sw.wiselink.net.cn/",
        // 头部轮播图数据
        g_banner_image: [],
        // 头部轮播图动态高度
        s_banner_height: "",
        // 咨询入群弹窗状态
        join_the_group_modal: false,
        // 使用指南数据
        fullBannerList: [],
        // 头部标题
        title_name: "",
        // 主题颜色
        bgcolor: "#fff",
        // 距离头部
        height_from_head: 44,
        // 专区入口数据（网络图片）
        zoneList: [{
          id: 1,
          name: "钥匙分享",
          bgcolor: "#EFF1FC",
          icon: "privateCar.png"
        }],
        // 底部tab数据（网络图片）
        tabList: [],
        head_height: "",
        capsule_distance_to_the_right: "",
        account: "",
        personal_qr_code: "",
        s_use_height: "",
        text: "",
        coupon_modal: ""
      };
    },
    onLoad(options) {
      this.initialGetBanner();
      this.initBottomDirectory();
      this.initZoneInfo();
      this.initBookList();
      if (options == null ? void 0 : options.name) {
        this.title_name = options == null ? void 0 : options.name;
      }
      if (options == null ? void 0 : options.bgcolor) {
        this.bgcolor = options == null ? void 0 : options.bgcolor;
      }
    },
    onShow() {
    },
    onReady() {
      this.initLoginStatus();
      this.initQrCode();
    },
    methods: {
      // 获取系统头部各区域高度
      initSystemInfo() {
        const {
          statusBarHeight: s
        } = uni.getWindowInfo();
        const m = uni.getMenuButtonBoundingClientRect();
        if (!m) {
          return;
        }
        const n = m.height + (m.top - s) * 2;
        formatAppLog("log", "at pages/ZoneHome/index.vue:214", s);
        const c = uni.getWindowInfo().screenWidth - m.right;
        this.height_from_head = s;
        this.head_height = s + n;
        this.capsule_distance_to_the_right = c;
      },
      // 获取头部banner资源
      async initialGetBanner() {
        const res2 = await u_bannerlist20();
        if ((res2 == null ? void 0 : res2.code) == 1e3) {
          this.g_banner_image = res2.content;
        }
      },
      // 获取当前登录状态
      initLoginStatus() {
        uni.getStorage({
          key: "user_info",
          // 替换为你的缓存键值
          success: (res2) => {
            var _a, _b;
            this.account = ((_a = res2 == null ? void 0 : res2.data) == null ? void 0 : _a.companyName) || ((_b = res2 == null ? void 0 : res2.data) == null ? void 0 : _b.username);
          },
          fail(err) {
            formatAppLog("error", "at pages/ZoneHome/index.vue:241", "获取失败", err);
          }
        });
      },
      // 请求入群码
      async initQrCode() {
        var _a;
        const response = await u_getQrcodeImg();
        if ((response == null ? void 0 : response.code) == 1e3) {
          this.personal_qr_code = (_a = response == null ? void 0 : response.content) == null ? void 0 : _a.img;
        }
      },
      // 获取底部导航数据
      async initBottomDirectory() {
        const response = await u_navlist20();
        if ((response == null ? void 0 : response.code) == 1e3) {
          this.tabList = response == null ? void 0 : response.content;
        }
      },
      // 获取专区目录
      async initZoneInfo() {
        const response = await u_getHomeArea();
        if ((response == null ? void 0 : response.code) == 1e3) {
          this.zoneList = response == null ? void 0 : response.content;
        }
      },
      // 获取使用指南
      async initBookList() {
        const response = await u_booklist();
        if (response == null ? void 0 : response.code) {
          this.fullBannerList = response.content;
        }
      },
      // 动态改变轮播图高度
      LoadOnUseGuideImageLoad(e2) {
        const [self2, {
          currentTarget: {
            dataset: {
              flag: mark
            } = {}
          } = {}
        }] = [this, e2 ?? {}];
        (async () => {
          try {
            const {
              detail: {
                width: w,
                height: h
              } = {}
            } = e2 ?? {};
            if (!w || !h || typeof w !== "number" || typeof h !== "number") {
              throw Symbol();
            }
            const {
              windowWidth: winW
            } = await uni.getSystemInfo({});
            if (!winW || typeof winW !== "number") {
              throw Symbol();
            }
            const ratioH = h / w * winW;
            const validH = isFinite(ratioH) ? ratioH : 0;
            if (mark === "use") {
              self2.s_use_height = validH;
            }
            if (mark === "banner") {
              self2.s_banner_height = validH;
            }
          } catch (err) {
            formatAppLog("log", "at pages/ZoneHome/index.vue:313", "CatchClause", err);
            formatAppLog("log", "at pages/ZoneHome/index.vue:314", "CatchClause", err);
            err.description || formatAppLog("error", "at pages/ZoneHome/index.vue:315", "imgLoadErr:", err);
          }
        })();
      },
      // 点击“咨询” 显示入群二维码
      handleShowContact() {
        this.join_the_group_modal = true;
      },
      // 点击关闭咨询&群二维码
      handleQRClose() {
        this.join_the_group_modal = false;
      },
      // 预览图片使其放大
      handleQRShowImageMask() {
        uni.previewMedia({
          sources: [{
            url: this.personal_qr_code,
            // 图片路径
            type: "image"
          }]
        });
      },
      // 切换底部导航
      handleSwitchTabNavigation(evt) {
        const {
          currentTarget: {
            dataset: {
              index: idx = null
            } = {}
          } = {}
        } = evt ?? {};
        if (idx === null) {
          return;
        }
        const {
          tabList = []
        } = this;
        const {
          pagePath: targetUrl
        } = tabList[idx] ?? {};
        if (!targetUrl) {
          return;
        }
        const [currentPage] = getCurrentPages().slice(-1);
        const {
          route: currentPath
        } = currentPage ?? {};
        if (!currentPath) {
          return;
        }
        const targetPurePath = targetUrl.split("?")[0];
        formatAppLog("log", "at pages/ZoneHome/index.vue:372", currentPath, targetPurePath);
        if (currentPath !== targetPurePath) {
          if (targetPurePath == "pages/privateCar/index") {
            uni.redirectTo({
              url: "/pages/index/index"
            });
          } else {
            uni.redirectTo({
              url: `/${targetUrl}`
            });
          }
        }
      },
      // 返回上一页面
      handleBackHome() {
        uni.redirectTo({
          url: "/pages/index/index"
        });
      },
      //  跳转功能页面
      handleGetMenuList(evt) {
        var _a, _b, _c;
        const path = (evt == null ? void 0 : evt.path) ?? ((_c = (_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.info) == null ? void 0 : _c.path);
        const hasDesk = path.includes("desk") || path.includes("/desk");
        if (hasDesk) {
          uni.switchTab({
            url: path
          });
        } else {
          uni.navigateTo({
            url: `/${path}`
          });
        }
      },
      handleOnExistingAccountTap() {
        formatAppLog("log", "at pages/ZoneHome/index.vue:410", "占位：函数 handleOnExistingAccountTap 未声明");
        uni.redirectTo({
          url: "/pages/login/index"
        });
      },
      onReachBottom() {
        formatAppLog("log", "at pages/ZoneHome/index.vue:417", "占位：函数 onReachBottom 未声明");
      },
      handleUseJump() {
        formatAppLog("log", "at pages/ZoneHome/index.vue:421", "占位：函数 handleUseJump 未声明");
      },
      handleOnGetPhoneNumber() {
        formatAppLog("log", "at pages/ZoneHome/index.vue:425", "占位：函数 handleOnGetPhoneNumber 未声明");
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" 页面根容器：设置整体背景图，使用container样式控制布局 "),
      vue.createElementVNode(
        "view",
        {
          class: "container",
          style: vue.normalizeStyle("background: linear-gradient(" + $data.bgcolor + ", #fff)")
        },
        [
          vue.createCommentVNode(" 自定义头部区域：包含系统状态栏高度适配，使用custom-header样式 "),
          vue.createElementVNode(
            "view",
            {
              class: "custom-header",
              style: vue.normalizeStyle("padding-top: " + $data.height_from_head + "px;height: " + $data.head_height + "px;")
            },
            [
              vue.createElementVNode("view", { class: "custom-header-outer-layer" }, [
                vue.createElementVNode(
                  "view",
                  { class: "custom-header-outer-layer-title" },
                  vue.toDisplayString((_a = $data.tabList[0]) == null ? void 0 : _a.text) + "服务",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "custom-header-outer-layer-user_name" }, [
                  $data.account ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    { key: 0 },
                    vue.toDisplayString($data.account),
                    1
                    /* TEXT */
                  )) : (vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    { key: 1 },
                    [
                      vue.createElementVNode("text", {
                        onClick: _cache[0] || (_cache[0] = (...args) => $options.handleOnExistingAccountTap && $options.handleOnExistingAccountTap(...args))
                      }, "请登录"),
                      vue.createElementVNode("image", {
                        onClick: _cache[1] || (_cache[1] = (...args) => $options.handleOnExistingAccountTap && $options.handleOnExistingAccountTap(...args)),
                        src: _imports_0$4
                      })
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  ))
                ])
              ])
            ],
            4
            /* STYLE */
          ),
          vue.createCommentVNode(" 中间滚动内容区：使用scroll-view实现垂直滚动，设置顶部和底部偏移量 "),
          vue.createElementVNode(
            "scroll-view",
            {
              class: "content",
              "scroll-y": true,
              style: vue.normalizeStyle("top: 90px; bottom: " + $data.tabBarHeight + "px;"),
              onScrolltolower: _cache[6] || (_cache[6] = (...args) => $options.onReachBottom && $options.onReachBottom(...args))
            },
            [
              vue.createCommentVNode(" 第一块：轮播图区域 "),
              vue.createElementVNode("view", { class: "swiper-container" }, [
                vue.createElementVNode(
                  "swiper",
                  {
                    "indicator-dots": false,
                    autoplay: true,
                    interval: "3000",
                    duration: "500",
                    style: vue.normalizeStyle("height: " + $data.s_banner_height + "px;")
                  },
                  [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.g_banner_image, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("swiper-item", { key: index }, [
                          vue.createElementVNode("image", {
                            src: $data.c_link + "/img/" + item.img,
                            class: "banner-img",
                            mode: "widthFix",
                            "data-flag": "banner",
                            onLoad: _cache[2] || (_cache[2] = (...args) => $options.LoadOnUseGuideImageLoad && $options.LoadOnUseGuideImageLoad(...args))
                          }, null, 40, ["src"])
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ],
                  4
                  /* STYLE */
                )
              ]),
              vue.createCommentVNode(" 第三块：专区入口区域（一行三列布局） "),
              vue.createElementVNode("view", { class: "special-zone" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.zoneList, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        class: "zone-item",
                        style: vue.normalizeStyle("margin-right: " + (index == 2 || index == 5 || index == 8 || index == 11 ? "0rpx" : "5%") + ";"),
                        key: index
                      },
                      [
                        vue.createElementVNode("view", {
                          class: "zone-out",
                          style: vue.normalizeStyle("background-color: " + item.bgcolor + ";"),
                          "data-info": item,
                          onClick: _cache[3] || (_cache[3] = (...args) => $options.handleGetMenuList && $options.handleGetMenuList(...args))
                        }, [
                          vue.createElementVNode("image", {
                            class: "zone-img",
                            src: "https://k1sw.wiselink.net.cn/img/" + item.icon
                          }, null, 8, ["src"]),
                          vue.createElementVNode("view", { class: "zone-text-area" }, [
                            vue.createElementVNode(
                              "view",
                              { class: "zone-name" },
                              vue.toDisplayString(item.name),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "view",
                              { class: "zone-desc" },
                              vue.toDisplayString(item.bak),
                              1
                              /* TEXT */
                            )
                          ])
                        ], 12, ["data-info"])
                      ],
                      4
                      /* STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createCommentVNode(" 第四块：全宽图片轮播区域 "),
              $data.fullBannerList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "full-width-swiper"
              }, [
                vue.createElementVNode("view", { class: "full-width-use" }, [
                  vue.createElementVNode("image", { src: _imports_1$3 }),
                  vue.createElementVNode("text", null, "使用指南")
                ]),
                vue.createElementVNode(
                  "swiper",
                  {
                    "indicator-dots": false,
                    autoplay: true,
                    interval: "4000",
                    duration: "500",
                    style: vue.normalizeStyle("height: " + $data.s_use_height + "px;")
                  },
                  [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.fullBannerList, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("swiper-item", {
                          "data-info": item,
                          onClick: _cache[5] || (_cache[5] = (...args) => $options.handleUseJump && $options.handleUseJump(...args)),
                          key: index
                        }, [
                          vue.createElementVNode("image", {
                            src: "https://k1sw.wiselink.net.cn/img/" + item.imgpath,
                            class: "full-banner-img",
                            "data-flag": "use",
                            onLoad: _cache[4] || (_cache[4] = (...args) => $options.LoadOnUseGuideImageLoad && $options.LoadOnUseGuideImageLoad(...args)),
                            mode: "widthFix"
                          }, null, 40, ["src"])
                        ], 8, ["data-info"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ],
                  4
                  /* STYLE */
                )
              ])) : vue.createCommentVNode("v-if", true)
            ],
            36
            /* STYLE, NEED_HYDRATION */
          ),
          vue.createCommentVNode(" 固定底部导航栏区域：使用tabbar样式，高度自适应 "),
          vue.createElementVNode(
            "view",
            {
              class: "tabbar",
              style: vue.normalizeStyle("height: " + $data.tabBarHeight + "px;")
            },
            [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.tabList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: vue.normalizeClass("tab-item " + ($data.currentTab === index ? "active" : "")),
                    onClick: _cache[7] || (_cache[7] = (...args) => $options.handleSwitchTabNavigation && $options.handleSwitchTabNavigation(...args)),
                    "data-index": index,
                    key: index
                  }, [
                    $data.currentTab === index ? (vue.openBlock(), vue.createElementBlock("image", {
                      key: 0,
                      src: "https://k1sw.wiselink.net.cn/img/" + item.selectedIconPath,
                      class: "tab-icon",
                      mode: "widthFix"
                    }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("image", {
                      key: 1,
                      src: "https://k1sw.wiselink.net.cn/img/" + item.iconPath,
                      class: "tab-icon",
                      mode: "widthFix"
                    }, null, 8, ["src"])),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.text),
                      1
                      /* TEXT */
                    )
                  ], 10, ["data-index"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ],
            4
            /* STYLE */
          )
        ],
        4
        /* STYLE */
      ),
      vue.createCommentVNode(" 弹窗代码 "),
      vue.createCommentVNode(" 优惠券图片容器（点击图片触发授权） "),
      $data.coupon_modal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "mask-container"
      }, [
        vue.createElementVNode("view", { class: "coupon-wrapper" }, [
          vue.createElementVNode(
            "button",
            {
              class: "image-auth-btn",
              "open-type": "getPhoneNumber",
              "hover-class": "btn_tapcolor",
              onGetphonenumber: _cache[8] || (_cache[8] = (...args) => $options.handleOnGetPhoneNumber && $options.handleOnGetPhoneNumber(...args))
            },
            [
              vue.createElementVNode("image", {
                src: "https://k3a.wiselink.net.cn/img/app/coupon50.png",
                mode: "widthFix",
                class: "coupon-image"
              })
            ],
            32
            /* NEED_HYDRATION */
          ),
          vue.createElementVNode("button", {
            class: "existing-account-btn",
            onClick: _cache[9] || (_cache[9] = (...args) => $options.handleOnExistingAccountTap && $options.handleOnExistingAccountTap(...args))
          }, "已有账号？点击登录")
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 点击咨询入群 "),
      vue.createElementVNode("view", {
        class: "float-button",
        onClick: _cache[10] || (_cache[10] = (...args) => $options.handleShowContact && $options.handleShowContact(...args))
      }, [
        vue.createElementVNode("image", { src: "https://k1sw.wiselink.net.cn/img/app2.0/desk/consulting.png" })
      ]),
      $data.join_the_group_modal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "qr-group-container"
      }, [
        vue.createElementVNode("view", {
          class: "qr-group-mask",
          onClick: _cache[13] || (_cache[13] = (...args) => $options.handleQRClose && $options.handleQRClose(...args))
        }, [
          vue.createCommentVNode(" 关闭按钮 "),
          vue.createElementVNode("view", {
            class: "qr-group-close",
            onClick: _cache[11] || (_cache[11] = (...args) => $options.handleQRClose && $options.handleQRClose(...args))
          }, "×"),
          vue.createElementVNode("view", { class: "qr-group-preview-content" }, [
            vue.createElementVNode("image", {
              onClick: _cache[12] || (_cache[12] = vue.withModifiers((...args) => $options.handleQRShowImageMask && $options.handleQRShowImageMask(...args), ["stop", "prevent"])),
              class: "qr-group-preview-img",
              src: $data.personal_qr_code,
              mode: "widthFix"
            }, null, 8, ["src"]),
            vue.createElementVNode("text", { class: "qr-group-preview-desc" }, "请点击、长按官方群二维码加入交流群，获取体验权限！")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesZoneHomeIndex = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "C:/Users/PC/Documents/wslink/ZXTAPPS/pages/ZoneHome/index.vue"]]);
  const info_screen = () => {
    return new Promise((resolve, reject) => {
      uni.getSystemInfo({
        success: function(res2) {
          formatAppLog("log", "at utils/scheme/screen.js:10", "屏幕可用高度:", res2.windowHeight);
          resolve(res2);
        },
        fail: function(err) {
          formatAppLog("error", "at utils/scheme/screen.js:14", "获取系统信息失败", err);
          reject(err);
        }
      });
    });
  };
  const _imports_0$2 = "/static/public/nav_left.png";
  const _imports_1$2 = "/static/public/home.png";
  const _sfc_main$8 = {
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
        uni.redirectTo({
          url: "/pages/index/index"
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
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
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
                src: _imports_0$2,
                class: "action-icon back-icon",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.handleBack && $options.handleBack(...args))
              }),
              vue.createElementVNode("image", {
                src: _imports_1$2,
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
  const CustomNavBar = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-3f55fa2f"], ["__file", "C:/Users/PC/Documents/wslink/ZXTAPPS/components/custom-header/index.vue"]]);
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
  const timeLine = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-3085ce19"], ["__file", "C:/Users/PC/Documents/wslink/ZXTAPPS/components/timeline/timeline.vue"]]);
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
  const _imports_0$1 = "/static/public/car_01.png";
  const _imports_1$1 = "/static/privateCar/right_1.png";
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
        formatAppLog("log", "at pages/blackTeche/sendTheKey/index.vue:478", evt, "1111");
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
        formatAppLog("log", "at pages/blackTeche/sendTheKey/index.vue:501", flag);
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
        ({
          page: this.g_page
        });
        u_paivateCarList().then((response) => {
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
        ({
          page: this.y_page
        });
        u_paivateRentRecord().then((response) => {
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
          formatAppLog("log", "at pages/blackTeche/sendTheKey/index.vue:621", [...this.y_items, ...response.content]);
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
        const submitRequest = async () => {
          try {
            const response = await u_sendRentKey(requestParams);
            if (response.code !== 1e3) {
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
            formatAppLog("log", "at pages/blackTeche/sendTheKey/index.vue:693", "CatchClause", error);
            formatAppLog("log", "at pages/blackTeche/sendTheKey/index.vue:694", "CatchClause", error);
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
        formatAppLog("log", "at pages/blackTeche/sendTheKey/index.vue:751", evt);
        const controlcode = evt.currentTarget.dataset.item.controlcode;
        const bak = (_c = (_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.item) == null ? void 0 : _c.bak;
        this.controlcode = controlcode, this.bak = bak;
      },
      handleEditKey(evt) {
        formatAppLog("log", "at pages/blackTeche/sendTheKey/index.vue:761", evt.currentTarget.dataset.item);
        this.c_edit_key_show_momal = true;
        this.g_edit_info = evt.currentTarget.dataset.item;
      },
      async handleFormEdit() {
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
        const response = await u_updateRentKey(requestParams);
        formatAppLog("log", "at pages/blackTeche/sendTheKey/index.vue:783", response, "0000");
        if (response.code == 1e3) {
          this.g_edit_info = {};
          this.c_edit_key_show_momal = false;
          this.y_triggered = false;
          this.y_page = 1;
          this.y_items = [];
          setTimeout(() => {
            this.getKeySendingList();
          }, 300);
        }
        formatAppLog("log", "at pages/blackTeche/sendTheKey/index.vue:796", requestParams);
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
              "refresher-enabled": false,
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
            $data.c_activeTab == 2 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
              key: 1,
              "scroll-y": "",
              onScrolltolower: _cache[7] || (_cache[7] = (...args) => $options.handleLower && $options.handleLower(...args)),
              "refresher-enabled": false,
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
                          onClick: _cache[4] || (_cache[4] = (...args) => $options.handleEditKey && $options.handleEditKey(...args)),
                          "data-item": item,
                          style: { "float": "left" }
                        }, "修改", 8, ["data-item"])
                      ]),
                      vue.createElementVNode("view", { style: { "display": "flex", "flex-direction": "row" } }, [
                        vue.createCommentVNode(' <button :data-item="item" open-type="share" @tap="handleForward">一键转发</button> '),
                        vue.createElementVNode("text", {
                          onClick: _cache[5] || (_cache[5] = (...args) => $options.handleCopy && $options.handleCopy(...args)),
                          "data-item": item
                        }, vue.toDisplayString($data.copied ? "已复制" : "复制链接"), 9, ["data-item"]),
                        vue.createElementVNode("text", {
                          onClick: _cache[6] || (_cache[6] = (...args) => $options.handleCance && $options.handleCance(...args)),
                          "data-item": item
                        }, "取消用车", 8, ["data-item"])
                      ])
                    ])) : vue.createCommentVNode("v-if", true)
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ], 40, ["refresher-triggered"])) : vue.createCommentVNode("v-if", true)
          ],
          4
          /* STYLE */
        )
      ]),
      vue.createCommentVNode(" 发送电子钥匙弹窗 "),
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
                vue.createElementVNode("text", null, "发送电子钥匙"),
                vue.createElementVNode("image", {
                  src: _imports_1$1,
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.handleHideSengKeyModal && $options.handleHideSengKeyModal(...args))
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
                  vue.createElementVNode("label", null, "结束时间"),
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
        onClick: _cache[15] || (_cache[15] = (...args) => $options.handleHideEditKeyModal && $options.handleHideEditKeyModal(...args))
      })) : vue.createCommentVNode("v-if", true),
      $data.c_edit_key_show_momal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "modal-base-map"
      }, [
        vue.createElementVNode(
          "form",
          {
            onSubmit: _cache[21] || (_cache[21] = (...args) => $options.handleFormEdit && $options.handleFormEdit(...args))
          },
          [
            vue.createElementVNode("view", { class: "modal-container" }, [
              vue.createElementVNode("view", { class: "modal-container-head" }, [
                vue.createElementVNode("text", null, "修改"),
                vue.createElementVNode("image", {
                  src: _imports_1$1,
                  onClick: _cache[16] || (_cache[16] = (...args) => $options.handleHideEditKeyModal && $options.handleHideEditKeyModal(...args))
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
                        onChange: _cache[17] || (_cache[17] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
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
                        onChange: _cache[18] || (_cache[18] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
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
                        onChange: _cache[19] || (_cache[19] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
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
                        onChange: _cache[20] || (_cache[20] = (...args) => $options.bindTimeChange && $options.bindTimeChange(...args))
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
  const PagesBlackTecheSendTheKeyIndex = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "C:/Users/PC/Documents/wslink/ZXTAPPS/pages/blackTeche/sendTheKey/index.vue"]]);
  const _sfc_main$5 = {
    data() {
      return {
        // 底部tabbar高度
        tabBarHeight: 80,
        // 当前选中的底部tabbar索引
        currentTab: 2,
        // 原始链接
        c_link: "https://k1sw.wiselink.net.cn/",
        // 咨询入群弹窗状态
        join_the_group_modal: false,
        // 底部tab数据（网络图片）
        tabList: [],
        contentList: [],
        height_from_head: 44,
        head_height: "",
        capsule_distance_to_the_right: "",
        account: "",
        personal_qr_code: ""
      };
    },
    onLoad() {
      this.initBottomDirectory();
      this.initDirectoryStructure();
    },
    onShow() {
    },
    onReady() {
      this.initLoginStatus();
      this.initQrCode();
    },
    methods: {
      // 获取系统头部各区域高度
      initSystemInfo() {
        const {
          statusBarHeight: s
        } = uni.getWindowInfo();
        const m = uni.getMenuButtonBoundingClientRect();
        if (!m) {
          return;
        }
        const n = m.height + (m.top - s) * 2;
        const c = uni.getWindowInfo().screenWidth - m.right;
        this.setData({
          height_from_head: s,
          head_height: s + n,
          capsule_distance_to_the_right: c
        });
      },
      // 获取当前登录状态
      initLoginStatus() {
        uni.getStorage({
          key: "user_info",
          // 替换为你的缓存键值
          success: (res2) => {
            var _a, _b;
            this.account = ((_a = res2 == null ? void 0 : res2.data) == null ? void 0 : _a.companyName) || ((_b = res2 == null ? void 0 : res2.data) == null ? void 0 : _b.username);
          },
          fail(err) {
            formatAppLog("error", "at pages/zoneCenter/index.vue:151", "获取失败", err);
          }
        });
      },
      // 请求入群码
      async initQrCode() {
        var _a;
        const response = await u_getQrcodeImg();
        if ((response == null ? void 0 : response.code) == 1e3) {
          this.personal_qr_code = (_a = response == null ? void 0 : response.content) == null ? void 0 : _a.img;
        }
      },
      // 获取底部导航数据
      async initBottomDirectory() {
        var _a;
        const response = await u_navlist20();
        if ((response == null ? void 0 : response.code) == 1e3) {
          this.tabList = response == null ? void 0 : response.content, this.currentTab = ((_a = response == null ? void 0 : response.content) == null ? void 0 : _a.length) - 1;
        }
      },
      // 获取目录结构数据
      async initDirectoryStructure() {
        const response = await u_mylist();
        if ((response == null ? void 0 : response.code) === 1e3) {
          this.contentList = response.content.concat({
            iconPath: null,
            menuId: null,
            pagePath: "",
            text: "退出"
          });
        }
      },
      // 点击“咨询” 显示入群二维码
      handleShowContact() {
        this.setData({
          join_the_group_modal: true
        });
      },
      // 点击关闭咨询&群二维码
      handleQRClose() {
        this.setData({
          join_the_group_modal: false
        });
      },
      // 预览图片使其放大
      handleQRShowImageMask() {
        uni.previewMedia({
          sources: [{
            url: this.personal_qr_code,
            // 图片路径
            type: "image"
          }]
        });
      },
      // 切换底部导航
      // 切换底部导航
      handleSwitchTabNavigation(evt) {
        const {
          currentTarget: {
            dataset: {
              index: idx = null
            } = {}
          } = {}
        } = evt ?? {};
        if (idx === null) {
          return;
        }
        const {
          tabList = []
        } = this;
        const {
          pagePath: targetUrl
        } = tabList[idx] ?? {};
        if (!targetUrl) {
          return;
        }
        const [currentPage] = getCurrentPages().slice(-1);
        const {
          route: currentPath
        } = currentPage ?? {};
        if (!currentPath) {
          return;
        }
        const targetPurePath = targetUrl.split("?")[0];
        formatAppLog("log", "at pages/zoneCenter/index.vue:241", currentPath, targetPurePath);
        if (currentPath !== targetPurePath) {
          if (targetPurePath == "pages/privateCar/index") {
            uni.redirectTo({
              url: "/pages/index/index"
            });
          } else {
            uni.redirectTo({
              url: `/${targetUrl}`
            });
          }
        }
      },
      // 返回上一页面
      handleBackHome() {
        uni.redirectTo({
          url: "/pages/index/index"
        });
      },
      // 点击工具执行
      handleFunExe(evt) {
        var _a, _b;
        formatAppLog("log", "at pages/zoneCenter/index.vue:265", evt);
        const info = (_b = (_a = evt == null ? void 0 : evt.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.info;
        if (!info || !info.pagePath) {
          wx.showModal({
            title: "提示",
            content: "确定要退出吗？",
            showCancel: true,
            cancelText: "取消",
            confirmText: "确定",
            success: (res2) => {
              if (res2.confirm) {
                const app = getApp();
                if (app == null ? void 0 : app.data)
                  app.data.userInfo = "";
                try {
                  wx.clearStorageSync();
                } catch (e2) {
                  formatAppLog("error", "at pages/zoneCenter/index.vue:281", "清除存储失败", e2);
                }
                wx.redirectTo({
                  url: "/pages/index/index"
                });
              }
            }
          });
          return;
        }
        const {
          pagePath
        } = info;
        uni.navigateTo({
          url: `/${pagePath}`
        });
      },
      handleOnExistingAccountTap() {
        formatAppLog("log", "at pages/zoneCenter/index.vue:300", "占位：函数 handleOnExistingAccountTap 未声明");
        uni.redirectTo({
          url: "/pages/login/index"
        });
      },
      onReachBottom() {
        formatAppLog("log", "at pages/zoneCenter/index.vue:307", "占位：函数 onReachBottom 未声明");
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" 页面根容器：设置整体背景图，使用container样式控制布局 "),
      vue.createElementVNode("view", { class: "container" }, [
        vue.createCommentVNode(" 自定义头部区域：包含系统状态栏高度适配，使用custom-header样式 "),
        vue.createElementVNode(
          "view",
          {
            class: "custom-header",
            style: vue.normalizeStyle("padding-top: " + $data.height_from_head + "px;height: " + $data.head_height + "px;")
          },
          [
            vue.createElementVNode("view", { class: "custom-header-outer-layer" }, [
              vue.createCommentVNode(' 	<image class="custom-header-outer-layer-image" src="/static/assets/images/index/home.png"\r\n						@tap="handleBackHome"></image> '),
              vue.createElementVNode("view", { class: "custom-header-outer-layer-title" }, "个人中心"),
              vue.createElementVNode("view", { class: "custom-header-outer-layer-user_name" }, [
                $data.account ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  { key: 0 },
                  vue.toDisplayString($data.account),
                  1
                  /* TEXT */
                )) : (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 1 },
                  [
                    vue.createElementVNode("text", {
                      onClick: _cache[0] || (_cache[0] = (...args) => $options.handleOnExistingAccountTap && $options.handleOnExistingAccountTap(...args))
                    }, "请登录"),
                    vue.createElementVNode("image", {
                      onClick: _cache[1] || (_cache[1] = (...args) => $options.handleOnExistingAccountTap && $options.handleOnExistingAccountTap(...args)),
                      src: _imports_0$4
                    })
                  ],
                  64
                  /* STABLE_FRAGMENT */
                ))
              ])
            ])
          ],
          4
          /* STYLE */
        ),
        vue.createCommentVNode(" 中间滚动内容区：使用scroll-view实现垂直滚动，设置顶部和底部偏移量 "),
        vue.createElementVNode(
          "scroll-view",
          {
            class: "content",
            "scroll-y": true,
            style: vue.normalizeStyle("top: 90px; bottom: " + $data.tabBarHeight + "px;"),
            onScrolltolower: _cache[3] || (_cache[3] = (...args) => $options.onReachBottom && $options.onReachBottom(...args))
          },
          [
            vue.createElementVNode("view", { class: "my-content-list-container" }, [
              vue.createElementVNode("view", { class: "my-content-list-inner" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.contentList, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      "data-info": item,
                      class: vue.normalizeClass("my-content-list-item " + (index === $data.contentList.length - 1 ? "my-content-list-item_last" : "")),
                      onClick: _cache[2] || (_cache[2] = (...args) => $options.handleFunExe && $options.handleFunExe(...args)),
                      key: item.id
                    }, [
                      vue.createElementVNode("view", { class: "my-content-list-item__left" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "my-content-list-item__text" },
                          vue.toDisplayString(item.text),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("image", {
                        src: _imports_0$4,
                        class: "my-content-list-item__arrow",
                        mode: "widthFix"
                      })
                    ], 10, ["data-info"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ],
          36
          /* STYLE, NEED_HYDRATION */
        ),
        vue.createCommentVNode(" 固定底部导航栏区域：使用tabbar样式，高度自适应 "),
        vue.createElementVNode(
          "view",
          {
            class: "tabbar",
            style: vue.normalizeStyle("height: " + $data.tabBarHeight + "px;")
          },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.tabList, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: vue.normalizeClass("tab-item " + ($data.currentTab === index ? "active" : "")),
                  onClick: _cache[4] || (_cache[4] = (...args) => $options.handleSwitchTabNavigation && $options.handleSwitchTabNavigation(...args)),
                  "data-index": index,
                  key: index
                }, [
                  $data.currentTab === index ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    src: "https://k1sw.wiselink.net.cn/img/" + item.selectedIconPath,
                    class: "tab-icon",
                    mode: "widthFix"
                  }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("image", {
                    key: 1,
                    src: "https://k1sw.wiselink.net.cn/img/" + item.iconPath,
                    class: "tab-icon",
                    mode: "widthFix"
                  }, null, 8, ["src"])),
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(item.text),
                    1
                    /* TEXT */
                  )
                ], 10, ["data-index"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          4
          /* STYLE */
        )
      ]),
      vue.createCommentVNode(" 点击咨询入群 "),
      vue.createElementVNode("view", {
        class: "float-button",
        onClick: _cache[5] || (_cache[5] = (...args) => $options.handleShowContact && $options.handleShowContact(...args))
      }, [
        vue.createElementVNode("image", { src: "https://k1sw.wiselink.net.cn/img/app2.0/desk/consulting.png" })
      ]),
      $data.join_the_group_modal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "qr-group-container"
      }, [
        vue.createElementVNode("view", {
          class: "qr-group-mask",
          onClick: _cache[8] || (_cache[8] = (...args) => $options.handleQRClose && $options.handleQRClose(...args))
        }, [
          vue.createCommentVNode(" 关闭按钮 "),
          vue.createElementVNode("view", {
            class: "qr-group-close",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.handleQRClose && $options.handleQRClose(...args))
          }, "×"),
          vue.createElementVNode("view", { class: "qr-group-preview-content" }, [
            vue.createElementVNode("image", {
              onClick: _cache[7] || (_cache[7] = vue.withModifiers((...args) => $options.handleQRShowImageMask && $options.handleQRShowImageMask(...args), ["stop", "prevent"])),
              class: "qr-group-preview-img",
              src: $data.personal_qr_code,
              mode: "widthFix"
            }, null, 8, ["src"]),
            vue.createElementVNode("text", { class: "qr-group-preview-desc" }, "请点击、长按官方群二维码加入交流群，获取体验权限！")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesZoneCenterIndex = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "C:/Users/PC/Documents/wslink/ZXTAPPS/pages/zoneCenter/index.vue"]]);
  const _imports_1 = "/static/privateCar/_edit.png";
  const _imports_2 = "/static/privateCar/_delete.png";
  const _imports_3 = "/static/privateCar/ss.png";
  const _sfc_main$4 = {
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
          success: (res2) => {
            formatAppLog("log", "at pages/listOfPrivateCars/list/index.vue:336", "扫码成功:", res2);
            this.handleScanResult(res2.result);
          },
          fail: (err) => {
            formatAppLog("error", "at pages/listOfPrivateCars/list/index.vue:340", "扫码失败:", err);
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
      async initList(evt) {
        uni.showLoading({
          title: "加载中..."
        });
        const response = await u_paivatecarList();
        if ((response == null ? void 0 : response.code) == 1e3) {
          formatAppLog("log", "at pages/listOfPrivateCars/list/index.vue:404", response);
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
        return;
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
          complete: (res2) => {
            if (res2.confirm) {
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
          success(res2) {
            _this.sn = (res2 == null ? void 0 : res2.data.sn) || "";
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
                success: (res2) => {
                  if (res2.confirm) {
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
              success: (res2) => {
                var _a2, _b2;
                res2.confirm ? (_a2 = action.callback) == null ? void 0 : _a2.call(action, res2.content) : (_b2 = action.fallback) == null ? void 0 : _b2.call(action);
              }
            });
          }
        };
        uni.getStorage({
          key: "bluetoothData",
          success: (res2) => {
            executeNavigation(res2 == null ? void 0 : res2.data);
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
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
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
            )
          ]),
          vue.createCommentVNode(" 详情区域部分 "),
          $data.c_activeTab == 1 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
            key: 0,
            "scroll-y": "",
            onScrolltolower: _cache[5] || (_cache[5] = (...args) => $options.handleLower && $options.handleLower(...args)),
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
                          vue.createElementVNode("image", { src: _imports_0$3 }),
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
                          src: _imports_1,
                          "data-item": item,
                          onClick: _cache[2] || (_cache[2] = (...args) => $options.handleEdit && $options.handleEdit(...args))
                        }, null, 8, ["data-item"]),
                        vue.createElementVNode("image", {
                          src: _imports_2,
                          "data-item": item,
                          onClick: _cache[3] || (_cache[3] = (...args) => $options.handleDelete && $options.handleDelete(...args))
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
                        vue.createCommentVNode(' <view class="footer-right-btn" :data-item="item" @tap="handleSelectJump">\r\n										<text>设置</text>\r\n									</view> '),
                        $data.g_items.length > 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                          key: 0,
                          class: "footer-right-btn",
                          "data-item": item,
                          onClick: _cache[4] || (_cache[4] = (...args) => $options.handleSelectCar && $options.handleSelectCar(...args))
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
                    onInput: _cache[6] || (_cache[6] = (...args) => $options.handleBindinput && $options.handleBindinput(...args))
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
                    onInput: _cache[7] || (_cache[7] = (...args) => $options.handleBindinput && $options.handleBindinput(...args))
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
                    onInput: _cache[8] || (_cache[8] = (...args) => $options.handleBindinput && $options.handleBindinput(...args))
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
                        onInput: _cache[9] || (_cache[9] = (...args) => $options.handleBindinput && $options.handleBindinput(...args))
                      }, null, 40, ["value"]),
                      vue.createElementVNode("image", {
                        src: _imports_3,
                        mode: "",
                        onClick: _cache[10] || (_cache[10] = (...args) => $options.scanCode && $options.scanCode(...args)),
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
                    onInput: _cache[11] || (_cache[11] = (...args) => $options.handleBindinput && $options.handleBindinput(...args))
                  }, null, 40, ["value"]))
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "card-footer" }, [
              vue.createElementVNode(
                "view",
                {
                  onClick: _cache[12] || (_cache[12] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
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
      ),
      $data.c_activeTab == 1 && $data.g_flagMulti && $data.g_black.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "levitation-button",
        onClick: _cache[13] || (_cache[13] = (...args) => $options.handleJumpBlackInfo && $options.handleJumpBlackInfo(...args))
      }, [
        vue.createElementVNode("text", null, "确定")
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesListOfPrivateCarsListIndex = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "C:/Users/PC/Documents/wslink/ZXTAPPS/pages/listOfPrivateCars/list/index.vue"]]);
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
  const _sfc_main$3 = {
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
        this.initList();
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
          formatAppLog("error", "at pages/videoMaterials/index.vue:196", "[ScreenInfo] 获取屏幕信息失败:", error);
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
          formatAppLog("log", "at pages/videoMaterials/index.vue:210", response);
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
        formatAppLog("log", "at pages/videoMaterials/index.vue:352", this.g_param);
        ({
          page: this.g_page,
          ...this.g_param
        });
        const handle = evt ? u_promotionalApiWxBooklist : u_promotionalApi;
        await handle().then((response) => {
          formatAppLog("log", "at pages/videoMaterials/index.vue:359", response);
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
            formatAppLog("error", "at pages/videoMaterials/index.vue:426", "复制失败:", err);
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
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
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
          vue.createCommentVNode(' <view class="search-box">\r\n				<input placeholder="请输入名称" @blur="handleBlur" class="search-input" />\r\n			</view> ')
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
                      onClick: _cache[0] || (_cache[0] = (...args) => $options.hadleView && $options.hadleView(...args))
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
  const PagesVideoMaterialsIndex = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-60a55764"], ["__file", "C:/Users/PC/Documents/wslink/ZXTAPPS/pages/videoMaterials/index.vue"]]);
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
  const _imports_0 = "/static/public/logo.png";
  const _sfc_main$2 = {
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
        formatAppLog("log", "at pages/login/index.vue:114", 111);
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
            url: "/pages/index/index"
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
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
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
                  src: _imports_0,
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
  const PagesLoginIndex = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "C:/Users/PC/Documents/wslink/ZXTAPPS/pages/login/index.vue"]]);
  const _sfc_main$1 = {
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
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavBar = vue.resolveComponent("CustomNavBar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createVNode(_component_CustomNavBar, { title: "注册账号" }),
      vue.createElementVNode("view", { class: "register-area" }, [
        vue.createCommentVNode(" Logo 区域 "),
        vue.createElementVNode("view", { class: "logo-container fade-in" }, [
          vue.createElementVNode("view", { class: "logo-wrapper" }, [
            vue.createElementVNode("image", {
              src: _imports_0,
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
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/PC/Documents/wslink/ZXTAPPS/pages/register/register.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/ZoneHome/index", PagesZoneHomeIndex);
  __definePage("pages/blackTeche/sendTheKey/index", PagesBlackTecheSendTheKeyIndex);
  __definePage("pages/zoneCenter/index", PagesZoneCenterIndex);
  __definePage("pages/listOfPrivateCars/list/index", PagesListOfPrivateCarsListIndex);
  __definePage("pages/videoMaterials/index", PagesVideoMaterialsIndex);
  __definePage("pages/login/index", PagesLoginIndex);
  __definePage("pages/register/register", PagesRegisterRegister);
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
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/PC/Documents/wslink/ZXTAPPS/App.vue"]]);
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
