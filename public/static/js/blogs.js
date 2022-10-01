const container = document.getElementById('blogs');
console.log(container);
const generateRegularCard = (data) => {
    return `<div class="thumbnail-outer">
                <img src="/assets/arrow-up-right-circle-fill.svg" alt="" class="navigator icon-md filter-inv">
                <img src="${data.thumbnail_link}" alt=""
                    class="thumbnail">
            </div>
            <div class="txt flex-col-up gap-sm-2">
                <em class="font-sm-2 text-regular">${data.keywords}</em>

                <h1 class="title text-imp font-md">${data.title.slice(0, 50)}</h1>
                <span class="brief text-regular font-sm-2">${data.brief.slice(0, 100)}</span>
            </div>`;
};


const renderBlogs = (array) => {
    array.forEach(e => {
        e.link = `/blog/${e._id}`;
        const element = document.createElement('a');
        element.href = e.link;
        element.classList.add('card', 'flex-col-up');
        element.innerHTML = generateRegularCard(e);
        container.appendChild(element);
    });
};
const retriveAndRender = async () => {
    const response = await fetch('/api/v1/blogs');
    const data = await response.json();
    console.log(data.data);
    if (data.success === true)
        renderBlogs(data.data);

};

const load_btn = document.getElementById('load-more');
console.log(load_btn);
load_btn.addEventListener('click', () => {
    console.log('button clicked');
    retriveAndRender();
});
retriveAndRender();

const column = document.querySelector('.col-1');
document.getElementById('toggle').addEventListener('click', () => {
    if (column.getAttribute('aria-expanded') === 'true')
        column.setAttribute('aria-expanded', false);
    else if (column.getAttribute('aria-expanded') === 'false')
        column.setAttribute('aria-expanded', true);
    else
        console.error('Check here. it is an error');
});


// search functionality
const search = async (term) => {
    const response = await fetch('/api/v1/blogs/search', {
        method: 'POST',
        body: {
            keywords: term.trim()
        }
    });
    const data = await response.json();
    renderBlogs(data);
};