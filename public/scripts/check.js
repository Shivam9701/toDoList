let checks = document.querySelectorAll("input[type=checkbox");
for (let i = 0; i < checks.length; i++) {
  console.log("poop");
  checks[i].addEventListener("change", function (e) {

    if (this.checked) {
      console.log("checked");
      const query = "label[for=check" + i + "]";
      document.querySelector(query).classList.add("checked");
    }

    else {
      const query = "label[for=check" + i + "]";
      document.querySelector(query).classList.remove("checked");
    }


  });
}

window.onSpotifyWebPlaybackSDKReady = () => {
  const token = "BQBx_JVcy1Xo7eysLhBTNsz-M475sBoZkbKtUkHzRQm_xfotYsnBapo-13EwbuasYsSWQ6qARHC55TbmW7iiEBb-faGkC_pJg1F0KPW7Dpd8JN3dnk8SeYVuM8H4eAjq7deweUKA8ObdcxlqZttDtg-8t1w1OvkrdqybSO_nQfrSub0HxEUg_2hZT5w8rENVCmPEvB25bswHsLuiX2iNPYhGa3dC";
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token); },
    volume: 0.5
  })
  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  player.addListener('initialization_error', ({ message }) => {
    console.error(message);
  });

  player.addListener('authentication_error', ({ message }) => {
    console.error(message);
  });

  player.addListener('account_error', ({ message }) => {
    console.error(message);
  });
 
  player.connect().then(success => {
    if (success) {
      console.log('The Web Playback SDK successfully connected to Spotify!');
    }
  })


  document.getElementById('btn').onclick = function () {
  player.togglePlay();
  };



};

