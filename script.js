// || LANDING PAGE ||
function separator(id, childElements, separator) { // "id", "childElements" and "separator" must be strings
    const container = document.getElementById(id);
    const children = container.querySelectorAll(childElements);

    for (let i = 0; i < children.length-1; i++) {
        const separation = document.createElement('p'); // or 'p', 'div', etc.
        separation.textContent = separator;
        separation.classList.add(`${id}-separator`); // add class name to make it easier to style
        children[i].after(separation);
    }
}

separator("tagline", "p", "✦");