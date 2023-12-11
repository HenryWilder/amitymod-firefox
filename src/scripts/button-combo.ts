const radioCombos: HTMLElement[] = Array.from(document.querySelectorAll('.button-combo[data-kind="single"]'));
for (const combo of radioCombos) {
    const buttons: HTMLButtonElement[] = Array.from(combo.querySelectorAll('button'));
    for (const btn of buttons) {
        btn.addEventListener('click', () => {
            for (const other of buttons) {
                other.classList.replace('primary', 'secondary');
            }
            btn.classList.replace('secondary', 'primary');
        });
    }
}
