<template>
	<view class="container">
		<CustomNavBar title="设备清单" />
		<view class="record-container" :style="'margin-top: ' + (navbarTotalHeight) + 'px;'">
			<!-- 切换部分 -->
			<view class="record-tabs">
				<view class="record-tabs-item" data-flag="设备清单" @tap="handleSwitchTab"
					:style="'background-image: url(' + (c_activeTab == 1 ? s_background_tabs_active_1 : s_background_tabs_1) + ');'">
					设备清单</view>
				<view class="record-tabs-item" data-flag="开通设定" @tap="handleSwitchTab"
					:style="'background-image: url(' + (c_activeTab == 2 ? s_background_tabs_2 : s_background_tabs_active_2) + ');'">
					{{ btnState }}设定
				</view>
			</view>
			<!-- 详情区域部分 -->
			<block v-if="c_activeTab == 1">
				<scroll-view scroll-y @scrolltolower="handleLower" :refresher-triggered="g_triggered">
					<block v-for="(item, index) in g_items" :key="index">
						<view class="content-item"
							:style="'border: ' + (sn == item.sn ? '1px solid #e4b6b6' : '') + ';'">
							<view class="content-item-head">
								<view class="head-left">
									<view class="left-category">
										<image src="/static/privateCar/car_icon.png" />
										<text>{{ item.platenumber }}</text>
									</view>
									<view class="left-split_line"></view>
									<view class="left-model">
										{{ item.vehicleSerialName || '-' }}{{ item.vehicleModeName || '' }}
									</view>
								</view>
								<view class="head-right" v-if="!g_flagMulti">
									<image src="/static/privateCar/_edit.png" :data-item="item" @tap="handleEdit" />
									<image src="/static/privateCar/_delete.png" :data-item="item" @tap="handleDelete" />
								</view>
							</view>
							<view class="content-item-info">
								<view :class="'info-item  ' + (item.sn.length > 15 ? 'long-info-item' : '')">
									<label>设备号 ：</label>
									<text>{{ item.sn || '-' }}</text>
								</view>
							</view>
							<view class="content-item-footer">
								<view class="footer-left"></view>
								<view class="footer-right" style="gap: 20rpx">
									<!-- <view class="footer-right-btn" :data-item="item" @tap="handleSelectJump">
										<text>设置</text>
									</view> -->
									<view class="footer-right-btn" :data-item="item" @tap="handleSelectCar"
										v-if="g_items.length > 1">
										<text>选择此车</text>
									</view>
								</view>
							</view>
						</view>
					</block>
				</scroll-view>
			</block>
			<block v-if="c_activeTab == 2">
				<scroll-view scroll-y>
					<view class="card-info">
						<!-- 车牌号 -->
						<view class="card-info-item">
							<label>
								车牌号
								<text>*</text>
							</label>

							<view class="card-info-item-input">
								<input placeholder="请输入车牌号" :value="params.platenumber" data-item="platenumber"
									@input="handleBindinput" />
							</view>

						</view>
						<!-- 车系 -->
						<view class="card-info-item">
							<label>
								车系
								<text>*</text>
							</label>

							<view class="card-info-item-input">
								<input placeholder="请输入车系" :value="params.vehicleSerialName"
									data-item="vehicleSerialName" @input="handleBindinput" />
							</view>

						</view>
						<!-- 车型 -->
						<view class="card-info-item">
							<label>
								车型
								<text>*</text>
							</label>

							<view class="card-info-item-input">
								<input placeholder="请输入车型" :value="params.vehicleModeName" data-item="vehicleModeName"
									@input="handleBindinput" />
							</view>

						</view>
						<!-- 设备号 -->
						<view class="card-info-item">
							<label>
								设备号(sn)
								<text>*</text>
							</label>

							<view class="card-info-item-input"
								style="display: flex; flex-direction: row; align-items: center">
								<block v-if="id != ''">
									<text v-if="id != ''" style="font-size: 26rpx">{{ params.sn || '空' }}</text>
								</block>
								<block v-else>
									<input placeholder="请输入设备号(SN)" :value="params.sn" data-item="sn"
										@input="handleBindinput" />
									<image src="/static/privateCar/ss.png" mode="" @tap="scanCode"
										style="width: 50rpx; height: 50rpx" />
								</block>
							</view>

						</view>
						<view class="card-info-item">
							<label>code <text>*</text></label>

							<view class="card-info-item-input"
								style="display: flex; flex-direction: row; align-items: center">
								<text v-if="id != ''" style="font-size: 26rpx">{{ params.code || '空' }}</text>
								<input v-else placeholder="请输入code" :value="params.code" data-item="code"
									@input="handleBindinput" />
							</view>

						</view>
					</view>
					<view class="card-footer">
						<view @tap="handleSubmit">确认{{ btnState }}</view>
					</view>

				</scroll-view>
			</block>
		</view>
		<view class="levitation-button" v-if="c_activeTab == 1 && g_flagMulti && g_black.length > 0"
			@tap="handleJumpBlackInfo">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import CustomNavBar from "@/components/custom-header/index.vue";
	import {
		info_screen
	} from '@/utils/scheme/screen.js'
	import {
		u_paivatecarList,
		u_paivateAddOrUpdateCar,
		u_paivateCarapiDeleteCar,
	} from '@/api'
	export default {
		components: {
			CustomNavBar
		},
		data() {
			return {
				// 屏幕信息对象，当前为空
				screenInfo: {},

				// 标签页背景图片（未激活状态）
				s_background_tabs_1: '/static/privateCar/1-1.png',
				s_background_tabs_2: '/static/privateCar/1-2.png',

				// 标签页背景图片（激活状态）
				s_background_tabs_active_1: '/static/privateCar/2-1.png',
				s_background_tabs_active_2: '/static/privateCar/2-2',

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
					platenumber: '',
					vehicleSerialName: '',
					vehicleModeName: '',
					sn: '',
					code: ''
				},

				// 按钮状态文本，初始为“开通”
				btnState: '开通',

				// ID，初始为空字符串
				id: '',

				// 制动类型编号，初始为1
				brakingType: 1,

				// 图片加载状态宽度和高度，初始为“加载中...”
				imageWidth: '加载中...',
				imageHeight: '加载中...',

				// 黑名单列表，初始为空数组
				g_black: [],

				// 车牌号码列表，初始为空数组
				g_platenumbers: [],

				// 来源，初始为空字符串
				g_source: '',

				// 多标识符标记，初始为空字符串
				g_flagMulti: '',

				// 信息，初始为空字符串
				info: '',

				// 所有参数，初始为空字符串
				allParams: '',

				// 类型，初始为空字符串
				type: '',

				// 名称，初始为空字符串
				name: '',

				// 序列号，初始为空字符串
				sn: '',

				// 总计，初始为空字符串
				g_total: '',

				// 角色列表索引，初始为空字符串
				g_roleList_index: '',

				// 首页背景图片路径，初始为空字符串
				s_background_picture_of_the_front_page: ''
			};
		},
		onLoad(options) {
			this.initCarryParams(options);
			this.initList(options);
		},
		onShow() {
			// 获取设备屏幕信息
			this.initialScreenInfo()
			this.handleGet();
		},
		computed: {
			// 状态栏高度
			statusBarHeight() {
				return this.screenInfo.statusBarHeight || 0;
			},
			// 导航栏高度
			navBarHeight() {
				return this.screenInfo.platform === 'ios' ? 49 : 44;
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
						title: '设备信息获取失败',
						icon: 'none',
						duration: 3000
					});
				}
			},
			handleChangeBlack(evt) {
				// 使用解构赋值一次性获取所有需要的数据
				const {
					id
				} = evt.currentTarget.dataset.item;
				const {
					g_black,
					g_platenumbers,
					g_items
				} = this;

				// 转换为 Set 操作更高效
				const blackSet = new Set(g_black);
				const plateSet = new Set(g_platenumbers);

				// 增加安全判断防止 undefined
				const vehicle = g_items.find((item) => item.id === id);
				if (!vehicle) {
					return;
				}

				// 统一操作逻辑：存在则删除，不存在则添加
				if (blackSet.has(id)) {
					blackSet.delete(id);
					plateSet.delete(vehicle.platenumber); // 同步移除车牌号
				} else {
					blackSet.add(id);
					plateSet.add(vehicle.platenumber); // 同步添加车牌号
				}
				this.g_black = [...blackSet]
				// 使用展开运算符更简洁K
				this.g_platenumbers = [...plateSet]

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
					scanType: ['qrCode', 'barCode'],
					// 扫码类型：二维码、条形码
					success: (res) => {
						console.log('扫码成功:', res);
						this.handleScanResult(res.result);
					},
					fail: (err) => {
						console.error('扫码失败:', err);
						uni.showToast({
							title: '扫码失败',
							icon: 'error'
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
				}

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

				this.g_source = source
				this.g_flagMulti = flagMulti
				this.info = info && JSON.parse(info)
				this.allParams = allParams
				this.type = type
				this.name = name

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
				this.sn = evt?.currentTarget?.dataset?.item?.sn

				uni.setStorage({
					key: 'bluetoothData',
					data: evt?.currentTarget?.dataset?.item
				});
			},


			// 管控列表数据
			async initList(evt) {
				uni.showLoading({
					title: '加载中...'
				})
				const response = await u_paivatecarList()
				if (response?.code == 1000) {
					console.log(response)
					if (this.g_page > 1 && response.content.length === 0) {
						uni.showToast({
							title: `已加载全部数据：共${this.g_items.length}条`,
							icon: 'none',
							duration: 3000
						});

					}
					this.g_items = this.g_items.concat(response.content)
					this.g_total = Number(response.count || 0).toLocaleString()
					setTimeout(() => {
						if (evt?.tabs) {
							this.c_activeTab = evt?.tabs

						} else if (this.g_items?.length > 0) {
							this.c_activeTab = 1

						} else {
							this.c_activeTab = 2

						}
						uni.hideLoading();
					}, 1000)
				} else {
					uni.showToast({
						title: '请求失败，请稍后再试',
						icon: 'none',
						duration: 2000
					});

					uni.hideLoading();
				}

				return

			},

			// 触底请求
			handleLower() {
				this.g_page = this.g_page + 1
				setTimeout(() => {
					this.initList();
				}, 100)
			},


			// 内容输入回调
			handleBindinput(evt) {
				const {
					params
				} = this;
				params[evt.currentTarget.dataset.item] = evt.detail.value;
				this.params = {
					...params
				}

			},

			//提交内容
			handleSubmit() {
				const param = {
					...this.params,
					brakingType: this.brakingType,
					id: this.id || ''
				};
				const validations = [{
						field: 'platenumber',
						message: '请填写车牌号'
					},
					{
						field: 'sn',
						message: '请填写设备号'
					}
				];
				for (const {
						field,
						message
					}
					of validations) {
					if (!param[field]?.trim()) {
						uni.showToast({
							title: message,
							icon: 'none',
							duration: 3000
						});
						return;
					}
				}

				u_paivateAddOrUpdateCar(param).then((response) => {

					if (response?.code == 1000) {
						uni.showToast({
							title: response?.msg,
							icon: 'none',
							duration: 3000,
							success: () => {
								this.c_activeTab = 1
								// 默认选中的Tab索引
								this.params = {}
								//所属平台
								this.brakingType = 1
								this.g_page = 1
								//列表页码
								this.g_items = [] //列表数据
								if (!this.id) {
									uni.redirectTo({
										url: '/pages/listOfPrivateCars/pdf/index'
									});
								}

								this.initList();
							}
						});

					} else {
						uni.showToast({
							title: response?.msg,
							icon: 'none',
							duration: 3000
						});

					}
				})
				return
			},

			// 修改管控
			handleEdit(evt) {
				const info = evt.currentTarget.dataset.item;
				this.c_activeTab = 2
				this.btnState = '修改'
				this.id = info?.id
				this.params = {
					vehicleSerialName: info?.vehicleSerialName,
					vehicleModeName: info?.vehicleModeName,
					ccdate: info?.ccdate,
					introduction: info?.introduction,
					platenumber: info?.platenumber,
					vin: info?.vin,
					xsgw: info?.xsgw,
					sn: info?.sn,
					code: info?.code
				}
				this.brakingType = info?.brakingType


			},

			// 删除车辆
			handleDelete(evt) {
				uni.showModal({
					title: '提示',
					content: '确认删除？',
					complete: (res) => {
						if (res.confirm) {
							const info = evt.currentTarget.dataset.item;

							const param = {
								sn: info?.sn,
								code: info?.code
							};
							u_paivateCarapiDeleteCar(param).then((response) => {
								uni.hideLoading();
								if (response?.code == 1000) {
									this.c_activeTab = 1
									// 默认选中的Tab索引
									this.g_page = 1
									//列表页码
									this.g_items = [] //列表数据

									uni.showToast({
										title: response?.msg,
										icon: 'none',
										duration: 3000
									});
									this.initList();
								} else {

									uni.showToast({
										title: response?.msg,
										icon: 'none',
										duration: 3000
									});
								}
							})
							return
						}
					}
				});
			},

			// 切换tabs标签
			handleSwitchTab(e) {
				const flag = e.target.dataset.flag;
				if (flag == '设备清单') {
					this.c_activeTab = 1
					this.btnState = '开通'
					this.params = {}
					this.id = ''
					this.g_roleList_index = null
				}
				if (flag == '开通设定' || flag == '修改设定') {
					if (this.c_activeTab != 2) {
						this.c_activeTab = 2

					}
				}
				if (flag == '功能设置') {
					if (this.c_activeTab != 3) {
						this.c_activeTab = 3

					}
				}
			},

			handleGet() {
				const _this = this;
				uni.getStorage({
					key: 'bluetoothData',
					success(res) {
						_this.sn = res?.data.sn || ''

					}
				});
			},

			// 导航到各个设置页面
			navigateToUserInfo(evt) {
				const sign = evt?.currentTarget?.dataset?.sign || evt;
				const getActionMap = (item) => ({
					default: {
						url: `/pages/privateCar/btSettings/index?sign=${sign}&deviceIDC=${item?.sn}&orgKey=${item?.bluetoothKey}`
					}
				});
				const executeNavigation = (ele) => {
					const actionMap = getActionMap(ele);
					const action = actionMap[sign] || actionMap.default;
					if (action.url) {
						if (sign == 1) {
							uni.showModal({
								title: '提示',
								content: '如未与设备配对,请先执行蓝牙配对操作',
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
								res.confirm ? action.callback?.(res.content) : action.fallback?.();
							}
						});
					}
				};
				uni.getStorage({
					key: 'bluetoothData',
					success: (res) => {
						executeNavigation(res?.data);
					},
					fail: () => {
						const param = {
							[u_carList.page]: 1
						};
						byGet('https://k1sw.wiselink.net.cn/' + u_carList.URL, param)
							.then((response) => {
								if (response.statusCode === 200) {
									executeNavigation(response?.data?.content[0]);
								}
							})
							.catch(() => {});
					}
				});
			}
		}
	};
</script>
<style>
	.container {
		height: 100vh;
		padding: 10rpx 4rpx;
	}

	.record-container {
		width: 96%;
		margin: 0 auto;
		position: relative;
		border-radius: 12rpx;
		background-color: #fff;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.record-tabs {
		display: flex;
		height: 50px;
	}

	.record-tabs-item {
		border-radius: 12rpx;
		width: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		touch-action: pan-x;
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 28rpx;
		color: #010101;
	}

	.record-tabs-1 {
		display: flex;
		padding: 10rpx;
		justify-content: space-between;
		align-items: center;
	}

	.tabs-1-title {
		display: flex;
		align-items: center;
		gap: 6rpx;
	}

	.tabs-1-title text {
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 26rpx;
		color: #333333;
	}

	.tabs-1-title image {
		width: 42rpx;
		height: 46rpx;
	}

	/* 内容项 */
	.content-item {
		margin: 10rpx;
		background-color: #ffffff;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.content-item-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-bottom: 1px solid #f0f0f0;
		padding: 20rpx 15rpx;
	}

	.head-left {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.left-model {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 24rpx;
		color: #333333;
	}

	.head-right {
		display: flex;
		flex-direction: row;
		gap: 20rpx;
		align-items: center;
		justify-content: center;
	}

	.head-right image {
		width: 30rpx;
		height: 30rpx;
	}

	.content-item-info {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		padding: 10rpx;
		gap: 20rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.info-item {
		flex: 0 0 48%;
		box-sizing: border-box;
		word-wrap: break-word;
		transition: all 0.3s;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 24rpx;
		color: #333333;
	}

	.long-info-item {
		flex-basis: 100% !important;
		/* 长内容时占满整行 */
	}

	/* alarm-add.wxss （保持相同） */

	.form-item {
		margin-bottom: 10rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 20rpx;
	}

	.label {
		display: block;
		font-size: 28rpx;
		color: #666;
	}

	.picker {
		background: #fff;
		border-radius: 8rpx;
		font-size: 28rpx;
	}

	.days-container {
		display: flex;
		justify-content: space-between;
	}

	.day-item {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #333;
	}

	.day-item.active {
		background: #07c160;
		color: #fff;
	}

	.input {
		padding: 20rpx;
		background: #fff;
		border-radius: 8rpx;
	}

	.save-btn {
		margin-top: 60rpx;
		background: #07c160;
		color: #fff;
	}

	.container {
		width: 100%;
		height: 95vh;
		display: flex;
		flex-direction: column;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		touch-action: pan-x;
		position: relative;
	}

	/* 主要内容容器 */
	.content-container {
		background-color: #fff;
		position: absolute;
		bottom: 10rpx;
		left: 0;
		right: 0;
		width: 96%;
		margin: auto;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		/* 子元素垂直排列 */
	}

	.card-head {
		display: flex;
		align-items: center;
		gap: 20rpx;
		padding: 0 20rpx;
		height: 30px;
	}

	.card-head image {
		width: 40rpx;
		height: 30rpx;
	}

	.card-head text {
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 28rpx;
		color: #333333;
	}

	.long-range-control-car {
		flex: 1;
		overflow-y: auto;
		box-shadow: 4rpx 4px 8px rgba(0, 0, 0, 0.1);
	}

	.long-range-control-car-subitem {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #f0f0f0;
		padding: 20rpx;
	}

	.long-range-control-car-subitem label {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 26rpx;
		color: #333333;
		display: flex;
		gap: 6rpx;
		align-items: flex-start;
	}

	.long-range-control-car-subitem label text {
		color: red;
	}

	.picker {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 26rpx;
		color: #333333;
		display: flex;
		align-items: center;
	}

	.picker image {
		width: 30rpx;
		height: 30rpx;
	}

	.long-range-control-car-subitem input {
		text-align: right;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 26rpx;
		color: #333333;
	}

	.viewText {
		text-align: right;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 26rpx;
		color: #333333;
	}

	.card-info-item-tabs {}

	.card-info-item-tabs-btn {
		display: flex;
		gap: 10rpx;
		justify-content: flex-end;
	}

	.card-info-item-tabs-btn text {
		border-radius: 7rpx;
		border: 1px solid #7b7c7c;
		font-family: PingFang SC;
		font-weight: 500;
		padding: 6rpx 20rpx;
		font-size: 24rpx;
		color: #333333;
	}

	.tabs-footer {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 22rpx;
		color: #7b7c7c;
		display: flex;
	}

	.card-info-item-tips {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.tabs-active {
		background: #1b64b1;
		border-radius: 7rpx;
		color: #ffffff !important;
	}

	.card-footer {
		/* position: absolute; */
		text-align: center;
		margin: 20rpx 0;
		/* bottom: 120rpx; */
		width: 100%;
		display: flex;
		justify-content: center;
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 34rpx;
		color: #ffffff;
	}

	.card-footer view {
		width: 40%;
		background-color: #2196f3;
		padding: 10rpx;
		background: linear-gradient(88deg, #1576dc, #1b64b1);
		box-shadow: 0rpx 1rpx 13rpx 0rpx rgba(51, 63, 92, 0.31);
		border-radius: 36rpx;
	}

	/* index.wxss */
	.tree-container {
		padding: 0rpx;
	}

	.node {
		margin: 0rpx 0;
	}

	.node-header {
		display: flex;
		align-items: center;
		padding: 10rpx 0;
	}

	.arrow {
		font-size: 24rpx;
		color: #666;
		margin-right: 10rpx;
		transition: transform 0.3s;
	}

	.arrow.expanded {
		transform: rotate(90deg);
	}

	.checkbox {
		min-width: 36rpx;
		min-height: 36rpx;
		border: 2rpx solid #ccc;
		border-radius: 6rpx;
		margin-right: 15rpx;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.checkbox.checked {
		background: #07c160;
		border-color: #07c160;
		width: 36rpx;
		height: 36rpx;
	}

	.child-node {
		margin-top: 5rpx;
	}

	.checkbox.indeterminate {
		background: #fff;
		border-color: #07c160;
	}

	.checkmark {
		color: white;
		font-size: 28rpx;
	}

	.indeterminate-line {
		width: 20rpx;
		height: 4rpx;
		background: #07c160;
	}

	.children {
		margin-left: 20rpx;
		border-left: 2rpx solid #eee;
		padding-left: 20rpx;
	}

	.node-name {
		font-size: 24rpx;
		color: #333;
	}

	/* 内容项 */
	.content-item {
		margin: 15rpx;
		background-color: #ffffff;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.content-item-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-bottom: 1px solid #f0f0f0;
		padding: 20rpx 15rpx;
	}

	.head-left {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.left-category {
		display: flex;
		align-items: center;
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 26rpx;
		color: #333333;
		gap: 10rpx;
	}

	.left-category image {
		width: 43rpx;
		height: 35rpx;
	}

	.left-split_line {
		width: 1rpx;
		height: 28rpx;
		border-left: 1px solid #797979;
	}

	.left-brand {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 24rpx;
		color: #4587fd;
		border: 1px solid #4587fd;
		border-radius: 8rpx;
		padding: 0 15rpx;
	}

	.left-model {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 24rpx;
		color: #333333;
	}

	.head-right {
		display: flex;
		flex-direction: row;
		gap: 20rpx;
		align-items: center;
		justify-content: center;
	}

	.head-right image {
		width: 30rpx;
		height: 30rpx;
	}

	.content-item-info {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		padding: 10rpx;
		gap: 20rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.info-item {
		flex: 0 0 48%;
		box-sizing: border-box;
		word-wrap: break-word;
		transition: all 0.3s;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 24rpx;
		color: #333333;
	}

	.long-info-item {
		flex-basis: 100% !important;
		/* 长内容时占满整行 */
	}

	.content-item-footer {
		display: flex;
		padding: 15rpx;
		justify-content: space-between;
	}

	.footer-left {
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 26rpx;
		color: #333333;
	}

	.footer-right {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.footer-right-btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 22rpx;
		color: #ffffff;
		background-color: #1b64b1;
		border-radius: 8rpx;
		padding: 4rpx 15rpx;
	}

	.levitation-button {
		position: absolute;
		bottom: 50rpx;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.levitation-button text {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 75rpx;
		width: 40%;
		background: linear-gradient(88deg, #1576dc, #1b64b1);
		box-shadow: 0rpx 1rpx 13rpx 0rpx rgba(51, 63, 92, 0.31);
		border-radius: 36rpx;
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 32rpx;
		color: #ffffff;
	}

	.card-info {
		flex: 1;
		overflow-y: auto;
	}

	.card-info-item {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #f0f0f0;
		padding: 20rpx;
	}

	.card-info-item label {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 26rpx;
		color: #333333;
		display: flex;
		gap: 6rpx;
		align-items: flex-start;
	}

	.card-info-item label text {
		color: red;
	}

	.picker {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 26rpx;
		color: #333333;
		display: flex;
		align-items: center;
	}

	.picker image {
		width: 30rpx;
		height: 30rpx;
	}

	.card-info input {
		text-align: right;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 26rpx;
		color: #333333;
	}

	.viewText {
		text-align: right;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 26rpx;
		color: #333333;
	}

	.card-info-item-tabs {}

	.card-info-item-tabs-btn {
		display: flex;
		gap: 10rpx;
		justify-content: flex-end;
	}

	.card-info-item-tabs-btn text {
		border-radius: 7rpx;
		border: 1px solid #7b7c7c;
		font-family: PingFang SC;
		font-weight: 500;
		padding: 6rpx 20rpx;
		font-size: 24rpx;
		color: #333333;
	}

	.tabs-footer {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 22rpx;
		color: #7b7c7c;
		display: flex;
	}

	.card-info-item-tips {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.tabs-active {
		background: #1b64b1;
		border-radius: 7rpx;
		color: #ffffff !important;
	}

	.card-footer {
		height: 50px;
		color: white;
		text-align: center;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 34rpx;
		color: #ffffff;
	}

	.card-footer view {
		width: 40%;
		background-color: #2196f3;
		padding: 10rpx;
		background: linear-gradient(88deg, #1576dc, #1b64b1);
		box-shadow: 0rpx 1rpx 13rpx 0rpx rgba(51, 63, 92, 0.31);
		border-radius: 36rpx;
	}

	/* 图片容器样式 */
	.image-container {
		width: 100%;
		position: relative;
	}

	.settings-group {
		margin-bottom: 10px;
		background-color: #ffffff;
	}

	.group-title {
		padding: 10px 15px;
		font-size: 14px;
		color: #999999;
	}

	.settings-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
		border-bottom: 1px solid #f0f0f0;
	}

	.item-left {
		display: flex;
		/* align-items: center; */
		flex-direction: column;
		justify-content: center;
	}

	.item-tips {
		font-size: 24rpx;
		color: #999999;
	}

	.item-icon {
		width: 20px;
		height: 20px;
		margin-right: 10px;
	}

	.item-text {
		font-size: 28rpx;
		color: #333333;
	}

	.item-right {
		display: flex;
		align-items: center;
	}

	.item-value {
		font-size: 14px;
		color: #999999;
		margin-right: 5px;
	}

	.item-arrow {
		width: 16px;
		height: 16px;
	}

	/* 最后一个设置项去掉下划线 */
</style>