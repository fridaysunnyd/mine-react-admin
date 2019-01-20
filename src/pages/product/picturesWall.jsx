import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal } from 'antd';

export default class PicturesWall extends React.Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })
  getImgs = () =>{
    // 如果传入了imgs, 生成一个对应的fileList, 并更新fileList状态
    const imgs = this.props.imgs
    if (imgs && imgs.length > 0) {
      const fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done', // loading: 上传中, done: 上传完成, remove: 删除
        url: 'http://localhost:5000/upload/' + img,
      }))
      this.state.fileList = fileList
    }
  }

  componentWillMount() {
    this.getImgs()

  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

