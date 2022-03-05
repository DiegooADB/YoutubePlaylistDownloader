const downloader = require('./downloader.js');

downloader.getVideoUrl("RDhXl3DAD2kU0", 50);

exports.getUrl = () => {

 let urls = downloader.urls

 console.log(urls);

 return urls;
};
