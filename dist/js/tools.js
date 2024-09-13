function calculate() {
    const desiredSnap = document.getElementById('desired-snap').value;
    const baseSnap = document.getElementById('base-snap').value;
    const bpm = document.getElementById('bpm').value;

    if (bpm && desiredSnap && baseSnap) {
        const result = (bpm * desiredSnap) / baseSnap;
        document.getElementById('result').textContent = result.toFixed(2) + ' BPM';
    } else {
        alert('Please fill in all fields!');
    }
}

document.getElementById('mp3-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('mp3-upload').files[0];
    const speedInput = parseFloat(document.getElementById('speed').value);
    const originalBPM = parseFloat(document.getElementById('original-bpm').value);
    const targetBPM = parseFloat(document.getElementById('target-bpm').value);

    let speed = 1.0; 

    if (originalBPM && targetBPM) {
        speed = targetBPM / originalBPM;
    } else if (speedInput) {
        speed = speedInput;
    }

    if (fileInput) {
        const audioPlayer = document.getElementById('audio-player');
        const fileURL = URL.createObjectURL(fileInput);

        audioPlayer.src = fileURL;
        audioPlayer.playbackRate = speed;
        audioPlayer.play();
    }
});

