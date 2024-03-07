document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('filter-btn').addEventListener('click', function() {
        var filterOptions = document.querySelector('.filter-options');
        if (filterOptions.style.display === 'none' || filterOptions.style.display === '') {
            filterOptions.style.display = 'block';
        } else {
            filterOptions.style.display = 'none';
        }
    });
});

function filterProjects(criteria, clickedButton) {
    let projects = document.querySelectorAll('.project');
    let filterButtons = document.querySelectorAll('.filter-options button');
    filterButtons.forEach(btn => btn.classList.remove('active'));

    clickedButton.classList.add('active');

    switch (criteria) {
        case 'all':
            for (let project of projects) {
                project.style.display = '';
            }
            break;
        case 'unity':
        case 'unreal':
            for (let project of projects) {
                project.style.display = project.getAttribute('data-engine') === criteria ? '' : 'none';
            }
            break;
        case 'steam':
            for (let project of projects) {
                project.style.display = project.getAttribute('data-steam') === 'yes' ? '' : 'none';
            }
            break;
        case 'itch':
            for (let project of projects) {
                project.style.display = project.getAttribute('data-itch') === 'yes' ? '' : 'none';
            }
            break;
        case 'alphabetical':
            sortProjectsAlphabetically(projects);
            break;
        case 'chronological':
            sortProjectsChronologically(projects);
            break;
    }
}

function sortProjectsAlphabetically(projects) {
    let container = document.querySelector('.projects-container');
    let projectsArray = Array.from(projects);

    projectsArray.sort((a, b) => a.getAttribute('data-title').localeCompare(b.getAttribute('data-title')));

    projectsArray.forEach(project => {
        container.appendChild(project);
    });
}

// function sortProjectsChronologically(projects) {
//     let container = document.querySelector('.projects-container');
//     let projectsArray = Array.from(projects);

//     projectsArray.sort((a, b) => a.getAttribute('data-date').localeCompare(b.getAttribute('data-date')));

//     projectsArray.forEach(project => {
//         container.appendChild(project);
//     });
// }
