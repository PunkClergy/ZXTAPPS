<template>
	<view>
		<!-- 页面根容器：设置整体背景图，使用container样式控制布局 -->
		<view class="container">
			<!-- 自定义头部区域：包含系统状态栏高度适配，使用custom-header样式 -->
			<view class="custom-header"
				:style="'padding-top: ' + height_from_head + 'px;height: ' + head_height + 'px;'">
				<view class="custom-header-outer-layer">
					<!-- 	<image class="custom-header-outer-layer-image" src="/static/assets/images/index/home.png"
						@tap="handleBackHome"></image> -->
					<view class="custom-header-outer-layer-title">个人中心</view>
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

			<!-- 中间滚动内容区：使用scroll-view实现垂直滚动，设置顶部和底部偏移量 -->
			<scroll-view class="content" :scroll-y="true" :style="'top: ' + 90 + 'px; bottom: ' + tabBarHeight + 'px;'"
				@scrolltolower="onReachBottom">
				<view class="my-content-list-container">
					<view class="my-content-list-inner">
						<view :data-info="item"
							:class="'my-content-list-item ' + (index === contentList.length - 1 ? 'my-content-list-item_last' : '')"
							@tap="handleFunExe" v-for="(item, index) in contentList" :key="item.id">
							<view class="my-content-list-item__left">
								<text class="my-content-list-item__text">{{ item.text }}</text>
							</view>

							<image src="/static/assets/images/home/right_1.png" class="my-content-list-item__arrow"
								mode="widthFix" />
						</view>
					</view>
				</view>
			</scroll-view>

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
		</view>

		<!-- 点击咨询入群 -->
		<view class="float-button" @tap="handleShowContact">
			<image src="https://k1sw.wiselink.net.cn/img/app2.0/desk/consulting.png" />
		</view>
		<view class="qr-group-container" v-if="join_the_group_modal">
			<view class="qr-group-mask" @tap="handleQRClose">
				<!-- 关闭按钮 -->
				<view class="qr-group-close" @tap="handleQRClose">×</view>
				<view class="qr-group-preview-content">
					<image @tap.stop.prevent="handleQRShowImageMask" class="qr-group-preview-img"
						:src="personal_qr_code" mode="widthFix"></image>
					<text class="qr-group-preview-desc">请点击、长按官方群二维码加入交流群，获取体验权限！</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		u_getQrcodeImg,
		u_navlist20,
		u_mylist
	} from '@/api'
	export default {
		data() {
			return {
				// 底部tabbar高度
				tabBarHeight: 80,

				// 当前选中的底部tabbar索引
				currentTab: 2,

				// 原始链接
				c_link: 'https://k1sw.wiselink.net.cn/',

				// 咨询入群弹窗状态
				join_the_group_modal: false,

				// 底部tab数据（网络图片）
				tabList: [],

				contentList: [],
				height_from_head: 44,
				head_height: '',
				capsule_distance_to_the_right: '',
				account: '',
				personal_qr_code: ''
			};
		},
		onLoad() {
			this.initBottomDirectory();
			// 获取目录结构数据
			this.initDirectoryStructure();
		},
		onShow() {
			// 获取系统头部各区域高度
			// this.initSystemInfo();
		},
		onReady() {
			// 获取登录状态
			this.initLoginStatus();
			// 获取入群二维码
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
					key: 'user_info',
					// 替换为你的缓存键值
					success: (res) => {
							this.account= res?.data?.companyName || res?.data?.username
					},
					fail(err) {
						console.error('获取失败', err); // 失败时的错误信息
					}
				});
			},

			// 请求入群码
			async initQrCode() {
				const response = await u_getQrcodeImg()
				if (response?.code == 1000) {
					this.personal_qr_code = response?.content?.img
				}
			},

			// 获取底部导航数据
			async initBottomDirectory() {
				const response = await u_navlist20()
				if (response?.code == 1000) {
					this.tabList = response?.content,
						this.currentTab = response?.content?.length - 1
				}
			},

			// 获取目录结构数据
			async initDirectoryStructure() {
				const response = await u_mylist()
				if (response?.code == 1000) {
					this.contentList = response?.content
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
						type: 'image'
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

			// 返回上一页面
			handleBackHome() {
				uni.redirectTo({
					url: '/pages/index/index'
				});
			},

			// 点击工具执行
			handleFunExe(evt) {
				console.log(evt);
				const info = evt?.currentTarget?.dataset?.info;
				if (!info || !info.pagePath) {
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
				console.log('占位：函数 handleOnExistingAccountTap 未声明');
				uni.redirectTo({
					url:'/pages/login/index'
				})
			},

			onReachBottom() {
				console.log('占位：函数 onReachBottom 未声明');
			}
		}
	};
</script>
<style>
	/* 隐藏滚动条，但保留滚动功能 */
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	/* 容器样式：设置页面整体布局，占满整个视口高度，使用flex垂直排列 */
	.container {
		width: 100%;
		display: flex;
		flex-direction: column;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		touch-action: pan-x;
		align-items: center;
		height: 100vh;
		background-color: #f3f9fd;
	}

	/* 自定义头部样式：固定在顶部，占满宽度，使用flex布局居中对齐内容 */
	.custom-header {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
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

	.my-content-list-container {
		width: 96%;
		margin: 0 auto;
	}

	.my-content-list-inner {
		width: 94%;
		background-color: #fff;
		margin: 0 auto;
		border-radius: 20rpx;
		padding: 20rpx;
	}

	.my-content-list-item {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #cdd5da;
	}

	.my-content-list-item_last {
		border-bottom: none;
	}

	.my-content-list-item__left {
		display: flex;
		gap: 20rpx;
		flex-direction: row;
		align-items: center;
	}

	.my-content-list-item__icon {
		width: 30rpx;
		height: 30rpx;
	}

	.my-content-list-item__text {
		font-weight: bold;
		font-size: 28rpx;
		color: #333333;
	}

	.my-content-list-item__arrow {
		width: 25rpx;
		height: 25rpx;
	}

	/* 底部tabbar样式：占满宽度，白色背景，flex平均分布，固定在底部，阴影效果，z-index100 */
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

	/* tab项样式：flex垂直排列，居中对齐，宽度25% */
	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 25%;
	}

	/* tab图标样式：固定宽高50rpx，底部外边距10rpx */
	.tab-icon {
		width: 50rpx;
		height: 50rpx;
		margin-bottom: 10rpx;
	}

	/* tab文本样式：字体大小24rpx，颜色浅灰 */
	.tab-item text {
		font-size: 24rpx;
		color: #999;
	}

	/* 激活状态的tab文本样式：颜色改为蓝色 */
	.tab-item.active text {
		color: #3498db;
	}

	/* 优惠券弹窗部分样式 */
	.mask-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
		z-index: 9999;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40rpx;
		box-sizing: border-box;
	}

	/* 空白区域关闭层 */
	.mask-close {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	/* 优惠券及按钮容器 */
	.coupon-wrapper {
		width: 90%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		z-index: 2;
		/* 确保在关闭层上方 */
	}

	/* 图片授权按钮（仅包裹图片） */
	.image-auth-btn {
		width: 100%;
		padding: 0;
		background: transparent;
		border: none;
		margin: 0;
	}

	/* 优惠券图片样式 */
	.coupon-image {
		width: 100%;
		border-radius: 16rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
	}

	/* 已有账号按钮样式（不触发授权） */
	.existing-account-btn {
		margin-top: 20rpx;
		padding: 10rpx 20rpx;
		background-color: transparent;
		color: #cccccc;
		font-size: 24rpx;
		border: none;
		text-decoration: underline;
		text-underline-offset: 4rpx;
		z-index: 3;
		/* 确保点击优先级 */
	}

	/* 按钮交互效果 */
	.btn_tapcolor {
		opacity: 0.9;
	}

	.existing-account-btn:hover {
		color: #ffffff;
	}

	/* 点击咨询入群样式 */

	.float-button {
		position: fixed;
		right: 20rpx;
		top: 75%;
		transform: translateY(-50%);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
		transition: all 0.2s ease;
	}

	.float-button image {
		width: 111rpx;
		height: 123rpx;
	}

	.float-button:active {
		transform: translateY(-50%) scale(0.9);
		background-color: #3a8ee6;
		box-shadow: 0 2rpx 8rpx rgba(64, 158, 255, 0.2);
	}

	.qr-group-container {
		width: 100%;
		box-sizing: border-box;
	}

	/* 遮罩层样式 */
	.qr-group-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.9);
		z-index: 9999;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	/* 关闭按钮 */
	.qr-group-close {
		position: absolute;
		top: 12vh;
		right: 30rpx;
		color: white;
		font-size: 60rpx;
		width: 80rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 10;
		cursor: pointer;
	}

	/* 预览内容区 */
	.qr-group-preview-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 30rpx;
	}

	.qr-group-preview-img {
		max-width: 90%;
		max-height: 70vh;
		object-fit: contain;
		border-radius: 12rpx;
	}

	.qr-group-preview-desc {
		color: white;
		font-size: 24rpx;
		text-align: center;
		padding: 0 40rpx;
		line-height: 1.5;
	}
</style>