const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = wrapper.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreBtn = wrapper.querySelector("#more-music"),
  hideMusicBtn = musicList.querySelector("#close");

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

window.addEventListener("load", () => {
  loadMusic(musicIndex); //calling load music function once window load
  playingNow();
});
//load music function

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].nameSong;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `./images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `./songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
  playingNow();
}

//pause music function
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//next music function
function nextMusic() {
  //here we'll just increment of index by 1
  musicIndex++;
  //If musicIndex is greater than array length then musicIndex will be 1 so the first song will play
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//prev music function
function prevMusic() {
  //here we'll just decrement of index by 1
  musicIndex--;
  //If musicIndex is less than 1 then musicIndex will be array length so the last song will play
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  // if isMusicPause is true then call pauseMusic else call playMusic
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

//next music btn event
nextBtn.addEventListener("click", () => {
  nextMusic(); // calling next music function
});

//prev music btn event
prevBtn.addEventListener("click", () => {
  prevMusic(); // calling next music function
});

// Update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; // getting current time of song
  const duration = e.target.duration; // getting total duration of song
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");
  mainAudio.addEventListener("loadeddata", () => {
    //Update song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });
  //Update song total duration
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//let update playing song current time  according to progress bar width
progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth; //getting width of progress bar
  let clickedOffSetX = e.offsetX; // getting offset x value
  let songDuration = mainAudio.duration; //getting song total duration

  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
  playMusic(); //If music is paused and user click on the progress bar then music will play
});

//let's work on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText; //getting innerText Of icon
  //let's do different changes on different icon lick using switch
  switch (getText) {
    case "repeat": // if this icon is repeat then change it to repeat_one
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song lopped");
      break;
    case "repeat_one": // if this icon is repeat_one then change it to shuffle
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle": // if this icon is repeat_one then change it to shuffle
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist lopped");
      break;
  }
});

//above we just change the icon, now let's work on what to do
//after song ended

mainAudio.addEventListener("ended", () => {
  //we'll do according to the means if user has set icon to loop song then we'll repeat
  //the current song and will do further accordingly

  let getText = repeatBtn.innerText; //getting innerText Of icon
  switch (getText) {
    case "repeat": // if this icon is repeat then simply we call the nextMusic function so the next song will play
      nextMusic(); //
      break;
    case "repeat_one": // if this icon is repeat_one then we will change the current playing song current time to 0 so song will play from beginning
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic(); //calling playMusic function

      break;
    case "shuffle": // if this icon is repeat_one then change it to shuffle
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex); // this loop run until the next random wont't be the same of current music index
      musicIndex = randIndex; //passing randomIndex to musicIndex so the random song will play
      loadMusic(musicIndex); //calling loadMusic function
      playMusic(); //calling playMusic function
      playingNow();
      break;
  }
});

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

const ulTag = wrapper.querySelector("ul");

//let's create li according to the array length
for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i + 1}">
          <div class="row">
            <span>${allMusic[i].nameSong}</span>
            <p>${allMusic[i].artist}</p>
          </div>
          <audio class="${allMusic[i].src}" src="./songs/${
    allMusic[i].src
  }.mp3"></audio>
          <span id="${allMusic[i].src}" class="audio-duration"></span>
        </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioTagDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioTagDuration.innerText = `${totalMin}:${totalSec}`;
    liAudioTagDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

//let's work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    //If there is an li tag which li-index is equal to musicIndex
    //then this music is playing now and we'll style it
    //Let remove playing class from all other li expect the last one which is clicked
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      // let's get that audio duration value and pass to .audio-duration innerText
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
    //adding onclick attribute in all li tags
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

//let's playing song on li click
function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //passing that li-index to musicIndex
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
