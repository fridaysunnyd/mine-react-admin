import React from 'react'
import {Icon,List} from 'antd'

import {BASE_IMG_PATH} from '../../utils/constant'
import {reqCategoryName} from '../../api'

export default class productDetail extends React.Component {

  state = {
    cName1:'',
    cName2:''
  }

  getCategoryName = async() =>{
    const {pCategoryId, categoryId} = this.props.location.state
    if(pCategoryId === '0'){
      const result = await reqCategoryName(categoryId)
      const cName1 = result.data.name
      this.setState({
        cName1
      })
    }else {
      const results = await Promise.all([reqCategoryName(pCategoryId), reqCategoryName(categoryId)])
      const result1 = results[0]
      const result2 = results[1]
      const cName1 = result1.data.name
      const cName2 = '---->'+result2.data.name
      this.setState({
        cName1,
        cName2
      })
    }
  }
  componentDidMount(){
    this.getCategoryName()

  }

  render() {
    const {name, desc, price, pCategoryId, categoryId, imgs, detail} = this.props.location.state
    const {cName1,cName2} = this.state
    return (
      <div className='product-detail'>
        <h1>
          <Icon type="arrow-left" onClick={() => this.props.history.goBack()}/>&nbsp;&nbsp;
          商品详情
        </h1>

        <List>
          <List.Item>
            <span className='left'>商品名称:</span>
            <span>{name}</span>
          </List.Item>
          <List.Item>
            <span className='left'>商品描述:</span>
            <span>{desc}</span>
          </List.Item>
          <List.Item>
            <span className='left'>商品价格:</span>
            <span>{price + '元'}</span>
          </List.Item>
          <List.Item>
            <span className='left'>所属分类:</span>
            <span>{cName1+cName2}</span>
          </List.Item>
          <List.Item>
            <span className='left'>商品图片:</span>
            <span>
              {
                imgs.map(img => (
                  <img src={BASE_IMG_PATH + img} alt="img" key={img}
                       style={{width: 150, height: 150, marginRight: 10}}/>
                ))
              }
            </span>
          </List.Item>

          <List.Item>
            <span className='left'>商品详情:</span>
            <div dangerouslySetInnerHTML={{__html: detail}}></div>
          </List.Item>
        </List>
      </div>
    )
  }
}
