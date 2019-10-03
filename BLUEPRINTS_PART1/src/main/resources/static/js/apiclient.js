const apiUrl = "http://localhost:8080/blueprints/";
apiclient = (function() {
  return {
    getBlueprintsByAuthor: function(name, callback) {
      var getPromise = jQuery.ajax({
        url: apiUrl + name,
        success: function(result) {
          callback(result);
        },
        async: true
      });
      getPromise.then(
        function() {
          console.info("OK getBlueprintsByAuthor");
        },
        function() {
          alert("No se encuentra el author: " + name);
        }
      );
    },
    getBlueprintsByNameAndAuthor: function(author, name, callback) {
      var getPromise = jQuery.ajax({
        url: apiUrl + author + "/" + name,
        success: function(result) {
          callback(result);
        },
        async: true
      });
      getPromise.then(
        function() {
          console.info("OK getBlueprintsByNameAndAuthor");
        },
        function() {
          alert(
            "No se encuentra el author: " + author + " con el plano: " + name
          );
        }
      );
    },
    setBlueprint: function(author, name, newBp) {
      var putPromise = $.ajax({
        url: "/blueprints/" + author + "/" + name + "/",
        type: "PUT",
        data: newBp,
        contentType: "application/json"
      });

      putPromise.then(
        function() {
          BlueprintModule.updateListPlans(author);
          BlueprintModule.openPlane(author,name);
        },
        function() {
          console.info("ERROR setBlueprint");
        }
      );
    },
    deletePlane: function(author, name) {
      var delPromise = $.ajax({
        url: "/blueprints/" + author + "/" + name + "/",
        type: "DELETE",
        contentType: "application/json"
      });

      delPromise.then(
        function() {
          BlueprintModule.updateListPlans(author);
          console.info("OK deletePlane");
        },
        function() {
          console.info("ERROR deletePlane");
        }
      );
    }
  };
})();
