//ajax(url, data={}, method='GET')
import ajax from './ajax'
import jsonp from 'jsonp'

//登录
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')
//请求天气
export function reqWeather(city) {
  return new Promise((res,rej) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(
      url,
      {
        param: 'callback'
      },
      (error,data) =>{
        if(!error) {
          const {dayPictureUrl, temperature} = data.results[0].weather_data[0]
          res({dayPictureUrl, temperature})
        } else {
          alert('请求天气接口出错啦!!!')
        }
      }
    )
  })
}


