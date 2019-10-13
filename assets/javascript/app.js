// var apiKey = "";  apiKey is defined in apiconfig.js

var resultDeck = $(".search-results"); // The div where the search results go.
var recipeSearchResults = [];

// When the user clicks on the "search" button...
$("#submit").on("click", function (event) {
    event.preventDefault();
    recipes = [];
    var searchQuery = $("#search-text").val().trim();
    var queryURL = "https://api.spoonacular.com/recipes/search?query=" + searchQuery + "&instructionsRequired=true&apiKey=" + apiKey;
    search(queryURL, "basicSearch"); // Take the user's input and search for recipes.
});

// When the Suprise Me!! button is clicked, trigger the surprise function.
$("#surprise").on("click", function () {
    recipes = [];
    var queryURL = "https://api.spoonacular.com/recipes/random?number=10&instructionsRequired=true&apiKey=" + apiKey;
    search(queryURL, "surpriseSearch"); // Take the user's input and search for recipes.
});

// Search the spoonacular API using the provided URL.
function search(theURL, theType) {
    $.ajax({
        url: theURL,
        method: "GET",
    }).then(function (response) {
        if (theType === "basicSearch") {
            appendSearchResults(response.results);
        } else if (theType === "surpriseSearch") {
            appendSearchResults(response.recipes);
        }
    });
}

// Append the search results to the resultDeck.
function appendSearchResults(theResults) {
    $(".search-results").empty();
    for (var i = 0; i < theResults.length; i++) {
        recipeSearchResults.push(theResults[i].id);
        var searchResult = $("<div>");
        searchResult.addClass("search-result");
        searchResult.attr("data-id", theResults[i].id);
        searchResult.html(theResults[i].title);
        resultDeck.append(searchResult);
    }
}

// Display the ingredients and instructions when the recipe is clicked.
function displayRecipe() {
    // Get the data-label 
    var recipeId = $(this).attr("data-id");

    var recipeJSON = {
        spoonId: recipeId,
        title: $(this).html(),
        ingredients: [],
        instructions: []
    }

    // get recipe Image
    displayRecipeImage(recipeJSON.title);


    // Find the ing-and-buttons row. 
    var ingAndButtonsRow = $("#ing-and-buttons");

    // Find the recipe-instructions row.
    var recipeInstRow = $("#recipe-instructions");

    // Create a new column for ingredients.
    var ingrColumn = $("<div class='col-8' id='ingredients'>");

    // Create a new column for buttons.
    var buttonColumn = $("<div class='col' id='recipe-buttons'>");

    // Create a new column for the instructions.
    var instColumn = $("<div class='col' id='instructions'>");

    // Add required listButtons div to the buttonColumn.
    var listButtons = $("<div id='listButtons'>");
    buttonColumn.append(listButtons);

    // build h3 label
    var labelH3 = $("<h3>");
    labelH3.text("Ingredients");
    ingrColumn.append(labelH3);

    // Add the ingredients to the container, which in turn calls callInstructions(), which adds
    // the instructions to the container.
    callIngredients(recipeJSON, recipeId, ingrColumn, instColumn);

    // Add the ingredient and button columns to the ingAndButtonsRow and 
    // add the instructions column to the recipeInstRow.
    ingAndButtonsRow.append(ingrColumn);
    ingAndButtonsRow.append(buttonColumn);
    recipeInstRow.append(instColumn);
}

// callIngredients calls the spoonacular ingredientWidget, which retrieves the ingredients of a recipe.
// It adds the ingredients to the temporary recipe JSON and the container Div.
function callIngredients(theJSON, theId, theIngColumn, theInstColumn) {
    // Build the Ingredients list
    var ingredientsUl = $("<ul>");

    var ingQueryURL = "https://api.spoonacular.com/recipes/" + theId + "/ingredientWidget.json?apiKey=" + apiKey;

    $.ajax({
        url: ingQueryURL,
        method: "GET",
    }).then(function (response) {

        var ingredients = response.ingredients; // Get the ingredients array from the response.

        // For each ingredient in the array...
        for (var i = 0; i < ingredients.length; i++) {
            var ingredientLi = $("<li>");

            // Create a string which is built from the ingredient amount, ingredient unit, and ingredient name.
            var currentIng = ingredients[i].amount.us.value + " " + ingredients[i].amount.us.unit + " " + ingredients[i].name;

            // Push the ingredient to the recipe JSON.
            theJSON.ingredients.push(currentIng);

            // Add the ingredient to the ingredient list.
            ingredientLi.text(currentIng);
            ingredientsUl.append(ingredientLi);
        }

        // Append the ingredients list to the container div.
        theIngColumn.append(ingredientsUl);

        // Now call the instructions API.
        callInstructions(theJSON, theId, theInstColumn);
    });
}

// callInstructions calls the spoonacular analyzedInstructionsAPI, which retrieves the steps of a recipe.
// It adds the steps to the temporary recipe JSON and the container Div.
function callInstructions(theJSON, theId, theInstColumn) {
    // Build the Instructions list
    var instructionsUl = $("<ul>");

    var instQueryURL = "https://api.spoonacular.com/recipes/" + theId + "/analyzedInstructions?apiKey=" + apiKey;

    $.ajax({
        url: instQueryURL,
        method: "GET",
    }).then(function (response) {

        var recipeInstructions = response[0].steps; // Get the instructions array from the response.

        // For each instruction in the array...
        for (var i = 0; i < recipeInstructions.length; i++) {
            var instructionsLi = $("<li>");

            // Get the instruction number and the step.
            var instNumber = recipeInstructions[i].number;
            var instStep = recipeInstructions[i].step;

            // Push the step to the recipe JSON.
            theJSON.instructions.push(instStep);

            // Append the instruction to the instruction list.
            instructionsLi.text(instNumber + " " + instStep);
            instructionsUl.append(instructionsLi);
        }

        // Add the recipe JSON to session storage.
        sessionStorage.setItem(theId, JSON.stringify(theJSON));

        // Append the instruction list to the container div.
        theInstColumn.append(instructionsUl);
    });
}

// When a search result is clicked, display its corresponding recipe ingredients and instructions.
$(document).on("click", ".search-result", displayRecipe);
