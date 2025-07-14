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


// **UNIVERSAL**
// Helper function for larger multilingual translation function
function nameSwitch(nameContainer, nameClass) {
    const container = document.getElementsByClassName(nameContainer);
    const names = container.querySelectorAll(`.${nameClass}`);

    for (let i = 0; i < names.length-1; i++) {
        let temp;
        let currentName = names[i];
        let nextName = names[i+1];

        temp = currentName.textContent;
        currentName.textContent = nextName.textContent;
        nextName.textContent = temp;
    }
}