import React from 'react'
import {Card, Select, Input, Button, Icon, Table,message} from 'antd'

import {reqProducts,reqSearchProducts,reqUpdateProductState} from '../../api'

const Option = Select.Option

export default class productIndex extends React.Component {
  state = {
    total:0,
    products:[],
    searchType:'productName',
    searchName:'',
  }
  updateProductState = async (productId,status) =>{
    const result = await reqUpdateProductState(productId,status)
    if(result.status === 0){
      message.success('更新成功')
      this.getProducts(this.pageNum || 1)
    }else {
      message.error('更新失败')
    }
  }
  getProducts = async (pageNum) => {
    this.pageNum = pageNum
    const {searchType,searchName} = this.state
    let result
    if(searchName){
      result = await reqSearchProducts({pageNum, pageSize: 3, searchType, searchName})

    }else {
      result = await reqProducts(pageNum, 3)

    }
    if(result.status===0) {
      const {total,list} = result.data
      this.setState({
        total,
        products: list
      })
    }
  }
  initColumns = () =>{
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => <span>¥{price}</span>
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (status,product) => {// 1: 在售, 2: 已下架
          let btnText
          let statusText
          if(status === 1){
            btnText = '下架'
            statusText = '在售'
            status = 2
          } else if(status === 2){
            btnText = '上架'
            statusText = '已下架'
            status = 1
          }
          return (
            <span>
              <Button type='primary' onClick={() =>{this.updateProductState(product._id,status)}}>{btnText}</Button>
              &nbsp;&nbsp;
              <span>{statusText}</span>
            </span>
          )

        }
      },
      {
        title: '操作',
        render: (product) => (
          <span>
            <a href="javascript:" onClick={() => {this.props.history.push('/product/detail',product)}}>详情</a>
            &nbsp;&nbsp;&nbsp;
            <a href="javascript:" onClick={()=>this.props.history.push('/product/saveupdate',product)}>修改</a>
          </span>
        )
      }
    ]
  }
  componentWillMount = () =>{
    this.initColumns()
  }
  componentDidMount () {
    this.getProducts(1)
  }
  render() {
    const {products,total,searchType} = this.state
    return (
      <div>
        <Card>
          <Select value={searchType} onChange={value => this.setState({searchType: value})}>
            <Option key='productName' value='productName'>按名称搜索</Option>
            <Option key='productDesc' value='productDesc'>按描述搜索</Option>
          </Select>

          <Input style={{width: 150, marginLeft: 10, marginRight: 10}} placeholder='关键字' onChange={(e) => this.setState({searchName: e.target.value})}/>

          <Button type='primary' onClick={()=>{this.getProducts(1)}}>搜索</Button>

          <Button type='primary' style={{float: 'right'}} onClick={()=>this.props.history.push('/product/saveupdate')}>
            <Icon type='plus'/>
            添加商品
          </Button>
        </Card>
        <Table
          bordered
          rowKey='_id'

          columns={this.columns}
          dataSource={products}
          pagination={{
            total,
            defaultPageSize: 3,
            showQuickJumper: true,
            onChange: this.getProducts
          }}
        />
      </div>
    )
  }
}
