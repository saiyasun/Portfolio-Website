const hiddenClass = "is_hidden";

function setActiveLink(links: NodeListOf<HTMLAnchorElement>, activeClass: string) {
    links.forEach((link) => {
        link.addEventListener("click", () => {
            links.forEach((item) => item.classList.remove(activeClass));
            link.classList.add(activeClass);
        });
    });
}

function toggleSections(links: NodeListOf<HTMLAnchorElement>, sections: NodeListOf<HTMLElement>) {
    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href")?.slice(1);

            sections.forEach((section) => {
                section.classList.toggle(hiddenClass, section.id !== targetId);
            });
        });
    });
}

/** Enables the About and Skills tab controls on the homepage. */
export function initializeHomeTabs() {
    const aboutLinks = document.querySelectorAll<HTMLAnchorElement>("#bio-navigation a");
    const aboutSections = document.querySelectorAll<HTMLElement>(".about-subsection");
    setActiveLink(aboutLinks, "nav_active");
    toggleSections(aboutLinks, aboutSections);

    const techLinks = document.querySelectorAll<HTMLAnchorElement>("#tech-nav a");
    const techSections = document.querySelectorAll<HTMLElement>(".tech-container");
    setActiveLink(techLinks, "tech-nav_active");
    toggleSections(techLinks, techSections);
}
