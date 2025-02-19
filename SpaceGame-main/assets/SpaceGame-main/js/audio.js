// Carregar o elemento de áudio
const gameAudio = document.getElementById('game-audio');

// Função para reproduzir o áudio
function playAudio() {
    gameAudio.play();
}

// Função para pausar o áudio
function pauseAudio() {
    gameAudio.pause();
}

// Função para parar o áudio e reiniciar
function stopAudio() {
    gameAudio.pause();
    gameAudio.currentTime = 0;
}

// Função para alterar o volume
function setVolume(level) {
    gameAudio.volume = level;
}

// Iniciar a reprodução do áudio automaticamente quando a página carregar
window.addEventListener('load', () => {
    playAudio();
});