// import Cookies from 'js-cookie'
// import {Navigate} from 'react-router-dom'
import { Component } from 'react'
import UploadTypeFilter from '../UploadTypeFilter'
import UploadForm from '../UploadForm'
import Header from '../Header'
import './index.css'

const uploadTypeList = [
  {
    type: 'Upload Vedio File',
    id: 'UploadVedioFile'
  },
  {
    type: 'Youtube Link',
    id: 'YoutubeLink'
  },
  {
    type: 'Youtube Channel',
    id: 'YoutubeChannel'
  },
  {
    type: 'Google Photos',
    id: 'GooglePhotos'
  }
]

class Home extends Component{
  state = {activeTabId: 'UploadVedioFile', file:[]}
  // const jwtToken = Cookies.get('jwt_token')
  // if (jwtToken === undefined) {
  //   return <Navigate to="/" />
  // }

  onChangeActiveTabId = activeTabId => {
    this.setState({activeTabId})
  }

  onFileChange = file => {
    console.log(file)
  }

  render() {
    const {activeTabId} = this.state

    return (
      <>
      <Header />
      <div className="home-container">
        <div className="tab-container">
          {
            uploadTypeList.map(eachItem => <UploadTypeFilter key={eachItem.id} details={eachItem} activeTabId={activeTabId} onChangeActiveTab={this.onChangeActiveTabId}/>)
          }
        </div>

        <hr className='rule-line'/>
        
        <div className="upload-container">
          <UploadForm activeTabId={activeTabId} onFileChange={this.onFileChange}/>
        </div>
      </div>
    </>
    )
  }
}

export default Home