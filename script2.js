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
    console.log('Receiving a call...');
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
                console.log('Stream received from remote peer');
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
    console.log(`Attempting to call peer with ID: ${peerId}`);

    try {
        const emptyStream = getEmptyStream(); // 使用包含无效轨道的空媒体流对象
        const call = peer.call(peerId, emptyStream); // 传递包含无效轨道的空媒体流

        if (call) {
            console.log('Call object created');
            call.on('stream', remoteStream => {
                console.log('Stream received from remote peer');
                remoteVideo.srcObject = remoteStream;
                statusDiv.innerText = 'Call connected!';
            });
            call.on('error', err => {
                console.error('Call error:', err);
                statusDiv.innerText = `Call error: ${err}`;
            });
        } else {
            console.log('Call object is undefined');
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

function getEmptyStream() {
    const emptyStream = new MediaStream();
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const dst = audioContext.createMediaStreamDestination();
    oscillator.connect(dst);
    oscillator.start();
    const track = dst.stream.getAudioTracks()[0];
    emptyStream.addTrack(track);
    return emptyStream;
}
