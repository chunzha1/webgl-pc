const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const peerIdInput = document.getElementById('peerId');
const callButton = document.getElementById('callButton');
const statusDiv = document.getElementById('status');
const enableVideoCheckbox = document.getElementById('enableVideo');
const enableAudioCheckbox = document.getElementById('enableAudio');

const peer = new Peer();

peer.on('open', id => {
    console.log('My peer ID is: ' + id);
    statusDiv.innerText = `My peer ID is: ${id}`;
});

peer.on('call', call => {
    statusDiv.innerText = 'Receiving a call...';
    const mediaConstraints = {
        video: enableVideoCheckbox.checked,
        audio: enableAudioCheckbox.checked
    };
    navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(stream => {
            call.answer(stream);
            localVideo.srcObject = stream;
            call.on('stream', remoteStream => {
                remoteVideo.srcObject = remoteStream;
                statusDiv.innerText = 'Call connected!';
            });
        })
        .catch(err => {
            console.error('Failed to get local stream', err);
            statusDiv.innerText = 'Failed to get local stream';
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
        // 创建一个空的媒体流对象
        const emptyStream = new MediaStream();
        const call = peer.call(peerId, emptyStream); // 传递空的媒体流

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
