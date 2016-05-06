var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
  var revealPoints = function(point) {
    points[point].style.opacity = 1;
    points[point].style.transform = "scaleX(1) translateY(0)";
    points[point].style.msTransform = "scaleX(1) translateY(0)";
    points[point].style.WebkitTransform = "scaleX(1) translateY(0)";
  };

  for (var i = 0; i < points.length; ++i){
    revealPoints(i);
  }
};

window.onload = function() {
  if (window.innerHeight > 950) {
    animatePoints(pointsArray);
  }

  var sellingPoints = document.getElementsByClassName('selling-points')[0];
  var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

  window.addEventListener('scroll', function(e){
    console.log("documentElement.scrollTop: " + document.documentElement.scrollTop);
    console.log("body.scrollTop           : " + document.body.scrollTop);
    if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
      animatePoints(pointsArray);
    }

  });

}
