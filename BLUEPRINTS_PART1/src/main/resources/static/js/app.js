var apiRest = apiclient;
var BlueprintModule = (function() {
  var _author;
  var _authorBlueprint = [];
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

  var _pintar = function(blueprint) {
    $("#tituloPlano").text("Current blueprint: " + blueprint.name);
    var c = _getCanvas();
    var ctx = _clearCanvas(c);
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

  var changeAuthorName = function(author) {
    _open = false;
    _author = author;
  };

  var updateListPlans = function(author) {
    changeAuthorName(author);
    $("#blueprintAuthorName > h2").text(author + "'s blueprints: ");
    _clearCanvas(_getCanvas());
    apiRest.getBlueprintsByAuthor(author, _genTable);
  };

  var openPlane = function(author, name) {
    _open = true;
    _name = name;
    apiRest.getBlueprintsByNameAndAuthor(author, _name, _pintar);
  };

  var _repaint = function(event, canvas) {
    var offset = _getOffset(canvas);
    var x = event.pageX - parseInt(offset.left, 10);
    var y = event.pageY - parseInt(offset.top, 10);
    var plano = _authorBlueprint.filter(obj => {
      return obj.name === _name;
    })[0];
    plano.points.push({ x: x, y: y });
    _pintar(plano);
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

  return {
    changeAuthorName: changeAuthorName,
    updateListPlans: updateListPlans,
    openPlane: openPlane,
    listenPointMouse: listenPointMouse,
    savePoints: savePoints
  };
})();
