var apiRest = apimock;
var BlueprintModule = (function() {
  var _author;
  var _authorBlueprint = [];
  var open = false;
  

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

  var _getCanvas= function(){
    var c = document.getElementById("myCanvas");
    return c;
  }

  var _clearCanvas= function(canvas){
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    return ctx;
  }

  var _pintar = function(blueprint) {
    $("#tituloPlano").text("Current blueprint: " + blueprint.name);
    var c= _getCanvas();
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

  var _getOffset=function (obj) {
    var offsetLeft = 0;
    var offsetTop = 0;
    do {
      if (!isNaN(obj.offsetLeft)) {
          offsetLeft += obj.offsetLeft;
      }
      if (!isNaN(obj.offsetTop)) {
          offsetTop += obj.offsetTop;
      }   
    } while(obj = obj.offsetParent );
    return {left: offsetLeft, top: offsetTop};
  } 

  var changeAuthorName = function(author) {
    open= false;
    _author = author;
  };
  
  var updateListPlans = function(author) {
    changeAuthorName(author);
    $("#blueprintAuthorName > h2").text(author + "'s blueprints: ");
    _clearCanvas(_getCanvas());
    apiRest.getBlueprintsByAuthor(author, _genTable);
  };
 

  var openPlane = function(author, name) {
    open = true;
    apiRest.getBlueprintsByNameAndAuthor(author, name, _pintar);
  };

  var listenPointMouse = function (){
    var canvas= _getCanvas();
    var offset  = _getOffset(canvas);
    if(window.PointerEvent) {
      canvas.addEventListener("pointerdown", function(event){
        if (open){
          var x= event.pageX-parseInt(offset.left,10);
          var y= event.pageY-parseInt(offset.top,10);
          console.log('pointerdown at '+x+','+y);  
        }
      });
    }
  }
  

  return {
    changeAuthorName: changeAuthorName,
    updateListPlans: updateListPlans,
    openPlane: openPlane,
    listenPointMouse: listenPointMouse
  };
})();
