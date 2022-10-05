const sbmtBtn = document.getElementById('submitBtn');

// * uility function
const getTo1stForm = () => {
    document.getElementById('first-form').classList.remove('vanish');
    document.getElementById('second-form').classList.add('vanish');
    sbmtBtn.value = 'Next';
    sbmtBtn.setAttribute('type', 'button');
    sbmtBtn.classList.remove('sbmt-btn');
    sbmtBtn.classList.add('next-btn');

};
const getTo2ndForm = () => {
    document.getElementById('first-form').classList.add('vanish');
    document.getElementById('second-form').classList.remove('vanish');
    sbmtBtn.value = 'Publish';
    sbmtBtn.setAttribute('type', 'submit');
    sbmtBtn.classList.add('sbmt-btn');
    sbmtBtn.classList.remove('next-btn');
};


// * reset button addtional functionality
const reset = document.getElementById('resetBtn');
reset.addEventListener('click', () => {
    getTo1stForm();
});
// * publish button functionality
if (!sbmtBtn) console.error('Cant found submit button');
const publish = async () => {
    console.log('publishing the current blog...');

    //generate object to send it.
    const object = {
        "title": document.getElementById('title').value,
        "author": 'Unknown',
        "content": document.getElementById('content').value,
        "keywords": document.getElementById('keywords').value.split(','),
        "thumbnail_link": document.getElementById('thumbnail').value,
        "brief": document.getElementById('brief').value,
    };

    // send the object to create a blog
    const response = await fetch("/api/v1/blogs", {

        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify(object),

        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
        popUp('Blog published successfully');
        reset.click();
    }
    else
        popUp('some error occured');

};
sbmtBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (sbmtBtn.classList.contains('next-btn')) {
        console.log('next button clicked');

        getTo2ndForm();
    }
    else if (sbmtBtn.classList.contains('sbmt-btn')) {
        console.log('submit button clicked');
        publish();
    }
    else {
        console.error('Something went wrong... reload the page');
        popUp('Something went wrong, Reload the page');
    }
});