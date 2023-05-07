// JavaScript for left section links
var links = document.querySelectorAll('nav a');
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function (e) {
        e.preventDefault();
        var url = this.getAttribute('href');
        loadPage(url);
    });
}

// function to load pages into main section
function loadPage(url) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            main.innerHTML = this.responseText;
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}
