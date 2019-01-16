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
//请求分类列表
export const reqCategory = (parentId) => ajax('/manage/category/list',{parentId})
//添加分类
export const addCategory = ({parentId,categoryName}) => ajax('/manage/category/add',{parentId,categoryName},'POST')
//更新品类名称
export const updateCategory = ({categoryId,categoryName}) => ajax('/manage/category/update',{categoryId,categoryName},'POST')

// updateCategory({categoryId:'5c3f04260ec9e53678305b10',categoryName:'ccc'}).then(data =>{console.log(data);})

