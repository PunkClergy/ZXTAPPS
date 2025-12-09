import {
	http
} from '@/utils/request/http'

export const u_navlist20 = (data) => http.get('/deskapi/navlist20', data)
export const u_carList = (data) => http.get('/carapi/getCarList', data)
export const u_sendInfo = (data) => http.postFormData('/renterApi/uploadControlRecord', data)
export const u_uploadLog = (data) => http.post('/loggerapi/uploadLog', data)
export const u_bannerlist20 = (data) => http.get('/deskapi/bannerlist20', data)
export const u_getQrcodeImg = (data) => http.get('/deskapi/getQrcodeImg', data)
export const u_getHomeArea = (data) => http.get('/deskapi/homeArea', data)
export const u_booklist = (data) => http.get('/deskapi/booklist', data)
export const u_mylist = (data) => http.get('/deskapi/mylist', data)
  
