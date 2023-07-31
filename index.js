const charactersContainer = document.querySelector('#characters');
const modal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');
const loadMoreButton = document.querySelector('.load-more');
const btnUp = document.querySelector('.btn-up');

const API = 'https://rickandmortyapi.com/api/character';

// const pagination = document.querySelector('.page__container');

let currentPage = 1;
let totalPages = 0;

async function getCharacters(page) {
    const response = await fetch(`${API}/?page=${page}`);
    const data = await response.json();

    totalPages = data.info.pages;

    return data.results;
};

async function getEpisode(url) {
    const response = await fetch(url);
    const data = await response.json();

    return data;
}


// Create Cards

function createCharacterCard(character) {
    const characterCard = document.createElement('div');
    characterCard.classList.add('character-card');

    characterCard.innerHTML = `
        <img src="${character.image}" alt="${character.name}">
        <h2>${character.name}</h2>
    `;

    characterCard.addEventListener('click', () => {
        openModal(character);
    });

    return characterCard;
};


// Modal

async function openModal(character) {
    const firstEpisode = await getEpisode(character.episode[0]);
    // const lastEpisode = await getEpisode(character.episode[character.episode.length - 1]);

    modalContent.innerHTML = `
        <div class="modal-content_close" data-close>&times;</div>
        <div class="modal-content_img">
            <img src="${character.image}" alt="${character.name}">
        </div>
        <div class="modal-content_info">
            <h2>${character.name}</h2>
            <ul class="madal-content_list">
            <li><span>Status:</span> ${character.status}</li>
            <li><span>Species:</span> ${character.species}</li>
            <li><span>Gender:</span> ${character.gender}</li>
            <li><span>Origin:</span> ${character.origin.name}</li>
            <li><span>Location:</span> ${character.location.name}</li>
            <li><span>First seen in:</span> ${firstEpisode.name}</li>
            </ul>
        </div>
    `;
    document.body.style.overflow = 'hidden';

    modal.classList.add('open');
};

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
};

modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.getAttribute('data-close') === '') {
        closeModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape' && modal.classList.contains('open')) {
        closeModal();
    }
});

modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target === modalContent) {
        closeModal();
    }
});



// Load More Button

async function loadPages(page) {
    const characters = await getCharacters(page);
    
    characters.forEach(character => {
        const characterCard = createCharacterCard(character);
        charactersContainer.append(characterCard);
    });

    if (currentPage === totalPages) {
        loadMoreButton.style.display = 'none';
    }
};

loadPages(currentPage);

loadMoreButton.addEventListener('click', () => {
    currentPage++;
    loadPages(currentPage);
});


// To Top Button 


function show() {
    btnUp.classList.remove('btn-up_hide');
};

function hide() {
    btnUp.classList.add('btn-up_hide');
};

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    scrollY > 400 ? show() : hide();
});

btnUp.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
});


//Pagination

// async function loadPagination(page) {
//     charactersContainer.innerHTML = '';
//     const characters = await getCharacters(page);

//     characters.forEach(character => {
//         const characterCard = createCharacterCard(character);
//         charactersContainer.append(characterCard);
//     });
    
//     createPagination();
// }

// function createPagination() {
//     pagination.innerHTML = '';
    
//     for (let i = 1; i <= totalPages; i++) {
//         const pageButton = document.createElement('button');
//         pageButton.classList.add('page__list')
//         pageButton.innerText = i;

//         pageButton.addEventListener('click', () => {
//             currentPage = i;
//             loadPagination(currentPage);
//         });
        
//         if (i === currentPage) {
//             pageButton.classList.add('active');
//         }
        
//         pagination.append(pageButton);
//     }
// }

// loadPagination(currentPage);