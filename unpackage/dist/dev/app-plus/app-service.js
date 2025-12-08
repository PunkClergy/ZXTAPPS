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
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
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
      formatAppLog("error", "at node_modules/z-utility/dist/index.js:134", "数据长度不正确，需为24（仅数据体）或32（完整帧）字符");
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
    formatAppLog("log", "at node_modules/z-utility/dist/index.js:245", "解析结果:", result);
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
      header["funAreaId"] = 1978;
      header["token"] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjg4MTY1MTc5MjQ5LCJ1c2VyIjoie1wiYWNxdWllc2NlbnRcIjoxLFwiYnR5cGVcIjowLFwiY29tcGFueUlkXCI6ODM4MCxcImNvbXBhbnlOYW1lXCI6XCLljJfkuqzkuLDlj7DmgLvpg6jln7rlnLBcIixcImZpbjNDb21wYW55SWRcIjo3NDAsXCJpZFwiOjMzMTAsXCJpbnZpdGVDb2RlXCI6XCJCR1IwQlwiLFwibW9iaWxlXCI6XCIxMzY4MzE4NzAzOVwiLFwicGVyc29uSW52aXRlQ29kZVwiOlwiQkdSMEJcIixcInJlYWxuYW1lXCI6XCLniYjmnKxcIixcInVzZXJuYW1lXCI6XCIxMzY4MzE4NzAzOVwiLFwieGN4T3BlbklkXCI6XCJvdlhXODYzWEFQakYxZmVhWGhPbXlnQ0o4bDRjXCJ9IiwiaWF0IjoxNzY1MTc5MjQ5fQ.0RnsSvhAMHl2HCePO558NxKgg3og1Q9ySnLbRHsTum0";
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
  const u_navlist20 = (data) => http.get("/deskapi/navlist20", data);
  const u_carList = (data) => http.get("/carapi/getCarList", data);
  const u_sendInfo = (data) => http.postFormData("/renterApi/uploadControlRecord", data);
  const u_uploadLog = (data) => http.post("/loggerapi/uploadLog", data);
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
                logger.e("查询已连接设备,未成功建立连接!!!");
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
      if (gIdc == devices.devices[0].localName) {
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
        getBLEDeviceWriteCharacteristicsConnected();
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
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:501", res2);
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
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:520", res2);
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
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:535", res2);
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
                formatAppLog("log", "at utils/BleKeyFun-utils-single.js:551", "MTU modify success");
              },
              fail: function(res3) {
                formatAppLog("log", "at utils/BleKeyFun-utils-single.js:554", "MTU modify fail");
              }
            });
          }
        );
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:562", res2);
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
                formatAppLog("log", "at utils/BleKeyFun-utils-single.js:589", "MTU modify success");
              },
              fail: function(res3) {
                formatAppLog("log", "at utils/BleKeyFun-utils-single.js:592", "MTU modify fail");
              }
            });
          }
        );
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:599", res2);
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
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:611", res2);
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:614", res2);
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
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:626", res2);
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:629", res2);
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
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:654", res2);
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
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:668", res2);
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
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:684", "随机指令接收:" + formatted + "  数据:" + receiverHexData);
        logger.e("随机指令数据:" + receiverHexData, false, false, true);
        gOnReceiveValue(0, arrayData, utils.hexCharCodeToStr(receiverHexData), receiverHexData);
      } else {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:688", "通知指令接收:" + formatted + "  数据:" + receiverHexData);
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
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:703", "随机指令接收:" + formatted + "  数据:" + receiverHexData);
        logger.e("随机指令数据:" + receiverHexData, false, false, true);
        gOnReceiveValue(0, arrayData, utils.hexCharCodeToStr(receiverHexData), receiverHexData);
      } else {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:707", "通知指令接收:" + formatted + "  数据:" + receiverHexData);
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
      success: function(res2) {
        writeBLECharacteristicValue2(true);
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:727", res2);
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
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:874", "指令发送成功:" + formatted + "  数据:" + sendHexData);
        logger.e("指令发送成功:" + sendHexData, false, false, true);
      } else {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:877", "!!!指令发送失败:" + formatted + "  数据:" + sendHexData);
        logger.e("!!!指令发送失败:" + sendHexData, false, false, true);
      }
    });
  }
  function makePair() {
    uni.makeBluetoothPair({
      deviceId,
      timeout: 2e4,
      success: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:892", res2);
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:895", res2);
      }
    });
  }
  function saveBLEDeviceInfo(deviceIDC) {
    formatAppLog("log", "at utils/BleKeyFun-utils-single.js:901", "saveBLEDeviceInfo");
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
    formatAppLog("log", "at utils/BleKeyFun-utils-single.js:919", "getBLEDeviceInfo");
    uni.getStorage({
      key: deviceIDC,
      success: function(res2) {
        var param = JSON.parse(res2.data);
        deviceId = param.deviceId;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:925", deviceId);
        gReadService = param.readServiceUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:927", gReadService);
        gWriteService = param.writeServiceUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:929", gWriteService);
        gReadCharacteristic = param.readCharacUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:931", gReadCharacteristic);
        gWriteCharacteristic = param.writeCharacUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:933", gWriteCharacteristic);
        gReadRandomCharacteristic = param.randomCharacUUID;
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:935", gReadRandomCharacteristic);
        result(true, param);
      },
      fail: function(res2) {
        formatAppLog("log", "at utils/BleKeyFun-utils-single.js:940", res2);
        result(false);
      }
    });
  }
  function clrBLEDeviceInfo(deviceIDC) {
    formatAppLog("log", "at utils/BleKeyFun-utils-single.js:947", "clrBLEDeviceInfo");
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
  const _imports_0 = "/static/assets/images/home/right_1.png";
  const _imports_1 = "/static/assets/images/home/car_icon.png";
  const _imports_2 = "/static/assets/images/close.png";
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
  const _sfc_main$1 = {
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
        // 蓝牙连接状态（文本描述：未连接/连接中/已连接/连接失败）
        connectionState: "未连接",
        // 蓝牙连接ID（系统分配的连接句柄，用于管理连接）
        connectionID: "",
        // 蓝牙连接状态-界面展示文本（格式化后的连接状态描述）
        connectionDisplay: "未连接",
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
        controlIndex: 0
      };
    },
    onLoad: function(options) {
      this.initScreenAndSystemInfo();
      this.initBottomDirectory();
      this.initToConfigureCache();
      this.handleSystemInfo();
      this.initCheckTimer();
      this.options = options;
    },
    onShow: function() {
      this.handleStart();
      this.startConnectionStatusPolling();
    },
    onHide: function() {
      const that = this;
      setTimeout(() => bleKeyManager.releaseBle(), 1500);
      this.connectionState = "未连接";
      this.connectionID = "";
      this.connectionDisplay = "未连接";
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
    },
    methods: {
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
        formatAppLog("log", "at pages/index/index.vue:596", currentPath, targetPurePath);
        if (currentPath !== targetPurePath) {
          uni.redirectTo({
            url: `/${targetUrl}`
          });
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
            formatAppLog("log", "at pages/index/index.vue:715", "设备信息:", this.deviceInfo);
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
          const displayText = isConnected ? connectionID : "未连接";
          const firmware = isConnected ? this.firmware : "";
          this.connectionState = isConnected ? "已连接" : "未连接";
          this.connectionID = connectionID;
          this.connectionDisplay = displayText;
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
      // 获取当前登录状态
      initLoginStatus() {
        uni.getStorage({
          key: "userKey",
          // 替换为你的缓存键值
          success: (res2) => {
            var _a, _b;
            this.account = ((_a = res2 == null ? void 0 : res2.data) == null ? void 0 : _a.companyName) || ((_b = res2 == null ? void 0 : res2.data) == null ? void 0 : _b.username);
          },
          fail(err) {
            formatAppLog("error", "at pages/index/index.vue:758", "获取失败", err);
          }
        });
      },
      // 初始化钥匙按钮内容
      initContro() {
        this.controlItemspanel = this.splitArray(dist.getControlItems(), 4);
        formatAppLog("log", "at pages/index/index.vue:766", this.splitArray(dist.getControlItems(), 4));
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
          formatAppLog("log", "at pages/index/index.vue:796", that);
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
            formatAppLog("error", "at pages/index/index.vue:816", "获取蓝牙数据失败:", err);
          });
        };
        if (options == null ? void 0 : options.scene) {
          formatAppLog("log", "at pages/index/index.vue:823", "处理URL参数:", options.scene);
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
                  const response = await u_carList();
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
        if (!isLogin()) {
          uni.navigateTo({
            url: "/pages/system/managerLoginView/loginView"
          });
          return;
        }
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
        bleKeyManager.isDeviceConnected(this.deviceIDC, (status, param) => {
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
        formatAppLog("log", "at pages/index/index.vue:1088", type, dataLength, data, sign);
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
        formatAppLog("log", "at pages/index/index.vue:1103", packet);
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
        const UPLOAD_LOG_URL = "https://k1sw.wiselink.net.cn/" + u_uploadLog.URL;
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
          byPostJson(
            UPLOAD_LOG_URL,
            updatedLogs,
            (response) => {
              var _a2;
              if (((_a2 = response == null ? void 0 : response.data) == null ? void 0 : _a2.code) === 1e3) {
                this.logs = [];
              } else {
                this.logs = updatedLogs;
              }
            },
            (err) => {
              formatAppLog("warn", "at pages/index/index.vue:1183", "日志上传失败，保留本地日志:", err);
              this.logs = updatedLogs;
            }
          );
        } else {
          this.logs = updatedLogs;
        }
      },
      //  数据解析按钮处理
      parseData: function(hexData) {
        const parsedResult = dist.getParseHexDataObject(hexData);
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
      // 快捷控制命令方法
      handleUnlock: function() {
        this.sendVehicleCommandFun(3, "");
      },
      // 开锁命令
      handleLock: function() {
        this.sendVehicleCommandFun(4, "");
      },
      // 锁车命令
      handleOpenTrunk: function() {
        this.sendVehicleCommandFun(5, "");
      },
      // 尾箱命令
      handleFindCar: function() {
        this.sendVehicleCommandFun(6, "");
      },
      // 寻车命令
      handlRaiseTheWindow: function() {
        this.sendVehicleCommandFun(7, 3);
      },
      // 升窗命令
      handleLowerTheWindow: function() {
        this.sendVehicleCommandFun(7, 4);
      },
      // 降窗命令
      // 指令公共方法
      sendVehicleCommandFun: function(commandCode, code) {
        var _a, _b;
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
        if (((_b = this == null ? void 0 : this.bluetoothData) == null ? void 0 : _b.platenumber) && this.connectionState == "已连接") {
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
        byPost("https://k1sw.wiselink.net.cn/" + u_sendInfo.URL, temp, function() {
        });
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
            formatAppLog("log", "at pages/index/index.vue:1379", "合并并优先保留 enabled=false 的结果：", result);
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
        var _a;
        const {
          currentTarget: target,
          touches = []
        } = e2 || {};
        const touch = touches[0];
        if (!target || !touch) {
          return;
        }
        const trackId = (_a = target.dataset) == null ? void 0 : _a.id;
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
        formatAppLog("log", "at pages/index/index.vue:1467", `${trackId} - 判断滑动值`);
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
              formatAppLog("warn", "at pages/index/index.vue:1547", "[提示]", tipText);
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
          formatAppLog("log", "at pages/index/index.vue:1572", trackId, trackType);
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
        const resetSettings = {
          modalisShow: false,
          key_settings: false,
          all_settings: false
        };
        this.resetSettings = resetSettings;
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
        formatAppLog("log", "at pages/index/index.vue:1684", idActions);
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
        formatAppLog("log", "at pages/index/index.vue:1757", "占位：函数 handleOnExistingAccountTap 未声明");
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
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
            vue.createElementVNode("view", { class: "custom-header-outer-layer-title" }, "私家车"),
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
                    src: _imports_0
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
                    vue.createElementVNode("view", {
                      class: "top-fixed-basics-plate-btn-install-tip",
                      onClick: _cache[2] || (_cache[2] = (...args) => $options.handleJumpSc && $options.handleJumpSc(...args))
                    }, "安装说明")
                  ]),
                  vue.createElementVNode("view", {
                    class: "top-fixed-basics-plate-btn-more",
                    "data-key": "all_settings",
                    onClick: _cache[3] || (_cache[3] = (...args) => $options.handleMoreSettings && $options.handleMoreSettings(...args))
                  }, [
                    vue.createElementVNode("text", null, "更多设置")
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
                    vue.createElementVNode("text", { class: "top-fixed-signal-layar-title" }, "当前电量："),
                    vue.createElementVNode(
                      "text",
                      { class: "top-fixed-signal-text" },
                      vue.toDisplayString($data.parsedData.electric || 100) + "%",
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "top-fixed-signal-layar" }, [
                  vue.createElementVNode("image", {
                    src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/bluetooth@2x.png",
                    style: { "width": "30rpx", "height": "33rpx" }
                  }),
                  vue.createElementVNode("view", { class: "top-fixed-signal-layar-info" }, [
                    vue.createElementVNode("text", { class: "top-fixed-signal-layar-title" }, "蓝牙状态："),
                    vue.createElementVNode(
                      "text",
                      { class: "top-fixed-signal-text" },
                      vue.toDisplayString($data.connectionState == "已连接" ? "蓝牙已连接" : "蓝牙已断开"),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "top-fixed-signal-layar" }, [
                  vue.createElementVNode("image", {
                    src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/pair@2x.png",
                    style: { "width": "33rpx", "height": "23rpx" }
                  }),
                  vue.createElementVNode("view", { class: "top-fixed-signal-layar-info" }, [
                    vue.createElementVNode("text", { class: "top-fixed-signal-layar-title" }, "蓝牙配对："),
                    vue.createElementVNode(
                      "text",
                      { class: "top-fixed-signal-text" },
                      vue.toDisplayString($data.parsedData.pairStatus || "未配对"),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "middle-scroll" }, [
            vue.createElementVNode("view", { class: "middle-title" }, [
              vue.createElementVNode("text", null, "感应开关锁"),
              vue.createElementVNode("switch", {
                onChange: _cache[4] || (_cache[4] = (...args) => $options.handleToggleSensorMode && $options.handleToggleSensorMode(...args)),
                checked: $data.parsedData.inductionMode,
                color: "#1B64B1",
                style: { "transform": "scale(0.8)" }
              }, null, 40, ["checked"])
            ]),
            vue.createElementVNode("view", { class: "middle-concrete-content" }, [
              vue.createElementVNode("view", { class: "middle-concrete-content-debugging" }, [
                vue.createElementVNode("view", { class: "middle-concrete-content-debugging-title" }, "开锁信号敏感值DIY"),
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
                        src: _imports_1
                      }),
                      vue.createElementVNode(
                        "text",
                        { class: "middle-concrete-content-debugging-info-text" },
                        "开锁范围: " + vue.toDisplayString($data.parsedData.inductionUnlockSignal || 50),
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
                      onTouchmove: _cache[5] || (_cache[5] = (...args) => $options.onlockSlide && $options.onlockSlide(...args))
                    },
                    [
                      vue.createElementVNode("image", { src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/open@2x.png" })
                    ],
                    36
                    /* STYLE, NEED_HYDRATION */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: "middle-concrete-content-debugging-person-icon",
                      style: vue.normalizeStyle($data.myPositionStyle)
                    },
                    [
                      vue.createElementVNode("view", { class: "middle-concrete-content-debugging-person-info" }, [
                        vue.createElementVNode("image", {
                          class: "middle-concrete-content-debugging-person-info-image",
                          src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/my_place.png"
                        }),
                        vue.createElementVNode(
                          "text",
                          { class: "middle-concrete-content-debugging-info-text" },
                          "我的位置:" + vue.toDisplayString($data.parsedData.signalValue || 40),
                          1
                          /* TEXT */
                        )
                      ])
                    ],
                    4
                    /* STYLE */
                  )
                ]),
                vue.createElementVNode("view", { class: "middle-concrete-content-debugging-tip" }, "拖动圆环，根据您与车辆的距离设定开锁感应范围。携带手机进入范围时，车辆将自动开锁。 ")
              ]),
              vue.createElementVNode("view", { class: "middle-concrete-content-debugging" }, [
                vue.createElementVNode("view", { class: "middle-concrete-content-debugging-title" }, "关锁信号敏感值DIY"),
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
                        src: _imports_1,
                        class: "middle-concrete-content-debugging-info-image"
                      }),
                      vue.createElementVNode(
                        "text",
                        { class: "middle-concrete-content-debugging-info-text" },
                        "关锁范围: " + vue.toDisplayString($data.parsedData.inductionLockSignal || 60),
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
                      onTouchmove: _cache[6] || (_cache[6] = (...args) => $options.onlockSlide && $options.onlockSlide(...args))
                    },
                    [
                      vue.createElementVNode("image", { src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/shut@2x.png" })
                    ],
                    36
                    /* STYLE, NEED_HYDRATION */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: "middle-concrete-content-debugging-person-icon",
                      style: vue.normalizeStyle($data.myPositionStyle)
                    },
                    [
                      vue.createElementVNode("view", { class: "middle-concrete-content-debugging-person-info" }, [
                        vue.createElementVNode("image", {
                          class: "middle-concrete-content-debugging-person-info-image",
                          src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/my_place.png"
                        }),
                        vue.createElementVNode(
                          "text",
                          { class: "middle-concrete-content-debugging-info-text" },
                          "我的位置:" + vue.toDisplayString($data.parsedData.signalValue || 50),
                          1
                          /* TEXT */
                        )
                      ])
                    ],
                    4
                    /* STYLE */
                  )
                ]),
                vue.createElementVNode("view", { class: "middle-concrete-content-debugging-tip" }, "拖动圆环，根据您与车辆的距离设定关锁感应范围。携带手机离开范围时，车辆将自动关锁。 ")
              ]),
              vue.createElementVNode("view", { class: "middle-concrete-content-debugging" }, [
                vue.createElementVNode("view", { class: "middle-concrete-content-debugging-title" }, "特殊情况DIY"),
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
                        src: _imports_1,
                        class: "middle-concrete-content-debugging-info-image"
                      }),
                      vue.createElementVNode(
                        "text",
                        { class: "middle-concrete-content-debugging-info-text" },
                        "关锁范围: " + vue.toDisplayString($data.parsedData.inductionLockSignal || 60),
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
                      onTouchmove: _cache[7] || (_cache[7] = (...args) => $options.onlockSlide && $options.onlockSlide(...args))
                    },
                    [
                      vue.createElementVNode("image", { src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/special@2x.png" })
                    ],
                    36
                    /* STYLE, NEED_HYDRATION */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: "middle-concrete-content-debugging-person-icon",
                      style: vue.normalizeStyle($data.myPositionStyle)
                    },
                    [
                      vue.createElementVNode("view", { class: "middle-concrete-content-debugging-person-info" }, [
                        vue.createElementVNode("image", {
                          class: "middle-concrete-content-debugging-person-info-image",
                          src: "https://k1sw.wiselink.net.cn/img/app2.0/sjc/my_place.png"
                        }),
                        vue.createElementVNode(
                          "text",
                          { class: "middle-concrete-content-debugging-info-text" },
                          "我的位置: " + vue.toDisplayString($data.parsedData.signalValue || 50),
                          1
                          /* TEXT */
                        )
                      ])
                    ],
                    4
                    /* STYLE */
                  )
                ]),
                vue.createElementVNode("view", { class: "middle-concrete-content-debugging-tip" }, "如车辆启动时频繁开锁关锁, 请拖动圆环远离车辆。调试本项会同步调整关锁灵敏度。 ")
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
                  onClick: _cache[8] || (_cache[8] = (...args) => $options.handleMoreSettings && $options.handleMoreSettings(...args))
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
                onClick: _cache[9] || (_cache[9] = (...args) => $options.handleSwitchTabNavigation && $options.handleSwitchTabNavigation(...args)),
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
          onClick: _cache[10] || (_cache[10] = (...args) => $options.handleMaskTap && $options.handleMaskTap(...args))
        }),
        vue.createElementVNode("view", {
          class: "modal-content",
          style: { "background-color": "#eef1f4" }
        }, [
          vue.createElementVNode(
            "view",
            {
              style: vue.normalizeStyle("margin-top: " + $data.g_height_from_head + "px;"),
              onClick: _cache[11] || (_cache[11] = (...args) => $options.handleMaskTap && $options.handleMaskTap(...args))
            },
            [
              vue.createElementVNode("image", {
                src: _imports_2,
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
                            onChange: _cache[12] || (_cache[12] = (...args) => $options.handleToBreakOff && $options.handleToBreakOff(...args)),
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
                            onChange: _cache[13] || (_cache[13] = (...args) => $options.handleAutoCloseTheWindow && $options.handleAutoCloseTheWindow(...args)),
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
                                onChange: _cache[14] || (_cache[14] = (...args) => $options.handleOutputMethod && $options.handleOutputMethod(...args)),
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
                                  vue.createElementVNode("image", { src: _imports_0 })
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
                            onChange: _cache[15] || (_cache[15] = (...args) => $options.handleToggleControl && $options.handleToggleControl(...args)),
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
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/PC/Documents/wslink/ZXTAPPS/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
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
