let atualMusica = 0;

const musica = document.querySelector('#musica');
const rolagemMusica = document.querySelector('.rolagem-musica');
const nomeMusica = document.querySelector('.nome-musica');
const nomeArtista = document.querySelector('.nome-artista');
const disco = document.querySelector('.disco');
const tempoAtual = document.querySelector('.tempo-atual');
const duracaoMusica = document.querySelector('.duracao-musica');
const playBtn = document.querySelector('.play-btn');
const anteriorBtn = document.querySelector('.anterior-btn');
const proximoBtn = document.querySelector('.proximo-btn');

// Função para formatar segundos em MM:SS
const formatoDeTempo = (time) => {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
}

// Configura a música atual
const setMusica = (i) => {
    const som = songs[i];
    atualMusica = i;
    musica.src = som.path;

    nomeMusica.textContent = som.name;
    nomeArtista.textContent = som.artist;
    disco.style.backgroundImage = `url('${som.cover}')`;

    tempoAtual.textContent = '00:00';
    
    // Espera os dados da música carregarem para definir a duração
    musica.addEventListener('loadedmetadata', () => {
        rolagemMusica.max = musica.duration;
        duracaoMusica.textContent = formatoDeTempo(musica.duration);
    });
}

// Alternar Play/Pause
const togglePlay = () => {
    if (musica.paused) {
        musica.play();
        playBtn.classList.remove('pause');
        disco.classList.add('play');
    } else {
        musica.pause();
        playBtn.classList.add('pause');
        disco.classList.remove('play');
    }
}

playBtn.addEventListener('click', togglePlay);

// Atualiza progresso da barra e tempo texto
musica.addEventListener('timeupdate', () => {
    rolagemMusica.value = musica.currentTime;
    tempoAtual.textContent = formatoDeTempo(musica.currentTime);
    
    // Auto-play próxima música
    if (Math.floor(musica.currentTime) >= Math.floor(musica.duration)) {
        proximoBtn.click();
    }
});

// Mudar tempo ao arrastar a barra
rolagemMusica.addEventListener('input', () => {
    musica.currentTime = rolagemMusica.value;
});

// Navegação entre músicas
proximoBtn.addEventListener('click', () => {
    atualMusica = (atualMusica >= songs.length - 1) ? 0 : atualMusica + 1;
    setMusica(atualMusica);
    if (!playBtn.classList.contains('pause')) musica.play();
});

anteriorBtn.addEventListener('click', () => {
    atualMusica = (atualMusica <= 0) ? songs.length - 1 : atualMusica - 1;
    setMusica(atualMusica);
    if (!playBtn.classList.contains('pause')) musica.play();
});

// Inicialização
setMusica(0);
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

function setupVisualizer() {
    // Cria o contexto de áudio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Conecta o elemento de áudio ao analisador
    audioSource = audioContext.createMediaElementSource(musica);
    analyser = audioContext.createAnalyser();
    
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    
    // Configurações do analisador (precisão)
    analyser.fftSize = 128; 
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] / 2; // Ajusta a altura da barra
            
            // Cor das barras (usando o tom de verde do seu player)
            ctx.fillStyle = `rgba(127, 200, 169, ${dataArray[i] / 255})`;
            
            // Desenha as barras de baixo para cima
            ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// Inicia o visualizador apenas na primeira vez que o play for clicado
playBtn.addEventListener('click', () => {
    if (!audioSource) {
        setupVisualizer();
    }
}, { once: true });
const listaContainer = document.querySelector('.lista-container');

const gerarPlaylist = () => {
    listaContainer.innerHTML = ''; // Limpa a lista antes de gerar

    songs.forEach((musicaItem, index) => {
        // Cria a div da música
        const div = document.createElement('div');
        div.classList.add('musica-item');
        
        // Marca a música que está tocando agora
        if(index === atualMusica) div.classList.add('ativa');

        div.innerHTML = `
            <img src="${musicaItem.cover}" alt="Capa">
            <div class="musica-item-info">
                <p>${musicaItem.name}</p>
                <span>${musicaItem.artist}</span>
            </div>
        `;

        // Evento de clique para trocar de música
        div.addEventListener('click', () => {
            setMusica(index);
            togglePlay();
            atualizarDestaquePlaylist(index);
        });

        listaContainer.appendChild(div);
    });
}

// Função para atualizar qual música aparece como "ativa" na lista
const atualizarDestaquePlaylist = (index) => {
    const itens = document.querySelectorAll('.musica-item');
    itens.forEach(item => item.classList.remove('ativa'));
    itens[index].classList.add('ativa');
}

// Chame a função para gerar a lista assim que o script carregar
gerarPlaylist();

// --- AJUSTE IMPORTANTE ---
// No seu código anterior, dentro dos botões PROXIMO e ANTERIOR, 
// adicione a chamada da função atualizarDestaquePlaylist(atualMusica)
// para que a lista mude o destaque sozinha quando você passar a música.