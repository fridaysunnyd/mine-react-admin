//ajax(url, data={}, method='GET')
import ajax from './ajax'

export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')



