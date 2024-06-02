const bookmarksContainer = document.querySelector(".bookmarks");
const categorySuggestionsContainer = document.querySelector(".category-suggest div");
const categoryButtonsContainer = document.querySelector(".category-buttons div");
const showAll = document.querySelector(".all");

localStorage.removeItem("active-category");

showAll.addEventListener("click", function () {
    displayBookmarks();

    const categoryButtons = document.querySelectorAll(".category-buttons div span");
    categoryButtons.forEach((button) => button.classList.remove("active"));
    localStorage.removeItem("active-category");
});

function saveBookmarks() {
    const title = document.querySelector(".title").value.trim();
    const url = document.querySelector(".url").value.trim();
    const category = document.querySelector(".category").value.trim();

    if (!title || !url || !category) {
        alert("Please Fill All Feildes");
        return;
    }

    const allbookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    
    if (!allbookmarks[category]) allbookmarks[category] = [];

    allbookmarks[category].push({title, url});

    localStorage.setItem("bookmarks", JSON.stringify(allbookmarks));

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => input.value = "");
}

function displayBookmarks() {
    const allbookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    bookmarksContainer.innerHTML = "";

    for (const category in allbookmarks) {
        const categoryBookmarks = allbookmarks[category];
        categoryBookmarks.forEach((bookmarks, index) => {
            const bookmarkElement = document.createElement("div");
            bookmarkElement.innerHTML = `
            <div class="cat">${category}</div>
            <div class="link"><a href="${bookmarks.url}" target="_blank">${bookmarks.title}</a></div>
            <button onclick="deleteBookmark('${category}', ${index})">Delete</button>
            `;
            bookmarksContainer.appendChild(bookmarkElement);
        })
    }
}

displayBookmarks();

function filterBookmarksByCategory(category) {
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    const categoryBookmarks = allBookmarks[category];
    bookmarksContainer.innerHTML = "";

    categoryBookmarks.forEach((bookmarks, index) => {
        const bookmarkElement = document.createElement("div");
        bookmarkElement.innerHTML = `
        <span class="number">${index + 1}</span>
        <div class="link"><a href="${bookmarks.url}" target="_blank">${bookmarks.title}</a></div>
        <button onclick="deleteBookmark('${category}', ${index})">Delete</button>
        `;
        bookmarksContainer.appendChild(bookmarkElement);
    })
}

function displayCategorySuggestions() {
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};

    const categories = Object.keys(allBookmarks);
    categorySuggestionsContainer.innerHTML = "";
    categories.forEach((category) => {
        const categoryElement = document.createElement("span");
        categoryElement.textContent = category;

        categoryElement.addEventListener("click", () => (document.querySelector(".category").value = category));

        categorySuggestionsContainer.appendChild(categoryElement);
    })
}
displayCategorySuggestions();

function displayCategoryButtons() {
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    const categories = Object.keys(allBookmarks);
    categoryButtonsContainer.innerHTML = "";

    categories.forEach((category) => {
        const categoryElement = document.createElement("span");
        categoryElement.textContent = category;

        categoryElement.addEventListener("click", function() {
            filterBookmarksByCategory(category);
            // هاد السطر عشان اخر فيديو
            localStorage.setItem("active-category", category);
             // Remove Active Class From All Buttons
            const categoryButtons = document.querySelectorAll(".category-buttons div span");
            categoryButtons.forEach((button) => button.classList.remove("active"));
            // Add Active Class To The Chicked Buttons
            this.classList.add("active");
        });

        const activeCategory = localStorage.getItem("active-category");
        if (activeCategory === category) categoryElement.classList.add("active");


        categoryButtonsContainer.appendChild(categoryElement);
    })

}
displayCategoryButtons();

function deleteBookmark(category, index) {
const allBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
allBookmarks[category].splice(index, 1);

// if the category is empty, remove the category
if(allBookmarks[category].length === 0) delete allBookmarks[category];
localStorage.setItem("bookmarks", JSON.stringify(allBookmarks));

if (allBookmarks[category] && localStorage.getItem("active-category")) {
    filterBookmarksByCategory(category);
} else {
displayBookmarks();
}

displayBookmarks();
displayCategoryButtons();
displayCategorySuggestions();
}
