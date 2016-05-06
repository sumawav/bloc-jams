// our js will go hero
var animatePoints = function() {
  var points = document.getElementsByClassName('point');

  var revealPoints = function(point) {
    points[point].style.opacity = 1;
    points[point].style.transform = "scale(1) translateX(0)";
    points[point].style.msTransform = "scaleV(1) translateX(0)";
    points[point].style.WebkitTransform = "scaleV(1) translateX(0)";
  }

  for (var i = 0; i < points.length; ++i){
    revealPoints(i);
  }


};
