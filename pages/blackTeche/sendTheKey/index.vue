<template>
    <view>
        <view class="container" :style="'background-image: url(' + s_background_picture_of_the_front_page + ');height: ' + c_screen_height + 'px;'">
            <custom-header title="发送电子钥匙" />
            <view
                class="record-container"
                :style="'height: ' + (c_screen_height - (navBarHeight + statusBarHeight + 10)) + 'px;margin-top: ' + (navBarHeight + statusBarHeight) + 'px;'"
            >
                <!-- 切换部分 -->
                <view class="record-tabs" @tap="handleSwitchTab">
                    <view class="record-tabs-item" :style="'background-image: url(' + (c_activeTab == 1 ? s_background_tabs_active_1 : s_background_tabs_1) + ');'">发送钥匙</view>
                    <view class="record-tabs-item" :style="'background-image: url(' + (c_activeTab == 2 ? s_background_tabs_2 : s_background_tabs_active_2) + ');'">
                        {{ btnState }}使用记录
                    </view>
                </view>
                <!-- 详情区域部分 -->
                <block v-if="c_activeTab == 1">
                    <scroll-view
                        scroll-y
                        :style="'height:' + (c_screen_height - (navBarHeight + statusBarHeight + 10 + 50)) + 'px;'"
                        @scrolltolower="handleLower"
                        @refresherrefresh="handleRefresh"
                        :refresher-enabled="true"
                        :refresher-triggered="g_triggered"
                    >
                        <block v-for="(item, index) in g_items" :key="index">
                            <view class="content-item">
                                <view class="content-item-head">
                                    <view class="head-left">
                                        <view class="left-category">
                                            <image src="/static/assets/images/home/car_icon.png" />
                                            <text>{{ item.platenumber }}</text>
                                        </view>

                                        <view class="left-model" v-if="!item.bluetoothKey">{{ item.vehicleSerialName || '-' }}{{ item.vehicleModeName || '' }}111</view>
                                    </view>
                                </view>
                                <view class="content-item-info">
                                    <view :class="'info-item  ' + (item.vin.length > 15 ? 'long-info-item' : '')" v-if="!item.bluetoothKey">
                                        <label>车架号 ：</label>
                                        <text>{{ item.vin || '-' }}</text>
                                    </view>
                                    <view :class="'info-item  ' + (item.xsgw.length > 15 ? 'long-info-item' : '')" v-if="!item.bluetoothKey">
                                        <label>油箱容积 ：</label>
                                        <text>{{ item.xsgw ? item.xsgw + 'L' : '-' }}</text>
                                    </view>
                                    <view :class="'info-item  ' + (item.carOwnerName.length > 15 ? 'long-info-item' : '')" v-if="!item.bluetoothKey">
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
                    <view class="record-tabs-1">
                        <view class="search-box">
                            <icon type="search" size="16" class="search-icon" />
                            <input placeholder="车牌号/设备号/使用人" class="search-input" @blur="bindblurSea" />
                        </view>
                    </view>
                    <view class="tabs-1-conut">共有{{ y_total }}条记录</view>
                    <scroll-view
                        class="content-container"
                        :scroll-y="true"
                        :style="'top:' + (25 + 5 + 8 + 10 + 10 + searchBarHeight) + 'px;'"
                        @scrolltolower="handleKeyLower"
                        @refresherrefresh="handleKeyRefresh"
                        :refresher-enabled="true"
                        :refresher-triggered="y_triggered"
                    >
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
                                    <time-line :events="[{ createdate: item.startdate || '-' }, { createdate: item.enddate || '-' }]" />
                                </view>
                                <view class="card-footer1" style="display: flex; justify-content: space-between">
                                    <block v-if="!item.status">
                                        <view>
                                            <text @tap="handleEditKey" :data-item="item" style="float: left">修改</text>
                                        </view>
                                        <view style="display: flex; flex-direction: row">
                                            <button :data-item="item" open-type="share" @tap="handleForward">一键转发</button>
                                            <text @tap="handleCopy" :data-item="item">{{ copied ? '已复制' : '复制链接' }}</text>
                                            <text @tap="handleCance" :data-item="item">取消用车</text>
                                        </view>
                                    </block>
                                    <block v-else>
                                        <view></view>
                                        <view style="display: flex; flex-direction: row">
                                            <text @tap="handleViewPhotos" :data-item="item">查看照片</text>
                                        </view>
                                    </block>
                                </view>
                            </view>
                        </block>
                    </scroll-view>
                </block>
            </view>
        </view>
        <!-- 发送电子钥匙弹窗 -->
        <block>
            <view class="modal-mask" v-if="c_send_key_show_momal" @tap="handleHideSengKeyModal"></view>
            <view class="modal-base-map" v-if="c_send_key_show_momal">
                <form @submit="handleFormSubmit">
                    <view class="modal-container">
                        <view class="modal-container-head">
                            <text>发送电子钥匙</text>
                            <image src="/static/assets/images/home/right_1.png" @tap="handleHideSengKeyModal" />
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
                                    <input placeholder="请输入使用人" name="personName" style="text-align: right; font-size: 28rpx" />
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
                                    <input placeholder="请输入车位号或车辆位置" name="bak" style="text-align: right; font-size: 28rpx" />
                                </view>
                            </view>
                        </view>
                        <view class="modal-container-footer">
                            <button formType="submit">确认</button>
                        </view>
                    </view>
                </form>
            </view>
        </block>
        <!-- 修改电子钥匙 -->
        <block>
            <view class="modal-mask" v-if="c_edit_key_show_momal" @tap="handleHideEditKeyModal"></view>
            <view class="modal-base-map" v-if="c_edit_key_show_momal">
                <form @submit="handleFormEdit">
                    <view class="modal-container">
                        <view class="modal-container-head">
                            <text>修改</text>
                            <image src="/static/assets/images/home/right_1.png" @tap="handleHideEditKeyModal" />
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
        </block>
    </view>
</template>

<script>
import customHeader from '@/components/CustomHeader/index';
import timeLine from '@/components/timeline/timeline';
const { _handleWindowInfo, _handleDeviceInfo } = require('../../../utils/public').default;
const { showLoading, hideLoading, showToast } = require('../../../utils/Inspect/tips');
const { u_addOrUpdate, u_updateRentKey } = require('../../../utils/request/order');
const { u_carList } = require('../../../utils/request/car');
const { byGet, byPost } = require('../../../utils/request/http');
const { u_rentRecord, u_sendRentKey, u_cancelRentKey } = require('../../../utils/request/self');
export default {
    components: {
        customHeader,
        timeLine
    },
    data() {
        return {
            c_screen_height: _handleWindowInfo.screenHeight || 0,

            //屏幕高度
            c_screen_width: _handleWindowInfo.windowWidth || 0,

            //屏幕宽度
            statusBarHeight: _handleWindowInfo.statusBarHeight || 0,

            // 状态栏高度
            navBarHeight: _handleDeviceInfo.platform == 'ios' ? 49 : 44,

            // 导航栏高度，默认值
            s_background_tabs_1: '',

            //tabs背景
            s_background_tabs_2: '',

            //tabs背景
            s_background_tabs_active_1: '',

            //tabs背景
            s_background_tabs_active_2: '',

            //tabs背景
            searchBarHeight: 80,

            // 搜索框高度，默认值
            totalNavHeight: (_handleWindowInfo.statusBarHeight || 0) + (_handleDeviceInfo.platform == 'ios' ? 49 : 44),

            // 总导航高度 = 状态栏高度 + 导航栏高度
            g_page: 1,

            //列表页码
            g_items: [],

            //列表数据
            c_fin3_link: 'https://fin3.wiselink.net.cn/fin/',

            y_items: [],
            y_page: 1,
            y_triggered: false,

            c_tabs: [
                {
                    name: '报销记录',
                    value: '1'
                },
                {
                    name: '新增报销',
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
    onLoad(options) {
        this.getOrderList();
        this.getKeySendingList();
    },
    onReady() {
        this.handleCurrentDate();
    },
    onShow() {
        this.initialiImageBaseConversion();
        this.handleCurrentDate();
    },
    onShareAppMessage() {
        return {
            title: `请前往${this.bak || '车主指定位置'}寻找车辆`,
            path: '/pages/desk/desk?scene=' + this.controlcode
        };
    },
    methods: {
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
            this.setData({
                oilendDate: currentDate,
                oilendTime: currentTime,
                startDate: currentDate,
                // 今天作为开始日期
                endDate: tomorrowDate,
                // 明天作为结束日期
                startTime: currentTime,
                endTime: currentTime
            });
        },

        // 全屏背景图
        initialiImageBaseConversion() {
            const _this = this;
            const imageMap = [
                {
                    path: '/static/assets/images/home/car-bg.png',
                    key: 's_background_picture_of_the_front_page'
                },
                {
                    path: '/static/assets/images/home/1-1.png',
                    key: 's_background_tabs_1'
                },
                {
                    path: '/static/assets/images/home/2-1.png',
                    key: 's_background_tabs_active_1'
                },
                {
                    path: '/static/assets/images/home/1-2.png',
                    key: 's_background_tabs_2'
                },
                {
                    path: '/static/assets/images/home/2-2.png',
                    key: 's_background_tabs_active_2'
                }
            ];
            const promises = imageMap.map(
                (item) =>
                    new Promise((resolve, reject) => {
                        uni.getFileSystemManager().readFile({
                            filePath: item.path,
                            encoding: 'base64',
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
            this.setData({
                startDate: currentDate,
                // 今天作为开始日期
                endDate: tomorrowDate,
                // 明天作为结束日期
                startTime: currentTime,
                endTime: currentTime
            });
        },

        // 发送电子钥匙弹窗
        handleShowSendKeyModal(evt) {
            const info = evt.currentTarget.dataset.item;
            this.setData({
                cellData: info,
                c_send_key_show_momal: true,
                vehId: info.id
            });
        },

        handleHideSengKeyModal() {
            this.setData({
                cellData: {},
                c_send_key_show_momal: false
            });
        },

        handleHideEditKeyModal() {
            this.setData({
                c_edit_key_show_momal: false,
                g_edit_info: {}
            });
        },

        // 切换tabs标签
        handleSwitchTab(e) {
            const flag = e._relatedInfo.anchorTargetText;
            if (flag == '发送钥匙') {
                this.setData({
                    c_activeTab: 1
                });
            } else {
                this.setData({
                    c_activeTab: 2
                });
            }
        },

        // 触底执行
        handleLower() {
            this.setData(
                {
                    g_page: this.g_page + 1
                },
                () => {
                    this.getOrderList();
                }
            );
        },

        // 电子钥匙发送记录到底执行
        handleKeyLower() {
            const page = this.y_page;
            this.setData(
                {
                    y_page: page + 1
                },
                () => {
                    this.getKeySendingList();
                }
            );
        },

        // 下拉操作执行
        handleRefresh() {
            this.setData(
                {
                    g_triggered: false,
                    g_page: 1,
                    g_items: []
                },
                () => {
                    this.getOrderList();
                }
            );
        },

        handleKeyRefresh() {
            this.setData(
                {
                    y_triggered: false,
                    y_page: 1,
                    y_items: []
                },
                () => {
                    this.getKeySendingList();
                }
            );
        },

        // 请求车辆列表
        getOrderList() {
            showLoading('加载中...');
            const param = {
                [u_addOrUpdate.page]: this.g_page
            };
            byGet(getApp().globalData.data.k1swUrl + u_carList.URL, param).then((response) => {
                if (response.statusCode == 200) {
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
                } else {
                    showToast('请求失败，请稍后再试');
                    hideLoading();
                }
            });
        },

        // 搜索记录
        bindblurSea(evt) {
            this.setData(
                {
                    comParam: evt.detail.value,
                    y_triggered: false,
                    y_page: 1,
                    y_items: []
                },
                () => {
                    this.getKeySendingList();
                }
            );
        },

        // 请求发送记录列表
        getKeySendingList: async function (evt) {
            showLoading('加载中...');
            try {
                const app = getApp();
                const url = app.globalData.data.k1swUrl + u_rentRecord.URL;
                const params = {
                    [u_rentRecord.page]: this.y_page
                };
                const response = await byGet(url, params);
                const resp = response.data;
                if (this.y_page > 1 && resp.content.length === 0) {
                    showToast(`已加载全部数据：共${this.y_items.length}条`);
                    return;
                }
                this.setData({
                    y_total: resp.count || 0,
                    y_items: [...this.y_items, ...resp.content]
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                showToast('数据加载失败，请重试');
            } finally {
                hideLoading();
            }
        },

        // 查看照片
        handleViewPhotos(evt) {
            const info = evt?.currentTarget?.dataset?.item;
            if (!info) {
                showToast('无效数据');
                return;
            }
            const g_images = [info.img1, info.img2, info.img3, info.img4, info.img5].filter((img) => img != null && img !== '');
            if (g_images.length < 1) {
                showToast('无可查看照片');
                return;
            }
            const images = g_images.map((ele) => {
                return this.c_fin3_link + ele.replace(/\\/g, '/');
            });
            uni.previewImage({
                urls: images // 需要预览的图片http链接列表
            });
        },

        // 提交发送钥匙
        handleFormSubmit(evt) {
            const { startDate, startTime, endDate, endTime, vehId } = this;
            const formData = evt.detail.value;
            const validations = [
                {
                    field: formData.personName,
                    message: '请输入使用人'
                },
                {
                    field: formData.mobile,
                    message: '请输入手机号'
                }
            ];
            const validationError = validations.find(({ field }) => !field);
            if (validationError) {
                showToast(validationError.message);
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
                baseURL: getApp().globalData.data.k1swUrl,
                sendRentKey: u_sendRentKey.URL
            };
            const submitRequest = async () => {
                try {
                    const response = await byGet(`${API_ENDPOINTS.baseURL}${API_ENDPOINTS.sendRentKey}`, requestParams);
                    if (response.data.code !== 1000) {
                        throw new Error(response.data.msg);
                    }
                    this.setData(
                        {
                            c_send_key_show_momal: false,
                            g_items: [],
                            y_items: [],
                            y_page: 1
                        },
                        () => {
                            showToast('发送成功');
                            setTimeout(() => {
                                this.getKeySendingList();
                                this.getOrderList();
                            }, 1000);
                        }
                    );
                } catch (error) {
                    console.log('CatchClause', error);
                    console.log('CatchClause', error);
                    showToast(error.message || '请求失败，请稍后重试');
                }
            };
            submitRequest();
        },

        bindTimeChange(evt) {
            const category = evt.currentTarget.dataset.index;
            const value = evt.detail.value;
            this.setData({
                [category]: value
            });
        },

        handleCance(evt) {
            const params = {
                [u_cancelRentKey.controlCode]: evt.currentTarget.dataset.item.controlcode
            };
            byGet(getApp().globalData.data.k1swUrl + u_cancelRentKey.URL, params).then((response) => {
                console.log(response.data);
                if (response.data.code == 1000) {
                    this.setData(
                        {
                            c_send_key_show_momal: false,
                            g_items: [],
                            y_items: [],
                            y_page: 1
                        },
                        () => {
                            this.getKeySendingList();
                            this.getOrderList();
                        }
                    );
                } else {
                    showToast(response.data.msg);
                }
            });
        },

        handleCopy(evt) {
            const text = evt.currentTarget.dataset.item.simplecode;
            uni.setClipboardData({
                data: text,
                success: () => {
                    this.setData({
                        copied: true
                    });
                }
            });
        },

        handleForward(evt) {
            console.log(evt);
            const controlcode = evt.currentTarget.dataset.item.controlcode;
            const bak = evt?.currentTarget?.dataset?.item?.bak;
            this.setData({
                controlcode: controlcode,
                bak: bak
            });
        },

        handleEditKey(evt) {
            console.log(evt.currentTarget.dataset.item);
            this.setData({
                c_edit_key_show_momal: true,
                g_edit_info: evt.currentTarget.dataset.item
            });
        },

        handleFormEdit() {
            const { startDate, startTime, endDate, endTime, g_edit_info } = this;
            const buildDateTime = (date, time) => `${date || ''} ${time ? `${time}:00` : '00:00:00'}`.trim();
            const requestParams = {
                controlCode: g_edit_info.controlcode,
                startDate: buildDateTime(startDate, startTime),
                endDate: buildDateTime(endDate, endTime)
            };
            byPost(
                `${getApp().globalData.data.k1swUrl}${u_updateRentKey.URL}`,
                requestParams,
                (response) => {
                    if (response.data.code == 1000) {
                        this.setData(
                            {
                                g_edit_info: {},
                                c_edit_key_show_momal: false,
                                y_triggered: false,
                                y_page: 1,
                                y_items: []
                            },
                            () => {
                                this.getKeySendingList();
                            }
                        );
                    }
                },
                (error) => {}
            );
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

.card-info-item-tabs {
}

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
</style>
