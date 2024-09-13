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
    const targetBPMInput = parseFloat(document.getElementById('target-bpm').value);
    const preservePitch = document.getElementById('preserve-pitch').checked;

    let speed = 1.0;
    let targetBPM = targetBPMInput;

    if (originalBPM && !targetBPM) {
        if (speedInput) {
            targetBPM = originalBPM * speedInput;
            document.getElementById('target-bpm').value = targetBPM.toFixed(2)
        }
    }

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

        audioPlayer.preservesPitch = !preservePitch;

        audioPlayer.play();
    }
});


