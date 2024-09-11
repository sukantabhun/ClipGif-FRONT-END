import React, { Component } from "react";
import PropTypes from "prop-types";
import { gapi } from "gapi-script"; // For Google API interaction
import "./index.css";
import { ImageConfig } from "../../config/ImageConfig"; // Image config for different file types
import uploadImg from "../../assets/cloud-upload-regular-240.png";

const CLIENT_ID =
  "162407400699-0gcmt4d8c9mhjlm8f4i2hqbk687uk66u.apps.googleusercontent.com";
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPE = "https://www.googleapis.com/auth/photoslibrary.readonly";

class UploadForm extends Component {
  static propTypes = {
    onFileChange: PropTypes.func.isRequired,
    activeTabId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.state = {
      fileList: [],
      authToken: "",
      photos: [],
      link: '',
      channel: '',
      number: 0,
    };
  }

  componentDidMount() {
    if (this.props.activeTabId === "GooglePhotos") {
      gapi.load("client:auth2", this.initClient);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.activeTabId === "GooglePhotos" &&
      prevProps.activeTabId !== "GooglePhotos"
    ) {
      gapi.load("client:auth2", this.initClient);
    }
  }

  initClient = () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPE,
      })
      .then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance) {
          if (authInstance.isSignedIn.get()) {
            this.setState({
              authToken: authInstance.currentUser.get().getAuthResponse()
                .access_token,
            });
            this.fetchGooglePhotos(this.state.authToken);
          } else {
            authInstance
              .signIn()
              .then((response) => {
                this.setState({
                  authToken: response.getAuthResponse().access_token,
                });
                this.fetchGooglePhotos(response.getAuthResponse().access_token);
              })
              .catch((error) => console.error("Error during sign-in:", error));
          }
        } else {
          console.error("Auth instance is null");
        }
      })
      .catch((error) =>
        console.error("Error initializing Google API client:", error)
      );
  };

  fetchGooglePhotos = (token) => {
    gapi.client
      .request({
        path: "https://photoslibrary.googleapis.com/v1/mediaItems",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        this.setState({ photos: response.result.mediaItems || [] });
      })
      .catch((error) => console.error("Error fetching Google Photos:", error));
  };

  onDragEnter = () => this.wrapperRef.current.classList.add("dragover");

  onDragLeave = () => this.wrapperRef.current.classList.remove("dragover");

  onDrop = () => this.wrapperRef.current.classList.remove("dragover");

  onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [...this.state.fileList, newFile];
      this.setState({ fileList: updatedList });
      this.props.onFileChange(updatedList);
    }
  };

  fileRemove = (file) => {
    const updatedList = [...this.state.fileList];
    updatedList.splice(this.state.fileList.indexOf(file), 1);
    this.setState({ fileList: updatedList });
    this.props.onFileChange(updatedList);
  };

  renderFilePreview = (file) => {
    const fileType = file.type.split("/")[1];
    const imageSrc = ImageConfig[fileType] || ImageConfig["default"];
    return (
      <div className="drop-file-preview__item">
        <img src={imageSrc} alt={file.name} />
        <div className="drop-file-preview__item__info">
          <p className="text-item">File Name: {file.name}</p>
          <p className="text-item">File Size: {file.size}B</p>
        </div>
        <span
          className="drop-file-preview__item__del"
          onClick={() => this.fileRemove(file)}
        >
          x
        </span>
      </div>
    );
  };

  onChangeInputLink = (event) => {
    this.setState({ link: event.target.value });
  }

  onChangeChannelLink = (event) => {
    this.setState({ channel: event.target.value });
  }

  onChangeNumberLink = (event) => {
    this.setState({ number: Number(event.target.value) });
  }

  render() {
    const { activeTabId } = this.props;
    const { fileList, photos, channel, number, link } = this.state;

    switch (activeTabId) {
      case "UploadVedioFile":
        return (
          <>
            <div
              ref={this.wrapperRef}
              className="drop-file-input"
              onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave}
              onDrop={this.onDrop}
            >
              <div className="drop-file-input__label">
                <img src={uploadImg} alt="Upload" />
                <p>Drag & Drop your files here</p>
              </div>
              <input
                type="file"
                accept="video/mp4,video/x-matroska,video/x-msvideo"
                onChange={this.onFileDrop}
              />
            </div>
            {fileList.length>0? <hr className='rule-line-2'/>: null}
            {fileList.length > 0 && (
              <div className="drop-file-preview">
                <h1 className="drop-file-preview__title">Ready to upload</h1>
                {fileList.map((file, index) => (
                  <div key={index}>{this.renderFilePreview(file)}</div>
                ))}
              </div>
            )}
            {fileList.length>0?<button className="btn-submit-vedio" type='button'>Upload</button>: null}
          </>
        );
      case "GooglePhotos":
        return (
          <div className="google-photos-upload">
            <h1>Upload from Google Photos</h1>
            {photos.length > 0 ? (
              <div className="photo-grid">
                {photos.map((photo) => (
                  <div key={photo.id} className="photo-item">
                    <img
                      src={photo.baseUrl}
                      alt={photo.filename}
                      className="photo-img"
                    />
                    <p className="photo-filename">{photo.filename}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No photos loaded yet. Please log in to fetch photos.</p>
            )}
          </div>
        );
      case "YoutubeChannel":
        return (
          <form className='form-container'>
            <div className="div-container">
              <label htmlFor="ytChannel" className="text-left-align">Youtube Channel</label>
              <input
                type="text"
                id="ytChannel"
                onChange={this.onChangeChannelLink}
                value={channel}
                className="input-element"
              />
            </div>
            <div className="div-container">
              <label htmlFor="ytNumber" className="text-left-align">Number of Videos</label>
              <input
                type="number"
                id="ytNumber"
                onChange={this.onChangeNumberLink}
                value={number}
              />
            </div>
            <button type='submit' className='btn-submit-vedio'>Proceed</button>
          </form>
        );
      case "YoutubeLink":
        return (
          <form className="form-container">
            <div className="div-container">   
              <label htmlFor="ytLink" className="text-left-align">Youtube Link</label>
              <input 
                type="text" 
                className='input-element' 
                onChange={this.onChangeInputLink} 
                value={link}
              />
            </div>
            <button type='submit' className='btn-submit-vedio'>Proceed</button>
          </form>
        );
      default:
        return "Invalid Choice";
    }
  }
}

export default UploadForm;
