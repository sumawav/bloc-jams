// our js will go hero
var animatePoints = function() {
  var points = document.getElementsByClassName('point');

  var revealFirstPoint = function() {
    points[0].style.opacity = 1;
    points[0].style.transform = "scale(1) translateY(0)";
    points[0].style.msTransform = "scaleV(1) translateY(0)";
    points[0].style.WebkitTransform = "scaleV(1) translateY(0)";
  };

  var revealSecondPoint = function() {
    points[0].style.opacity = 1;
    points[0].style.transform = "scale(1) translateY(0)";
    points[0].style.msTransform = "scaleV(1) translateY(0)";
    points[0].style.WebkitTransform = "scaleV(1) translateY(0)";
  };

  var revealThirdPoint = function() {
    points[0].style.opacity = 1;
    points[0].style.transform = "scale(1) translateY(0)";
    points[0].style.msTransform = "scaleV(1) translateY(0)";
    points[0].style.WebkitTransform = "scaleV(1) translateY(0)";
  };



  revealFirstPoint();
  revealSecondPoint();
  revealThirdPoint();
};
