const toggleButtons: HTMLButtonElement[] = Array.from(document.querySelectorAll('.button-combo[data-kind="multi"] button, button[data-toggle="yes"]'));
for (const btn of toggleButtons) {
    btn.addEventListener('click', () => {
        btn.classList.toggle('secondary', !btn.classList.toggle('primary'));
    });
}
