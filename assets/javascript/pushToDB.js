    //logout
    $("#logout").on("click", function(event){
        event.preventDefault();
        $("#group-items-list").empty();
        $(".search-results").empty();
        $(".search-suprise").empty();
        $("#image-div").empty();
        $("#ing-and-buttons").empty();
        $("#recipe-instructions").empty();
        $("#deck-item-drop-div").empty();
        $("#create-group-textBox").empty();
        $("#create-group-textBox").val("");
        groupList = [];        
    })
    $("#login").on("click", function(event){
        event.preventDefault();
        $("#group-items-list").empty();
        $(".search-results").empty();
        $(".search-suprise").empty();
        $("#image-div").empty();
        $("#ing-and-buttons").empty();
        $("#recipe-instructions").empty();
        $("#deck-item-drop-div").empty();
        $("#create-group-textBox").empty();
        $("#create-group-textBox").val("");
        groupList = [];
        // groupingsOfRecipies = {};
        auth.onAuthStateChanged(user=>{
            var tempUserPath;
            var tempUserID;
            tempUserID = user.uid;
            tempUserPath = "users/" + tempUserID;
            var reference = database.ref(tempUserPath);
            
            reference.once("value", function(snapshot){
                //need to empty prior because of persistent cached data
                $("#group-items-list").empty();
                groupList = [];
                groupingsOfRecipies = {};
                snapshot.forEach(function(snapshot2){
                    var groupItemDiv = "<div class = 'group-item'><button class = 'btn btn-outline-success mr-2 my-sm-2 btn-block group-item-button'>";
                    var groupItemClosingDiv = "</button></div><br>";
               
                    var groupItem =snapshot2.key;
                   
                    groupingsOfRecipies[groupItem] = [];
                    
                    groupList.push(groupItem);
                    createList();
                    $("#group-items-list").append(groupItemDiv + groupItem + groupItemClosingDiv);
                })
            })
        })
    })


    $(document).on("click", ".group-item-button", function(){
        auth.onAuthStateChanged(user=>{
          
            var tempUserID;
            tempUserID = user.uid;
            tempGroupName = $(this).text();
            var tempGroupPath = "users/" + tempUserID + "/" + tempGroupName;
            var reference=database.ref(tempGroupPath);
            reference.once("value", function(snapshot){
                $("#deck-item-drop-div").empty();
                snapshot.forEach(function(snapshot2){
                    var deckButtonDiv = $("<button>");
                    deckButtonDiv.attr("type", "button");
                    deckButtonDiv.addClass("btn btn-primary deck-item set-id inline");
                    deckButtonDiv.attr("recipe-id", snapshot2.key);
                    deckButtonDiv.text(snapshot2.val().title);
                    $("#deck-item-drop-div").append(deckButtonDiv)

                    var recipeStored;
                    recipeStored = JSON.stringify(snapshot2.val());
                    // Put the new JSON recipe in session storage.
                    sessionStorage.setItem(snapshot2.key, recipeStored);

                })
            })
            
        })
    })

    $(document).on("click", ".group-list-button", function(){
        auth.onAuthStateChanged(user=>{
            event.preventDefault();
            currentRecipeID = $("#add-to-deck").attr("recipe-id");
            tempJSON = JSON.parse(sessionStorage.getItem(currentRecipeID));
           
            currentRecipeTitle = tempJSON.title;
            tempUID = user.uid;
            tempGroupName = $(this).text();
            var groupPath = "users/" + tempUID + "/" + tempGroupName;
            // var recipePath = groupPath + "/" + currentRecipeTitle;
            database.ref(groupPath).update({
                [currentRecipeID]: tempJSON
            })
          
        })
    })

    $("#create-group-button").on("click", function(event){
        auth.onAuthStateChanged(user=>{
            if($("#create-group-textBox").val() != ''){
                event.preventDefault();
                tempGroupName = $("#create-group-textBox").val().trim();
                tempUID = user.uid;
                var userPath = "users/" + tempUID;
                database.ref(userPath).update({
                    [tempGroupName]: 0
                })
            }
            else{

            }
        })
    })
    $("#signup").on("click", function(){
        const email = $("#email").val().trim();
        const password = $("#password").val().trim();
        auth.createUserWithEmailAndPassword(email, password).then(cred => {
       
         })
         auth.onAuthStateChanged(user=>{
            var tempuser = user.uid;
            database.ref("users").update({
                [tempuser]: 0
              })    
         })
    })
