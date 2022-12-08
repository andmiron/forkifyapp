import * as model from "./model.js"
import {MODAL_CLOSE_SEC} from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import AddRecipeView from "./views/addRecipeView.js";

import "core-js/stable"
import "regenerator-runtime/runtime"
import {state} from "./model.js";
import addRecipeView from "./views/addRecipeView.js";
import {CONSTRUCTOR} from "core-js/internals/promise-constructor-detection";

if (module.hot) {
  module.hot.accept()
}

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1)

    if (!id) return
    recipeView.renderSpinner()

    //update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())

    //updating bookmarks view
    bookmarksView.update(model.state.bookmarks)

    //loading recipe
    await model.loadRecipe(id);

    //rendering recipe
    recipeView.render(model.state.recipe)

  }
  catch (err) {
    recipeView.renderError()
  }
}

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner()
    // 1 get search ready
    const query = searchView.getQuery()
    if (!query) return
    // 2 load search results
    await model.loadSearchResults(query)
    // 3 render results
    resultsView.render(model.getSearchResultsPage())
    //  4 initial pagination buttons
    paginationView.render(model.state.search)
  } catch (err) {
    console.error(err)
  }
}

const controlPagination = function (goToPage) {
  // 1 render new results
  resultsView.render(model.getSearchResultsPage(goToPage))
  //  2 new pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  //  update the recipe servings in state
  model.updateServings(newServings)
  //  update the recipe view
  //   recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  // 1 add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe)
  }
  else {
    model.deleteBookmark(model.state.recipe.id)
  }
  // 2 update recipe view
  recipeView.update(model.state.recipe)

  // 3 render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner()

    // upload the new recipe data
    await model.uploadRecipe(newRecipe)

    // render the new recipe
    recipeView.render(model.state.recipe)

    // success message
    addRecipeView.renderMessage()

    // render bookmark view
    bookmarksView.render(model.state.bookmarks)

    // change id in the url
    window.history.pushState(null, "", `#${model.state.recipe.id}`)

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)

  } catch (err) {
    addRecipeView.renderError(err.message)
  }
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}
init()