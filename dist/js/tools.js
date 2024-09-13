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
    const originalBPM = parseFloat(document.getElementById('original-bpm').value);
    const speedInput = parseFloat(document.getElementById('speed').value);
    const targetBPMInput = parseFloat(document.getElementById('target-bpm').value);
    const preservePitch = document.getElementById('preserve-pitch').checked;

    let speed = 1.0; 
    let targetBPM = targetBPMInput;

    if (document.getElementById('use-multiplier').checked) {
        if (originalBPM && speedInput) {
            targetBPM = originalBPM * speedInput;
            document.getElementById('target-bpm').value = targetBPM.toFixed(2); 
        }
    }

    if (document.getElementById('use-target-bpm').checked) {
        if (originalBPM && targetBPM) {
            speed = targetBPM / originalBPM;
            document.getElementById('speed').value = speed.toFixed(2); 
        }
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

document.getElementById('use-multiplier').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('target-bpm').disabled = true;
        document.getElementById('use-target-bpm').checked = false;
        document.getElementById('speed').disabled = false;
    } else {
        document.getElementById('speed').disabled = true;
    }
});

document.getElementById('use-target-bpm').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('speed').disabled = true;
        document.getElementById('use-multiplier').checked = false;
        document.getElementById('target-bpm').disabled = false;
    } else {
        document.getElementById('target-bpm').disabled = true;
    }
});


