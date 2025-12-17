<template>
	<view>
		<view class="container">
			<CustomNavBar title="发送电子钥匙" />
			<view class="record-container" :style="'margin-top: ' + (navbarTotalHeight) + 'px;'">
				<!-- 切换部分 -->
				<view class="record-tabs">
					<view class="record-tabs-item" data-index="1" @tap="handleSwitchTab"
						:style="'background-image: url(' + (c_activeTab == 1 ? s_background_tabs_active_1 : s_background_tabs_1) + ');'">
						发送钥匙</view>
					<view class="record-tabs-item" data-index="2" @tap="handleSwitchTab"
						:style="'background-image: url(' + (c_activeTab == 2 ? s_background_tabs_2 : s_background_tabs_active_2) + ');'">
						{{ btnState }}使用记录
					</view>
				</view>
				<!-- 详情区域部分 -->
				<block v-if="c_activeTab == 1">
					<scroll-view scroll-y @scrolltolower="handleLower" @refresherrefresh="handleRefresh"
						:refresher-enabled="true" :refresher-triggered="g_triggered">
						<block v-for="(item, index) in g_items" :key="index">
							<view class="content-item">
								<view class="content-item-head">
									<view class="head-left">
										<view class="left-category">
											<image src="/static/public/car_01.png" />
											<text>{{ item.platenumber }}</text>
										</view>

										<view class="left-model" v-if="!item.bluetoothKey">
											{{ item.vehicleSerialName || '-' }}{{ item.vehicleModeName || '' }}111
										</view>
									</view>
								</view>
								<view class="content-item-info">
									<view :class="'info-item  ' + (item.vin.length > 15 ? 'long-info-item' : '')"
										v-if="!item.bluetoothKey">
										<label>车架号 ：</label>
										<text>{{ item.vin || '-' }}</text>
									</view>
									<view :class="'info-item  ' + (item.xsgw.length > 15 ? 'long-info-item' : '')"
										v-if="!item.bluetoothKey">
										<label>油箱容积 ：</label>
										<text>{{ item.xsgw ? item.xsgw + 'L' : '-' }}</text>
									</view>
									<view
										:class="'info-item  ' + (item.carOwnerName.length > 15 ? 'long-info-item' : '')"
										v-if="!item.bluetoothKey">
										<label>设备平台 ：</label>
										<text>{{ item.carOwnerName || '-' }}</text>
									</view>
									<view :class="'info-item  ' + (item.sn.length > 15 ? 'long-info-item' : '')">
										<label>设备号 ：</label>
										<text>{{ item.sn || '-' }}</text>
									</view>
								</view>
								<view class="content-item-footer">
									<view class="footer-left"></view>
									<view class="footer-right">
										<view class="footer-right-btn" :data-item="item" @tap="handleShowSendKeyModal">
											<text>发送钥匙</text>
										</view>
									</view>
								</view>
							</view>
						</block>
					</scroll-view>
				</block>
				<block v-if="c_activeTab == 2">
					<scroll-view scroll-y @scrolltolower="handleLower" @refresherrefresh="handleRefresh"
						:refresher-enabled="true" :refresher-triggered="g_triggered">
						<block v-for="(item, index) in y_items" :key="index">
							<view class="content-card">
								<view class="card-head">
									<view class="card-head-left">
										<text>{{ item.platenumber }}</text>
										<text>{{ item.personname }}</text>
										<text class="split-line"></text>
										<text class="phone-text">{{ item.mobile }}</text>
									</view>
									<view class="card-head-right">
										<text v-if="item.status" style="color: #7b7b7c">已取消</text>
										<text v-else>使用中</text>
									</view>
								</view>
								<view class="card-info">
									<time-line
										:events="[{ createdate: item.startdate || '-' }, { createdate: item.enddate || '-' }]" />
								</view>
								<view class="card-footer1" v-if="!item.status"
									style="display: flex; justify-content: space-between">
									<view>
										<text @tap="handleEditKey" :data-item="item" style="float: left">修改</text>
									</view>
									<view style="display: flex; flex-direction: row">
										<!-- <button :data-item="item" open-type="share" @tap="handleForward">一键转发</button> -->
										<text @tap="handleCopy" :data-item="item">{{ copied ? '已复制' : '复制链接' }}</text>
										<text @tap="handleCance" :data-item="item">取消用车</text>
									</view>
								</view>
							</view>
						</block>
					</scroll-view>
				</block>
			</view>
		</view>
		<!-- 发送电子钥匙弹窗 -->

		<view class="modal-mask" v-if="c_send_key_show_momal" @tap="handleHideSengKeyModal"></view>
		<view class="modal-base-map" v-if="c_send_key_show_momal">
			<form @submit="handleFormSubmit">
				<view class="modal-container">
					<view class="modal-container-head">
						<text>发送电子钥匙</text>
						<image src="/static/privateCar/right_1.png" @tap="handleHideSengKeyModal" />
					</view>
					<view class="modal-container-middle">
						<view class="middle-form-item">
							<label>车牌号</label>
							<view class="modal-form-region">
								{{ cellData.platenumber }}
							</view>
						</view>
						<view class="middle-form-item">
							<label>使用人</label>
							<view class="modal-form-region">
								<input placeholder="请输入使用人" name="personName"
									style="text-align: right; font-size: 28rpx" />
							</view>
						</view>
						<view class="middle-form-item">
							<label>手机号</label>
							<view class="modal-form-region">
								<input placeholder="请输入手机号" name="mobile" style="text-align: right; font-size: 28rpx" />
							</view>
						</view>
						<view class="middle-form-item">
							<label>开始时间</label>
							<view class="modal-form-region">
								<picker mode="date" data-index="startDate" @change="bindTimeChange">
									<view class="form-item-text">
										<text>{{ startDate }}</text>
									</view>
								</picker>
								<picker mode="time" data-index="startTime" @change="bindTimeChange">
									<view class="form-item-text">
										<text>{{ startTime }}</text>
									</view>
								</picker>
							</view>
						</view>
						<view class="middle-form-item">
							<label>结束时间</label>
							<view class="modal-form-region">
								<picker mode="date" data-index="endDate" @change="bindTimeChange">
									<view class="form-item-text">
										<text>{{ endDate }}</text>
									</view>
								</picker>
								<picker mode="time" data-index="endTime" @change="bindTimeChange">
									<view class="form-item-text">
										<text>{{ endTime }}</text>
									</view>
								</picker>
							</view>
						</view>
						<view class="middle-form-item">
							<label>备注</label>
							<view class="modal-form-region">
								<input placeholder="请输入车位号或车辆位置" name="bak"
									style="text-align: right; font-size: 28rpx" />
							</view>
						</view>
					</view>
					<view class="modal-container-footer">
						<button formType="submit">确认</button>
					</view>
				</view>
			</form>
		</view>

		<!-- 修改电子钥匙 -->

		<view class="modal-mask" v-if="c_edit_key_show_momal" @tap="handleHideEditKeyModal"></view>
		<view class="modal-base-map" v-if="c_edit_key_show_momal">
			<form @submit="handleFormEdit">
				<view class="modal-container">
					<view class="modal-container-head">
						<text>修改</text>
						<image src="/static/privateCar/right_1.png" @tap="handleHideEditKeyModal" />
					</view>
					<view class="modal-container-middle">
						<view class="middle-form-item">
							<label>车牌号</label>
							<view class="modal-form-region">
								{{ g_edit_info.platenumber }}
							</view>
						</view>
						<view class="middle-form-item">
							<label>使用人</label>
							<view class="modal-form-region">
								<text>{{ g_edit_info.personname }}</text>
							</view>
						</view>
						<view class="middle-form-item">
							<label>手机号</label>
							<view class="modal-form-region">
								<text>{{ g_edit_info.mobile }}</text>
							</view>
						</view>
						<view class="middle-form-item">
							<label>开始时间</label>
							<view class="modal-form-region">
								<picker mode="date" data-index="startDate" @change="bindTimeChange">
									<view class="form-item-text">
										<text>{{ startDate }}</text>
									</view>
								</picker>
								<picker mode="time" data-index="startTime" @change="bindTimeChange">
									<view class="form-item-text">
										<text>{{ startTime }}</text>
									</view>
								</picker>
							</view>
						</view>
						<view class="middle-form-item">
							<label>结束时间</label>
							<view class="modal-form-region">
								<picker mode="date" data-index="endDate" @change="bindTimeChange">
									<view class="form-item-text">
										<text>{{ endDate }}</text>
									</view>
								</picker>
								<picker mode="time" data-index="endTime" @change="bindTimeChange">
									<view class="form-item-text">
										<text>{{ endTime }}</text>
									</view>
								</picker>
							</view>
						</view>
						<view class="middle-form-item">
							<label>备注</label>
							<view class="modal-form-region">
								<text>{{ g_edit_info.bak || '-' }}</text>
							</view>
						</view>
					</view>
					<view class="modal-container-footer">
						<button formType="submit">确认</button>
					</view>
				</view>
			</form>
		</view>

	</view>
</template>

<script>
	import CustomNavBar from "@/components/custom-header/index.vue";
	import timeLine from '@/components/timeline/timeline';
	import {
		u_paivateUpdateRentKey,
		u_paivateCarList,
		u_paivateRentRecord,
		u_paivateSendRentKey,
		u_paivateCancelRentKey,
		u_sendRentKey,
		u_updateRentKey
	} from '@/api'
	import {
		info_screen
	} from '@/utils/scheme/screen.js'
	import 'url-search-params-polyfill';

	export default {
		components: {
			CustomNavBar,
			timeLine
		},
		data() {
			return {
				screenInfo: {},
				// 标签页背景图片（未激活状态）
				s_background_tabs_1: '/static/privateCar/1-1.png',
				s_background_tabs_2: '/static/privateCar/1-2.png',
				// 标签页背景图片（激活状态）
				s_background_tabs_active_1: '/static/privateCar/2-1.png',
				s_background_tabs_active_2: '/static/privateCar/2-2',
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

				c_tabs: [{
						name: '',
						value: '1'
					},
					{
						name: '',
						value: '2'
					}
				],

				//tabs切换签
				c_activeTab: 1,

				params: {},
				file: null,
				g_triggered: false,

				//下拉刷新状态
				c_send_key_show_momal: false,

				startDate: '2025-03-20',

				//历史轨迹查询时间
				startTime: '19:00',

				//历史轨迹查询时间
				endDate: '2025-03-20',

				//历史轨迹查询时间
				endTime: '19:00',

				//历史轨迹查询时间
				copied: false,

				controlcode: '',
				c_edit_key_show_momal: false,

				g_edit_info: {
					platenumber: '',
					personname: '',
					mobile: '',
					bak: ''
				},

				oilendDate: '',
				oilendTime: '',

				cellData: {
					platenumber: ''
				},

				vehId: '',
				g_total: '',
				comParam: '',
				y_total: '',
				category: '',
				bak: '',
				s_background_picture_of_the_front_page: '',
				btnState: ''
			};
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
		onLoad(options) {
			this.getOrderList();
			this.getKeySendingList();
		},
		onReady() {
			this.handleCurrentDate();
		},
		onShow() {
			this.initialScreenInfo()
			this.handleCurrentDate();
		},
		onShareAppMessage() {
			return {
				title: `请前往${this.bak || '车主指定位置'}寻找车辆`,
				path: '/pages/desk/desk?scene=' + this.controlcode
			};
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
			// 获取当前年月日 时分
			handleCurrentDate() {
				const formatDate = (date) => {
					const year = date.getFullYear();
					const month = date.getMonth() + 1;
					const day = date.getDate();
					return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
				};
				const formatTime = (date) => {
					const hours = date.getHours();
					const minutes = date.getMinutes();
					return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
				};
				const now = new Date();
				const tomorrow = new Date(now);
				tomorrow.setDate(now.getDate() + 1); // 改为获取明天

				const currentDate = formatDate(now);
				const tomorrowDate = formatDate(tomorrow);
				const currentTime = formatTime(now);

				this.oilendDate = currentDate
				this.oilendTime = currentTime
				this.startDate = currentDate
				// 今天作为开始日期
				this.endDate = tomorrowDate
				// 明天作为结束日期
				this.startTime = currentTime
				this.endTime = currentTime

			},


			// 获取当前年月日 时分
			handleCurrentDate() {
				const formatDate = (date) => {
					const year = date.getFullYear();
					const month = date.getMonth() + 1;
					const day = date.getDate();
					return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
				};
				const formatTime = (date) => {
					const hours = date.getHours();
					const minutes = date.getMinutes();
					return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
				};
				const now = new Date();
				const tomorrow = new Date(now);
				tomorrow.setDate(now.getDate() + 1); // 改为获取明天

				const currentDate = formatDate(now);
				const tomorrowDate = formatDate(tomorrow);
				const currentTime = formatTime(now);

				this.startDate = currentDate
				// 今天作为开始日期
				this.endDate = tomorrowDate
				// 明天作为结束日期
				this.startTime = currentTime
				this.endTime = currentTime

			},

			// 发送电子钥匙弹窗
			handleShowSendKeyModal(evt) {
				console.log(evt, '1111')
				const info = evt.currentTarget.dataset.item;

				this.cellData = info
				this.c_send_key_show_momal = true
				this.vehId = info.id

			},

			handleHideSengKeyModal() {
				this.cellData = {}
				this.c_send_key_show_momal = false

			},

			handleHideEditKeyModal() {
				this.c_edit_key_show_momal = false
				this.g_edit_info = {}
			},

			// 切换tabs标签
			handleSwitchTab(e) {
				const flag = e.currentTarget.dataset;
				console.log(flag)
				if (flag?.index == 1 && this.c_activeTab != 1) {
					this.c_activeTab = 1
				}
				if (flag?.index == 2 && this.c_activeTab != 2) {
					this.c_activeTab = 2
				}
			},

			// 触底执行
			handleLower() {
				g_page: this.g_page + 1
				setTimeout(() => {
					this.getOrderList();
				}, 300)
			},

			// 电子钥匙发送记录到底执行
			handleKeyLower() {
				const page = this.y_page;

				this.y_page = page + 1

				setTimeout(() => {
					this.getKeySendingList();
				}, 300)

			},

			// 下拉操作执行
			handleRefresh() {

				this.g_triggered = false
				this.g_page = 1
				this.g_items = []

				setTimeout(() => {
					this.getOrderList();
				}, 300)

			},

			handleKeyRefresh() {

				this.y_triggered = false
				this.y_page = 1
				this.y_items = []

				setTimeout(() => {
					this.getKeySendingList();
				}, 300)

			},

			// 请求车辆列表
			getOrderList() {
				uni.showLoading({
					title: '加载中...',
				});
				const param = {
					page: this.g_page
				};
				u_paivateCarList().then(response => {
					if (response.code == 1000) {
						if (this.g_page > 1 && response.content.length === 0) {
							uni.showToast({
								title: `已加载全部数据：共${this.g_items.length}条`,
								icon: 'none',
								duration: 1500
							});
						}

						this.g_items = this.g_items.concat(response.content)
						this.g_total = Number(response.count || 0).toLocaleString()
						setTimeout(() => {
							uni.hideLoading();
						}, 300)


					} else {
						uni.hideLoading();
					}

				})

			},

			// 搜索记录
			bindblurSea(evt) {

				this.comParam = evt.detail.value
				this.y_triggered = false
				this.y_page = 1
				this.y_items = []

				setTimeout(() => {
					this.getKeySendingList();
				}, 300)

			},

			// 请求发送记录列表
			getKeySendingList: async function(evt) {
				uni.showLoading({
					title: '加载中...'
				});
				const params = {
					page: this.y_page
				};
				u_paivateRentRecord().then(response => {
					if (this.y_page > 1 && response.content.length === 0) {
						uni.showToast({
							title: `已加载全部数据：共${this.y_items.length}条`,
							icon: 'none',
							duration: 1500
						});
						return;
					}
					this.y_total = response.count || 0
					this.y_items = [...this.y_items, ...response.content]
					console.log([...this.y_items, ...response.content])
				})
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
				const validations = [{
						field: formData.personName,
						message: '请输入使用人'
					},
					{
						field: formData.mobile,
						message: '请输入手机号'
					}
				];
				const validationError = validations.find(({
					field
				}) => !field);
				if (validationError) {
					uni.showToast({
						title: validationError.message,
						icon: 'none',
						duration: 1500
					});
					return;
				}
				const buildDateTime = (date, time) => `${date || ''} ${time ? `${time}:00` : '00:00:00'}`.trim();
				const requestParams = {
					vehId: vehId,
					startDate: buildDateTime(startDate, startTime),
					endDate: buildDateTime(endDate, endTime),
					personName: formData.personName,
					mobile: formData.mobile,
					bak: formData.bak
				};
				const API_ENDPOINTS = {
					baseURL: '',
					sendRentKey: u_paivateSendRentKey
				};
				const submitRequest = async () => {
					try {
						const response = await u_sendRentKey(requestParams)
						// const response = await byGet(`${API_ENDPOINTS.baseURL}${API_ENDPOINTS.sendRentKey}`,
						// 	requestParams);
						if (response.code !== 1000) {
							throw new Error(response.data.msg);
						}
						uni.showToast({
							title: '发送成功',
							icon: 'none',
							duration: 1500
						});

						this.c_send_key_show_momal = false
						this.g_items = []
						this.y_items = []
						this.y_page = 1

						setTimeout(() => {
							this.getKeySendingList();
							this.getOrderList();
						}, 100)

					} catch (error) {
						console.log('CatchClause', error);
						console.log('CatchClause', error);
						uni.showToast({
							title: error.message || '请求失败，请稍后重试',
							icon: 'none',
							duration: 1500
						});
					}
				};
				submitRequest();
			},

			bindTimeChange(evt) {
				const category = evt.currentTarget.dataset.index;
				const value = evt.detail.value;

				this[category] = value

			},

			handleCance(evt) {
				const params = {
					controlCode: evt.currentTarget.dataset.item.controlcode
				};
				u_paivateCancelRentKey().then((response) => {
					if (response.code == 1000) {
						this.c_send_key_show_momal = false,
							this.g_items = [],
							this.y_items = [],
							this.y_page = 1
						setTimeout(() => {
							this.getKeySendingList();
							this.getOrderList();
						}, 300)

					} else {
						uni.showToast({
							title: response.msg,
							icon: 'none',
							duration: 1500
						});
					}

				})

			},

			handleCopy(evt) {
				const text = evt.currentTarget.dataset.item.simplecode;
				uni.setClipboardData({
					data: text,
					success: () => {
						this.copied = true
					}
				});
			},

			handleForward(evt) {
				console.log(evt);
				const controlcode = evt.currentTarget.dataset.item.controlcode;
				const bak = evt?.currentTarget?.dataset?.item?.bak;

				this.controlcode = controlcode,
					this.bak = bak

			},

			handleEditKey(evt) {
				console.log(evt.currentTarget.dataset.item);

				this.c_edit_key_show_momal = true
				this.g_edit_info = evt.currentTarget.dataset.item

			},

			async handleFormEdit() {
				const {
					startDate,
					startTime,
					endDate,
					endTime,
					g_edit_info
				} = this;
				const buildDateTime = (date, time) => `${date || ''} ${time ? `${time}:00` : '00:00:00'}`.trim();
				const requestParams = {
					controlCode: g_edit_info.controlcode,
					startDate: buildDateTime(startDate, startTime),
					endDate: buildDateTime(endDate, endTime)
				};
				const response = await u_updateRentKey(requestParams)
				console.log(response,'0000')
				if (response.code == 1000) {
					this.g_edit_info = {}
					this.c_edit_key_show_momal = false
					this.y_triggered = false
					this.y_page = 1
					this.y_items = []
					setTimeout(() => {
						this.getKeySendingList();
					}, 300)


				}
				console.log(requestParams);
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
		margin: auto;
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
		padding: 10rpx;
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
		width: 40rpx;
		height: 40rpx;
	}

	.left-brand {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 24rpx;
		color: #1b64b1;
		background: #eef7ff;
		border-radius: 5rpx;
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
		gap: 10rpx;
		align-items: center;
		justify-content: center;
	}

	.right-state {
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 26rpx;
	}

	.right-special-state {
		border-radius: 8rpx;
		border: 1px solid #dd0b2d;
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 20rpx;
		color: #dd0b2d;
		padding: 0 15rpx;
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

	.card-upload {
		font-size: 26rpx;
		color: #7b7c7c;
		border: 1rpx solid #f0f0f0;
		padding: 0rpx 20rpx;
		border-radius: 8rpx;
	}

	.modal-form-region {
		display: flex;
		gap: 10rpx;
	}

	.form-item-text {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 4rpx;
		padding: 4rpx 2rpx 4rpx 10rpx;
		gap: 20rpx;
	}

	.form-item-text text {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 28rpx;
		color: #7b7c7c;
	}

	.card-footer {
		position: absolute;
		text-align: center;
		bottom: 120rpx;
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

	/* 搜索框 */
	.search-box {
		display: flex;
		align-items: center;
		border: 1px solid #f0f0f0;
		border-radius: 200rpx;
		padding: 4px 12px;
		width: 96%;
	}

	/* 搜索图标 */
	.search-icon {
		margin-right: 8px;
		/* 图标与输入框之间留出间距 */
	}

	/* 输入框 */
	.search-input {
		flex: 1;
		border: none;
		background-color: transparent;
		outline: none;
		font-size: 22rpx;
	}

	.count-text {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 22rpx;
		color: #7b7c7c;
	}

	.tabs-1-conut {
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 22rpx;
		color: #7b7c7c;
		padding: 10px;
		/* border-bottom: 1px solid #f0f0f0; */
	}

	.content-container {
		position: absolute;
		bottom: 10rpx;
		left: 0;
		right: 0;
		overflow-y: auto;
		/* 当内容超出高度时显示滚动条 */
	}

	.content-card {
		border: 1px solid #f0f0f0;
		margin: 12rpx;
		padding: 12rpx;
		border-radius: 8rpx;
	}

	.card-head {
		border-bottom: 1px solid #f0f0f0;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.card-head-left {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 20rpx;
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 26rpx;
		color: #333333;
	}

	.phone-text {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 24rpx;
		color: #333333;
	}

	.card-head-right {
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 26rpx;
		color: #4587fd;
	}

	.split-line {
		border-left: 1px solid #f0f0f0;
		width: 1px;
		height: 35rpx;
	}

	.card-info {
		border-bottom: 1px solid #f0f0f0;
	}

	.card-footer1 {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 60rpx;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 22rpx;
		color: #333333;
		padding-top: 10rpx;
	}

	.card-footer1 text {
		border: 1px solid #f0f0f0;
		padding: 10rpx 20rpx;
		border-radius: 8rpx;
		background-color: #4587fd;
		color: #fff;
	}

	.card-footer1 button {
		border: 1px solid #f0f0f0;
		border-radius: 8rpx;
		height: 58rpx;
		font-size: 22rpx;
		display: flex;
		/* align-items: center; */
		justify-content: flex-end;
		background-color: #4587fd;
		color: #fff;
		margin: inherit;
	}

	.detection_button {
		position: absolute;
		bottom: 60px;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.detection_button text {
		background: linear-gradient(88deg, #1576dc, #1b64b1);
		box-shadow: 0rpx 1rpx 13rpx 0rpx rgba(51, 63, 92, 0.31);
		border-radius: 50rpx;
		font-family: PingFang SC;
		padding: 0rpx 100rpx;
		font-weight: bold;
		font-size: 30rpx;
		color: #ffffff;
		line-height: 76rpx;
	}

	/* 弹窗蒙版 */
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 10;
		background: rgba(0, 0, 0, 0.4);
		z-index: 998;
	}

	.modal-base-map {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: #fff;
		border-radius: 20rpx;
		z-index: 998;
		padding: 20rpx;
	}

	.modal-container {
		height: 40vh;
		display: flex;
		flex-direction: column;
	}

	.modal-container-head {
		display: flex;
		justify-content: row;
		justify-content: space-between;
		align-items: center;
		height: 60rpx;
	}

	.modal-container-head text {
		font-weight: bold;
		font-size: 34rpx;
		color: #333333;
	}

	.modal-container-head image {
		width: 24rpx;
		height: 24rpx;
	}

	.modal-container-middle {
		flex: 1;
		overflow-y: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 20rpx;
	}

	.modal-container-footer {
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-container-footer button {
		background: linear-gradient(88deg, #1576dc, #1b64b1);
		box-shadow: 0rpx 1rpx 13rpx 0rpx rgba(51, 63, 92, 0.31);
		border-radius: 36rpx;
		font-weight: bold;
		font-size: 34rpx;
		color: #ffffff;
		width: 50%;
		height: 90%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.middle-form-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 45rpx;
		width: 80%;
	}

	.middle-form-item label {
		font-family: PingFang SC;
		font-weight: 600;
		font-size: 28rpx;
		color: #333333;
	}

	.modal-form-region {
		display: flex;
		gap: 10rpx;
	}

	.form-item-text {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 4rpx;
		padding: 4rpx 2rpx 4rpx 10rpx;
		gap: 20rpx;
	}

	.form-item-text text {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 28rpx;
		color: #7b7c7c;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.form-item-text image {
		width: 30rpx;
		height: 30rpx;
	}
</style>