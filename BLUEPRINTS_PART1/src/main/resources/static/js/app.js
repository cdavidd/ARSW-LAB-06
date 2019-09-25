var apiRest = apimock;
var BlueprintModule = (function() {
  var _author;
  var _authorBlueprint = [];

  var _mapNamePoints = function(blueprints) {
    return blueprints.map(function(blueprint) {
      return { name: blueprint.name, points: blueprint.points.length };
    });
  };

  var _sumPoints = function(blueprints) {
    var sum = blueprints.reduce(function(total, currentValue) {
      return total + currentValue.points;
    }, 0);
    $("#blueprintSum > h3").text("Total user points: " + sum);
  };

  var _genTable = function(blueprints) {
    blueprints = _mapNamePoints(blueprints);
    _authorBlueprint = blueprints;
    _sumPoints(blueprints);
    $("#blueprintTable > tbody").empty(); //Limpia el cuerpo de la tabla para otros datos
    blueprints.map(function(blueprint) {
      $("#blueprintTable > tbody").append(
        "<tr> <td>" +
          blueprint.name +
          "</td>" +
          "<td>" +
          blueprint.points +
          "</td>" +
          "<td><form><button type='button' class='btn btn-primary' onclick='BlueprintModule.openPlane( \"" +
          _author +
          '" , "' +
          blueprint.name +
          "\")' >Open</button></form></td>" +
          "</tr>"
      );
    });
  };

  var _pintar = function(blueprint) {
    $("#tituloPlano").text("Current blueprint: " + blueprint.name);
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    var anterior;
    blueprint.points.map(function(point) {
      if (!anterior) {
        anterior = point;
        ctx.moveTo(anterior.x, anterior.y);
      } else {
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    });
  };
  var changeAuthorName = function(author) {
    _author = author;
  };

  var updateListPlans = function(author) {
    changeAuthorName(author);
    $("#blueprintAuthorName > h2").text(author + "'s blueprints: ");
    apiRest.getBlueprintsByAuthor(author, _genTable);
  };

  var openPlane = function(author, name) {
    apiRest.getBlueprintsByNameAndAuthor(author, name, _pintar);
  };

  return {
    changeAuthorName: changeAuthorName,
    updateListPlans: updateListPlans,
    openPlane: openPlane
  };
})();
