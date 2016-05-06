var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
  var revealPoints = function(pointIndex) {
    points[pointIndex].style.opacity = 1;
    points[pointIndex].style.transform = "scaleX(1) translateY(0)";
    points[pointIndex].style.msTransform = "scaleX(1) translateY(0)";
    points[pointIndex].style.WebkitTransform = "scaleX(1) translateY(0)";
  };

  forEach(points, revealPoints);

};

window.onload = function() {
  if (window.innerHeight > 950) {
    animatePoints(pointsArray);
  }

  var sellingPoints = document.getElementsByClassName('selling-points')[0];
  var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

  window.addEventListener('scroll', function(e){
    if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
      animatePoints(pointsArray);
    }

  });

}
