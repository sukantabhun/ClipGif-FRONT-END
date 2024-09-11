import './index.css'

const UploadTypeFilter = props => {
    const {details,activeTabId, onChangeActiveTab} = props
    const {type, id} = details
    
    const changeType = () => {
        onChangeActiveTab(id)
    }
    
    const activeClass = (id === activeTabId? 'active' : '')

    

    return (
        <button className={`header-text ${activeClass}`} type="button" onClick={changeType}>
            <p>{type}</p>
        </button>
    );
}

export default UploadTypeFilter