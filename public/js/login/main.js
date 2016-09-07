(function($) {
    "use strict";

//Validaciónes (correo,contraseña)
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


    //  Bind the event handler to the "submit" JavaScript event
    $('#user-register').click(function () {

        // Get the Login Name value and trim it
        var email = $.trim($('#reg_email').val());

        // Check if empty of not
        if (!validateEmail(email)) return false;
        if ($('#user_password').val() !== ($('#user_password_confirm').val())) return false;
        if ($('#user_username').val().length < 5 || ($('#user_username').val().length > 15)) return false;
        return true;

    });






})(jQuery);
