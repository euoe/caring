import * as youtubeData from '../data/youtube.js';
import * as videoData from '../data/video.js';

print('loading', screen.width, window.innerWidth, doc.body.clientWidth, window.devicePixelRatio || 1);
// if (F > 1.01) {
//     selector(page_container).style.width = `${F * (screen.width - 95)}px`;
// }

// const VideoData = videoData.VideoData
// const videos = videoData.videos
const videoGrid = selector('.video-grid');

const num48 = 48;
var videosAll = videos;
var currentPage = 0;
var maxPage = Math.floor(videos.length / num48);
print(videosAll.length);


let videoAbortController = null;
async function fetchVideo(pageToken='', tx='') {
    if (videoAbortController) {
        videoAbortController.abort();
    }
    videoAbortController = new AbortController();
    const signal = videoAbortController.signal;

    var _pageToken;
    if (pageToken) {
        _pageToken = `&pageToken=${pageToken}`;
    } else {
        _pageToken = '';
    }

    try {
        var fetch_url;
                        // `https://youtube.googleapis.com/youtube/v3/search?part=snippet%2C%20contentDetails&channelId=UC4_4ppuAbPzgPDrYkj-HCvg&channelType=any&order=date&key=[YOUR_API_KEY]`
        if (tx) {fetch_url = `https://www.googleapis.com/youtube/v3/search?key=${youtubeData.apiKey}&channelId=${youtubeData.channelId}&q=${tx}&part=snippet&type=video&maxResults=${num48}`}
        else {fetch_url = youtubeData.url}

        const data = await fetch(fetch_url + _pageToken, {signal}).then(res => res.json());

        if (data.prevPageToken) {
            videoData.pageTokens[0] = data.prevPageToken;
        } else {
            videoData.pageTokens[0] = '';
        }
        if (data.nextPageToken) {
            videoData.pageTokens[1] = data.nextPageToken;
        } else {
            videoData.pageTokens[1] = '';
        }

        if (tx) {
            print(data.items[0]);
            const videoPromises = data.items.map(async function(e) {
                const videoId = e.id.videoId;
                print(videoId);
                var duration = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${youtubeData.apiKey}`, {signal})
                .then(response => response.json())
                .then(data => {
                    if (data.items.length === 0) {
                        console.error('Video not found');
                        return;
                    }
                    return convertISO8601ToReadableFormat(data.items[0].contentDetails.duration);
                });

                const video = new VideoData(
                    videoId,
                    e.snippet.title,
                    '',
                    duration,
                    `http://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    e.snippet.publishedAt.substring(0, 10),
                );

                videos.push(video);
            });

            await Promise.all(videoPromises);
        } else {
            const videoPromises = data.items.map(async function(e) {
                const videoId = e.snippet.resourceId.videoId;
                var duration = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${youtubeData.apiKey}`, {signal})
                .then(response => response.json())
                .then(data => {
                    if (data.items.length === 0) {
                        console.error('Video not found');
                        return;
                    }
                    return convertISO8601ToReadableFormat(data.items[0].contentDetails.duration);
                });

                const video = new VideoData(
                    videoId,
                    e.snippet.title,
                    '',
                    duration,
                    `http://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    e.contentDetails.videoPublishedAt.substring(0, 10),
                );

                videos.push(video);
            });

            await Promise.all(videoPromises);
        }

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            console.error('Error fetching data:', error);
        }
    }
}


function append_video(thumbnail, videoId, videoTitle, videoDate, duration) {
    videoGrid.innerHTML += `
    <div class="video-card">
        <div class="thumbnail-container">
            <img class="thumbnail" src=${thumbnail} onclick="imageClick('${videoId}')">
            <div class="video-time">${duration}</div>
        </div>
        <div class="video-info-grid">
            <div class="video-info">
                <p class="video-title">
                    ${videoTitle}
                </p>

                <div class="video-stats">
                    ${videoDate}
                </div>
            </div>
        </div>
    </div>
    `;
}


function convertISO8601ToReadableFormat(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);

    let readableDuration = "";
    if (hours > 0) readableDuration += hours + ":";
    if (minutes > 0) readableDuration += minutes + ":";
    if (seconds > 0) readableDuration += seconds;

    return readableDuration;
}

function renderVideos(videos48, sort=true) {
    if (sort) videos48.sort((a, b) => new Date(b.date) - new Date(a.date));

    videos48.forEach((e) => {
        append_video(
            `http://img.youtube.com/vi/${e.videoId}/hqdefault.jpg`,
            // `https://www.youtube.com/watch?v=${e.videoId}`,
            e.videoId,
            e.title,
            e.date,
            formatDuration(e.duration)
        );
    });
    // fix_button();

    if (currentPage > 0) {
        selector('.prevpage-button').disabled = false;
    } else {
        selector('.prevpage-button').disabled = true;
    }
    if (currentPage < maxPage) {
        selector('.nextpage-button').disabled = false;
    } else {
        selector('.nextpage-button').disabled = true;
    }
    // const prevPageTokens = videoData.pageTokens[0]
    // const nextPageTokens = videoData.pageTokens[1]
    // if (prevPageTokens) {
    //     selector('.prevpage-button').disabled = false;
    // } else {
    //     selector('.prevpage-button').disabled = true;
    // }
    // if (nextPageTokens) {
    //     selector('.nextpage-button').disabled = false;
    // } else {
    //     selector('.nextpage-button').disabled = true;
    // }
}

function formatDuration(s) {
    let parts = s.split(':');
    // Pad single digit minutes and seconds with a leading zero
    for (let i = 1; i < parts.length; i++) {
        parts[i] = parts[i].padStart(2, '0');
    }
    // If there's only one part, it's seconds, so pad it with 0: at the beginning
    if (parts.length === 1) {
        return `0:${parts[0].padStart(2, '0')}`;
    }
    return parts.join(':');
}


function abortFetch() {
    videoAbortController.abort();
    videos.length = 0;
    videoGrid.innerHTML = '';
}

function fnPrevPage() {
    currentPage = Math.max(currentPage - 1, 0);
    videoGrid.innerHTML = '';
    const index0 = currentPage * num48
    renderVideos(videos.slice(index0, index0 + num48), false);
    window.scrollTo(0, document.body.scrollHeight);
    // abortFetch();
    // fetchVideo(videoData.pageTokens[0]).then(() => {renderVideos();});
}
selector('.prevpage-button').addEventListener('click', fnPrevPage);

function fnNextPage() {
    currentPage = Math.min(currentPage + 1, maxPage);
    videoGrid.innerHTML = '';
    const index0 = currentPage * num48
    renderVideos(videos.slice(index0, index0 + num48), false);
    window.scrollTo(0, document.body.scrollHeight);
    // abortFetch();
    // fetchVideo(videoData.pageTokens[1]).then(() => {renderVideos();});
}
selector('.nextpage-button').addEventListener('click', fnNextPage);

export function searchVideos(tx) {
    if (tx) {
        videos = [];
        videosAll.forEach((e) => {
            var s = `${e.title} ${e.date} ${e.duration}`;
            if (s.includes(tx)) {
                videos.push(e);
            }
        })
    } else {
        videos = videosAll;
    }

    currentPage = 0;
    maxPage = Math.floor(videos.length / num48);
    videoGrid.innerHTML = '';
    renderVideos(videos.slice(0, num48), false);
    // abortFetch();
    // fetchVideo('', tx).then(() => {renderVideos();});
}





// fetchVideo().then(() => {renderVideos();});

renderVideos(videos.slice(0, num48), false);



