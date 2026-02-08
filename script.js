// UNIVERSAL
const htmlTitle = document.title;
const zhName = document.querySelector(".zh-name").textContent;
let enName = document.querySelector("#en-name").textContent;
    const firstLast = enName.split(" ")
    if (enName.includes(zhName)) {
        enName = enName.replace(zhName, "").trim()
    }
console.log(enName)

// !Hero!

// 👨🏾About👨🏾

// 🤹Skills🤹

// 🛠️Projects🛠️

// 🎓👷Experience/Education🎓👷

// ✉️Contact✉️