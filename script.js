const baseURL = 'http://localhost:9090/etudiants';
const TITRE = document.getElementById('titre');
const ITEMDETAILS = document.getElementById('item-cud');
const ITEMLISTE = document.getElementById('item-liste');
const ITEMSEARCH = document.getElementById('item-recherche');
const BODY = document.getElementById('tbody');
const FORMULAIREID = document.getElementById('formulaire-id');
const FORMULAIRE = document.getElementById('formulaire');
const BTNMODIF = document.getElementById('btn-modif');
const BTNSUPP = document.getElementById('btn-supprimer');
const BTNVALID = document.getElementById('btn-valider');
const ID = document.getElementById('id');
const NOM = document.getElementById('nom');
const PRENOM = document.getElementById('prenom');
const VILLE = document.getElementById('ville');
const DOUBLON = document.getElementById('doublon');
const ERREURNOM = document.getElementById('erreur-nom');
const ERREURPRENOM = document.getElementById('erreur-prenom');
const ERREURVILLE = document.getElementById('erreur-ville');
const SEARCH = document.getElementById("search-bar");
let ajout = false;

function strUpFirst(a) {
    return (a + '').charAt(0).toUpperCase() + a.substr(1);
}

function ajouter() {
    ajout = true;
    TITRE.textContent = 'Ajout d\'un étudiant';
    ITEMDETAILS.className = 'item-ajouter';
    ITEMLISTE.className = 'none';
    ITEMSEARCH.className = 'none';
    FORMULAIREID.className = 'none';
    BTNMODIF.className = 'none';
    BTNSUPP.className = 'none';
    BTNVALID.className = 'btn btn-success';
    BTNVALID.disabled = false;
    ID.value = '';
    NOM.value = '';
    PRENOM.value = '';
    VILLE.value = '';
    ERREURNOM.innerHTML = '';
    ERREURPRENOM.innerHTML = '';
    ERREURVILLE.innerHTML = '';
    DOUBLON.innerHTML = '';
    SEARCH.value = '';
    recherche();
    return ajout;
}

function retour() {
    NOM.value = '';
    PRENOM.value = '';
    VILLE.value = '';
    ITEMDETAILS.className = 'none';
    ITEMLISTE.className = 'item-liste';
    ITEMSEARCH.className = 'item-recherche';
    ERREURNOM.innerHTML = '';
    ERREURPRENOM.innerHTML = '';
    ERREURVILLE.innerHTML = '';
    DOUBLON.innerHTML = '';
    ajout = false;
}

function valideForm(event) {
    let valide = true;
    ERREURNOM.innerHTML = '';
    ERREURPRENOM.innerHTML = '';
    ERREURVILLE.innerHTML = '';

    const regexNom = /^[a-zA-Z '\-éèêëçäàï]{2,50}$/;
    const regexVille = /^([a-zA-Z '\-éèêëçäàï]|[a-zA-Z '\-éèêëçäàï]\s?[a-zA-Z '\-éèêëçäàï]){4,99}$/;

    if (!NOM.value.match(regexNom)) {
        valide = false;
        ERREURNOM.innerHTML = 'Le nom doit contenir entre 2 et 50 caractères'
    }
    if (!PRENOM.value.match(regexNom)) {
        valide = false;
        ERREURPRENOM.innerHTML = 'Le prénom doit contenir entre 2 et 50 caractères'
    }
    if (!VILLE.value.match(regexVille)) {
        valide = false;
        ERREURVILLE.innerHTML = 'La ville doit contenir au moins 4 caractères et ne peut contenir de caractères spéciaux'
    }

    if (ajout) {
        if (valide && !doublon(NOM.value, PRENOM.value)) {
            return true;
        } else {
            event.preventDefault();
        }
    } else {
        if (valide) {
            return true;
        } else {
            event.preventDefault();
        }
    }
}

function doublon(n, p) {
    let valide = false;
    let etudiants = BODY.childNodes;
    for (let i = 0; i < etudiants.length; i++) {
        let etu = etudiants[i];
        let nom = etu.childNodes[0].innerHTML;
        let prenom = etu.childNodes[1].innerHTML;
        if (Object.is(nom.toUpperCase(), n.toUpperCase()) && Object.is(prenom.toUpperCase(), p.toUpperCase())) {
            valide = true;
            DOUBLON.innerHTML = 'Etudiant déjà existant !'
        }
    }
    return valide;
}

function detailsEtudiant(id) {
    ITEMDETAILS.className = 'item-details';
    FORMULAIREID.className = 'form-group';
    TITRE.textContent = 'Détails d\'un étudiant';
    BTNVALID.className = 'none';
    BTNMODIF.className = 'btn btn-warning';
    BTNMODIF.disabled = true;
    ERREURNOM.innerHTML = '';
    ERREURPRENOM.innerHTML = '';
    ERREURVILLE.innerHTML = '';
    DOUBLON.innerHTML = '';

    BTNMODIF.onclick = function () {
        modifierEtudiant(id);
    };
    BTNSUPP.className = 'btn btn-danger';
    BTNSUPP.onclick = function () {
        supprimerEtudiant(id);
        generate_table();
        ITEMLISTE.className = 'item-liste';
        ITEMSEARCH.className = 'item-recherche';
        ITEMDETAILS.className = 'none';
    };

    fetch(baseURL + '/' + id)
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (json) {
            ID.value = json.id;
            NOM.value = json.nom.toUpperCase();
            PRENOM.value = strUpFirst(json.prenom);
            VILLE.value = strUpFirst(json.ville);

            NOM.onkeyup = function () {
                BTNMODIF.disabled = NOM.value === json.nom;
            };
            PRENOM.onkeyup = function () {
                BTNMODIF.disabled = PRENOM.value === json.prenom;
            };
            VILLE.onkeyup = function () {
                BTNMODIF.disabled = VILLE.value === json.ville;
            };
        }).catch(console.log)
}

function modifierEtudiant(id) {

    let nom = NOM.value;
    let prenom = PRENOM.value;
    let ville = VILLE.value;
    let etudiant = {"nom": nom, "prenom": prenom, "ville": ville};
    let put = JSON.stringify(etudiant);

    if (valideForm()) {
        fetch(baseURL + '/' + id.toString(), {
            method: "PUT",
            body: put,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {  /* syntaxe qui remplace function(response) {...}  */
            if (response.ok) {
                alert('Modification réussie !');
                response.json()
                    .then(console.log)
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                console.error('server response : ' + response.status);
            }
        }).catch(error => {
            console.error(error);
        });
    }
}

function ajoutListeEtudiant() {

    let nom = NOM.value;
    let prenom = PRENOM.value;
    let ville = VILLE.value;
    let etudiant = {"nom": nom, "prenom": prenom, "ville": ville};
    let post = JSON.stringify(etudiant);


    if (valideForm()) {
        fetch(baseURL, {
            method: "POST",
            body: post,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {  /* syntaxe qui remplace function(response) {...}  */
            if (response.ok) {
                alert('Ajout réussi !');
                ITEMLISTE.className = 'item-liste';
                ITEMSEARCH.className = 'item-recherche';
                ITEMDETAILS.className = 'none';
            } else {
                console.error('server response : ' + response.status);
            }
        }).catch(error => {
            console.error(error);
        });
    }
}

function supprimerEtudiant(id) {
    if (confirm('Voulez-vous vraiment supprimer l\'étudiant ?')) {
        fetch(baseURL + '/' + id, {method: "DELETE"})
            .then(response => {  /* syntaxe qui remplace function(response) {...}  */
                if (response.ok) {
                    generate_table();
                    alert('Etudiant surpprimé !');
                } else {
                    console.error('server response : ' + response.status);
                }
            }).catch(error => {
            console.error(error);
        });
    }
}

function viderTable() {
    BODY.innerHTML = '';
}

/* Utilisation d'une lib twbs-pagination-master/jquery.twbsPagination.min.js de jquery pour la pagination.*/
function generate_table() {
    viderTable();
    let totalEtudiants = 0;
    let etudiants = [];
    let displayEtudiants = [];
    let recPerPage = 4;
    let totalPages = 0;

    $.ajax({
        url: "http://localhost:9090/etudiants",
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            etudiants = data;
            console.log(etudiants);
            totalEtudiants = etudiants.length;
            totalPages = Math.ceil(totalEtudiants / recPerPage);
            $('#pagination').twbsPagination({
                totalPages: totalPages,
                visiblePages: 6,
                onPageClick: function (event, page) {
                    let displayEtudiantsIndex = Math.max(page - 1, 0) * recPerPage;
                    let endEtudiants = (displayEtudiantsIndex) + recPerPage;

                    displayEtudiants = etudiants.slice(displayEtudiantsIndex, endEtudiants);

                    $('#tbody').html('');
                    for (let i = 0; i < displayEtudiants.length; i++) {

                        const tr = document.createElement('tr');
                        const id = displayEtudiants[i].id;
                        tr.id = 'tr_' + id;

                        const td_nom = document.createElement('td');
                        const nom = document.createTextNode(displayEtudiants[i].nom.toUpperCase());
                        td_nom.id = 'nom-' + id;
                        td_nom.appendChild(nom);
                        tr.appendChild(td_nom);

                        const td_prenom = document.createElement('td');
                        const prenom = document.createTextNode(strUpFirst(displayEtudiants[i].prenom));
                        td_prenom.id = 'prenom-' + id;
                        td_prenom.appendChild(prenom);
                        tr.appendChild(td_prenom);

                        tr.onclick = function () {
                            detailsEtudiant(id);
                        };
                        BODY.appendChild(tr);
                    }
                }
            });
        }, error: function (resultat, statut, erreur) {
            alert('Erreur : ' + erreur);
        }
    });
}

function recherche() {
    const saisie = this.value;

    let etudiants = BODY.childNodes;
    console.log(etudiants);
    for (let i = 0; i < etudiants.length; i++) {
        let etu = etudiants[i];
        let nom = etu.childNodes[0].innerHTML;
        let prenom = etu.childNodes[1].innerHTML;
        etu.hidden = !nom.toUpperCase().includes(saisie.toUpperCase()) && !prenom.toUpperCase().includes(saisie.toUpperCase());
    }
}

FORMULAIRE.addEventListener("submit", valideForm);
BTNVALID.addEventListener("click", ajoutListeEtudiant);
BTNVALID.addEventListener("submit", generate_table);
SEARCH.addEventListener("keyup", recherche);
window.onload = function () {
    generate_table();
};
