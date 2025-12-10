<template>
	<view>
		<!-- 页面根容器：设置整体背景图，使用container样式控制布局 -->
		<view class="container" :style="'background: linear-gradient(' + bgcolor + ', #fff)'">
			<!-- 自定义头部区域：包含系统状态栏高度适配，使用custom-header样式 -->
			<view class="custom-header"
				:style="'padding-top: ' + height_from_head + 'px;height: ' + head_height + 'px;'">
				<view class="custom-header-outer-layer">
					<view class="custom-header-outer-layer-title">{{ tabList[0]?.text }}服务</view>
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
				<!-- 第一块：轮播图区域 -->
				<view class="swiper-container">
					<swiper :indicator-dots="false" :autoplay="true" interval="3000" duration="500"
						:style="'height: ' + s_banner_height + 'px;'">
						<swiper-item v-for="(item, index) in g_banner_image" :key="index">
							<image :src="c_link + '/img/' + item.img" class="banner-img" mode="widthFix"
								data-flag="banner" @load="LoadOnUseGuideImageLoad" />
						</swiper-item>
					</swiper>
				</view>

				<!-- 第三块：专区入口区域（一行三列布局） -->
				<view class="special-zone">
					<view class="zone-item"
						:style="'margin-right: ' + (index == 2 || index == 5 || index == 8 || index == 11 ? '0rpx' : '5%') + ';'"
						v-for="(item, index) in zoneList" :key="index">
						<view class="zone-out" :style="'background-color: ' + item.bgcolor + ';'" :data-info="item"
							@tap="handleGetMenuList">
							<image class="zone-img" :src="'https://k1sw.wiselink.net.cn/img/' + item.icon" />
							<view class="zone-text-area">
								<view class="zone-name">{{ item.name }}</view>
								<view class="zone-desc">{{ item.bak }}</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 第四块：全宽图片轮播区域 -->
				<view class="full-width-swiper" v-if="fullBannerList.length > 0">
					<view class="full-width-use">
						<image src="/static/assets/images/index/useGuideIcon.png" />
						<text>使用指南</text>
					</view>
					<swiper :indicator-dots="false" :autoplay="true" interval="4000" duration="500"
						:style="'height: ' + s_use_height + 'px;'">
						<swiper-item :data-info="item" @tap="handleUseJump" v-for="(item, index) in fullBannerList"
							:key="index">
							<image :src="'https://k1sw.wiselink.net.cn/img/' + item.imgpath" class="full-banner-img"
								data-flag="use" @load="LoadOnUseGuideImageLoad" mode="widthFix"></image>
						</swiper-item>
					</swiper>
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

		<!-- 弹窗代码 -->
		<!-- 优惠券图片容器（点击图片触发授权） -->
		<view class="mask-container" v-if="coupon_modal">
			<view class="coupon-wrapper">
				<button class="image-auth-btn" open-type="getPhoneNumber" hover-class="btn_tapcolor"
					@getphonenumber="handleOnGetPhoneNumber">
					<image src="https://k3a.wiselink.net.cn/img/app/coupon50.png" mode="widthFix" class="coupon-image">
					</image>
				</button>
				<button class="existing-account-btn" @tap="handleOnExistingAccountTap">已有账号？点击登录</button>
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
		u_bannerlist20,
		u_getQrcodeImg,
		u_navlist20,
		u_getHomeArea,
		u_booklist
	} from '@/api'
	export default {
		data() {
			return {
				// 底部tabbar高度
				tabBarHeight: 80,

				// 当前选中的底部tabbar索引
				currentTab: 0,

				// 原始链接
				c_link: 'https://k1sw.wiselink.net.cn/',

				// 头部轮播图数据
				g_banner_image: [],

				// 头部轮播图动态高度
				s_banner_height: '',

				// 咨询入群弹窗状态
				join_the_group_modal: false,

				// 使用指南数据
				fullBannerList: [],

				// 头部标题
				title_name: '',

				// 主题颜色
				bgcolor: '#fff',

				// 距离头部
				height_from_head: 44,

				// 专区入口数据（网络图片）
				zoneList: [{
					id: 1,
					name: '钥匙分享',
					bgcolor: '#EFF1FC',
					icon: 'privateCar.png'
				}],

				// 底部tab数据（网络图片）
				tabList: [],

				head_height: '',
				capsule_distance_to_the_right: '',
				account: '',
				personal_qr_code: '',
				s_use_height: '',
				text: '',
				coupon_modal: ''
			};
		},
		onLoad(options) {
			// 图片转BASE64
			// this.initialiImageBaseConversion();
			// 请求头部banner资源
			this.initialGetBanner();
			// 请求导航数据
			this.initBottomDirectory();
			// 功能区入口
			this.initZoneInfo();
			// 获取使用指南
			this.initBookList();
			if (options?.name) {
				this.title_name = options?.name
			}
			if (options?.bgcolor) {
				this.bgcolor = options?.bgcolor
			}
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
				console.log(s);
				const c = uni.getWindowInfo().screenWidth - m.right;
				this.height_from_head = s
				this.head_height = s + n
				this.capsule_distance_to_the_right = c

			},


			// 获取头部banner资源
			async initialGetBanner() {
				const res = await u_bannerlist20()
				if (res?.code == 1000) {
					this.g_banner_image = res.content
				}

			},

			// 获取当前登录状态
			initLoginStatus() {
				uni.getStorage({
					key: 'user_info',
					// 替换为你的缓存键值
					success: (res) => {
						this.account = res?.data?.companyName || res?.data?.username
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
					this.tabList = response?.content
				}
			},

			// 获取专区目录
			async initZoneInfo() {
				const response = await u_getHomeArea()
				if (response?.code == 1000) {
					this.zoneList = response?.content
				}
			},

			// 获取使用指南
			async initBookList() {
				const response = await u_booklist()
				if (response?.code) {
					this.fullBannerList = response.content
				}
			},

			// 动态改变轮播图高度
			LoadOnUseGuideImageLoad(e) {
				const [self, {
					currentTarget: {
						dataset: {
							flag: mark
						} = {}
					} = {}
				}] = [this, e ?? {}];
				(async () => {
					try {
						const {
							detail: {
								width: w,
								height: h
							} = {}
						} = e ?? {};
						if (!w || !h || typeof w !== 'number' || typeof h !== 'number') {
							throw Symbol();
						}
						const {
							windowWidth: winW
						} = await uni.getSystemInfo({});
						if (!winW || typeof winW !== 'number') {
							throw Symbol();
						}
						const ratioH = (h / w) * winW;
						const validH = isFinite(ratioH) ? ratioH : 0;
						if (mark === 'use') {
							self.s_use_height = validH
						}
						if (mark === 'banner') {
							self.s_banner_height = validH
						}
					} catch (err) {
						console.log('CatchClause', err);
						console.log('CatchClause', err);
						err.description || console.error('imgLoadErr:', err);
					}
				})();
			},

			// 点击“咨询” 显示入群二维码
			handleShowContact() {
				this.join_the_group_modal = true
			},

			// 点击关闭咨询&群二维码
			handleQRClose() {

				this.join_the_group_modal = false

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

			//  跳转功能页面
			handleGetMenuList(evt) {
				const path = evt?.path ?? evt?.currentTarget?.dataset?.info?.path;
				const hasDesk = path.includes('desk') || path.includes('/desk');
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
				console.log('占位：函数 handleOnExistingAccountTap 未声明');
				uni.redirectTo({
					url:'/pages/login/index'
				})
			},

			onReachBottom() {
				console.log('占位：函数 onReachBottom 未声明');
			},

			handleUseJump() {
				console.log('占位：函数 handleUseJump 未声明');
			},

			handleOnGetPhoneNumber() {
				console.log('占位：函数 handleOnGetPhoneNumber 未声明');
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

	/* 轮播图容器样式：占满宽度，左右内边距10rpx */
	.swiper-container {
		width: 100%;
		padding: 0 10rpx;
		box-sizing: border-box;
	}

	/* 轮播图图片样式：占满宽度，高度自适应，圆角20rpx */
	.banner-img {
		width: 100%;
		height: auto;
		border-radius: 20rpx;
	}

	/* 专区入口容器样式：占满宽度，flex-wrap换行，内边距0 10rpx */
	.special-zone {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;
		padding: 0 10rpx;
		margin-top: 20rpx;
		/* justify-content: space-between; */
	}

	/* 专区项样式：宽度48%，左右外边距1%，flex垂直排列，底部外边距20rpx */
	.zone-item {
		width: 30%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 10rpx;
		box-sizing: border-box;
	}

	/* 专区项外层容器样式：占满宽度，高度180rpx，圆角32rpx，flex居中对齐，元素间距20rpx，内边距0 20rpx */
	.zone-out {
		width: 100%;
		height: 180rpx;
		border-radius: 32rpx;
		margin-bottom: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
		border: 1rpx solid #f1f1f1;
	}

	/* 专区图标样式：固定宽高，保持原有比例，不压缩 */
	.zone-img {
		width: 50rpx;
		height: 50rpx;
		object-fit: contain;
		flex-shrink: 0;
	}

	.zone-text-area {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	/* 专区名称样式：粗体，字体大小32rpx，颜色深灰，超出显示省略号 */
	.zone-name {
		font-weight: bold;
		font-size: 24rpx;
		color: #333333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.zone-desc {
		font-size: 20rpx;
		color: #333333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* 全宽轮播图容器样式：占满宽度，白色背景，内边距0 20rpx */
	.full-width-swiper {
		width: 100%;
		/* background-color: #fff; */
		padding: 20rpx;
		/* margin-top: 10rpx; */
		box-sizing: border-box;
	}

	/* 全宽轮播图标题容器样式：flex水平排列，对齐项目中心，间距20rpx，底部外边距20rpx */
	.full-width-use {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20rpx;
		margin-bottom: 20rpx;
	}

	/* 全宽轮播图标题旁图标样式：固定宽高，渐变背景，阴影效果，圆角6rpx，透明度0.8 */
	.full-width-use image {
		width: 13rpx;
		height: 34rpx;
		background: linear-gradient(-45deg, #8c94fd, #b5d6ff, #2964b8, #8fb6f6);
		box-shadow: 0rpx 5rpx 5rpx 0rpx rgba(178, 195, 221, 0.5);
		border-radius: 6rpx;
		opacity: 0.8;
	}

	/* 全宽轮播图标题文本样式：粗体，字体大小32rpx，颜色深灰 */
	.full-width-use text {
		font-weight: bold;
		font-size: 32rpx;
		color: #333333;
	}

	/* 全宽轮播图图片样式：占满宽度，固定高度200rpx，圆角20rpx */
	.full-banner-img {
		width: 100%;
		height: 200rpx;
		border-radius: 20rpx;
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