const nav_toggle = document.getElementById('mobile-nav-toggle');
const nav = document.querySelector('.nav__list');
if (nav_toggle) {
    nav_toggle.addEventListener('click', () => {
        const prev = nav.getAttribute('aria-expanded');
        if (prev === 'true')
            nav.setAttribute('aria-expanded', false);
        else
            nav.setAttribute('aria-expanded', true);
    });
}

// * Method to display message on screen
const popUp = (message) => {
    const elem = `<div class="pop-up-msg font-md">
        ${message}
    </div>`;
    const msg_container = document.getElementById('msg-container');
    msg_container.innerHTML = msg_container.innerHTML.trim();
    console.log({ html: msg_container.innerHTML });
    // if container is empty, then show the message immidiately
    if (msg_container.innerHTML === '') {
        msg_container.innerHTML = elem;
        setTimeout(() => {
            msg_container.innerHTML = '';
        }, 5000);
        return;
    }
    else {
        const id =
            setInterval(() => {
                console.log('Interval is running...');
                if (msg_container.innerHTML === '') {
                    msg_container.innerHTML = elem;
                    setTimeout(() => {
                        msg_container.innerHTML = '';
                    }, 5000);
                    clearInterval(id);
                    return;
                }
            }, 1000);
        return;
    }
};