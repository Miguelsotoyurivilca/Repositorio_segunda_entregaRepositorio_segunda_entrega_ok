function iniciarApp() {
    const resultado = document.querySelector('#resultado');
    const selectCategorias = document.querySelector('#categorias');
    
    if(selectCategorias) {
        selectCategorias.addEventListener('change', seleccionarCategoria)
        obtenerCategorias();
    }
    const favoritosDiv = document.querySelector('.favoritos');
    if(favoritosDiv) {
        obtenerFavoritos();
    }

    function obtenerCategorias() {
        const url = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarCategorias(resultado.drinks))
            .catch(error => {
                console.log(error);
                mostrarToast('Error al cargar categorías');
            });
    }

    function mostrarCategorias(categorias = []) {
        categorias.forEach(categoria => {
            const { strCategory } = categoria;
            const option = document.createElement('OPTION');
            option.value = strCategory;
            option.textContent = strCategory;
            selectCategorias.appendChild(option);     
        })
    }

    function seleccionarCategoria(e) {
        const categoria = e.target.value;
        const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${categoria}`;
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetas(resultado.drinks))
            .catch(error => {
                console.log(error);
                mostrarToast('Error al cargar recetas');
            });
    }

    function mostrarRecetas(recetas = []) {
        limpiarHtml(resultado);

        const heading = document.createElement('H2');
        heading.classList.add('text-center', 'text-black', 'my-5');
        heading.textContent = recetas.length ? 'Resultados': 'No Hay Resultados';
        resultado.appendChild(heading);
        
        // Create container for the grid
        const recetasGrid = document.createElement('DIV');
        recetasGrid.classList.add('row', 'row-cols-1', 'row-cols-md-3', 'g-4');
        
        recetas.forEach(receta => {
            const { idDrink, strDrink, strDrinkThumb } = receta;

            const recetaContenedor = document.createElement('DIV');
            recetaContenedor.classList.add('col');

            const recetaCard = document.createElement('DIV');
            recetaCard.classList.add('card', 'h-100');

            const recetaImagen = document.createElement('IMG');
            recetaImagen.classList.add('card-img-top');
            recetaImagen.alt = `Imagen del cóctel ${strDrink ?? receta.titulo}`;
            recetaImagen.src = strDrinkThumb ?? receta.img;

            const recetaCardBody = document.createElement('DIV');
            recetaCardBody.classList.add('card-body', 'd-flex', 'flex-column');

            const recetaHeading = document.createElement('H3');
            recetaHeading.classList.add('card-title', 'mb-3');
            recetaHeading.textContent = strDrink ?? receta.titulo;

            const recetaButton = document.createElement('BUTTON');
            recetaButton.classList.add('btn', 'btn-danger', 'mt-auto', 'w-100');
            recetaButton.textContent = 'Ver Cóctel';
            recetaButton.onclick = function() {
                seleccionarReceta(idDrink ?? receta.id);
            }

            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaButton);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody)

            recetaContenedor.appendChild(recetaCard);
            recetasGrid.appendChild(recetaContenedor);
        });
        
        resultado.appendChild(recetasGrid);
    }

    function seleccionarReceta(id) {
        const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetaModal(resultado.drinks[0]))
            .catch(error => {
                console.log(error);
                mostrarToast('Error al cargar detalles del cóctel');
            });
    }

    function mostrarRecetaModal(receta) {
        const { idDrink, strInstructions, strDrink, strDrinkThumb } = receta;
        
        // Actualizar elementos del modal usando los IDs correctos
        document.querySelector('#cocktailModalLabel').textContent = strDrink;
        document.querySelector('#modal-cocktail-img').src = strDrinkThumb;
        document.querySelector('#modal-cocktail-img').alt = `Imagen de ${strDrink}`;
        document.querySelector('#modal-instructions').textContent = strInstructions;

        // Limpiar y actualizar ingredientes
        const ingredientsList = document.querySelector('#modal-ingredients');
        ingredientsList.innerHTML = '';

        // Agregar ingredientes
        for(let i = 1; i <= 15; i++) {
            if(receta[`strIngredient${i}`]) {
                const ingrediente = receta[`strIngredient${i}`];
                const cantidad = receta[`strMeasure${i}`];

                const li = document.createElement('LI');
                li.textContent = `${cantidad || ''} ${ingrediente}`.trim();
                ingredientsList.appendChild(li);
            }
        }

        // Actualizar botón de favoritos
        const btnFavorito = document.querySelector('#guardarFavorito');
        btnFavorito.textContent = existeStorage(idDrink) ? 'Eliminar Favorito' : 'Guardar Favorito';
        
        btnFavorito.onclick = function() {
            if(existeStorage(idDrink)) {
                eliminarFavorito(idDrink);
                btnFavorito.textContent = 'Guardar Favorito';
                mostrarToast('Eliminado Correctamente');
                return;
            }

            agregarFavorito({
                id: idDrink,
                titulo: strDrink,
                img: strDrinkThumb 
            });
            btnFavorito.textContent = 'Eliminar Favorito';
            mostrarToast('Agregado Correctamente');
        };

        // Mostrar el modal
        const modalEl = document.querySelector('#cocktailModal');
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }

    function agregarFavorito(receta) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]));
    }

    function eliminarFavorito(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        const nuevosFavoritos = favoritos.filter(favorito => favorito.id !== id);
        localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
    }

    function existeStorage(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        return favoritos.some(favorito => favorito.id === id);
    }

    function mostrarToast(mensaje) {
        const toastDiv = document.querySelector('#toast');
        const toastBody = document.querySelector('.toast-body');
        const toast = new bootstrap.Toast(toastDiv, {
            animation: true,
            autohide: true,
            delay: 3000
        });
        toastBody.textContent = mensaje;
        toast.show();
    }

    function obtenerFavoritos() {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        if(favoritos.length) {
            mostrarRecetas(favoritos);
            return;
        } 

        const noFavoritos = document.createElement('P');
        noFavoritos.textContent = 'No hay favoritos aún';
        noFavoritos.classList.add('fs-4', 'text-center', 'font-bold', 'mt-5');
        favoritosDiv.appendChild(noFavoritos);
    }

    function limpiarHtml(selector) {
        while(selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    }
}

document.addEventListener('DOMContentLoaded', iniciarApp);