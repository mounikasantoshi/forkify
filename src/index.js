import Search from './modules/Search';
import Recipe from './modules/recipe';
import List from './modules/List';
import * as searchview from './views/searchview';
import * as recipeviews from './views/RecipeViews';
import * as listView from './views/ListView';
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
    try{
    //4. search for recipe
    await state.search.getResults();

    //5. render result on UI
    clearLoader();
    searchview.renderResults(state.search.result);
    console.log(state.search.result);
    }catch(err){
      alert('something went wrong with search');
      clearLoader();
    }
  }
}

elements.searchForm.addEventListener('submit', e =>{
  e.preventDefault();
  controlsearch();
});


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
  const id=window.location.hash.replace('#','');
    //console.log(id);

  if(id){
    //prepare UI for changes
    recipeviews.clearRecipe();
    renderLoader(elements.recipe);

    //Highlight selected search item
    if (state.search) searchview.highlightSelected(id);

    //create new recipe object
      state.recipe = new Recipe(id);
     
      try{
         //get recipe data and parse ingredients
          await state.recipe.getRecipe();
          state.recipe.parseIngredients();
         //calculate servings and time
          state.recipe.calcTime();
          state.recipe.calcServings();
          //render the recipe
          clearLoader();
          recipeviews.renderRecipe(state.recipe);
          console.log(state.recipe);
      }catch(err){
        alert('error processing recipe');
      }

  }
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load',controlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

/**List controller */

const controlList = () => {
  //create a new list if there in none yet
  if (!state.list)state.list = new List();

  //add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const  item =state.list.addItem(el.count,el.unit, el.ingredient);
    listView.renderItem(item);
  });
}
//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease', '.btn-decrease *')){
    //decrease button is clicked
    if(state.recipe.servings>1){
    state.recipe.updateServings('dec');
    recipeviews.updateServingsIngredients(state.recipe);
    }
  }else  if (e.target.matches('.btn-increase', '.btn-increase *')){
    //increase button is clicked
     state.recipe.updateServings('inc');
     recipeviews.updateServingsIngredients(state.recipe);
  } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  }
  //console.log(state.recipe); 
});


window.l =new List();












