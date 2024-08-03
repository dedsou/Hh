document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const mediaInput = document.getElementById('mediaInput');
    const gallery = document.getElementById('gallery');

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('media', mediaInput.files[0]);

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('File uploaded successfully');
            loadMedia();
        } else {
            alert('File upload failed');
        }
    });

    async function loadMedia() {
        const response = await fetch('/media');
        const mediaList = await response.json();

        gallery.innerHTML = '';
        mediaList.forEach(media => {
            const mediaItem = document.createElement('div');
            mediaItem.className = 'media-item';

            const fileType = media.name.split('.').pop().toLowerCase();

            if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
                const img = document.createElement('img');
                img.src = `sftp://storage1.danbot.host/media/${media.name}`;
                mediaItem.appendChild(img);
            } else if (['mp4', 'webm', 'ogg'].includes(fileType)) {
                const video = document.createElement('video');
                video.src = `sftp://storage1.danbot.host/media/${media.name}`;
                video.controls = true;
                mediaItem.appendChild(video);
            }

            gallery.appendChild(mediaItem);
        });
    }

    loadMedia();
});
