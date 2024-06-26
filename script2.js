const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const peerIdInput = document.getElementById('peerId');
const callButton = document.getElementById('callButton');
const statusDiv = document.getElementById('status');
const peer = new Peer();

peer.on('open', id => {
    console.log('My peer ID is: ' + id);
    statusDiv.innerText = `My peer ID is: ${id}`;
});

peer.on('call', call => {
    statusDiv.innerText = 'Receiving a call...';
    const mediaConstraints = {
        video: false, // 设置为false，不再获取本地视频流
        audio: false, // 设置为false，不再获取本地音频流
    };
    call.answer(null); // 不再传递本地流
    call.on('stream', remoteStream => {
        remoteVideo.srcObject = remoteStream;
        statusDiv.innerText = 'Call connected!';
    });
});

callButton.addEventListener('click', () => {
    const peerId = peerIdInput.value;
    statusDiv.innerText = `Calling ${peerId}...`;
    const call = peer.call(peerId, null); // 不再传递本地流
    call.on('stream', remoteStream => {
        remoteVideo.srcObject = remoteStream;
        statusDiv.innerText = 'Call connected!';
    });
    call.on('error', err => {
        console.error('Call error:', err);
        statusDiv.innerText = `Call error: ${err}`;
    });
});

peer.on('error', err => {
    console.error('Peer error:', err);
    statusDiv.innerText = `Error: ${err}`;
});
