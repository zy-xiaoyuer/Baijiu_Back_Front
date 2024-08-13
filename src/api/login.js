import request from './request'

export const login = (data) => {
    return request({
        method: 'post',
        url: 'login',
        data
    })
}