// При нажатии на кнопку меню открывается навигационное меню
$('#menu-button').click(function() {
     $(this).toggleClass('change');
     $('.nav-links').toggleClass('nav-open');
});

/* Если окно изменяет размер, и класс уже был применен,
то переключите его, чтобы избежать проблемы с исчезновением кнопки меню */
$(window).resize(function() {
     if ($(window).width() > 768) {
          console.log($(window).width());
          if ($('.nav-links').hasClass('nav-open')) {
               $('#menu-button').toggleClass('change');
               $('.nav-links').toggleClass('nav-open');
          }
     }
});
