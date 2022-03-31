
export function SwapActivePage(current, target) {
    const currentPage = document.querySelector(`#${current}`);
    const targetPage = document.querySelector(`#${target}`);

    // TODO: Maybe we should use browser history instead of this?
    // TODO: Maybe we should use a transition instead of this?

    // transition
    currentPage.classList.add('slide-out-left');
    targetPage.classList.add('slide-in-left');

    currentPage.classList.remove('slide-out-left');
    targetPage.classList.remove('slide-in-left');
    currentPage.style.display = 'none';
    targetPage.style.display = 'block';
    // wait for transition to finish
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 500);
    });
}
