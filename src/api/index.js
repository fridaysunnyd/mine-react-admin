//ajax(url, data={}, method='GET')
import ajax from './ajax'
import jsonp from 'jsonp'

// 登录
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')

// 根据分类ID获取分类
export const reqCategoryName = (categoryId) => ajax('/manage/category/info',{categoryId})
// 请求分类列表
export const reqCategory = (parentId) => ajax('/manage/category/list',{parentId})
// 添加分类
export const reqAddCategory = ({parentId,categoryName}) => ajax('/manage/category/add',{parentId,categoryName},'POST')
// 更新品类名称
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax('/manage/category/update',{categoryId,categoryName},'POST')
// updateCategory({categoryId:'5c3f04260ec9e53678305b10',categoryName:'ccc'}).then(data =>{console.log(data);})


// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})
// 搜索获取商品分页列表
export const reqSearchProducts = ({pageNum, pageSize,searchName,searchType}) => ajax('/manage/product/search',{
  [searchType]:searchName,
  pageNum,
  pageSize
})
// 删除上传图片
export const reqRemoveImg = (name) => ajax('/manage/img/delete',{name},'POST')
// 添加或者更新商品
export const reqAddUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
// 上下架商品
export const reqUpdateProductState = (productId,status) => ajax('/manage/product/updateStatus',{productId,status},'POST')

// 获取角色列表
export const reqRoles = () => ajax('/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add',{roleName},'POST')
// 更新角色(给角色设置权限)
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

// 获取用户列表
export const reqUsers = () => ajax('/manage/user/list')
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(user._id?'/manage/user/update':'/manage/user/add',user,'POST')
// 删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete',{userId},'POST')


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

