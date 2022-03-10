const { google } = require('googleapis');
const youtube = google.youtube('v3');

const config = require('../config/config.json');

exports.getVideoUrl = async (playlistId, result) => { //playlistId = RDhXl3DAD2kU0, maxResults = 50, 
const res = await youtube.playlistItems.list({
 key: config.API_KEY,
 part: 'snippet',
 maxResults: result,
 playlistId: playlistId,
}).catch(err => {
  console.log('[error-info]', err);
  throw {code: -1, msg: 'Something bad happened.'};
});

const items = res.data.items;
const urls = [];

await items.forEach(videos => {
  let videoName = videos.snippet.title;
  let videoUrl = "https://www.youtube.com/watch?v=" + videos.snippet.resourceId.videoId;
  
  urls.push({
    videoName,
    videoUrl,
  });
})

return urls;
};