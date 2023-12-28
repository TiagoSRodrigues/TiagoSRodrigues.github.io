document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.getElementById('searchbox');
    const suggestionsContainer = document.getElementById('suggestions');

    // Function to update suggestions
    function updateSuggestions(suggestions) {
        searchBox.oninput = function () {
            const inputVal = this.value;
            suggestionsContainer.innerHTML = ''; // Clear previous suggestions
            suggestionsContainer.style.display = 'block'; // Show suggestions container

            // Filter suggestions based on input and append to the container
            suggestions.forEach(function (suggestion) {
                if (suggestion.toLowerCase().includes(inputVal.toLowerCase())) {
                    const div = document.createElement('div');
                    div.textContent = suggestion;
                    div.className = 'suggestion-item';
                    div.onclick = function () {
                        searchBox.value = suggestion; // Set search box value to suggestion clicked
                        suggestionsContainer.style.display = 'none'; // Hide suggestions container
                    };
                    suggestionsContainer.appendChild(div);
                }
            });

            // If input is empty or no suggestions match, hide the suggestions container
            if (inputVal === '' || suggestionsContainer.childElementCount === 0) {
                suggestionsContainer.style.display = 'none';
            }
        };
    }

    // Fetch the suggestions from the JSON file
    fetch('tags_data.json')
        .then(response => response.json())
        .then(data => updateSuggestions(data.suggestions))
        .catch(error => console.error('Error fetching the suggestions:', error));

    // Hide suggestions when clicking outside
    document.onclick = function (e) {
        if (e.target.id !== 'searchbox') {
            suggestionsContainer.style.display = 'none';
        }
    };
});
