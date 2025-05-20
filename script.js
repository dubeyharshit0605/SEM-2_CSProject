let currentPage = 1;
let create = 0;

document.getElementById("query").addEventListener("keydown", (event) => {
    if (event.code === "Enter")
        fetchResults(1);
});

async function fetchResults(page = 1) {
    let query = String(document.getElementById("query").value);
    let language = document.getElementById("language").value;
    let sort = document.getElementById("sort").value;

    document.getElementById("body").style.justifyContent = "flex-start";
    document.getElementById("results").style.display = "none";
    Loading();

    if (!query) {
        console.log("no query");
        document.getElementById("errors").innerHTML = "<h4>Please enter a topic!</h4>";
        return;
    }

    try {
        let response = await fetch(`http://localhost:5000/api/data?query=${query}`);
        let data = await response.json();

        if (!data || !data.url) {
            throw new Error("Invalid response from backend.");
        }

        url = data.url;
    } 
    catch (error) 
    {
        document.getElementById("errors").innerHTML = (`<h4>Error fetching data : ${error}</h4>`);
        console.log("Error fetching data : ", error);
        document.getElementById("errors").style.display = "none";
        return; 
    }

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (!data.items || data.items.length === 0) {
            throw new Error("No projects found.");
        }

        displayResults(data.items);
        currentPage = page;

        document.getElementById("prevPage").style.visibility = currentPage > 1 ? "visible" : "hidden";
        document.getElementById("nextPage").style.visibility = data.items.length >= currentPage ? "visible" : "hidden";

    } 
    catch (error) 
    {
        document.getElementById("errors").innerHTML = (`<h4>Error fetching data : ${error}</h4>`);
        document.getElementById("errors").style.display = "none";
        return;
    }

    document.getElementById("result").style.visibility = "visible";
}

function displayResults(repositories) {
    document.getElementById("errors").style.display = "none";
    document.getElementById("loading").style.display = "none";

    let resultsDiv = document.getElementById("results");
    resultsDiv.style.display = "grid";
    resultsDiv.innerHTML = "";

    repositories.forEach(repo => {
        let card = document.createElement("div");
        card.className = "project-card";

        let a1 = document.createElement("a");
        a1.href = `repo.html?owner=${repo.owner.login}&repo=${repo.name}`;
        a1.innerHTML = `
            <div class="project-content">
                <h5 class="title">${repo.name}</a></h5>
                <p class="limit">${repo.description || "No description available."}</p>
                <p class="stars-forks">⭐ Stars: ${repo.stargazers_count} | 🍴 Forks: ${repo.forks_count}</p>
            </div>
        `;

        let download = document.createElement("a");
        download.textContent = "Download";
        download.className = "btn btn-success mt-2";
        download.href = `${repo.html_url}/archive/refs/heads/${repo.default_branch}.zip`;

        card.appendChild(a1);
        card.appendChild(download);
        resultsDiv.appendChild(card);
    });
}

function changePage(direction) {
    fetchResults(currentPage + direction);
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function Loading() {
    let loading = document.getElementById("loading");
    loading.style.display = "grid";

    if (!create)
    {
        for (let i=0; i<10; i++)
        {
            let card = document.createElement("div");
            card.className = "project-card";
            card.className = "gradient-background";
            
            loading.appendChild(card);
        }
        create = 1;
    }
}