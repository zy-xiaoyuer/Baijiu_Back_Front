import request from './request.js'

export const login = (data) => {
    return request({
        method: 'post',
        url: 'login',
        data
    })
}