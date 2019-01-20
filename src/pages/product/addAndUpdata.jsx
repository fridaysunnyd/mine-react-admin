import React from 'react'
import {Icon, Form, Input, Select, Button, message} from 'antd'

import {reqCategory,reqAddUpdateProduct} from '../../api'
import PicturesWall from './picturesWall'
import RichTextEditor from './richTextEditor'

const Item = Form.Item
const Option = Select.Option

class productAddAndUpdata extends React.Component {
  state = {
    categorys:[],
    subCategorys:[]
  }

  getCategorys = async(parentId) =>{
    const result = await reqCategory(parentId)
    const categorys = result.data
    if(parentId === '0'){
      this.setState({
        categorys
      })
    }else{
      this.setState({
        subCategorys:categorys
      })
    }
  }
  renderOptions = () => {
    const {categorys, subCategorys} = this.state
    const options = categorys.map(c => (
      <Option key={c._id} value={c._id}>{c.name}</Option>
    ))
    const subOptions = subCategorys.map(c => (
      <Option key={c._id} value={c._id}>{c.name}</Option>
    ))

    return {options, subOptions}
  }
  showSubCategory = (parentId) => {
    const product = this.props.location.state || {}
    product.categoryId = ''
    this.getCategorys(parentId)
  }
  submit = async() =>{
    const {name, desc, price, category1, category2} = this.props.form.getFieldsValue()
    let pCategoryId, categoryId
    if(!category2 || category2==='未选择') { // 当前要添加的商品是一级分类下的
      pCategoryId = '0'
      categoryId = category1
    } else { // 当前要添加的商品是二级分类下的
      pCategoryId = category1
      categoryId = category2
    }

    // 得到所上传图片的文件名的数组
    const imgs = this.refs.imgs.saveImgs()
    // 得到富文本编辑器内容
    const detail = this.refs.detail.getContent()

    const product = {name, desc, price, pCategoryId, categoryId, imgs, detail}

    // 如果是更新, 指定_id属性
    const p = this.props.location.state
    if(p) {
      product._id = p._id
    }

    const result = await reqAddUpdateProduct(product)
    if(result.status===0) {
      message.success('保存商品成功了')
      this.props.history.replace('/product/index')
    } else {
      message.error('保存商品失败了, 请重新处理')
    }
  }

  componentDidMount(){
    this.getCategorys('0')
    const product = this.props.location.state
   // console.log(product.pCategoryId);
    if(product && product.pCategoryId!=='0') {
      this.getCategorys(product.pCategoryId)
    }
  }
  render() {
    const product = this.props.location.state || {}
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 12 },
    }
    const {options, subOptions} = this.renderOptions()

    let initValue1 = '未选择'
    let initValue2 = '未选择'
    if(product.pCategoryId==='0') {
      initValue1 = product.categoryId
    } else if (product.pCategoryId) {
      initValue1 = product.pCategoryId
      initValue2 = product.categoryId || '未选择'
    }

    return (
      <div>
        <h2>
          <a href="javascripe:;" onClick={this.props.history.goBack}>
          <Icon type="arrow-left"/>
          </a>
          &nbsp;&nbsp;
          {product._id ? '编辑商品' : '添加商品'}
        </h2>
        <Form>
          <Item label='商品名称' labelCol={{span: 2}} wrapperCol={{span: 12}}>

            {
              getFieldDecorator('name', {
                initialValue: product.name
              })(
                <Input placeholder='请输入商品名称'/>
              )
            }

          </Item>
          <Item label='商品描述' {...formItemLayout}>

            {
              getFieldDecorator('desc', {
                initialValue: product.desc
              })(
                <Input placeholder='请输入商品描述'/>
              )
            }

          </Item>
          <Item label='商品价格' {...formItemLayout}>

            {
              getFieldDecorator('price', {
                initialValue: product.price
              })(
                <Input placeholder='请输入商品价格' addonAfter='元'/>
              )
            }

          </Item>
          <Item>
            {
              getFieldDecorator('category1', {
                initialValue: initValue1
              })(
                <Select style={{width: 200}} onChange={value => this.showSubCategory(value)}>
                  {options}
                </Select>
              )
            }
            {
              product.pCategoryId !== '0'?
              getFieldDecorator('category2', {
                initialValue: initValue2
              })(
                <Select style={{width: 200}}>
                  {subOptions}
                </Select>
              ):null
            }
          </Item>
          <Item>
            <PicturesWall imgs={product.imgs} ref='imgs'/>
          </Item>
          <Item label='商品详情' labelCol={{span: 2}} wrapperCol={{span: 20}}>
            <RichTextEditor detail={product.detail} ref='detail'/>
          </Item>

          <Button type='primary' onClick={this.submit}>提交</Button>
        </Form>
      </div>

    )
  }
}
export default Form.create()(productAddAndUpdata)