// || HERO SECTION || 
function switchNames (lang) { // switch names when changing languages
    const enName = document.getElementById('hero_en-name');
    const zhName = document.getElementById('hero_zh-name');
    const langName = lang.toLowerCase();

    if (langName == 'en' || langName == 'eng' || langName == 'english') {
        enName.style.zIndex = 1;
        zhName.style.zIndex = 0;

        enName.style.color = 'black';
        zhName.style.color = 'white';
            zhName.style.mixBlendMode = 'overlay';
                zhName.style.backgroundColor = 'black';
            enName.style.mixBlendMode = 'normal';

        zhName.style.opacity = 0.5;
        enName.style.opacity = 1;
    } else if (langName == 'zh' || langName == 'chinese') {
        zhName.style.zIndex = 1;
        enName.style.zIndex = 0;

        zhName.style.color = 'black';
        enName.style.color = 'white';
            enName.style.mixBlendMode = 'overlay';
                enName.style.backgroundColor = 'black';
            zhName.style.mixBlendMode = 'normal';

        enName.style.opacity = 0.5;
        zhName.style.opacity = 1;
    }
}
// ||   || 