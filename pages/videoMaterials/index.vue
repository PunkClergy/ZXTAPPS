<template>
	<view class="container">
		<CustomNavBar :title="pageType?'使用指南':'视频物料'" />
		<!-- index.wxml -->
		<view class="header-content" :style="'margin-top: ' + (navbarTotalHeight) + 'px;'">
			
			<!-- <view class="search-box">
				<input placeholder="请输入名称" @blur="handleBlur" class="search-input" />
			</view> -->
		</view>
		<view class="record-container">
			<!-- 详情区域部分 -->
			<scroll-view scroll-y>
				<view v-for="(item, index) in g_items" :key="index" class="content-item">
					<view class="content-item-head">
						<view class="head-left">
							<view class="left-category">
								<text>{{item.title}}</text>
							</view>
						</view>

					</view>
					<view class="content-item-info">
						<view class="info-item" v-if="!pageType">
							<label>主/子序号 ：</label>
							<text>{{item.dsx||'-'}}/{{item.xsx}}</text>
						</view>
						<view class="info-item"
							:class="item.createusername && item.createusername.length > 15 ? 'long-info-item' : ''"
							v-if="!pageType">
							<label>创建人 ：</label>
							<text>{{item.createusername||'-'}}</text>
						</view>
						<view class="info-item"
							:class="item.fileTypeName && item.fileTypeName.length > 15 ? 'long-info-item' : ''">
							<label>类型 ：</label>
							<text>{{item.fileTypeName||'-'}}</text>
						</view>
						<view class="info-item"
							:class="item.industryName && item.industryName.length > 15 ? 'long-info-item' : ''">
							<label>行业 ：</label>
							<text>{{item.industryName||'-'}}</text>
						</view>
						<view class="info-item long-info-item">
							<label>创建时间 ：</label>
							<text>{{item.createdate||'-'}}</text>
						</view>
						<view class="info-item long-info-item">
							<label>备注 ：</label>
							<text>{{item.bak||'-'}}</text>
						</view>
					</view>

					<view class="content-item-footer">
						<view class="footer-left">
						</view>
						<view class="footer-right" style="display: flex;gap: 10rpx;">
							<view class="footer-right-btn" :data-item="item" @tap="hadleView">
								<text>查看</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		u_promotionalApi,
		u_promotionalApiWxBooklist,
		u_industryList
	} from '@/api'
	import {
		info_screen
	} from '@/utils/scheme/screen.js'
	import CustomNavBar from "@/components/custom-header/index.vue";

	const filter_sort = [{
			value: 'asc',
			name: '升序'
		},
		{
			value: 'desc',
			name: '降序'
		},
	]
	const filter_type = [{
			value: '',
			name: '全部'
		},
		{
			value: 1,
			name: '图片'
		},
		{
			value: 2,
			name: '视频'
		},
		{
			value: 3,
			name: '文档'
		},
		{
			value: 4,
			name: '其他'
		},
	]

	export default {
		data() {
			return {
				screenInfo: {},
				navBarHeight: uni.getSystemInfoSync().platform == 'ios' ? 49 : 44, // 导航栏高度，默认值
				searchBarHeight: 80, // 搜索框高度，默认值

				g_page: 1, //列表页码
				g_items: [], //列表数据
				g_param: {}, //筛选字段
				g_triggered: false, //下拉刷新状态
				pageType: 0,
				filter_industry: [],
				filter_aggregate: [{
						id: 1,
						name: '默认排序',
						btnRender: false,
						params: 'a',
						filter_work_status: filter_sort
					},
					{
						id: 2,
						name: '所有类型',
						btnRender: false,
						params: 'a',
						filter_work_status: filter_type
					},
					{
						id: 3,
						name: '所有行业',
						btnRender: false,
						params: 'a',
						filter_work_status: []
					},
				],
				s_background_picture_of_the_front_page: '',
				g_total: 0
			}
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
			this.pageType = options?.type || 0
			this.$nextTick(() => {
				this.initList()
			})
		},

		onShow() {
			this.initialiImageBaseConversion()
			this.initialQuickEntry()
			this.initialScreenInfo()
		},

		onReady() {
			// 可以在这里添加onReady逻辑
		},



		methods: {
			// 获取屏幕信息
			async initialScreenInfo() {
				try {
					this.screenInfo = await info_screen();
				} catch (error) {
					console.error('[ScreenInfo] 获取屏幕信息失败:', error);
					uni.showToast({
						title: '设备信息获取失败',
						icon: 'none'
					});
				}
			},

			// 查询行业数据
			async initialQuickEntry() {
				const params = {
					terminalId: -1
				}
				await u_industryList(params).then(response => {
					console.log(response)
					const content = response?.content || []
					const info = content.map(({
						id,
						name
					}) => ({
						value: id,
						name
					}))
					const infoWithAll = [{
						value: '',
						name: '全部'
					}, ...info]

					const {
						filter_aggregate
					} = this
					if (Array.isArray(filter_aggregate) && filter_aggregate[2]) {
						const updatedFilterAggregate = [...filter_aggregate]
						updatedFilterAggregate[2] = {
							...updatedFilterAggregate[2],
							filter_work_status: infoWithAll
						}

						this.filter_aggregate = updatedFilterAggregate
						this.filter_industry = infoWithAll
					}
				})
			},

			// 全屏背景图
			initialiImageBaseConversion() {
				const imageMap = [{
					path: '/static/images/home/car-bg.png',
					key: 's_background_picture_of_the_front_page'
				}]

				const promises = imageMap.map(item =>
					new Promise((resolve, reject) => {
						// uniapp中可以使用uni.getFileSystemManager()，但更推荐使用本地路径
						// 这里改为直接使用静态资源路径
						resolve({
							[item.key]: item.path
						})
					})
				)

				Promise.all(promises)
					.then(results => {
						const dataToUpdate = results.reduce((acc, curr) => ({
							...acc,
							...curr
						}), {})
						Object.keys(dataToUpdate).forEach(key => {
							this[key] = dataToUpdate[key]
						})
					})
			},

			bindPickerChange(evt) {
				const flag = evt?.currentTarget?.dataset?.id // '1', '2', '3'
				const key = evt?.detail?.key // 选中项的索引（或 key）

				const {
					g_param,
					filter_aggregate,
					filter_industry
				} = this

				// 映射配置：id → 参数名 + 数据源
				const config = {
					'1': {
						targetKey: 'sort',
						sourceList: filter_sort
					},
					'2': {
						targetKey: 'fileType',
						sourceList: filter_type
					},
					'3': {
						targetKey: 'industry',
						sourceList: filter_industry
					}
				}

				const setting = config[flag]
				if (!setting) return

				const {
					targetKey,
					sourceList
				} = setting
				const selectedItem = sourceList?.[key]

				if (!selectedItem) return

				// 1. 更新 g_param
				const newGParam = {
					...g_param,
					[targetKey]: selectedItem.value
				}

				// 2. 更新 filter_aggregate 对应项的 name 为选中项的 name
				const newFilterAggregate = [...filter_aggregate]
				const index = newFilterAggregate.findIndex(item => item.id == flag) // 注意：id 是数字，flag 是字符串
				if (index !== -1) {
					newFilterAggregate[index] = {
						...newFilterAggregate[index],
						name: selectedItem.name // 👈 关键：复用 name 字段
					}
				}

				// 3. setData 并刷新列表
				this.g_param = newGParam
				this.filter_aggregate = newFilterAggregate
				this.g_page = 1 //列表页码
				this.g_items = [] //列表数据

				this.$nextTick(() => {
					this.initList()
				})
			},

			handleBlur(evt) {
				const inputValue = evt?.detail?.value ?? ''
				const {
					g_param
				} = this
				this.g_param = {
					...g_param,
					name: inputValue
				}
				this.g_page = 1 //列表页码
				this.g_items = [] //列表数据

				this.$nextTick(() => {
					this.initList()
				})
			},

			// 列表数据
			async initList(evt) {
				console.log(this.g_param)
				const param = {
					page: this.g_page,
					...this.g_param
				}
				const handle = evt ? u_promotionalApiWxBooklist : u_promotionalApi
				await handle().then(response => {
					console.log(response)
					if (response.code == 1000) {
						if (this.g_page > 1 && response.content.length === 0) {
							uni.showToast({
								title: `已加载全部数据：共${this.g_items.length}条`,
								icon: 'none'
							})
						}
						this.g_items = this.g_items.concat(response.content)
						this.g_total = Number(response.count || 0).toLocaleString()

					} else {
						uni.showToast({
							title: '请求失败，请稍后再试',
							icon: 'none'
						})

					}
				})
			},

			// 触底请求
			handleLower() {
				this.g_page = this.g_page + 1
				this.$nextTick(() => {
					this.initList(this.pageType)
				})
			},



			/**
			 * 根据链接后缀判断类型：图片、视频、文档 或 其他
			 * @param {string} url - 链接地址
			 * @returns {string} 返回类型：'image' | 'video' | 'document' | 'unknown'
			 */
			getLinkTypeByExtension(url) {
				const match = url.match(/\.([a-zA-Z0-9]+)(\?|#|$)/)
				if (!match) return 'unknown'
				const ext = match[1].toLowerCase()
				const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico']
				const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'flv', 'mkv']
				const documentExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'rtf', 'md', 'zip',
					'rar'
				]

				if (imageExtensions.includes(ext)) return 'image'
				if (videoExtensions.includes(ext)) return 'video'
				if (documentExtensions.includes(ext)) return 'document'
				return 'unknown'
			},

			hadleCopyLink(evt) {
				const info = evt?.currentTarget?.dataset?.item
				uni.setClipboardData({
					data: `${info?.title} https://k3a.wiselink.net.cn/img/${encodeURI(info.filepath)}`,
					success: function() {
						uni.showToast({
							title: '已复制到剪贴板',
							icon: 'none'
						})
					},
					fail: function(err) {
						uni.showToast({
							title: '复制失败',
							icon: 'none'
						})
						console.error('复制失败:', err)
					}
				})
			},

			hadleView(evt) {
				const path = `https://k3a.wiselink.net.cn/img/${evt?.currentTarget?.dataset?.item.filepath}`
				const info = this.getLinkTypeByExtension(path)
				uni.navigateTo({
					url: `/pages/agreementWebView/agreementWebView?url=${path}`,
				})
			}
		}
	}
</script>

<style scoped>
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

	.header-content {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.search-drop {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 100%;
	}

	.search-box {
		margin-top: 10rpx;
		display: flex;
		align-items: center;
		background-color: #ffffff;
		border-radius: 200rpx;
		padding: 8px 12px;
		width: 95%;
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
		font-size: 16px;
		border: 1rpx solid #f1f1f1;
		padding: 20rpx;
		border-radius: 10rpx;
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
		border: 1px solid #7B7C7C;
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
		color: #7B7C7C;
		display: flex;
	}

	.card-info-item-tips {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.tabs-active {
		background: #1B64B1;
		border-radius: 7rpx;
		color: #FFFFFF !important;
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
		color: #FFFFFF;
	}

	.card-footer view {
		width: 40%;
		background-color: #2196f3;
		padding: 10rpx;
		background: linear-gradient(88deg, #1576DC, #1B64B1);
		box-shadow: 0rpx 1rpx 13rpx 0rpx rgba(51, 63, 92, 0.31);
		border-radius: 36rpx;
	}


	/* 弹窗蒙版 */
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
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

	.search-count {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 90%;
	}

	.search-count text {
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 22rpx;
		color: #7B7C7C;
	}
</style>