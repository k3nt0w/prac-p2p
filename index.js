navigator.mediaDevices =
  navigator.mediaDevices ||
  (navigator.mozGetUserMedia || navigator.webkitGetUserMedia
    ? {
        getUserMedia: function(c) {
          return new Promise(function(y, n) {
            ;(navigator.mozGetUserMedia || navigator.webkitGetUserMedia).call(
              navigator,
              c,
              y,
              n
            )
          })
        }
      }
    : null)

if (!navigator.mediaDevices) {
  console.log('getUserMedia() is not supported.')
}

const constraints = { audio: true, video: true }

const gotMedia = stream => {
  console.log('app: get media')
  const SimplePeer = require('simple-peer')
  const peer = new SimplePeer({
    initiator: location.hash === '#init',
    trickle: false,
    stream: stream
  })

  peer.on('error', err => console.log('error', err))

  peer.on('signal', data => {
    console.log('peer: init simple-peer')
    document.getElementById('yourId').value = JSON.stringify(data)
  })

  document.getElementById('connect').addEventListener('click', () => {
    console.log('app: connect')
    const otherId = JSON.parse(document.getElementById('otherId').value)
    peer.signal(otherId)
  })

  document.getElementById('send').addEventListener('click', () => {
    console.log('app: send message')
    const yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)
  })

  peer.on('data', data => {
    console.log('peer: recieve data')
    document.getElementById('messages').textContent += data + '\n'
  })

  peer.on('stream', stream => {
    console.log('peer: stream')
    const video = document.createElement('video')
    video.srcObject = stream
    document.body.appendChild(video)
    console.log(video)
    video.play()
  })
}

navigator.mediaDevices
  .getUserMedia(constraints)
  .then(gotMedia)
  .catch(err => console.error(err))
