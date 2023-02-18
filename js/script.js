let atualMusica = 0;

const audio = document.querySelector('#musica');

const rolagemMusica = document.querySelector('.rolagem-musica');
const nomeMusica = document.querySelector('.nome-musica');
const nomeArtista = document.querySelector('.nome-artista');
const disco = document.querySelector('.disco');
const tempoAtual = document.querySelector('.tempo-atual');
const duracaoMusica = document.querySelector('.duracao-musica');
const playBtn = document.querySelector('.play-btn');
const anteriorBtn = document.querySelector('.anterior-btn');
const proximoBtn = document.querySelector('.proximo-btn');

//eventos

playBtn.addEventListener('click', () => {
  if(playBtn.className.includes('pause')) {
    musica.play();
  } else{
    musica.pause();
  }

  playBtn.classList.toggle('pause');
  disco.classList.toggle('play');
})

//funções

const listaMusicas = (i) => {
  rolagemMusica.value = 0;
  let som = songs[i];
  atualMusica = i;
  musica.src = som.path;

  nomeMusica.innerHTML = som.name;
  nomeArtista.innerHTML = som.artist;
  disco.style.backgroundImage = `url('${som.cover}')`;
  

  tempoAtual.innerHTML = '00:00';
  setTimeout(() => {
    rolagemMusica.max = musica.duration;
    duracaoMusica.innerHTML = formatoDeTempo(musica.duration); 
  }, 300);
}
listaMusicas(0);

const formatoDeTempo = (time) => {
  let min = Math.floor(time / 60);
  if(min < 10){
    min = `0${min}`;
  }
  let sec = Math.floor(time % 60);
  if(sec < 10){
    sec = `0${sec}`;
  } 
  return `${min} : ${sec}`;
}

setInterval(() => {
  rolagemMusica.value = musica.currentTime;
  tempoAtual.innerHTML = formatoDeTempo(musica.currentTime);
  if(Math.floor(musica.currentTime) == Math.floor(rolagemMusica.max)){
    proximoBtn.click();
  }
}, 500)

rolagemMusica.addEventListener('change', () => {
  musica.currentTime = rolagemMusica.value;
})


const playMusic = () => {
  musica.play();
  playBtn.classList.remove('pause');
  disco.classList.add('play');
}

// funcões dos botões de próximo e anterior
proximoBtn.addEventListener('click', () => {
    if(atualMusica >= songs.length -1){
      atualMusica = 0;
    } else {
      atualMusica++;
    }
    listaMusicas(atualMusica);
    playMusic();  
  })
  anteriorBtn.addEventListener('click', () => {
    if(atualMusica <= 0){
      atualMusica = songs.length - 1;
    } else {
      atualMusica--;
    }
    listaMusicas(atualMusica);
    playMusic();
})