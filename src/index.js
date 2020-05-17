import Search from './modules/Search';
import Recipe from './modules/recipe';
import * as searchview from './views/searchview';
import {elements,renderLoader,clearLoader} from './views/base';

/**Global state of the app
 * -search object
 * -current recipe object
 * -shopping list object 
 * -liked recipes
 */
const state = {};

/**
 * search controller
 */
const controlsearch = async () =>{
  //1. get query from the view
  const query = searchview.getInput();
  //console.log(query);
  //const query='pizza';

  if(query){
    //2. new search object and to state
    state.search=new Search(query);

    //3. prepare ui for result
      searchview.clearInput();
      searchview.clearResults();
      renderLoader(elements.searchRes);

    //4. search for recipe
    await state.search.getResults();

    //5. render result on UI
    clearLoader();
    searchview.renderResults(state.search.result);
    //console.log(state.search.result);
  }
}

elements.searchForm.addEventListener('submit', e =>{
  e.preventDefault();
  controlsearch();
});

//testing
//window.addEventListener('load', e =>{
  //e.preventDefault();
  //controlsearch();
//});

elements.searchResPages.addEventListener('click', e =>{
  const btn =e.target.closest('.btn-inline');
  //console.log(btn);
  if (btn){
    const goToPage=parseInt(btn.dataset.goto, 10);
    searchview.clearResults();
    searchview.renderResults(state.search.result, goToPage);
    //console.log(goToPage);
  }
});

//const search = new Search('pizza');
//console.log(search);
//search.getResults();

/**
 * Recipe controller
 */
const controlRecipe = async () => {
  const id =window.location.hash.replace('a','');
  console.log(id);

  if(id){
    //prepare UI for changes

    //create new recipe object
      state.recipe = new Recipe(id);
    //get recipe data
     await state.recipe.getRecipe();
    //calculate servings and time
    state.recipe.calcTime();
    state.recipe.calcServings();
    //render the recipe
    console.log(state.recipe);

  }
};

window.addEventListener('hashchange', controlRecipe);














