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
const publish = () => {
    console.log('publishing the current blog...');
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