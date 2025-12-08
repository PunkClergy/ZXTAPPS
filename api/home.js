import {
	http
} from '@/utils/request/http'
// 底部导航目录

export const u_navlist20 = (data) => http.get('/deskapi/navlist20', data)
export const u_carList = (data) => http.get('/carapi/getCarList', data)
export const u_sendInfo = (data) => http.postFormData('/renterApi/uploadControlRecord', data)
export const u_uploadLog = (data) => http.post('/loggerapi/uploadLog', data)
// export const u_logo = (data) => http.get('/appdeskapi/logo', data)
// export const u_bannerlist = (data) => http.get('/appdeskapi/bannerlist', data)
// export const u_midMenulist = (data) => http.get('/appdeskapi/midMenulist', data)
// export const u_rightMenulist = (data) => http.get('/appdeskapi/rightMenulist', data)
// export const u_getCarPoisitonWx = (data) => http.postFormData('/h5Car/getCarPoisitonWx', data)
// export const u_getCarPoisiton = (data) => http.postFormData('/dzBussinessMobileApi/getCarPoisiton', data)
// export const u_operation = (data) => http.postFormData('/dzBussinessMobileApi/operation', data)