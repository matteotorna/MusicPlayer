// Elementi player
const musicPlayer = document.getElementById('music-player');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

// Elementi di ricerca
const searchInput = document.getElementById('search-input');
const searchIcon = document.getElementById('search-icon');

// Elementi playlist
const playlist = document.querySelector('.playlist');
let tracks = []; // Inizializza l'array tracks

// Inizializza l'array tracks con gli elementi della playlist
tracks = playlist.querySelectorAll('li');

// Track corrente
let currentTrack = 0;

// Flag per verificare se l'utente ha interagito con la pagina
let userInteracted = false;

// Carica traccia iniziale nel player
loadTrack(currentTrack);

// Carica una traccia nel player
function loadTrack(trackIndex) {
    clearCurrentTrack();
    if (tracks[trackIndex]) {
        tracks[trackIndex].classList.add('playing');
        musicPlayer.src = tracks[trackIndex].getAttribute('data-src');
        if (userInteracted) {
            musicPlayer.play();
        } else {
            // Se l'utente non ha interagito, mantieni l'audio in modalità mute
            musicPlayer.muted = true;
        }
    }
}

// Pulisci traccia corrente
function clearCurrentTrack() {
    const currentPlaying = playlist.querySelector('.playing');
    if (currentPlaying) {
        currentPlaying.classList.remove('playing');
    }
}

// Prev Track
prevBtn.addEventListener('click', () => {
    currentTrack--;
    if (currentTrack < 0) {
        currentTrack = tracks.length - 1;
    }
    loadTrack(currentTrack);
});

// Next Track 
nextBtn.addEventListener('click', () => {
    currentTrack++;
    if (currentTrack > tracks.length - 1) {
        currentTrack = 0;
    }
    loadTrack(currentTrack);
});

// Gestore di eventi al pulsante di riproduzione
playBtn.addEventListener('click', () => {
    if (!userInteracted) {
        // L'utente ha interagito con la pagina
        userInteracted = true;
        // Rimuovi il flag "muted" dall'elemento audio
        musicPlayer.muted = false;
    }

    if (musicPlayer.paused) {
        playBtn.classList.remove('fa-play');
        playBtn.classList.add('fa-pause');
        musicPlayer.play();
    } else {
        playBtn.classList.add('fa-play');
        playBtn.classList.remove('fa-pause');
        musicPlayer.pause();
    }
});

// Elemento di input per il volume
const volumeControl = document.getElementById('volume');

// Imposta il volume iniziale all'avvio
musicPlayer.volume = volumeControl.value;

// Aggiorna il volume quando l'utente cambia il valore dell'input
volumeControl.addEventListener('input', () => {
    musicPlayer.volume = volumeControl.value;
});

// Riferimenti agli elementi della progress bar
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');

// Aggiorna la barra di progresso durante la riproduzione
musicPlayer.addEventListener('timeupdate', () => {
    const currentTime = musicPlayer.currentTime;
    const duration = musicPlayer.duration;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = progressPercent + '%';
});

// Gestione del clic sulla barra di progresso
progressBar.addEventListener('click', (e) => {
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.offsetWidth;
    const seekTime = (clickX / progressBarWidth) * musicPlayer.duration;
    musicPlayer.currentTime = seekTime;
});

// Gestore di eventi per la ricerca
searchIcon.addEventListener('click', searchSongs);

// Gestore di eventi per il tasto "Enter" sulla tastiera
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchSongs();
    }
});

// Funzione per la ricerca delle canzoni
function searchSongs() {
    const searchTerm = searchInput.value.toLowerCase();

    // Nascondi tutte le canzoni nella playlist
    tracks.forEach((track) => {
        track.style.display = 'none';
    });

    // Mostra solo le canzoni che corrispondono alla ricerca
    tracks.forEach((track, index) => {
        const trackName = track.querySelector('span').textContent.toLowerCase();
        if (trackName.includes(searchTerm)) {
            track.style.display = 'flex';

            // Aggiungi un gestore di eventi al clic su un risultato nella barra di ricerca
            track.addEventListener('click', () => {
                currentTrack = index; // Imposta l'indice corrente sulla base del risultato cliccato
                loadTrack(currentTrack); // Carica e riproduci il brano selezionato
            });
        }
    });
}
