
const $ = (id) => document.getElementById(id);

let showingMemories = false;
let currentPage = 1;
let entries = JSON.parse(localStorage.getItem("cozyEntries") || "[]");

const profileFields = [
    "myName",
    "myBirthday",
    "myColor",
    "myHobby",
    "myDream"
];

// Display today's date
const today = new Date();

$("today").textContent = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
});

$("entryDate").textContent = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

function openJournal() {
    $("cover").classList.add("hidden");
    $("book").classList.remove("hidden");
    loadProfile();
    showWriting();
}

function backToCover() {
    $("book").classList.add("hidden");
    $("cover").classList.remove("hidden");
}

function saveProfile() {
    const profile = {};

    profileFields.forEach(id => {
        profile[id] = $(id).value;
    });

    localStorage.setItem("cozyProfile", JSON.stringify(profile));

    alert("Your little profile has been saved! ♡");
}

function loadProfile() {
    const profile = JSON.parse(
        localStorage.getItem("cozyProfile") || "{}"
    );

    profileFields.forEach(id => {
        if (profile[id] !== undefined) {
            $(id).value = profile[id];
        }
    });
}

// Add stickers to the journal text
function addSticker(sticker) {
    const textarea = $("entryText");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    textarea.value =
        textarea.value.substring(0, start) +
        " " + sticker + " " +
        textarea.value.substring(end);

    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd =
        start + sticker.length + 2;
}

// Save journal entry
function saveEntry() {
    const title = $("entryTitle").value.trim();
    const content = $("entryText").value.trim();

    if (!title && !content) {
        alert("Write a little something before saving! ♡");
        return;
    }

    const entry = {
        id: Date.now(),
        title: title || "A little memory",
        content: content,
        date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    };

    entries.unshift(entry);

    localStorage.setItem(
        "cozyEntries",
        JSON.stringify(entries)
    );

    $("saveMessage").textContent =
        "Saved to your little memory collection! ♡";

    $("entryTitle").value = "";
    $("entryText").value = "";

    setTimeout(() => {
        $("saveMessage").textContent = "";
    }, 3000);
}

// Display saved memories
function showMemories() {
    showingMemories = true;

    $("profilePage").classList.add("hidden");
    $("memoryPage").classList.remove("hidden");

    $("writingPage").classList.add("hidden");

    $("memoryList").innerHTML = "";

    if (entries.length === 0) {
        $("memoryList").innerHTML =
            "<p>You haven't saved any memories yet. Start writing! ♡</p>";
    }

    entries.forEach(entry => {
        const item = document.createElement("div");
        item.className = "memory-item";

        const heading = document.createElement("h3");
        heading.textContent = entry.title;

        const date = document.createElement("small");
        date.textContent = entry.date;

        const content = document.createElement("p");
        content.textContent = entry.content;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editEntry(entry.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteEntry(entry.id);
        });

        item.append(heading, date, content, editButton, deleteButton);
        $("memoryList").appendChild(item);
    });

    $("pageCounter").textContent = "My Memories";
    flipAnimation("forward");
}

// Return to writing page
function showWriting() {
    showingMemories = false;

    $("profilePage").classList.remove("hidden");
    $("memoryPage").classList.add("hidden");

    $("writingPage").classList.remove("hidden");

    $("pageCounter").textContent = "Page " + currentPage;
}

// Edit a saved memory
function editEntry(id) {
    const entry = entries.find(item => item.id === id);

    if (!entry) return;

    $("entryTitle").value = entry.title;
    $("entryText").value = entry.content;

    entries = entries.filter(item => item.id !== id);

    localStorage.setItem("cozyEntries", JSON.stringify(entries));

    showWriting();
}

// Delete a memory
function deleteEntry(id) {
    if (!confirm("Delete this memory?")) return;

    entries = entries.filter(item => item.id !== id);

    localStorage.setItem(
        "cozyEntries",
        JSON.stringify(entries)
    );

    showMemories();
}

// Page flip animation
function flipAnimation(direction) {
    const book = $("bookPages");

    book.classList.remove("flip-forward", "flip-backward");

    void book.offsetWidth;

    book.classList.add(
        direction === "forward"
            ? "flip-forward"
            : "flip-backward"
    );
}

function nextPage() {
    currentPage++;

    if (showingMemories) {
        showWriting();
    } else {
        showMemories();
    }

    flipAnimation("forward");
    $("pageCounter").textContent = showingMemories
        ? "My Memories"
        : "Page " + currentPage;
}

function previousPage() {
    currentPage = Math.max(1, currentPage - 1);

    if (showingMemories) {
        showWriting();
    } else {
        backToCover();
    }

    flipAnimation("backward");
}
