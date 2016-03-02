var nameValidate = false;
var phoneValidate = false;
var addressValidate =false;
var API = require('../API');
var PizzaCart = require('./PizzaCart');
var GoogleMap = require('./GoogleMap');

$('#inputName.form-control').keyup(function(){
    console.log("hbjn");
    var name = $('#inputName').val();
    if(name!='') {
        if (!isStringWithLetter(name)) {
            $('.name-help-block').css("display", "inline");
            $('.name-group').addClass('has-error');
            $('.name-help-block').addClass('danger');
            nameValidate = false;
        }else{
            $('.name-group').removeClass('has-error');
            $('.name-group').addClass('has-success');
            $('.name-help-block').css("display", "none");
            nameValidate = true;
        }
    }
});

function isStringWithLetter(str){
    var res = true;
    for(var i= 0; i<str.length; i++){
        if(!isLetter(str.charAt(i))&&str.charAt(i)!=' '){
            res = false;
        }
    }
    return res;
}



function isLetter(ch){
    return ch.toLowerCase() != ch.toUpperCase();
}



$('#inputPhone').keyup(function() {
    var phone = $('#inputPhone').val();
    if (!hasStarted(phone)||!lengthPhone(phone)||!isOnlyNumber(phone)) {
        $('.phone-help-block').css("display", "inline");
        $('.phone-group').addClass('has-error');
        $('.phone-help-block').addClass('danger');
        phoneValidate = false;
    }else{
        $('.phone-group').removeClass('has-error');
        $('.phone-group').addClass('has-success');
        $('.phone-help-block').css("display", "none");
        phoneValidate = true;
    }

});

function isOnlyNumber(str){
    var res = true;
    for(var i= 0; i<str.length; i++){
        if(isLetter(str.charAt(i))){
            res = false;
        }

    }
    return res;
}

function hasStarted(phone){
    var res = false;
    if(phone[0]==0){
        res = true;
    }else{
        if(phone[0]=='+' && phone[1]==3 && phone[2]==8 && phone[3]==0){
            res = true;
        }
    }

    return res;
}

function lengthPhone(phone){
    var res = false;
    if(phone[0]==0){
        if(phone.length == 10){
            res = true;
        }
    }else{
        if(phone.length == 13){
            res = true;
        }
    }

    return res;
}

var makeDelay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

function setValidateAddressTrue(){
    addressValidate = true;
    $('.address-group').addClass('has-success');
}

$('#inputAdress').keyup(function(){
    makeDelay(function(){
        GoogleMap.geocodeAddress($('#inputAdress').val(), function (err, coordinates) {
            if (!err) {
                $(".order-summery-adress").html('<b>Адреса доставки:</b> '+$('#inputAdress').val());
                $('.address-group').addClass('has-success');
                addressValidate = true;
                GoogleMap.calculateRoute(GoogleMap.pointPizza, coordinates);
            } else {
                console.log("Немає адреси");
            }
        });
    },5000);
});

$('.next-step-button').click(function(){
    if(nameValidate&&phoneValidate&&addressValidate&&PizzaCart.getPizzaInCart().length!=0){
        API.createOrder({
            name: $('#inputName').val(),
            phone: $('#inputPhone').val(),
            address: $('#inputAdress').val(),
            pizza: PizzaCart.getPizzaInCart()
        }, function(err, result) {
            if (err) {
                alert("Can't create order");
            } else {
                LiqPayCheckout.init({
                    data: result.data,
                    signature: result.signature,
                    embedTo: "#liqpay",
                    mode: "popup"
                }).on("liqpay.callback", function (data) {
                    console.log(data.status);
                    console.log(data);
                }).on("liqpay.ready", function (data) {

                }).on("liqpay.close", function (data) {

                });
            }
        });
    }
});

exports.setValidateAddressTrue = setValidateAddressTrue;