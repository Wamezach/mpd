const channels = {
  dreamworks: {
    name: "DreamWorks HD",
    url: "https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/cg_dreamworks_hd1.mpd",
    keys: {
      "4ab9645a2a0a47edbd65e8479c2b9669": "8cb209f1828431ce9b50b593d1f44079"
    }
  },
  cnvg: {
    name: "KAPAMILYA",
    url: "https://d1uf7s78uqso1e.cloudfront.net/out/v1/efa01372657648be830e7c23ff68bea2/index.mpd",
    keys: {
      "bd17afb5dc9648a39be79ee3634dd4b8": "3ecf305d54a7729299b93a3d69c02ea5"
    }
  }
};

const select = document.getElementById('channelSelect');
const video = document.getElementById('video');

// Populate the channel dropdown
for (const key in channels) {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = channels[key].name;
  select.appendChild(option);
}

let player = null;

select.addEventListener('change', async () => {
  const selected = select.value;
  if (!selected) return;

  const channel = channels[selected];
  if (!channel) return;

  // Destroy old instance
  if (player) {
    await player.destroy();
  }

  shaka.polyfill.installAll();
  player = new shaka.Player(video);

  // Error handler
  player.addEventListener('error', e => {
    console.error('Error code', e.detail.code, 'object', e.detail);
  });

  // Configure DRM
  const drmConfig = {};

  // ClearKey
  if (channel.keys) {
    drmConfig.clearKeys = channel.keys;
  }

  // Widevine
  if (channel.license && channel.license.type && channel.license.url) {
    drmConfig.servers = {
      [channel.license.type]: channel.license.url
    };
  }

  player.configure({ drm: drmConfig });

  try {
    await player.load(channel.url);
    console.log("Loaded channel:", channel.name);
    video.play();
  } catch (error) {
    console.error("Failed to load channel:", error);
  }
});
