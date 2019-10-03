var apiRest = apiclient;
var BlueprintModule = (function() {
  var _author;
  var _authorBlueprint = [];
  var _totalBlueprints = 0;
  var _open = false;
  var _name;

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
    changeAuthorName(blueprints[0].author);
    _totalBlueprints = blueprints.length;
    $("#blueprintAuthorName > h2").text(_author + "'s blueprints: ");
    _authorBlueprint = blueprints;
    blueprints = _mapNamePoints(_authorBlueprint);
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

  var _getCanvas = function() {
    var c = document.getElementById("myCanvas");
    return c;
  };

  var _clearCanvas = function(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    return ctx;
  };

  var _pintar = function(plano) {
    _authorBlueprint.filter(obj => {
      if (obj.name === plano.name) {
        obj.points = plano.points;
      }
    });
    $("#tituloPlano").text("Current blueprint: " + plano.name);
    var c = _getCanvas();
    var ctx = _clearCanvas(c);
    var anterior;
    plano.points.map(function(point) {
      if (!anterior) {
        anterior = point;
        ctx.moveTo(anterior.x, anterior.y);
      } else {
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    });
  };

  var _getOffset = function(obj) {
    var offsetLeft = 0;
    var offsetTop = 0;
    do {
      if (!isNaN(obj.offsetLeft)) {
        offsetLeft += obj.offsetLeft;
      }
      if (!isNaN(obj.offsetTop)) {
        offsetTop += obj.offsetTop;
      }
    } while ((obj = obj.offsetParent));
    return { left: offsetLeft, top: offsetTop };
  };

  var _repaint = function(event, canvas) {
    var offset = _getOffset(canvas);
    var x = event.pageX - parseInt(offset.left, 10);
    var y = event.pageY - parseInt(offset.top, 10);
    var plano = _authorBlueprint.filter(obj => {
      return obj.name === _name;
    })[0];
    plano.points.push({ x: x, y: y });
    console.log(plano);
    _pintar(plano);
  };

  var changeAuthorName = function(author) {
    _open = false;
    _author = author;
  };

  var updateListPlans = function(author) {
    _clearCanvas(_getCanvas());
    apiRest.getBlueprintsByAuthor(author, _genTable);
  };

  var openPlane = function(author, name) {
    _open = true;
    _name = name;
    apiRest.getBlueprintsByNameAndAuthor(author, _name, _pintar);
  };

  var listenPointMouse = function() {
    var canvas = _getCanvas();
    var ctx = canvas.getContext("2d");
    if (window.PointerEvent) {
      canvas.addEventListener("pointerdown", function(event) {
        if (_open) {
          _repaint(event, canvas);
        }
      });
    }
  };

  var savePoints = function() {
    var plano = _authorBlueprint.filter(obj => {
      return obj.name === _name;
    })[0];
    apiRest.setBlueprint(_author, _name, JSON.stringify(plano));
  };

  var newPlane = function(name) {
    $("#closeBtn").click();
    $("#nameBlueprint").val("");
    var plano = {
      author: _author,
      points: [],
      name: name
    };
    apiRest.setBlueprint(_author, _name, JSON.stringify(plano));
  };

  var deletePlane = function() {
    $("#tituloPlano").text("Current blueprint: ");
    if (_totalBlueprints > 1){
      apiRest.deletePlane(_author, _name);
    }
    else{
      alert("No se puede eliminar todos los planos");
    }
  };

  return {
    changeAuthorName: changeAuthorName,
    updateListPlans: updateListPlans,
    openPlane: openPlane,
    listenPointMouse: listenPointMouse,
    savePoints: savePoints,
    newPlane: newPlane,
    deletePlane: deletePlane
  };
})();
