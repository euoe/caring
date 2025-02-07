export class VideoData {
    constructor(id, title, description, duration, image, webLink, date) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.image = image;
        this.webLink = webLink;
        this.date = date;
    }
}

export let videos = [
    new VideoData(),
];