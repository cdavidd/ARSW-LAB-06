const apiUrl = "http://localhost:8080/blueprints/";
apiclient = (function() {
  return {
    getBlueprintsByAuthor: function(name, callback) {
      jQuery.ajax({
        url: apiUrl + name,
        success: function(result) {
          callback(result);
        },
        async: true
      });
    },
    getBlueprintsByNameAndAuthor: function(author, name, callback) {
      jQuery.ajax({
        url: apiUrl + author + "/" + name,
        success: function(result) {
          callback(result);
        },
        async: true
      });
    },
    setBlueprint: function(author, name, newBp) {
      $.ajax({
        url: "/blueprints/" + author + "/" + name + "/",
        type: "PUT",
        data: newBp,
        contentType: "application/json"
      });
    }
  };
})();
