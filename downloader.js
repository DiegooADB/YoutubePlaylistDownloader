require('dotenv').config()
const { google } = require('googleapis');
const youtube = google.youtube('v3');
const KEY = process.env.API_KEY;

exports.urls = [];

exports.getVideoUrl = (playlistId, results) => { //playlistId = RDhXl3DAD2kU0, maxResults = 50, 
youtube.playlistItems.list({
 key: KEY,
 part: 'snippet',
 maxResults: results,
 playlistId: playlistId,
}, async (err, results) => {
 await results.data.items.forEach(element => {
  let videoUrlString = "https://www.youtube.com/watch?v=" + element.snippet.resourceId.videoId;

  let urls = this.urls;

  urls.push(videoUrlString);

  if(urls.length == 50) {
    require("./index").getUrl()
  }
 });
 if (err) console.log(err);
});
}