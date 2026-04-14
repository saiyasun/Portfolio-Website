class SiteNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav id="main-nav" class="glass-nav" aria-label="Primary navigation">
        <ul>
            <li><a class="nav_active" href="/index.html" data-i18n="nav.home">HOME</a></li>
            <li><a href="/index.html#about" data-i18n="nav.about">ABOUT</a></li>
            <li><a href="/index.html#experience" data-i18n="nav.exp">EXPERIENCE</a></li>
            <li><a href="/index.html#skills" data-i18n="nav.skills">SKILLS</a></li>
            <li><a href="/index.html#projects" data-i18n="nav.projects">PROJECTS</a></li>
            <li><a href="/blog/index.html" data-i18n="nav.blog">BLOG</a></li>
            <li><a href="/index.html#contact" data-i18n="nav.contact">CONTACT</a></li>
            <hr id="main-nav_hr">
            <li><a href="/docs/Asiah Crutchfield - Resume.pdf" data-static><img class="icon" src="/images/icons/resume-blk.svg" alt="resume"></a></li>
        </ul>
    </nav>
        <!--~mobile nav bar~-->
        <nav id="mobile-nav" class="glass-nav" aria-label="Mobile navigation">
            <ul class="nav-rail">
                <li><a class="nav_active" href="/index.html" data-i18n="nav.home">HOME</a></li>
                <li><a href="/index.html#about" data-i18n="nav.about">About</a></li>
                <li><a href="/index.html#experience" data-i18n="nav.exp">Experience</a></li>
                <li><a href="/index.html#skills" data-i18n="nav.skills">Skills</a></li>
                <li><a href="/index.html#projects" data-i18n="nav.projects">Projects</a></li>
                <li><a href="/blog/index.html" data-i18n="nav.blog">BLOG</a></li>
                <li><a href="/index.html#contact" data-i18n="nav.contact">Contact</a></li>
            </ul>
            <!--TRANSLATION-->
            <div id="mobile-translator">
                <button class="lang-btn is_hidden glass-nav" id="lang_btn-en" data-lang="en">EN</button>
                <button class="lang-btn glass-nav" id="lang_btn-zh" data-lang="zh">中</button>
            </div>
        </nav>
        `
    }
}

customElements.define("site-navbar", SiteNavbar)