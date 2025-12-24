<template>
	<view>
		<!-- 自定义头部区域：使用custom-header样式 -->
		<view class="custom-header"
			:style="'padding-top: ' + g_height_from_head + 'px;height: ' + g_head_height + 'px;'">
			<view class="custom-header-outer-layer">
				<view class="custom-header-outer-layer-title">
					<view class="custom-header-outer-layer-title">私家车</view>
					<view style="color: #bbb;font-size: 20rpx;">智信通手机汽车互联钥匙 <br />mobile car connect key(MCCK)</view>
				</view>
				<view class="custom-header-outer-layer-user_name">
					<block v-if="account">
						<text>{{ account }}</text>
					</block>
					<block v-else>
						<text @tap="handleOnExistingAccountTap">请登录</text>
						<image @tap="handleOnExistingAccountTap" src="/static/assets/images/home/right_1.png" />
					</block>
				</view>
			</view>
		</view>

		<!-- 核心区域：使用container样式 -->
		<view class="container"
			:style="'height: ' + (g_screenTotalHeight - g_tabBarHeight - g_head_height) + 'px; top: ' + g_head_height + 'px;'">
			<view class="top-fixed">
				<view class="top-fixed-basics">
					<view class="top-fixed-basics-plate">
						<view class="top-fixed-basics-plate-text">{{ bluetoothData.platenumber }}</view>
						<view class="top-fixed-basics-plate-btn">
							<view class="top-fixed-basics-plate-btn-install">
								<view class="top-fixed-basics-plate-btn-install-iconfont">
									<icon type="warn" size="14" color="#909090"></icon>
								</view>
								<view class="top-fixed-basics-plate-btn-install-tip" @tap="handleJumpSc">安装说明</view>
							</view>
							<view class="top-fixed-basics-plate-btn-more" data-key="all_settings"
								@tap="handleMoreSettings">
								<text>更多设置</text>
							</view>
						</view>
					</view>
					<view class="top-fixed-signal">
						<view class="top-fixed-signal-layar">
							<image src="https://k1sw.wiselink.net.cn/img/app2.0/sjc/battery-01.png"
								style="width: 46rpx; height: 25rpx" />
							<view class="top-fixed-signal-layar-info">
								<text class="top-fixed-signal-layar-title">电量：</text>
								<text class="top-fixed-signal-text">{{ parsedData.electric || 100 }}%</text>

							</view>
							<view style="color: #bbb;font-size: 20rpx;text-align: left;">MCCK设备当前电量</view>
						</view>
						<view class="top-fixed-signal-layar">
							<image src="https://k1sw.wiselink.net.cn/img/app2.0/sjc/bluetooth@2x.png"
								style="width: 30rpx; height: 33rpx" />
							<view class="top-fixed-signal-layar-info">
								<text class="top-fixed-signal-layar-title">蓝牙状态：</text>
								<text class="top-fixed-signal-text">{{ parsedData.electric?'已连接':'未连接' }}</text>
							</view>
							<view style="color: #bbb;font-size: 20rpx;text-align: left;">MCCK蓝牙连接，支持手动</view>
						</view>
						<view class="top-fixed-signal-layar">
							<image src="https://k1sw.wiselink.net.cn/img/app2.0/sjc/pair@2x.png"
								style="width: 33rpx; height: 23rpx" />
							<view class="top-fixed-signal-layar-info">
								<text class="top-fixed-signal-layar-title">蓝牙配对：</text>
								<text class="top-fixed-signal-text">{{ parsedData.pairStatus || '未配对' }}</text>
							</view>
							<view style="color: #bbb;font-size: 20rpx;text-align: left;">MCCK蓝牙配对，感应生效</view>
						</view>
					</view>
				</view>
			</view>
			<view class="middle-scroll">
				<view class="middle-title">
					<view style="display: flex;flex-direction: column;">
						<text>感应开关锁</text>
						<text style="font-size: 20rpx;color: #bbb;">
							开启：实现开门不罚站 关门不回头，无感自动开关锁。
							关闭：需手动操作： 在「我的手机汽车钥匙功能」区域-完成开关门操作。
						</text>
					</view>

					<switch @change="handleToggleSensorMode" :checked="parsedData.inductionMode" color="#1B64B1"
						style="transform: scale(0.8)" />
				</view>
				<view class="signal-card">
					<view class="signal-info-group">
						<view class="signal-info-item">我的位置 :{{parsedData.signalValue||40}}</view>
						<view class="signal-info-item">开锁敏感值:{{parsedData.inductionUnlockSignal||50}}</view>
						<view class="signal-info-item">关锁敏感值:{{parsedData.inductionLockSignal||60}}</view>
					</view>
					<view class="signal-desc-group">
						<view class="signal-desc-item">【我的位置】: 手机与硬件设备的蓝牙信号值，数值越小信号越强</view>
						<view class="signal-desc-item">【变化规则】: "我的位置",该数值随手机移动实时变动。</view>
						<view class="signal-desc-item">【开锁敏感值】: 信号值低于此值，车辆感应开锁</view>
						<view class="signal-desc-item">【关锁敏感值】: 信号值高于此值，车辆感应关锁</view>
					</view>
					<view style="font-size: 24rpx;color: #5B5959;margin-top: 10rpx;">温馨提示：默认设置若不合预期（开关锁位置/距离），请在个下方性化
						DIY 处调整开关锁值</view>
				</view>
				<view class="middle-concrete-content">

					<view class="middle-concrete-content-debugging">
						<view
							style="display: flex;flex-direction: row;justify-content: space-between;border-bottom:1rpx solid #f1f1f1;padding: 15rpx 0rpx;">
							<view style="font-size: 25rpx;font-weight: bold;">舒适进入个性化DIY</view>
							<view @click="handleRestoreSettings"
								style="font-size: 20rpx;border: 1rpx solid #bbb;background-color: #3b82f6;padding: 10rpx 10rpx;border-radius: 10rpx;color: #fff;">
								恢复出厂设置</view>
						</view>
						<!-- 开锁 -->
						<view class="middle-concrete-content-debugging-title"
							style="display: flex;flex-direction: row;justify-content: space-between;">
							<view>开锁DIY</view>
						</view>
						<view class="middle-concrete-content-debugging-slider-track tarck-unlock" id="unlockTrack">
							<view class="middle-concrete-content-debugging-slider-fill fill-unlock"
								:style="'width: ' + (unlockRange + '%')"></view>
							<view class="middle-concrete-content-debugging-car-icon">
								<view class="middle-concrete-content-debugging-info">
									<image class="middle-concrete-content-debugging-info-image"
										src="/static/privateCar/car_icon.png"></image>
									<text class="middle-concrete-content-debugging-info-text">敏感值:
										{{parsedData.inductionUnlockSignal||50}}</text>
								</view>
							</view>
							<view class="middle-concrete-content-debugging-slider-thumb" :style="unlockThumbStyle"
								data-id="unlockTrack" @touchmove="onlockSlide">
								<image src="https://k1sw.wiselink.net.cn/img/app2.0/sjc/open@2x.png" />
							</view>
						</view>
						<view class="middle-concrete-content-debugging-tip">
							如开锁距离过远，则滑动"锁"图标调小数值，如开锁距离过近，则滑动"锁"图标调大数值。
						</view>
						<!-- 关锁 -->
						<view style="font-weight: bold;font-size: 23rpx;color: #BA2B2B;">关锁DIY</view>
						<view class="middle-concrete-content-debugging-slider-track tarck-lock" id="lockTrack">
							<view class="middle-concrete-content-debugging-slider-fill fill-lock"
								:style="'width: ' + (lockRange + '%')"></view>
							<view class="middle-concrete-content-debugging-car-icon">
								<view class="middle-concrete-content-debugging-info">
									<image src="/static/privateCar/car_icon.png"
										class="middle-concrete-content-debugging-info-image" />
									<text class="middle-concrete-content-debugging-info-text">敏感值:
										{{parsedData.inductionLockSignal||60}}</text>
								</view>
							</view>
							<view class="middle-concrete-content-debugging-slider-thumb" :style="lockThumbStyle"
								data-id="lockTrack" @touchmove="onlockSlide">
								<image src="https://k1sw.wiselink.net.cn/img/app2.0/sjc/shut@2x.png" />
							</view>
						</view>
						<view class="middle-concrete-content-debugging-tip">
							如关锁距离过远，则滑动"锁"图标调小数值，如关锁距离过近，则滑动"锁"图标调大数值。
						</view>
						<!-- 开车期间频繁开关锁调整DIY -->
						<view style="font-weight: bold;font-size: 23rpx;color: #BA2B2B;">开车期间频繁开关锁调整DIY</view>
						<view class="middle-concrete-content-debugging-slider-track tarck-special" id="unlockTrack">
							<view class="middle-concrete-content-debugging-slider-fill fill-special"
								:style="'width: ' + (lockRange + '%')"></view>
							<view class="middle-concrete-content-debugging-car-icon">
								<view class="middle-concrete-content-debugging-info">
									<image src="/static/privateCar/car_icon.png"
										class="middle-concrete-content-debugging-info-image"></image>
									<text class="middle-concrete-content-debugging-info-text">敏感值:
										{{parsedData.inductionLockSignal||60}}</text>
								</view>
							</view>
							<view class="middle-concrete-content-debugging-slider-thumb" :style="lockThumbStyle"
								data-id="lockTrack" @touchmove="onlockSlide">
								<image src="https://k1sw.wiselink.net.cn/img/app2.0/sjc/special@2x.png" />
							</view>
						</view>
						<view class="middle-concrete-content-debugging-tip">
							如开车期间频繁开关锁，建议调大数值～调整后关锁数值会同步更新，关门敏感度会降低。
						</view>
					</view>
				</view>
			</view>
			<view class="bottom-fixed" :style="'height: ' + bottomHeight + 'px;'">
				<view class="bottom-fixed-identification">
					<text class="bottom-fixed-identification-title">我的手机汽车钥匙功能</text>
					<text class="bottom-fixed-identification-more" data-key="key_settings"
						@tap="handleMoreSettings">更多钥匙功能 ></text>
				</view>
				<swiper class="bottom-fixed-swiper" :indicator-dots="true">
					<swiper-item class="bottom-fixed-swiper-item" v-for="(item, index) in controlItemspanel"
						:key="index">
						<!-- 内层循环遍历每个子数组的控制项 -->

						<view class="bottom-fixed-swiper-item-control"
							@tap="handleParseEventDynamicCode($event, control.evt)" :data-id="control.id"
							v-for="(control, controlIndex) in item" :key="controlIndex">
							<block v-if="control.enabled">
								<image :src="
								        control.id === 1 || control.id === 2 ? ((control.id === 1 ? parsedData.lock : !parsedData.lock) ? control.ative : control.icon) : control.icon
								    " style="width: 29rpx; height: 36rpx" />

								<text>{{ control.name }}</text>
							</block>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>

		<!-- 固定底部导航栏区域：使用tabbar样式，高度自适应 -->
		<view class="tabbar" :style="'height: ' + tabBarHeight + 'px;'">
			<view :class="'tab-item ' + (currentTab === index ? 'active' : '')" @tap="handleSwitchTabNavigation"
				:data-index="index" v-for="(item, index) in tabList" :key="index">
				<image :src="'https://k1sw.wiselink.net.cn/img/' + item.selectedIconPath" class="tab-icon"
					mode="widthFix" v-if="currentTab === index" />

				<image :src="'https://k1sw.wiselink.net.cn/img/' + item.iconPath" class="tab-icon" mode="widthFix"
					v-else />

				<text>{{ item.text }}</text>
			</view>
		</view>

		<!-- 更多功能弹出区域 -->
		<view class="modal-container" v-if="modalisShow">
			<view class="modal-mask" @tap="handleMaskTap"></view>
			<view class="modal-content" style="background-color: #eef1f4">
				<view :style="'margin-top: ' + g_height_from_head + 'px;'" @tap="handleMaskTap">
					<image src="/static/privateCar/close.png" style="width: 50rpx; height: 50rpx" />
				</view>
				<view class="modal-body" :style="'margin-top: ' + g_height_from_head + 'px;'">
					<block v-if="all_settings">
						<view class="modal-body-outer-layer-of-card">
							<view class="modal-body-outer-layer-of-card-layer">
								<text class="modal-body-outer-layer-of-card-layer-title">功能设置</text>
							</view>
							<view class="modal-body-outer-layer-of-card-layer-info">
								<view class="modal-body-outer-layer-of-card-layer-settings-item">
									<view class="modal-body-outer-layer-of-card-layer-item-left">
										<text class="modal-body-outer-layer-of-card-layer-item-text">蓝牙断开自动锁车</text>
										<switch :checked="parsedData.bleDisconnectLock" @change="handleToBreakOff"
											color="#07C160" style="transform: scale(0.7)" />
									</view>
									<view class="modal-body-outer-layer-of-card-layer-item-tips">
										启用后，若在开锁状态下与车载蓝牙断开，设备将自动执行一次关锁</view>
								</view>
								<view class="modal-body-outer-layer-of-card-layer-settings-item">
									<view class="modal-body-outer-layer-of-card-layer-item-left">
										<text class="modal-body-outer-layer-of-card-layer-item-text">锁车自动升窗</text>
										<switch :checked="parsedData.lockWindowUp" @change="handleAutoCloseTheWindow"
											color="#07C160" style="transform: scale(0.7)" />
									</view>
									<view class="modal-body-outer-layer-of-card-layer-item-tips">
										启用后，按关锁按钮将执行升窗。需要提前配置升窗动作</view>
								</view>
							</view>
						</view>

						<view class="modal-body-outer-layer-of-card">
							<view class="modal-body-outer-layer-of-card-layer">
								<text class="modal-body-outer-layer-of-card-layer-title">按键功能设置</text>
							</view>
							<view class="modal-body-outer-layer-of-card-layer-info">
								<view class="modal-body-outer-layer-of-card-layer-settings-item"
									v-for="(item, index) in keyInstructions" :key="index">
									<view class="modal-body-outer-layer-of-card-layer-item-left">
										<text
											class="modal-body-outer-layer-of-card-layer-item-text">{{ item.name }}</text>
										<picker :data-item="item" :data-index="index" @change="handleOutputMethod"
											:range="key_out_put[index]" range-key="name">
											<view class="modal-body-outer-layer-of-card-layer-picker">
												<text>{{ item.useType }}</text>
												<image src="/static/assets/images/home/right_1.png" />
											</view>
										</picker>
									</view>
								</view>
							</view>
						</view>
					</block>
					<block v-if="key_settings">
						<view class="modal-body-outer-layer-of-card">
							<view class="modal-body-outer-layer-of-card-layer">
								<text class="modal-body-outer-layer-of-card-layer-title">更多按键设置</text>
							</view>
							<view class="modal-body-outer-layer-of-card-layer-info">
								<view class="modal-body-outer-layer-of-card-layer-settings-item"
									v-for="(item, index) in controlItems" :key="index">
									<view class="modal-body-outer-layer-of-card-layer-item-left">
										<text
											class="modal-body-outer-layer-of-card-layer-item-text">{{ item.name }}</text>
										<switch :checked="item.enabled" @change="handleToggleControl"
											:data-index="index" color="#07C160" style="transform: scale(0.7)" />
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getInstructions,
		getOutputConfig,
		getControlItems,
		getParseHexDataObject,
		getInstructionMap
	} from 'z-utility';
	import {
		u_navlist20,
		u_carList,
		u_sendInfo,
		u_uploadLog
	} from '@/api'

	import bleKeyManager from '@/utils/BleKeyFun-utils-single.js'
	// const appUtil = require('../../utils/app-util.js'); // 应用工具
	// const { u_getCarBluetoothKeyByCode } = require('../../utils/request/order');
	const VehicleCommand = {
		UNLOCK: 3, //开锁
		LOCK: 4, //关锁
		OPEN_TRUNK: 5, //尾箱
		FIND_CAR: 6, //寻车
		CONTROL_WINDOW: 7, //操作车窗
	};
	export default {
		components: {

		},
		data() {
			return {
				// 屏幕总高度（动态计算赋值）
				g_screenTotalHeight: '',

				// 底部tabbar固定高度（单位：px）
				g_tabBarHeight: 80,

				// 手机状态栏高度（单位：px）
				g_height_from_head: 44,

				// 自定义导航栏固定高度（单位：px）
				g_head_height: 84,

				// 胶囊按钮到右侧的距离（动态计算赋值，单位：px/百分比）
				g_capsule_distance_to_the_right: '',

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
				unlockThumbStyle: 'left: 44%',

				// 关锁范围滑块样式 - 左侧偏移量（界面展示定位）
				lockThumbStyle: 'left: 54%',

				// 人物位置展示样式 - 左侧偏移量（界面展示定位）
				myPositionStyle: 'left: 30%',

				// ===================== 蓝牙通信相关 =====================
				// 蓝牙设备标识（连接成功后赋值，唯一标识设备）
				dc: '',

				// 蓝牙通信-待发送/接收的原始数据（二进制/字符串格式）
				data: '',

				// 蓝牙通信-消息日志（存储交互过程中的提示/错误信息）
				msg: '',

				// 默认蓝牙设备ID（出厂预设/常用设备ID，用于快速连接）
				deviceIDC: '932505100228',

				// 蓝牙通信-原始加密密钥（数组格式，用于数据加解密）
				orgKey: [51, 71, 1, 130, 52, 51],

				// 设备所有者标识（true：是所有者，false：非所有者，影响操作权限）
				isOwner: false,


				// 蓝牙连接ID（系统分配的连接句柄，用于管理连接）
				connectionID: '',


				// ===================== 数据解析相关 =====================
				// 页面滚动目标锚点（指定滚动到的DOM元素ID，如'hiddenview'）
				scrollTo: 'hiddenview',

				// 解析蓝牙数据的长度（记录已解析的字节数，用于数据分片处理）
				parseLen: 0,

				// 蓝牙数据解析后的数据对象（存储解析后的设备状态信息）
				parsedData: {
					electric: '', // 设备电量（百分比/数值）
					pairStatus: '', // 配对状态（已配对/未配对）
					inductionMode: '', // 感应模式（开启/关闭）
					inductionUnlockSignal: '', // 感应开锁信号（原始值）
					signalValue: '', // 实时感应信号值（0-100）
					inductionLockSignal: '', // 感应关锁信号（原始值）
					lock: '', // 锁体状态（上锁/解锁）
					bleDisconnectLock: '', // 蓝牙断开自动锁状态（开启/关闭）
					lockWindowUp: '' // 车窗锁状态（升起/降下）
				},

				// ===================== 定时器相关 =====================
				// 设备状态检查定时器ID（循环检查蓝牙/设备状态，用于清除定时器）
				pageInterval: 0,

				// 网络状态标识（true：已联网，false：断网）
				netWork: false,

				// ===================== 界面控制相关 =====================
				// 控制按钮配置项（通过getControlItems()获取，包含按钮ID/名称/图标等）
				controlItems: getControlItems(),

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
				c_link: 'https://k1sw.wiselink.net.cn/',

				// 设置弹窗显示状态（true：显示，false：隐藏）
				modalisShow: false,

				// 更多钥匙功能展示标志（true：展开，false：收起）
				key_settings: false,

				// 更多功能展示标志（true：展开，false：收起）
				all_settings: false,

				// 钥匙指令集合（通过getInstructions()获取，包含指令ID/名称/功能描述）
				keyInstructions: getInstructions(),

				// 输出方式配置集合（通过getOutputConfig()获取，包含输出类型/参数等）
				key_out_put: getOutputConfig(),

				// 状态检查定时器ID（页面卸载时清除，防止内存泄漏）
				checkTimer: null,

				// 临时存储-配置选项（通用临时变量，存储各类配置参数）
				options: '',

				// 设备固件版本（存储蓝牙设备的固件版本号）
				firmware: '',

				// 账号信息（当前登录账号标识/信息）
				account: '',

				// 原始密钥备份（存储修改前的加密密钥，用于回滚/对比）
				orgKeyOld: '',

				// 蓝牙设备扩展数据（存储车牌号等设备关联信息）
				bluetoothData: {
					platenumber: '' // 车牌号（设备绑定的车辆号牌）
				},

				// 临时存储-验证码/授权码（通用临时变量）
				code: '',

				// 控制按钮临时对象（存储当前操作的按钮信息）
				control: {
					id: '', // 按钮ID
					enabled: '', // 启用状态（true/false）
					ative: '', // 激活状态（true/false，拼写可能为active笔误）
					icon: '', // 按钮图标
					name: '' // 按钮名称
				},

				// 控制按钮当前选中索引（用于标识当前操作的按钮位置）
				controlIndex: 0,
				// 点击滑动模块最后的时间
				lastPairTime: Date.now()
			};
		},
		onLoad: function(options) {
			// 获取屏幕数据
			this.initScreenAndSystemInfo();
			// 获取底部导航数据
			this.initBottomDirectory();
			//获取缓存内容 底部按键
			this.initToConfigureCache();
			// 获取设备信息
			this.handleSystemInfo();
			// 参数内容获取
			this.options = options

		},
		onShow: function() {
			this.handleStart(); //开始执行链接蓝牙
			this.startConnectionStatusPolling(); //启动连接状态轮询
		},
		onHide: function() {
			const that = this;
			setTimeout(() => bleKeyManager.releaseBle(), 1500);
			// 连接状态
			this.connectionID = ''
			this.parsedData = {}
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
			// 获取登录状态
			this.initLoginStatus();
		},
		methods: {
			// 获取当前登录状态
			initLoginStatus() {
				uni.getStorage({
					key: 'user_info',
					success: (res) => {
						console.log(res)
						this.account = res?.data?.companyName || res?.data?.username
						// 创建定时器
						this.initCheckTimer();

					},
					fail(err) {
						console.error('获取失败', err); // 失败时的错误信息
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
						this.sendVehicleCommandFun(VehicleCommand.UNLOCK, '');
					},
					handleLock: () => {
						this.sendVehicleCommandFun(VehicleCommand.LOCK, '');
					},
					handleOpenTrunk: () => {
						this.sendVehicleCommandFun(VehicleCommand.OPEN_TRUNK, '');
					},
					handleFindCar: () => {
						this.sendVehicleCommandFun(VehicleCommand.FIND_CAR, '');
					},
					handleRaiseTheWindow: () => {
						this.sendVehicleCommandFun(VehicleCommand.CONTROL_WINDOW, WindowAction.RAISE);
					},
					handleLowerTheWindow: () => {
						this.sendVehicleCommandFun(VehicleCommand.CONTROL_WINDOW, WindowAction.LOWER);
					},
				};

				const action = actions[eventType];
				if (typeof action === 'function') {
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
				const targetPurePath = targetUrl.split('?')[0];
				console.log(currentPath, targetPurePath);
				if (currentPath !== targetPurePath) {
					if (targetPurePath == 'pages/privateCar/index') {
						uni.redirectTo({
							url: '/pages/index/index'
						})
					} else {
						uni.redirectTo({
							url: `/${targetUrl}`
						});
					}

				}
			},

			// 获取底部导航数据
			async initBottomDirectory() {
				const res = await u_navlist20()
				if (res?.code == 1000) {
					this.tabList = res?.content
				}
			},

			// 配对按钮点击处理
			btnPair() {
				const platform = uni.getSystemInfoSync().platform;
				const that = this;
				const deviceInfo = uni.getDeviceInfo(); // 获取设备信息
				if (Number(that.parsedData?.electric) > 10 && (that.parsedData?.pairStatus != '已配对')) {
					// 判断Android系统
					if (deviceInfo.system.toLowerCase().includes('android')) {
						// 发送配对命令
						that.btnCmdSend(34, [1, 0, 0, 0, 0, 0, 0, 0]);
						uni.showModal({
							title: '提示',
							content: `请跳转系统蓝牙列表点击设备名称为${this.deviceIDC}的设备`,
							showCancel: true, // 是否显示取消按钮，默认 true
							cancelText: '取消', // 取消按钮文字（最多4个字符）
							cancelColor: '#000000', // 取消按钮颜色
							confirmText: '确定', // 确认按钮文字（最多4个字符）
							confirmColor: '#3CC51F', // 确认按钮颜色
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
						// iOS系统处理流程
						that.btnCmdSend(34, [1, 0, 0, 0, 0, 0, 0, 0]);
						setTimeout(() => {
							that.btnCmdSend(34, [2, 0, 0, 0, 0, 0, 0, 0]);
							setTimeout(() => {
								that.btnEndConnect(); // 结束连接
								const pairInteval = setInterval(() => {
									if (!bleKeyManager.getBLEConnectionState()) {
										// 检查连接状态
										clearInterval(pairInteval); // 清除定时器
										setTimeout(() => {
											that.btnStartConnect(); // 重新开始连
										}, 500);
									}
								}, 500);
								setTimeout(() => {
									clearInterval(pairInteval); // 超时清除定时器
								}, 3000);
							}, 200);
						}, 200);
					}
				} else {
					uni.showToast({
						title: '请等待蓝牙初始化',
						icon: 'none'
					});
				}
			},

			// 切换感应模式
			handleToggleSensorMode(e) {
				const {
					parsedData = {}
				} = this || {};
				const {
					inductionMode: oldFlag = false,
					pairStatus = '未配对'
				} = parsedData;
				const newFlag = e?.detail?.value ?? false;
				if (!oldFlag && pairStatus === '未配对') {
					this.btnPair();
					return;
				}
				const cmdValue = newFlag ? 1 : 0;
				this.btnCmdSend(58, [cmdValue]);
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
						}

						console.log('设备信息:', this.deviceInfo);
					},
					fail: console.error
				});
			},

			// 启动连接状态轮询
			startConnectionStatusPolling() {
				console.log(this.pageInterval)
				if (this.pageInterval) {
					return;
				}
				this.pageInterval = setInterval(() => {
					const isConnected = bleKeyManager.getBLEConnectionState();
					const connectionID = isConnected ? bleKeyManager.getBLEConnectionID() : '';
					const firmware = isConnected ? this.firmware : '';
					this.connectionID = connectionID
					this.firmware = firmware
				}, 200);
			},

			// 初始化屏幕及系统头部相关信息

			initScreenAndSystemInfo() {
				const {
					screenHeight = 0
				} = uni.getWindowInfo() || {};
				this.g_capsule_distance_to_the_right = 0
				this.g_screenTotalHeight = screenHeight

			},


			// 初始化钥匙按钮内容
			initContro() {
				this.controlItemspanel = this.splitArray(getControlItems(), 4)
				console.log(this.splitArray(getControlItems(), 4))
			},

			initCheckTimer() {
				if (this.checkTimer) {
					clearInterval(this.checkTimer);
				}
				const timer = setInterval(() => {
					if (this.connectionID == '') {
						this.handleStart();
					}
				}, 3000);
				this.checkTimer = timer
			},

			// 蓝牙连接处理
			async handleStart() {
				const that = this;
				const options = this.options;

				// 统一处理数据的函数
				const handleData = (data) => {
					if (!data) {
						return;
					}

					that.deviceIDC = `${data?.sn}`
					that.orgKey = that.handleTransformation(data?.bluetoothKey)
					that.orgKeyOld = data?.bluetoothKey
					that.bluetoothData = data
					console.log(that)
					setTimeout(() => {
						that.handleBule();
					}, 500)
				};

				// 统一请求蓝牙数据的函数
				const fetchBluetoothData = (code) => {
					byGet('https://k1sw.wiselink.net.cn/' + u_getCarBluetoothKeyByCode.URL, {
							code
						})
						.then((response) => {
							if (!response?.data?.content) {
								return;
							}
							that.netWork = true
							that.code = code
							handleData(response.data.content);
						})
						.catch((err) => {
							console.error('获取蓝牙数据失败:', err);
						});
				};


				// 1. 优先处理URL参数
				if (options?.scene) {
					console.log('处理URL参数:', options.scene);
					fetchBluetoothData(options.scene);

					// 同时将URL参数存入缓存，便于后续使用
					uni.setStorage({
						key: 'scene',
						data: options.scene
					});
				}
				// 2. URL参数不存在时处理缓存参数
				else {

					uni.getStorage({
						key: 'scene',
						success: (res) => {
							fetchBluetoothData(res.data);
						},
						fail: () => {
							uni.getStorage({
								key: 'bluetoothData',
								success: (evt_response) => {
									handleData(evt_response.data);
								},
								// 3. 缓存也不存在时处理车辆列表数据
								fail: async () => {
									const response = await u_carList()
									if (response?.code == 1000) {
										const firstCar = response.content[0];
										uni.setStorageSync('bluetoothData', firstCar);
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
				// if (!isLogin()) {
				// 	uni.navigateTo({
				// 		url: '/pages/system/managerLoginView/loginView'
				// 	});
				// 	return;
				// }
				uni.redirectTo({
					url: '/pages/listOfPrivateCars/list/index'
				});
			},

			// 跳转到详细设置
			handleSelectJump() {
				if (!isLogin()) {
					uni.navigateTo({
						url: '/pages/system/managerLoginView/loginView'
					});
					return;
				}
				if (this?.bluetoothData?.platenumber) {
					uni.redirectTo({
						url: `/pages/listOfPrivateCars/index?sn=${this.deviceIDC}&bluetoothKey=${this.orgKeyOld}`
					});
				} else {
					uni.showModal({
						title: '提示',
						content: '请先绑定车辆',
						confirmText: '立即绑定',
						success: (res) => {
							if (res.confirm) {
								uni.redirectTo({
									url: '/pages/listOfPrivateCars/list/index'
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
						url: '/pages/system/managerLoginView/loginView'
					});
					return;
				}
				uni.redirectTo({
					url: '/pages/listOfPrivateCars/pdf/index?flag=1'
				});
			},

			// 处理蓝牙连接状态：检查设备是否已连接，决定执行连接或重连逻辑
			handleBule() {
				console.log('idc', this.deviceIDC)
				bleKeyManager.isDeviceConnected(this.deviceIDC, (status, param) => {
					console.log('222222222--2-2-2-22-2-', status)
					if (status) {
						//设备已连接，执行已连接逻辑
						this.btnStartConnectConnected();
					} else {
						// 设备未连接，执行连接逻辑;
						this.btnStartConnect();
					}
				});
			},

			// 设备已连接，执行已连接逻辑
			btnStartConnectConnected() {
				if (this.connectionID == '') {
					bleKeyManager.connectBLEConnected(
						this.deviceIDC,
						(state) => {
							this.bluetoothStateMonitor(state);
						},
						(type, arrayData, hexData, hexTextData) => {
							this.bluetoothDataMonitor(type, arrayData, hexData, hexTextData);
						}
					);
				} else {
					// appUtil.showModal('已连接蓝牙', false, (confirm) => {});
				}
			},

			// 蓝牙状态执行对应操作
			bluetoothStateMonitor: function(state) {
				if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_PRE_EXECUTE == state) {
					//显示加载框
					//appUtil.showLoading('加载中...');
				} else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ERROR == state) {
					//异常取消加载框
					// appUtil.hideLoading();
				} else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_ADAPTER_UNAVAILABLE == state) {
					//蓝牙不可用
					// appUtil.showModal('请打开蓝牙', false, function(confirm) {});
				} else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_NOT_FOUND == state) {
					//没有扫描到设备信息
					// appUtil.showModal('没有发现设备', false, function(confirm) {});
				} else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_CONNECT_FAILED == state) {
					//连接失败
					//appUtil.showModal('蓝牙连接失败', false, function (confirm) { });
				} else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_UNSUPPORTED == state) {
					//不支持ble
					// appUtil.showModal('您的手机不支持低功耗蓝牙', false, function(confirm) {});
				} else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_SEND_FAILED == state) {
					//发送失败
					// appUtil.showModal('数据发送失败', false, function(confirm) {});
				} else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_NO_RESPONSE == state) {
					//无响应
					// appUtil.showModal('设备超时无响应', false, function(confirm) {});
				} else if (bleKeyManager.DEFAULT_BLUETOOTH_STATE.BLUETOOTH_CONNECT_SUCESS == state) {
					// appUtil.hideLoading();
				}
			},

			// 解析数据+验证合法性
			bluetoothDataMonitor: function(type, arrayData, hexData, hexTextData) {
				const dataStr = hexTextData || '';
				if (type === 0) {
					this.btnCmdSend(16, arrayData);
					setTimeout(() => {
						this.PackAndSend(16, 8, [0, 0, 0, 0, 0, 0, 0, 0]);
					}, 1000);
				}
				this.parseData(this.trimHexData(dataStr));
				this.handleLoggerapi(dataStr);
				const newMsg = this.msg + `receive: type:${type}, data:${dataStr}\r\n`;
				const scrollTarget = 'hiddenview';

				this.msg = newMsg
				this.scrollTo = scrollTarget

			},

			// 发送控制命令
			btnCmdSend: function(type, data, sign) {
				const that = this;
				const defaultData = [0, 0, 0, 0, 0, 0, 0, 0];
				switch (type) {
					case 16:
						// 认证命令
						const orgKey = this.orgKey; // 原始密钥
						that.PackAndSend(type, 8, that.auth_encrypt(orgKey, data));
						break;
					case 3: // 开锁
					case 4: // 锁车
					case 5: // 尾箱
					case 6:
						// 寻车
						that.PackAndSend(type, 8, defaultData);
						break;
					case 34:
						// 配对
						that.PackAndSend(type, 8, data);
						break;
					case 7:
						//
						that.PackAndSend07(type, 8, data);
						break;
					case 17:
						//开锁信号值
						this.PackAndSendspecial(type, 6, data, sign); // 发送6字节数据
						break;
					case 59: // 设置 断开蓝牙自动锁车
					case 58:
						// 设置 感应模式
						const flameoutData = data; // 第一个字节为0x01，后面补11个0x00
						this.PackAndSend3a(type, 12, flameoutData); // 发送12字节数据
						break;
					case 77:
						//设置锁车升窗
						this.PackAndSendspecial04d(data); // 发送6字节数据
						break;
					case 99:
						this.PackAndSendspecial063(data); // 发送6字节数据
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
					36 // Footer
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
				// 数据包格式: 起始符(0x24) + 类型 + 长度 + 数据 + 结束符(0x24)
				var packet = [36, type, len, ...data, 36];
				bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet));
			},

			// 打包并发送数据（支持动态数据体长度）
			PackAndSend3a(type, dataLength, data, sign) {
				console.log(type, dataLength, data, sign);
				const header = [36]; // 数据头
				const end = [36]; // 数据尾
				// 根据要求的数据长度填充数据，不足补0
				const paddedData = [...data].concat(new Array(dataLength - data.length).fill(0)).slice(0,
					dataLength);
				const packet = dataLength == 8 ? [...header, type, dataLength, ...data, ...end] : [...header,
					type, ...
					paddedData, ...end
				]; // 组合数据包
				bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet)); // 发送数据
			},

			// 升窗降窗指令封装
			PackAndSend07: function(type, len, data) {
				const defaultData = [0, 0, 0, 0, 0, 0, 0];
				var packet = [36, type, len, data, ...defaultData, 36];
				console.log(packet);
				bleKeyManager.dispatcherSend2(this.arrayToArrayBuffer(packet));
			},

			// 数组转ArrayBuffer
			arrayToArrayBuffer: function(array, elementSize = 1) {
				const typedArray = new Uint8Array(array.length * elementSize);
				array.forEach((value, index) => (typedArray[index * elementSize] = value));
				return typedArray.buffer;
			},

			// 处理密钥
			handleTransformation(number) {
				if (!number) {
					return;
				}
				const numStr = number.toString();
				// 分割成每两个字符一组
				const bytes = [];
				for (let i = 0; i < numStr.length; i += 2) {
					const byteStr = numStr.substring(i, i + 2);
					bytes.push(parseInt(byteStr, 16)); // 按16进制解析
				}

				return bytes;
			},

			// 上传报文
			handleLoggerapi(evt) {
				const MAX_LOGS_BEFORE_UPLOAD = 10;
				const UPLOAD_LOG_URL = 'https://k1sw.wiselink.net.cn/' + u_uploadLog.URL;
				const {
					deviceInfo,
					deviceIDC,
					logs: currentLogs
				} = this;
				const userId = getApp().globalData.data?.userInfo?.id;
				const d = new Date();
				const fmt =
					d.getFullYear() +
					'-' +
					String(d.getMonth() + 1).padStart(2, '0') +
					'-' +
					String(d.getDate()).padStart(2, '0') +
					' ' +
					String(d.getHours()).padStart(2, '0') +
					':' +
					String(d.getMinutes()).padStart(2, '0') +
					':' +
					String(d.getSeconds()).padStart(2, '0');

				// 构造当前日志项
				const newLogEntry = {
					userId,
					sn: deviceIDC,
					mobileinfo: `${deviceInfo?.brand || ''} ${deviceInfo?.model || ''} ${deviceInfo?.platform || ''} ${deviceInfo?.system || ''}`,
					content: `${evt}${JSON.stringify(getParseHexDataObject(this.trimHexData(evt)))}`,
					logdate: fmt
				};

				// 创建新日志数组（避免直接修改原数组）
				const updatedLogs = [...currentLogs, newLogEntry];
				// 判断是否达到上传阈值
				if (updatedLogs.length >= MAX_LOGS_BEFORE_UPLOAD) {
					const response = u_uploadLog(updatedLogs)
					if (response?.code === 1000) {
						this.logs = []
					} else {
						// 上传失败，保留日志（后续可重试）
						this.logs = updatedLogs
					}
					return
				} else {
					// 未达到阈值，仅本地保存
					this.logs = updatedLogs

				}
			},

			//  数据解析按钮处理
			parseData: function(hexData) {
				console.log('hexData', hexData)
				const parsedResult = getParseHexDataObject(hexData);
				console.log('parsedResult', parsedResult)
				if (parsedResult) {

					this.parsedData = parsedResult

					// 初始化样式
					// this.updateSliderStyles();
					this.updateMyPositionStyles();

				}
			},

			// 初始化蓝牙连接

			btnStartConnect: function() {
				const that = this;
				if (that.connectionID == '') {
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
					// appUtil.showModal('已连接蓝牙', false, function(confirm) {});
				}
			},

			// 修剪16进制数据
			trimHexData: function(hexString) {
				if (typeof hexString !== 'string' || !/^[0-9a-fA-F]+$/.test(hexString)) {
					throw new Error('无效的16进制字符串');
				}
				return hexString.slice(4, -2); // 去除头尾固定字符
			},

			// 断开蓝牙连接
			btnEndConnect() {
				bleKeyManager.releaseBle();
			},


			// 指令公共方法
			sendVehicleCommandFun: function(commandCode, code) {
				if (!this?.bluetoothData?.platenumber) {
					uni.showModal({
						title: '提示',
						content: '请先开通设定再到开通设定-功能设置处完善设置',
						confirmText: '立即开通',
						success: (res) => {
							if (res.confirm) {
								uni.redirectTo({
									url: '/pages/listOfPrivateCars/list/index'
								});
							}
						}
					});
					return;
				}
				if (this?.bluetoothData?.platenumber && this.parsedData?.electric > 10) {
					uni.showModal({
						title: '提示',
						content: commandCode == 3 || commandCode == 4 ? '确认下发指令' :
							'如原车钥匙不支持此功能请自行点击【更多钥匙功能】关闭',
						confirmText: commandCode == 3 || commandCode == 4 ? '确认' : '确认支持',
						complete: (res) => {
							if (res.confirm) {
								uni.showLoading({
									title: '加载中...',
									mask: true
								});
								this.btnCmdSend(commandCode, code);
								setTimeout(() => {
									uni.hideLoading();
								}, 1000);
								this.handleSendInfo(commandCode, code);
							}
						}
					});
					return;
				}
				if (this.parsedData?.electric < 10) {
					uni.showToast({
						title: '请等待蓝牙连接后重试',
						icon: 'none'
					});
					return;
				}
			},

			// 发送控制命令
			handleSendInfo(commandCode, code) {
				const temp = {
					sn: this.deviceIDC,
					controltype: `${commandCode}${code}`,
					electricity: this?.parsedData?.electric || 0
				};
				u_sendInfo(temp)
			},

			handleToConfigure: function() {
				if (!isLogin()) {
					uni.navigateTo({
						url: '/pages/system/managerLoginView/loginView'
					});
					return;
				}
				uni.redirectTo({
					url: '/pages/listOfPrivateCars/setting/index?sign=4'
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
					url: '/pages/index/index'
				});
			},

			// 初始化获取缓存内容
			initToConfigureCache() {
				const currentItems = this.controlItems || [];
				uni.getStorage({
					key: 'controlItems',
					success: (res) => {
						const storageItems = res.data || [];
						const merged = [...currentItems, ...storageItems];
						const uniqueMap = new Map();
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
						console.log('合并并优先保留 enabled=false 的结果：', result);
						this.controlItems = result
						setTimeout(() => {
							this.controlItemspanel = this.splitArray(result, 4)
						}, 500)
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


				this.unlockThumbStyle = `left: ${inductionUnlockSignal || 44}%;`
				this.lockThumbStyle = `left: ${(inductionLockSignal || 54) / 2}%;`
				this.unlockRange = inductionUnlockSignal || 50
				this.lockRange = (inductionLockSignal || 60) / 2

			},

			// 更新人物位置样式
			updateMyPositionStyles() {
				const val = this.parsedData;
				const {
					signalValue
				} = val;

				this.myPositionStyle = `left: ${signalValue / 2}%;`

			},

			// 获取轨道尺寸（用于计算滑动位置）
			getTrackInfo(trackId) {
				return new Promise((resolve) => {
					const query = uni.createSelectorQuery().in(this);
					query.select(`#${trackId}`).boundingClientRect();
					query.exec((res) => {
						resolve(
							res?.[0] ? {
								width: res[0].width,
								left: res[0].left
							} :
							null
						);
					});
				});
			},

			// 滑块拖动事件
			async onlockSlide(e) {
				console.log(e, 'wwwww')
				const {
					data: {
						parsedData = {
							pairStatus: '未配对'
						}
					} = {}
				} = this;
				if (this.parsedData?.pairStatus == '未配对') {
					const now = Date.now();
					if (now - this.lastPairTime < 3000) return;
					// 执行配对逻辑
					this.btnPair();
					// 更新最后执行时间
					this.lastPairTime = now;
					return;

				}
				const {
					currentTarget: target,
					touches = []
				} = e || {};
				const touch = touches[0];
				if (!target || !touch) {
					return;
				}
				const trackId = target.dataset?.id;
				const validTrackIds = new Set(['lockTrack', 'unlockTrack']);
				if (!validTrackIds.has(trackId)) {
					return;
				}
				const trackInfo = await this.getTrackInfo(trackId);
				if (!trackInfo?.left || !trackInfo?.width) {
					return;
				}
				const touchX = touch.clientX;
				const relativeX = touchX - trackInfo.left;
				console.log(`${trackId} - 判断滑动值`);
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
				const progress = Math.max(0, Math.min(maxProgress, Math.round((relativeX / trackInfo
						.width) *
					maxProgress)));
				const THRESHOLD_CONFIG = {
					unlock: {
						defaultSignal: 100,
						min: 40,
						maxOffset: -10 // 最大阈值 = 感应信号 + 偏移量
					},

					lock: {
						defaultSignal: 40,
						max: 180,
						minOffset: 10 // 最小阈值 = 感应信号 + 偏移量
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
					const signalKey = trackType === 'unlock' ? 'inductionLockSignal' :
						'inductionUnlockSignal';
					return Number(parsedData[signalKey]) || config.defaultSignal;
				};
				const calculateValidProgress = (progress, trackType) => {
					const config = THRESHOLD_CONFIG[trackType];
					const signal = getParsedSignal(this, trackType);
					const thresholds =
						trackType === 'unlock' ? {
							min: config.min,
							max: signal + config.maxOffset
						} : {
							min: signal + config.minOffset,
							max: config.max
						};
					thresholds.min = Math.max(0, thresholds.min); // 最小不低于0
					thresholds.max = Math.min(255, thresholds.max); // 最大不超过255（16进制两位上限）
					if (thresholds.min > thresholds.max) {
						thresholds.min = thresholds.max;
					} // 避免范围倒置
					const validProgress = Math.max(thresholds.min, Math.min(thresholds.max, progress));
					return {
						validProgress,
						...thresholds
					};
				};
				const showThresholdTip = (progress, thresholds, trackType) => {
					const typeText = trackType === 'unlock' ? '开锁' : '锁定';
					let tipText;
					if (progress < thresholds.min) {
						tipText = `${typeText}进度不能小于${thresholds.min}，已自动修正为${thresholds.min}`;
					} else if (progress > thresholds.max) {
						tipText = `${typeText}进度不能大于${thresholds.max}，已自动修正为${thresholds.max}`;
					}
					if (tipText) {
						if (typeof wx?.showToast === 'function') {
							uni.showToast({
								title: tipText,
								icon: 'none',
								duration: 1500
							});
						} else {
							console.warn('[提示]', tipText); // 降级日志提示
						}
					}
				};

				const toTwoHex = (num) => {
					return num.toString(16).padStart(2, '0').toUpperCase();
				};
				if (['unlockTrack', 'lockTrack'].includes(trackId)) {
					const trackType = trackId.replace('Track', ''); // 提取类型：unlock/lock
					const progressNum = Number(progress) || 0; // 确保进度是数字，默认0
					const {
						validProgress,
						min,
						max
					} = calculateValidProgress(progressNum, trackType);
					if (progressNum < min || progressNum > max) {
						showThresholdTip(
							progressNum, {
								min,
								max
							},
							trackType
						);
					}
					console.log(trackId, trackType);
					if (trackType == 'lock') {
						//关锁

						this.lockThumbStyle = `left: ${validProgress / 2}%;`
						this.lockRange = validProgress / 2

					}
					if (trackType == 'unlock') {

						this.unlockThumbStyle = `left: ${validProgress}%;`
						this.unlockRange = validProgress || 50

					}
					const hexProgress = toTwoHex(validProgress);
					this.btnCmdSend(17, cmdParam, hexProgress);
				}
			},
			// DIY恢复出厂设置
			initToTwoHex(num) {
				return num.toString(16).padStart(2, '0').toUpperCase();
			},
			handleRestoreSettings() {
				// 统一定义函数内的常量，避免重复声明
				const CONST = {
					// 敏感值配置
					DEFAULT_UNLOCK_SENSITIVITY: 50, // 默认开锁敏感值
					DEFAULT_LOCK_SENSITIVITY: 70, // 默认关锁敏感值
					CMD_SET_SENSITIVITY: 0x11, // 设置敏感值指令码
					// 状态与路径
					LOGIN_PAGE: '/pages/system/managerLoginView/loginView',
					CONNECTION_STATE_UNCONNECTED: '未连接',
					PAIR_STATUS_UNPAIRED: '未配对',
					// 提示文本
					TOAST_BLUETOOTH_UNCONNECTED: '请等待蓝牙连接后重试',
					TOAST_SET_SUCCESS: '设置成功',
					MODAL_TITLE: '温馨提示',
					MODAL_CONTENT: '关锁敏感值不得低于开锁敏感值，使用默认关锁值前，需先将开锁敏感值设为默认值。',
					// 错误日志
					ERROR_MSG_UNLOCK: '设置开锁敏感值默认值失败：',
					ERROR_MSG_LOCK: '设置关锁敏感值默认值失败：'
				};

				// 1. 替换 wx.showModal 为 uni.showModal（Uniapp 跨端 API）
				uni.showModal({
					title: '确认重置',
					content: '是否将开关锁敏感值恢复到出厂设置？',
					confirmText: '确认',
					success: (res) => {
						if (res?.confirm) {
							// 检查登录状态
							const checkLogin = () => {
								// 注意：若 isLogin 是组件内方法，需改为 this.isLogin()
								// if (!isLogin()) {
								// 	// 2. 替换 wx.navigateTo 为 uni.navigateTo
								// 	uni.navigateTo({
								// 		url: CONST.LOGIN_PAGE
								// 	});
								// 	return false;
								// }
								return true;
							};

							// 检查蓝牙连接状态
							const checkBluetooth = () => {
								// 3. Uniapp 中无需 this.data，直接访问 data 中的属性
								if (this.connectionState === CONST.CONNECTION_STATE_UNCONNECTED) {
									// 4. 替换 wx.showToast 为 uni.showToast
									uni.showToast({
										title: CONST.TOAST_BLUETOOTH_UNCONNECTED,
										icon: 'none'
									});
									return false;
								}
								return true;
							};

							// 检查设备配对状态
							const checkPair = (parsedData) => {
								const {
									inductionMode = false, pairStatus = CONST.PAIR_STATUS_UNPAIRED
								} = parsedData || {};
								if (!inductionMode && pairStatus === CONST.PAIR_STATUS_UNPAIRED) {
									this.btnPair(); // 原有业务方法，保持不变
									return false;
								}
								return true;
							};

							// 设置敏感值
							const setSensitivity = (sensitivity, type, errorMsg) => {
								try {
									// 原有业务方法，保持不变
									this.btnCmdSend(CONST.CMD_SET_SENSITIVITY, type, this.initToTwoHex(
										sensitivity));
									uni.showToast({
										title: CONST.TOAST_SET_SUCCESS,
										icon: 'none',
										duration: 1500
									});
								} catch (e) {
									console.error(errorMsg, e);
								}
							};

							// 执行校验逻辑
							if (!checkLogin() || !checkBluetooth()) return;
							const parsedData = this.parsedData || {}; // 直接访问 data 中的 parsedData
							if (!checkPair(parsedData)) return;

							// 恢复默认敏感值
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

				this.modalisShow = true
				this.key_settings = key == 'key_settings'
				this.all_settings = key == 'all_settings'

			},

			// 关闭弹出窗
			handleMaskTap() {
				this.modalisShow = false
				this.key_settings = false
				this.all_settings = false
			},

			// 设置 蓝牙断开自动断开锁车
			handleToBreakOff(e) {
				const isEnabled = Boolean(e?.detail?.value);
				this.btnCmdSend(59, [isEnabled ? 1 : 0]);
			},

			// 锁车自动升窗
			handleAutoCloseTheWindow(e) {
				const isEnabled = Boolean(e?.detail?.value);
				this.btnCmdSend(77, [isEnabled ? 1 : 0]);
			},

			// 输出方式
			handleOutputMethod(evt) {
				const {
					index,
					item: info
				} = evt?.currentTarget?.dataset || {};
				const value = evt?.detail?.value;

				// 参数校验
				if (index === undefined || !info || value === undefined) {
					return;
				}

				// 获取选中项
				const selectedOutput = this.key_out_put?.[index]?.[Number(value)];
				if (!selectedOutput?.name) {
					return;
				}

				// 查找需要更新的项
				const {
					keyInstructions
				} = this;
				const updateIndex = keyInstructions.findIndex((item) => item?.id === info.id);
				if (updateIndex === -1) {
					return;
				}


				this.keyInstructions[updateIndex].useType = selectedOutput.name;
				this.keyInstructions[updateIndex].useTypeId = selectedOutput.id;

				this.$nextTick(() => {
					const updatedItem = this.keyInstructions[updateIndex];
					if (updatedItem?.useTypeId) {
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
				const instructionMap = getInstructionMap(sendCommand);
				const idActions = instructionMap[id];
				console.log(idActions);
				if (!idActions) {
					return;
				} // 无效 id
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
				const {
					index
				} = evt.currentTarget?.dataset || {};
				const {
					value
				} = evt.detail || {};
				const {
					controlItems
				} = this;
				if (index == null || value == null || !controlItems?.[index]) {
					return;
				}
				const updatedItems = controlItems.map((item, i) =>
					i === index ? {
						...item,
						enabled: Boolean(value)
					} :
					item
				);

				this.controlItems = updatedItems;

				// 2. 原回调逻辑：等待数据更新 + 拆分数组赋值给 controlItemspanel
				this.$nextTick(() => {
					this.controlItemspanel = this.splitArray(updatedItems, 4);
				});
				uni.setStorage({
					key: 'controlItems',
					data: updatedItems
				});
			},

			// 调整安装手册
			handleJumpSc() {
				if (!isLogin()) {
					uni.navigateTo({
						url: '/pages/system/managerLoginView/loginView'
					});
					return;
				}
				uni.redirectTo({
					url: '/pages/listOfPrivateCars/pdf/index?flag=1'
				});
			},

			handleOnExistingAccountTap() {
				console.log('占位：函数 handleOnExistingAccountTap 未声明');
				uni.redirectTo({
					url: '/pages/login/index'
				})
			}
		}
	};
</script>
<style>
	page {
		margin: auto;
		background: linear-gradient(to bottom left, #dbe2e8, #fff 100%);
		background-repeat: no-repeat;
		font-family: PingFang SC;
		overflow: hidden !important;
		height: 100% !important;
	}

	/* ========== 1. 头部区域样式 ========== */
	.custom-header {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding: 0px 20rpx;
	}

	/* 头部外层容器样式：flex布局，水平居中对齐，元素间间距10rpx */
	.custom-header-outer-layer {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 25rpx;
	}

	/* 头部外层容器图片样式：设置固定宽高 */
	.custom-header-outer-layer-image {
		width: 45rpx;
		height: 49rpx;
	}

	/* 头部标题样式：粗体，字体大小36rpx，颜色深灰 */
	.custom-header-outer-layer-title {
		font-weight: bold;
		font-size: 36rpx;
		color: #333333;
	}

	/* 头部用户名容器样式：flex水平排列，对齐项目中心，间距5rpx */
	.custom-header-outer-layer-user_name {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 5rpx;
	}

	/* 用户名文本样式：中等粗细，字体大小28rpx，颜色深灰 */
	.custom-header-outer-layer-user_name text {
		font-weight: 500;
		font-size: 28rpx;
		color: #333333;
	}

	/* 用户名旁图片样式：设置固定宽高 */
	.custom-header-outer-layer-user_name image {
		width: 26rpx;
		height: 26rpx;
	}

	/* 内容区域样式：占满宽度，绝对定位，允许垂直滚动 */
	.content {
		width: 100%;
		position: absolute;
		overflow-y: auto;
		box-sizing: border-box;
	}

	/* ========== 2. 核心内容区域样式 ========== */
	.container {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-sizing: border-box;
		position: relative;
		gap: 20rpx;
		padding: 20rpx;
	}

	/* 头部内容区 */
	.top-fixed {
		flex-shrink: 0;
		text-align: center;
	}

	.top-fixed-basics {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.top-fixed-basics-plate {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.top-fixed-basics-plate-text {
		font-weight: bold;
		font-size: 44rpx;
		color: #222222;
	}

	.top-fixed-basics-plate-btn {
		display: flex;
		flex-direction: row;
		gap: 20rpx;
		align-items: center;
	}

	.top-fixed-basics-plate-btn-install {
		border-radius: 12rpx;
		border: 1px solid #909090;
		display: flex;
		flex-direction: row;
		gap: 10rpx;
		padding: 4rpx 10rpx;
		justify-content: center;
		align-items: center;
	}

	.top-fixed-basics-plate-btn-install-iconfont {
		display: flex;
		align-items: center;
	}

	.top-fixed-basics-plate-btn-install-tip {
		font-weight: 500;
		font-size: 24rpx;
		color: #777777;
	}

	.top-fixed-basics-plate-btn-more {
		background: linear-gradient(0deg, #f7f8f8, #dde1e8, #f7f8f8);
		box-shadow: 0rpx 1rpx 33rpx 0rpx rgba(166, 173, 186, 0.38);
		border-radius: 13rpx;
		border: 1px solid #ffffff;
		padding: 5rpx 20rpx;
		display: flex;
		align-items: center;
	}

	.top-fixed-basics-plate-btn-more text {
		font-weight: bold;
		font-size: 26rpx;
		color: #222222;
	}

	.top-fixed-signal {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 15rpx;
	}

	.top-fixed-signal-layar {
		background: #fafafa;
		border-radius: 13rpx;
		border: 1px solid #e1e5ea;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10rpx;
	}

	.top-fixed-signal-layar-info {
		display: flex;
		flex-direction: row;
	}

	.top-fixed-signal-layar-title {
		font-size: 20rpx;
		color: #333333;
	}

	.top-fixed-signal-text {
		font-weight: bold;
		font-size: 20rpx;
		color: #222222;
	}

	/* 中部区域 */
	.middle-scroll {
		flex: 1;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		background: #ffffff;
		border-radius: 13rpx;
		padding: 20rpx;
	}

	.middle-title {
		border-bottom: 1rpx solid rgba(210, 211, 212, 0.2);
		font-weight: bold;
		font-size: 27rpx;
		color: #232426;
		padding-bottom: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.middle-concrete-content {
		margin-top: 40rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.middle-concrete-content-debugging {
		background: #fafafa;
		border-radius: 13rpx;
		border: 1px solid #e1e5ea;
		padding: 10rpx 30rpx;
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}

	.middle-concrete-content-debugging-title {
		font-weight: bold;
		font-size: 23rpx;
		color: #ba2b2b;
	}

	.middle-concrete-content-debugging-slider-track {
		height: 40px;
		border-radius: 15px;
		position: relative;
		margin-bottom: 12px;
		overflow: hidden;
	}

	.tarck-unlock {
		background-color: #f3f4f6;
	}

	.tarck-lock {
		background-color: #cd80e9;
	}

	.tarck-special {
		background-color: #e9808c;
	}

	.middle-concrete-content-debugging-slider-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		transition: width 0.1s ease;
		z-index: 1;
		border-bottom-right-radius: 35rpx;
		border-top-right-radius: 35rpx;
	}

	.fill-unlock {
		background-color: #95d5fe;
		border-right: 6rpx solid #2da2ec;
	}

	.fill-lock {
		background-color: #f0eeee;
		border-right: 6rpx solid #7d16a3;
	}

	.fill-special {
		background-color: #f0eeee;
		border-right: 6rpx solid #e53146;
	}

	.middle-concrete-content-debugging-slider-thumb {
		width: 55px;
		height: 40px;
		border-radius: 50%;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 3;
	}

	.middle-concrete-content-debugging-slider-thumb image {
		width: 31rpx;
		height: 33rpx;
	}

	.middle-concrete-content-debugging-car-icon {
		width: 30%;
		position: absolute;
		/* left: 16px; */
		top: 50%;
		transform: translateY(-50%);
		color: #3b82f6;
		font-size: 20px;
		z-index: 2;
		position: relative;
	}

	.middle-concrete-content-debugging-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rpx;
	}

	.middle-concrete-content-debugging-info-image {
		width: 40rpx;
		height: 30rpx;
	}

	.middle-concrete-content-debugging-info-text {
		font-weight: bold;
		font-size: 20rpx;
		color: #333333;
	}

	.middle-concrete-content-debugging-person-icon {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		color: #6b7280;
		z-index: 1;
	}

	.middle-concrete-content-debugging-person-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rpx;
	}

	.middle-concrete-content-debugging-person-info-image {
		width: 30rpx;
		height: 32rpx;
	}

	.middle-concrete-content-debugging-tip {
		font-weight: 500;
		font-size: 18rpx;
		color: #5b5959;
	}

	/* 下部区域 */
	.bottom-fixed {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		padding: 10rpx 30rpx 0rpx 30rpx;
		background: #ffffff;
		box-shadow: 0rpx 1rpx 13rpx 0rpx rgba(177, 177, 177, 0.31);
		border-radius: 13rpx;
		gap: 10rpx;
	}

	.bottom-fixed-identification {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.bottom-fixed-identification-title {
		font-weight: bold;
		font-size: 27rpx;
		color: #232426;
	}

	.bottom-fixed-identification-more {
		font-weight: 500;
		font-size: 21rpx;
		color: #5b5959;
	}

	.bottom-fixed-swiper {
		height: 90%;
	}

	.bottom-fixed-swiper-item {
		display: flex;
		flex-direction: row;
		flex-direction: row;
		justify-content: flex-start;
		gap: 20rpx;
	}

	.bottom-fixed-swiper-item-control {
		padding: 20rpx;
		height: 40rpx;
		width: 25%;
		display: flex;
		flex-direction: row;
		gap: 10rpx;
		justify-content: center;
		align-items: center;
		background: linear-gradient(0deg, #f7f8f8, #dde1e8, #f7f8f8);
		border-radius: 19rpx;
		border: 1px solid #e1e5ea;
	}

	.bottom-fixed-swiper-item-control text {
		font-weight: bold;
		font-size: 21rpx;
		color: #1a2028;
	}

	/* ========== 3. 底部 Tabbar 区域样式 ========== */
	.tabbar {
		width: 100%;
		background-color: #fff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
		z-index: 100;
		box-sizing: border-box;
	}

	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 25%;
	}

	.tab-icon {
		width: 50rpx;
		height: 50rpx;
		margin-bottom: 10rpx;
	}

	.tab-item text {
		font-size: 24rpx;
		color: #999;
	}

	.tab-item.active text {
		color: #3498db;
	}

	/* ========== 4. 更多功能 modal  区域样式 ========== */
	.modal-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
	}

	.modal-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		transition: opacity 0.3s ease;
	}

	.modal-content {
		position: absolute;
		top: 0;
		right: 0;
		width: 80%;
		height: 100%;
		background-color: #ffffff;
		box-sizing: border-box;
		padding: 20rpx;
		overflow-y: auto;
		transition: transform 0.3s ease;
		transform: translateX(0);
	}

	/* 主体内容样式 */
	.modal-body {
		font-size: 28rpx;
		color: #666666;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.modal-body-outer-layer-of-card {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 15rpx;
	}

	.modal-body-outer-layer-of-card-layer {
		border-bottom: 1rpx solid rgba(238, 241, 244, 0.5);
		padding: 10rpx 0;
	}

	.modal-body-outer-layer-of-card-layer-title {
		font-size: 26rpx;
		color: #222;
		font-weight: bold;
	}

	.modal-body-outer-layer-of-card-layer-info {
		padding: 10rpx 0;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.modal-body-outer-layer-of-card-layer-settings-item {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
	}

	.modal-body-outer-layer-of-card-layer-item-left {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		align-items: center;
	}

	.modal-body-outer-layer-of-card-layer-item-text {
		font-weight: bold;
		font-size: 24rpx;
		color: #333333;
	}

	.modal-body-outer-layer-of-card-layer-item-tips {
		display: flex;
		justify-content: flex-start;
		width: 100%;
		font-weight: 500;
		font-size: 20rpx;
		color: #5b5959;
	}

	.modal-body-outer-layer-of-card-layer-picker {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
	}

	.modal-body-outer-layer-of-card-layer-picker text {
		font-weight: 500;
		font-size: 22rpx;
		color: #5b5959;
	}

	.modal-body-outer-layer-of-card-layer-picker image {
		width: 25rpx;
		height: 25rpx;
	}

	/* 信号卡片容器：核心布局样式 + 质感优化 */
	.signal-card {
		display: flex;
		flex-direction: column;
		border: 1rpx solid #f1f1f1;
		border-radius: 10rpx;
		justify-content: space-between;
		padding: 30rpx 15rpx;
		/* 优化：横向内边距从5rpx增至15rpx，避免文字贴边 */
		background-color: #ffffff;
		/* 增加白色背景，提升卡片质感 */
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
		/* 轻微阴影，增强层次感 */
	}

	/* 信号信息组：数据行布局 */
	.signal-info-group {
		display: flex;
		justify-content: space-between;
		font-size: 26rpx;
		font-weight: bold;
		padding: 10rpx 0;
		/* 优化：去掉横向padding，避免与容器内边距重叠 */
		margin-bottom: 20rpx;
		/* 与描述区增加间距 */
		border-bottom: 1rpx dashed #f5f5f5;
		/* 虚线分隔，视觉更柔和 */
		padding-bottom: 20rpx;
		color: #333333;
		/* 数据文字用深灰色，突出重点 */
	}

	/* 信号信息项：可选，用于响应式适配 */
	.signal-info-item {
		flex: 1;
		text-align: center;
		/* 优化：文字居中，布局更整齐 */
	}

	/* 信号描述组：说明文字样式 */
	.signal-desc-group {
		font-size: 26rpx;
		line-height: 1.7;
		/* 增加行高，提升阅读体验 */
		color: #666666;
		/* 描述文字用浅灰色，区分数据层级 */
	}

	/* 信号描述项：每行的间距控制 */
	.signal-desc-item {
		margin-bottom: 14rpx;
		/* 行间距，避免文字拥挤 */
	}

	/* 最后一个描述项去掉下间距，避免多余空白 */
	.signal-desc-item:last-child {
		margin-bottom: 0;
	}
</style>