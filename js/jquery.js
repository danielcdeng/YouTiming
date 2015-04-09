// Safe jQuery code
(function(global, $) {
    $(document).ready(function() {
        $('#menu-wrap').prepend('<div id="menu-trigger">Menu</div>');
        $('#menu-trigger').on('click', function() {
            $('#menu').slideToggle();
        });
        $(global).resize(function() {
            var size = {
                width: global.innerWidth || document.body.clientWidth,
                //height: window.innerHeight || document.body.clientHeight
            }
            if(size.width > 700) {
                $('#menu').show();
            }
            else {
                $('#menu').hide();
            }
        });
    });
}(window, jQuery));