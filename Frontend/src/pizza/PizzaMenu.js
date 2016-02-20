/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $(".mainFramePizza");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
            console.log("button");
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

$('#meat').click(function(){
    filterPizza("meat");
});

$('#all').click(function(){
    filterPizza("all");
});

$('#pineapple').click(function(){
    filterPizza("pineapple");
});

$('#mushroom').click(function(){
    filterPizza("mushroom");
});

$('#ocean').click(function(){
    filterPizza("ocean");
});

$('#vega').click(function(){
    filterPizza("vega");
});


function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
    var num=0;
    var name = "";

    if(filter=='all'){ Pizza_List.forEach(function (pizza) {
        pizza_shown.push(pizza);
        num++;
        name = "Усі";
       });
    }

    if (filter == 'meat') {

        Pizza_List.forEach(function (pizza) {
            if (pizza.content.meat) {
                pizza_shown.push(pizza);
                num++;
                name = "М'ясні";
            }
        });
    }
    if(filter == 'pineapple') {
        Pizza_List.forEach(function (pizza) {
            if (pizza.content.pineapple) {
                pizza_shown.push(pizza);
                num++;
                name = "З ананасом";
            }
        });
    }
    if(filter == 'mushroom') {
        Pizza_List.forEach(function (pizza) {
            if (pizza.content.mushroom) {
                pizza_shown.push(pizza);
                num++;
                name = "З грибами";
            }
        });
    }
    if(filter == 'ocean') {
        Pizza_List.forEach(function (pizza) {
            if (pizza.content.ocean) {
                pizza_shown.push(pizza);
                num++;
                name = "З морепродуктами";
            }
        });
    }
    if(filter == 'vega')
        Pizza_List.forEach(function (pizza) {
            if(pizza.type==='Вега піца') {
                pizza_shown.push(pizza);
                num++;
                name = "Вега";
            }
        });
    $('.num').text(num);
    $('.filterName').text(name);

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List);

}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;