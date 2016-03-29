/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');

    var API = require('./API');
    API.getPizzaList(function(err,pizza_list){
        if(err) return console.error(err);
   console.log("Pizza List",pizza_list);
    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();
    })

    $(".ord").click(function(){

        window.location = "/order.html";
    })

    $(".edit").click(function(){
        window.location = "/";
    })



});