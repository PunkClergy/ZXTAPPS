var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// ../../../../../Documents/GitHub/ZXTSJC/node_modules/z-utility/dist/index.js
var require_dist = __commonJS({
  "../../../../../Documents/GitHub/ZXTSJC/node_modules/z-utility/dist/index.js"(exports, module) {
    var getInstructions = () => {
      return [
        { id: 1, name: "开锁功能指令配置", useType: "短按开锁键", useTypeId: "" },
        { id: 2, name: "关锁功能指令配置", useType: "短按关锁键", useTypeId: "" },
        { id: 3, name: "寻车功能指令配置", useType: "短按寻车键", useTypeId: "" },
        { id: 4, name: "尾箱功能指令配置", useType: "长按三秒尾箱键", useTypeId: "" },
        { id: 7, name: "升窗功能指令配置", useType: "长按7秒关锁键", useTypeId: "" },
        { id: 8, name: "降窗功能指令配置", useType: "长按7秒开锁键", useTypeId: "" }
      ];
    };
    var getOutputConfig = (customConfigs) => {
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
    var getControlItems = () => {
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
    var initVoltage = (dy) => {
      const thresholds = [4, 3.9, 3.8, 3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.1];
      const scores = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
      const index = thresholds.findIndex((threshold) => dy >= threshold);
      return index !== -1 ? scores[index] : 0;
    };
    var getBatteryLevel = (voltage) => {
      const thresholds = [90, 80, 70, 60, 50, 40, 30, 20, 10, 5];
      const values = ["100", "90", "80", "70", "60", "50", "40", "30", "20", "10"];
      const index = thresholds.findIndex((threshold) => voltage > threshold);
      return index !== -1 ? values[index] : "1";
    };
    var getParseHexDataObject = (hexString) => {
      if (!hexString || hexString.length !== 30) {
        console.error("数据长度不正确，需为24（仅数据体）或32（完整帧）字符");
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
      console.log("解析结果:", result);
      return result;
    };
    var getInstructionMap = (sendCommand) => {
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
    module.exports = {
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
  }
});
export default require_dist();
//# sourceMappingURL=z-utility.js.map
