<template>
    <view class="timeline-container">
        <block v-for="(item, index) in events" :key="index">
            <view class="timeline-item">
                <view class="timeline-dot" v-if="events.length - 1 != index" />
                <view class="timeline-content" style="border-color: #bdbdbd" />
                <view class="timeline-content-evevt">
                    <text class="timeline-title">{{ item.content }}</text>
                    <text class="timeline-date">{{ item.createdate }}</text>
                </view>
            </view>
        </block>
    </view>
</template>

<script>
export default {
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
    created: function () {}
};
</script>
<style>
.timeline-container {
    padding: 40rpx 0rpx 0px 30rpx;
}

.timeline-item {
    position: relative;
    margin: 0;
    padding-bottom: 12rpx;
    font-size: 16px;
    list-style: none;
}

.timeline-dot {
    position: absolute;
    inset-block-start: 10px;
    inset-inline-start: calc(10rpx);
    height: calc(100% - 10px);
    border-inline-start: 3rpx solid rgba(219, 213, 213, 0.6);
}

.timeline-content {
    margin-left: 2rpx;
    position: absolute;
    width: 3px;
    height: 3px;
    background-color: #bdbdbd;
    border: 3px solid transparent;
    border-radius: 50%;
    color: #52c41a;
}

.timeline-content-evevt {
    position: relative;
    inset-block-end: 6px;
    margin-inline-start: calc(20px);
    margin-inline-end: 14px;
    margin-block-start: 0px;
    margin-block-end: 0;
    word-break: break-word;
    display: flex;
    gap: 10rpx;
    flex-direction: column;
}

.timeline-title {
    font-family: PingFang SC;
    font-weight: bold;
    font-size: 26rpx;
    color: #333333;
    line-height: 30rpx;
}

.timeline-date {
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 22rpx;
    color: #333333;
    line-height: 30rpx;
}
</style>
