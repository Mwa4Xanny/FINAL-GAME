class AudioControl {
    constructor()   {
        this.charge = document.getElementById('charge');
    }

    play(sound)  {
        sound.currentTime = 0;
        sound.play();
    }
}