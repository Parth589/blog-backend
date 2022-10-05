const renderContent = (html) => {
    const container = document.getElementById('blog-container');
    container.innerHTML = html;
};

const start = async () => {
    const response = await fetch('/api/v1/blogs/' + location.href.substring(location.href.lastIndexOf('/') + 1));
    const data = await response.json();
    if (data.success) {
        console.log(data);
        // rendering keywords in html page
        const topics_wrapper = document.getElementById('topics-wrapper');
        data.data.keywords.forEach((e) => {
            topics_wrapper.innerHTML += `<li>${e}</li>`;
        });
        renderContent(data.data.content);
        document.getElementById('blog-title').innerText = data.data.title;
        if (data.data.thumbnail_link)
            document.getElementById('main-image').src = data.data.thumbnail_link;
        else {
            document.getElementById('main-image').src = `https://source.unsplash.com/random/?${String(data.data.keywords).replace(',', '&')}`;
            console.log('setup src');
        }
    }
};
start();