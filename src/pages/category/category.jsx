import React, {Component} from 'react'
import {
  Card,
  Table,
  Button,
  Icon
} from 'antd'

import {reqCategory,addCategory,updateCategory} from '../../api'

/*
管理的分类管理路由组件
 */
export default class Category extends Component {
  state = {
    categorys:[]
  }
  getCategorys = async () =>{
    const result = await reqCategory(0)
    if(result.status === 0 ){
      this.setState({
        categorys:result.data
      })
    }
  }
  componentDidMount(){
    this.getCategorys()
  }
  componentWillMount(){
    this.columns = [{
      title: '分类名称',
      dataIndex: 'name',
      // render: (value) => <a href='javascript:'>{value}</a>
    }, {
      title: '操作',
      width: 300,
      render: (category) => {
        return (
          <span>
            <a href="javascript:">修改分类</a>
            &nbsp;&nbsp;&nbsp;
            <a href="javascript:">查看子分类</a>
          </span>
        )
      }
    }, ]
  }
  render() {
    const {categorys} = this.state
    return (
      <div>
        <Card>
          <span style={{fontSize: 20}}>一级分类列表</span>
          <Button type='primary' style={{float: 'right'}}>
            <Icon type='plus'/>
            添加分类
          </Button>
        </Card>
        <Table
          bordered
          rowKey='_id'
          columns={this.columns}
          dataSource={categorys}
          loading={!categorys || categorys.length===0}
          pagination={{defaultPageSize: 2}}
        />
      </div>
    )
  }
}