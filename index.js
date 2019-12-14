/*
http://api.giphy.com/v1/gifs/search?q=coding%20train&api_key=dc6zaTOxFJmzC&limit=5
*/
const api = 'https://api.giphy.com/v1/';
const apiKey = '&api_key=59tpzgCcHAbMjPRqDAUklk79IyBTdF75';
let playOrPause = 'Auto play: ON';
let links = [];

function loadJSON (url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true)
  xhr.responseType = 'json'
  xhr.onload = () => {
    const status = xhr.status;
    if (status === 200) {
      callback(xhr.response, null)
    } else {
      callback(xhr.response, status)
    }
  }
  xhr.send()
}

function getRandomColor () {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function addImage (title, gifImage, gifSmall, gifFull, ratio_WidthHeight) {
  const newImage = document.createElement('IMG');
  newImage.src = playOrPause == 'Auto play: ON' ? gifSmall : gifImage
  newImage.title = title
  newImage.textContent = links.length
  newImage.classList.add('img')
  if (searchType() == 'gifs/search?' || searchType() == 'gifs/trending?') { newImage.style.backgroundColor = getRandomColor() } else newImage.style.backgroundColor = 'transparent'

  const addTo = getMinHeightElement(['images']);
  document.getElementById(addTo.id).appendChild(newImage)

  links.push({ image: gifImage, small: gifSmall, full: gifFull })
  console.log(links.length)
}

function getMinHeightElement (arr) {
  let min = document.getElementById(arr[0]).offsetHeight;
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    const h = document.getElementById(arr[i]).offsetHeight;
    if (h < min) {
      min = h
      result = arr[i]
    }
  }
  return { id: result, value: min }
}

function searchType () {
  return document.getElementById('sType').selectedOptions[0].value
}

function searchGiphy (giphyName) {
  const query = `&q=${giphyName}`;
  const limit = `&limit=${25}`;
  const url = api + searchType() + apiKey + limit + query;
  loadJSON(url, ({data}, status) => {
    if (status === null) {
      if (data.length < 1) {
        window.alert('Dont have data for this giphy name')
      } else {
        deleteImages()
        for (let i = 0; i < data.length; i++) {
          addImage(
            data[i].title,
            data[i].images.fixed_height_still.url,
            data[i].images.fixed_height_small.url,
            data[i].images.original.url,
            data[i].images.fixed_height_small.height /
              data[i].images.fixed_height_small.width
          )
        }
      }
    }
  })

  if (searchType() == 'gifs/search?') {
    for (let i = 25; i < window_WidthHeight().height / 20; i++) {
      addRandom(giphyName, 'gifs')
    }
  }
}

function addRandom (giphyName, type) {
  const tag = `&tag=${giphyName}`;
  const url = `${api + type}/random?${apiKey}${tag}`;
  loadJSON(url, ({data}, status) => {
    if (status === null) {
      addImage(
        data.title,
        data.images.fixed_height_still.url,
        data.images.fixed_height_small.url,
        data.images.original.url,
        data.images.fixed_height_small.height /
          data.images.fixed_height_small.width
      )
    }
  })
}

function changeImage () {
  const x = document.getElementById('inputS').value;
  if (
    (x != '' &&
      searchType() != 'gifs/trending?' &&
      searchType() != 'stickers/trending?') ||
    searchType() == 'gifs/trending?' ||
    searchType() == 'stickers/trending?'
  ) { searchGiphy(x) }
}

function deleteImages () {
  console.clear()
  links = []
  const imas = document.getElementsByClassName('img');
  for (let i = imas.length - 1; i >= 0; i--) {
    imas[i].parentNode.removeChild(imas[i])
  }
}

function playPauseImage () {
  playOrPause = playOrPause == 'Auto play: OFF' ? 'Auto play: ON' : 'Auto play: OFF'
  const imgs = document.getElementsByClassName('img');
  for (let i = imgs.length - 1; i >= 0; i--) {
    const linksI = links[imgs[i].textContent];
    imgs[i].src = playOrPause == 'Auto play: ON' ? linksI.small : linksI.image
  }
  const but = document.getElementById('playPauseBut');
  but.textContent = playOrPause
}

function window_WidthHeight () {
  const w =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const h =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  return { width: w, height: h }
}

function copyToClipboard (str) {