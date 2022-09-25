// creating text animation on the home page
const elem = document.querySelector('.main-animation');
const arr = [
    'Developer',
    'Data scientist',
    'Designer',
    'System admin',
    'non-IT person',
];
let i = 0;
{
    elem.textContent = arr[i];
    elem.classList.add('expand-width-animation');
    i = (i + 1) % arr.length;
}
setInterval(() => {
    elem.classList.remove('expand-width-animation');
    setTimeout(() => {
        elem.textContent = arr[i];
        elem.classList.add('expand-width-animation');
    }, 1000);
    // setTimeout(() => {
    // }, 2000);
    i = (i + 1) % arr.length;
}, 5000);