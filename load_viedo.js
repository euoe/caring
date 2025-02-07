import * as Data from './data/video.js';
import * as youtubeData from './data/youtube.js';

print('loading');

const videoGrid = selector('.video-grid');

fetch(youtubeData.url)
.then(res => res.json())
.then(data => {

    data.items.forEach(el => {
        append_video(
            `http://img.youtube.com/vi/${el.snippet.resourceId.videoId}/hqdefault.jpg`,
            `https://www.youtube.com/watch?v=${el.snippet.resourceId.videoId}`,
            el.snippet.title,
            el.contentDetails.videoPublishedAt.substring(0, 10),
        );
    });
});



function append_video(thumbnail, href, videoTitle, videoDate) {
    videoGrid.innerHTML += `
    <div class="video-card">
        <div class="thumbnail-container">
            <a href=${href}>
                <img class="thumbnail" src=${thumbnail}>
            </a>
            <div class="video-time">14:20</div>
        </div>
        <div class="video-info-grid">
            <div class="video-info">
                <p class="video-title">
                    <a class="video-link" href=${href}>
                        ${videoTitle}
                    </a>
                </p>
                <p class="channel-name">
                </p>
                <p class="video-stats">
                    ${videoDate}
                </p>
            </div>
        </div>
    </div>
    `;
}


// for (let i = 0; i < Data.videos.length; i++){
//     append_video(`./images/photo/${i}.jpg`, '', '', `./images/photo/${i}.jpg`, `Title ${i}`);
// }