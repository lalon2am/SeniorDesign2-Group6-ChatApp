import './Message.css';
function Message({ text,user,timestamp }) {
    return (
        <div>
            <div>
                <strong>{user}:</strong> {text} <small className='timestamp'>({timestamp})</small>
            </div>
        </div>
    );
}

export default Message;
