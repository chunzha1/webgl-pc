const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const peerIdInput = document.getElementById('peerId');
const callButton = document.getElementById('callButton');

const peer = new Peer();

peer.on('open', id => {
    console.log('My peer ID is: ' + id);
});

peer.on('call', call => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            call.answer(stream);
            localVideo.srcObject = stream;
            call.on('stream', remoteStream => {
                remoteVideo.srcObject = remoteStream;
            });
        })
        .catch(err => console.error('Failed to get local stream', err));
});

callButton.addEventListener('click', () => {
    const peerId = peerIdInput.value;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            const call = peer.call(peerId, stream);
            localVideo.srcObject = stream;
            call.on('stream', remoteStream => {
                remoteVideo.srcObject = remoteStream;
            });
        })
        .catch(err => console.error('Failed to get local stream', err));
});
