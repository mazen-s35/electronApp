const { ipcRenderer } = require('electron');

let title = document.querySelector('#title');
let note = document.querySelector("#note");
let btn = document.querySelector(".btn");
let list = document.querySelector("#list");

let notes = [];

function loadNotes() {
    list.innerHTML = "";
    notes.forEach((note, idx) => {
        list.innerHTML += `
            <h1>${idx}  ${note.title}</h1>
            <p>${note.note}</p>
        `
    });
}

window.onload = async() => {
    notes = await ipcRenderer.invoke("get_data");
    loadNotes();
}

btn.onclick = function() {
    if (title !== "" && note !== "") {
        let _note = {
            title: title.value,
            note: note.value,
        }

        notes.push(_note);
        loadNotes()

        ipcRenderer.send("save-note", _note)
    } else {
        window.alert('Please Fill All The Things and Try Agin')
    }
}