// DOM Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const quickTags = document.getElementById('quickTags');
const resultsSection = document.getElementById('resultsSection');
const resultsGrid = document.getElementById('resultsGrid');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');
const features = document.getElementById('features');

// Create result card
function createResultCard(result) {

  return `
  <article class="result-card">
    <div class="result-card-header">

      <h3 class="result-card-title">
        ${result.disasterType}
      </h3>

      

    </div>

    <p class="result-card-content">
      ${result.information}
    </p>

  </article>
  `;
}

// Display results
function displayResults(results) {

  features.classList.add("hidden");
  quickTags.classList.add("hidden");

  if(results.length === 0){

    resultsSection.classList.add("hidden");
    noResults.classList.remove("hidden");

    return;
  }

  noResults.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  resultsCount.textContent = `(${results.length} found)`;

  resultsGrid.innerHTML = results.map(createResultCard).join("");

}

// Loading state
function setLoading(isLoading){

  const buttonText = searchButton.querySelector(".button-text");
  const loaderIcon = searchButton.querySelector(".loader-icon");

  if(isLoading){

    buttonText.classList.add("hidden");
    loaderIcon.classList.remove("hidden");

    searchButton.disabled = true;

  } else {

    buttonText.classList.remove("hidden");
    loaderIcon.classList.add("hidden");

    searchButton.disabled = false;

  }

}

// Perform search
async function performSearch(query){

  if(!query.trim()) return;

  setLoading(true);

  try{

    const response = await fetch("/search", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        query: query
      })

    });

    const data = await response.json();

    displayResults(data);

  } catch(error){

    console.error("Search error:", error);

    alert("Error connecting to backend");

  } finally{

    setLoading(false);

  }

}

// Search submit
searchForm.addEventListener("submit", function(e){

  e.preventDefault();

  performSearch(searchInput.value);

});

// Enable button when typing
searchInput.addEventListener("input", () => {

  searchButton.disabled = !searchInput.value.trim();

});

// Quick search buttons
document.querySelectorAll(".tag-button").forEach(button => {

  button.addEventListener("click", () => {

    const query = button.dataset.query;

    searchInput.value = query;

    performSearch(query);

  });

});

// Initial state
searchButton.disabled = true;