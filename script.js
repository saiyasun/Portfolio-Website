// || HERO SECTION || 
function switchNames (lang) { // switch names when changing languages
    const enName = document.getElementById('hero_en-name');
    const zhName = document.getElementById('hero_zh-name');
    const langName = lang.toLowerCase();

    if (langName == 'en' || langName == 'eng' || langName == 'english') {
        enName.classList.add('name-active');
        enName.classList.remove('name-inactive');
        
        zhName.classList.add('name-inactive');
        zhName.classList.remove('name-active');
    } else if (langName == 'zh' || langName == 'chinese') {
        zhName.classList.add('name-active');
        zhName.classList.remove('name-inactive');

        enName.classList.add('name-inactive');
        enName.classList.remove('name-active');
    }
}
// ||   || 