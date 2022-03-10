const ytdl = require('ytdl-core');
const fs = require('fs');
const sanitize = require('sanitize-filename');
const inquirer = require('inquirer');

const getPlaylistVideos = require('./getPlaylistVideos.js');

const dir = './musics';

var questions = [
  {
    type: 'input',
    name: 'playlistId',
    message: "What's the playlist id?"
  },
  {
    type: 'input',
    name: 'maxResults',
    message: "What's the max of videos do you want do download? Max: 50"
  },
  
]

inquirer.prompt(questions).then(answers => {

  if(answers['maxResults'] > 50 || answers['maxResults'] <= 0){
    console.log("\n")
    console.log(" -> Invalid value");
    console.log("\n")
    return;
  };

  getVideo(answers['playlistId'].trim(), answers['maxResults'])
});

let counter = 0;

async function getVideo(playlistId, maxResults) {
  const videoId = await getPlaylistVideos.getVideoUrl(playlistId, maxResults);

  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, err => {
      if (err)
        return console.log(err);
    });
  };

  function downloadVideo(video) {

    let filename = sanitize(video.videoName);

    const verify = verifyFiles(filename)

    if(verify) {
      console.log('You already have this video');
      console.log('\n');
      counter++
      
      if(counter == videoId.length) {
        console.log('\n');
        console.log("You have all these videos!")
        console.log('\n');
        return;
      }

      downloadVideo(videoId[counter]);
      return;
    }

    let download = ytdl(video.videoUrl, {
      filter: 'audioonly',
    })

    ytdl.getInfo(video.videoUrl).then(() => {

      download.pipe(fs.createWriteStream(dir + "/" + filename + ".mp4"))

      console.group();
      console.log(`Downloading the video with name: ${video.videoName}`)

      download.on("progress", function (chunkSize, chunksDownloaded, totalChunks) {
        let percentage = (chunksDownloaded / totalChunks) * 100
        percentage = Math.floor(percentage)
        process.stdout.write('Downloading ' + percentage + '% complete... \r');

        //download completed
        if (percentage >= 100 && counter + 1 <= videoId.length) {
          counter++
          
          console.log(`The video with name: ${video.videoName} has been downloaded`);
          console.log(`Videos remaing: ${videoId.length - counter}`);
          console.log('\n');
          console.groupEnd();

          if(counter == videoId.length) {
            return console.log("All videos has been downloaded successfully!");
          };

          downloadVideo(videoId[counter])

        }
      })
    })
  }

  downloadVideo(videoId[counter])

  function verifyFiles(videoName) {

    const files = fs.readdirSync(dir);

    let filter = files.filter( filename => filename == videoName+ ".mp4");

    if(filter.length == 0) {
      return false;
    };
    
    return true;
  };
}