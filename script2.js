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
    call.answer(null); // 不再传递本地流
    call.on('stream', remoteStream => {
        remoteVideo.srcObject = remoteStream;
        statusDiv.innerText = 'Call connected!';
    });
    call.on('error', err => {
        console.error('Call error:', err);
        statusDiv.innerText = `Call error: ${err}`;
    });
});

callButton.addEventListener('click', () => {
    const peerId = peerIdInput.value;
    if (!peerId) {
        statusDiv.innerText = 'Please enter a valid peer ID.';
        return;
    }

    statusDiv.innerText = `Calling ${peerId}...`;
    try {
        const call = peer.call(peerId, null); // 不再传递本地流

        if (call) {
            call.on('stream', remoteStream => {
                remoteVideo.srcObject = remoteStream;
                statusDiv.innerText = 'Call connected!';
            });
            call.on('error', err => {
                console.error('Call error:', err);
                statusDiv.innerText = `Call error: ${err}`;
            });
        } else {
            statusDiv.innerText = 'Failed to establish call. Call object is undefined.';
        }
    } catch (err) {
        console.error('Call initiation error:', err);
        statusDiv.innerText = `Call initiation error: ${err.message}`;
    }
});

peer.on('error', err => {
    console.error('Peer error:', err);
    statusDiv.innerText = `Error: ${err}`;
});
