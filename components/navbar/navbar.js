// @ts-nocheck
class SiteNavbar extends HTMLElement {
    constructor() {
        super(...arguments);
        this.activeLinkClass = "nav_active";
        this.sectionIds = ["hero", "about", "experience", "skills", "projects", "contact"];
        this.scrollFrame = null;
        this.handleScroll = () => {
            if (this.scrollFrame)
                return;
            this.scrollFrame = requestAnimationFrame(() => {
                this.scrollFrame = null;
                this.updateSectionActive();
            });
        };
    }
    async connectedCallback() {
        const response = await fetch("/components/navbar/navbar.html");
        const html = await response.text();
        this.innerHTML = html;
        this.setupLinks();
        // make sure language param logic runs AFTER links exist
        if (typeof updateLocalizedLinks === "function") {
            updateLocalizedLinks(this);
        }
        this.setupActiveState();
        this.scrollActiveLinkIntoView();
        // if translations exist, re-apply to navbar
        if (window.translateUI) {
            document.dispatchEvent(new CustomEvent("languagechange", {
                detail: { lang: document.documentElement.lang }
            }));
        }
    }
    disconnectedCallback() {
        window.removeEventListener("scroll", this.handleScroll);
        window.removeEventListener("hashchange", this.handleScroll);
    }
    setupLinks() {
        const isHomePage = window.location.pathname === "/" ||
            window.location.pathname === "/index.html";
        const links = this.querySelectorAll("[data-link]");
        links.forEach(link => {
            const section = link.dataset.link;
            if (section === "home") {
                link.href = isHomePage ? "#hero" : "/index.html";
                return;
            }
            link.href = isHomePage
                ? `#${section}`
                : `/index.html#${section}`;
        });
    }
    setupActiveState() {
        this.getNavLinks().forEach(link => {
            link.addEventListener("click", () => {
                this.setActiveLink(link);
            });
        });
        if (this.isHomePage()) {
            this.updateSectionActive();
            window.addEventListener("scroll", this.handleScroll, { passive: true });
            window.addEventListener("hashchange", this.handleScroll);
            return;
        }
        this.updatePageActive();
    }
    isHomePage() {
        return this.isHomePath(window.location.pathname);
    }
    isHomePath(pathname) {
        return pathname === "/" || pathname === "/index.html";
    }
    getNavLinks() {
        return Array.from(this.querySelectorAll("a:not([data-static])"));
    }
    clearActiveLinks() {
        this.getNavLinks().forEach(link => {
            link.classList.remove(this.activeLinkClass);
            link.removeAttribute("aria-current");
        });
    }
    setActiveLink(activeLink) {
        const activeUrl = new URL(activeLink.href, window.location.origin);
        this.clearActiveLinks();
        this.getNavLinks().forEach(link => {
            const linkUrl = new URL(link.href, window.location.origin);
            const samePath = linkUrl.pathname === activeUrl.pathname;
            const sameHash = linkUrl.hash === activeUrl.hash;
            const sameHomePath = this.isHomePath(linkUrl.pathname) && this.isHomePath(activeUrl.pathname);
            if ((samePath && sameHash) || (sameHomePath && sameHash)) {
                link.classList.add(this.activeLinkClass);
                link.setAttribute("aria-current", "page");
            }
        });
        this.scrollActiveLinkIntoView();
    }
    updatePageActive() {
        const path = window.location.pathname;
        if (path === "/blog" || path.startsWith("/blog/")) {
            this.setActiveByPage("/blog/index.html");
            return;
        }
        if (path.startsWith("/projects")) {
            this.setActiveBySection("projects");
            return;
        }
        this.setActiveByPage(path);
    }
    setActiveByPage(pathname) {
        this.clearActiveLinks();
        this.getNavLinks().forEach(link => {
            const linkUrl = new URL(link.href, window.location.origin);
            if (linkUrl.pathname === pathname) {
                link.classList.add(this.activeLinkClass);
                link.setAttribute("aria-current", "page");
            }
        });
        this.scrollActiveLinkIntoView();
    }
    updateSectionActive() {
        let activeSection = "hero";
        const activationLine = window.innerHeight * 0.42;
        this.sectionIds.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (!section)
                return;
            const rect = section.getBoundingClientRect();
            if (rect.top <= activationLine && rect.bottom > activationLine) {
                activeSection = sectionId;
            }
        });
        if (window.scrollY < 20)
            activeSection = "hero";
        this.setActiveBySection(activeSection);
    }
    setActiveBySection(sectionId) {
        this.clearActiveLinks();
        this.getNavLinks().forEach(link => {
            const linkUrl = new URL(link.href, window.location.origin);
            const linkSection = linkUrl.hash.replace("#", "");
            const isHomeLink = this.isHomePath(linkUrl.pathname) && !linkUrl.hash;
            const isActiveHome = sectionId === "hero" && isHomeLink;
            const isActiveSection = linkSection === sectionId;
            if (isActiveHome || isActiveSection) {
                link.classList.add(this.activeLinkClass);
                link.setAttribute("aria-current", "page");
            }
        });
        this.scrollActiveLinkIntoView();
    }
    scrollActiveLinkIntoView() {
        const activeLink = this.querySelector(`#mobile-nav .${this.activeLinkClass}`);
        if (!activeLink)
            return;
        activeLink.scrollIntoView({
            behavior: "auto",
            block: "nearest",
            inline: "center"
        });
    }
}
customElements.define("site-navbar", SiteNavbar);
