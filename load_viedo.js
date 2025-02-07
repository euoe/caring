print('loading');

const videoGrid = selector('.video-grid');

function append_video(thumbnail, href, hrefProfile, imgProfile, videoTitle) {
    videoGrid.innerHTML += `
    <div class="video-card">
        <div class="thumbnail-container">
            <a href=${href}>
                <img class="thumbnail" src=${thumbnail}>
            </a>
            <div class="video-time">14:20</div>
        </div>
        <div class="video-info-grid">
            <div class="channel-profile-pic">
                <a href=${hrefProfile}>
                    <img src=${imgProfile}>
                </a>
            </div>
            <div class="video-info">
                <p class="video-title">
                    <a class="video-link" href=${href}>
                        ${videoTitle}
                    </a>
                </p>
                <p class="channel-name">
                    <a class="channel-link" href=${hrefProfile}>
                        Marques Brownlee
                    </a>
                </p>
                <p class="video-stats">
                    ? views · ? months ago
                </p>
            </div>
        </div>
    </div>
    `;
}

for (let i = 0; i < 20; i++){
    append_video(`./images/photo/${i}.jpg`, '', '', `./images/photo/${i}.jpg`, `Title ${i}`);
}