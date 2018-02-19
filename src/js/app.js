$(function(){
  var navbar = $(".site-navigation nav");
  var dropdowns = $(".site-navigation nav .dd");
  $(".open-menu").click(function(e){
    e.preventDefault();
    navbar.toggleClass("open");
  });

  dropdowns.click(function(){
    $(this).toggleClass("open");
  });

  $(window).resize(function() {
    if(window.innerWidth > 1000) {
      navbar.removeClass("open");
      dropdowns.removeClass("open");
    }
  });

  $(".hero-rotator").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 2000
  });
});