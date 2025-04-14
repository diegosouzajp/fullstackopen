const Notification = ({ message, color }) => {
  const style = {
    color: color,
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  if (message === null) {
    return null
  }

  return <div style={style}>{message}</div>
}

export default Notification
