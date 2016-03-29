/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = require('../Storage');
var sum=0;
var ammount = 0;

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $(".pizzaOrder");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    //Приклад реалізації, можна робити будь-яким іншим способом
    if(!isPizzaInCart(pizza, size)) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
        sum += pizza[size].price;
        ++ammount;
    }else{
        var key = getKeyPizzaInCart(pizza, size);
        sum+=Cart[key].pizza[size].price;
        ++Cart[key].quantity;
        ++ammount;
        updateCart();
    }
    //Оновити вміст кошика на сторінці
    updateCart();
}

function getKeyPizzaInCart(pizza, size){
    var valid;
    $.each( Cart, function( key, value ) {
        if(Cart[key] != undefined) {
            if (value.pizza === pizza) {
                if (Cart[key].size == size) {
                    valid = key;
                }
            }
        }
    });
    return valid;
}


function isPizzaInCart(pizza, size){
    var valid = false;
    $.each(Cart, function (key, value) {
        if(Cart[key] != undefined) {
            if (value.pizza == pizza) {
                if (Cart[key].size == size) {
                    valid = true;
                }
            }
        }
    });

    return valid;
}

function removeFromCart(cart_item) {
//Видалити піцу з кошика
    var price = cart_item.pizza[cart_item.size].price*cart_item.quantity;
    sum-=price;
    ammount-=cart_item.quantity;
    var index = Cart.indexOf(cart_item);
    Cart.splice(index, 1);
//Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    var $node = $(".order");
    var $n = $(".summ");
    var saved_orders = Storage.get('cart');
    if(saved_orders) {
        Cart = saved_orders;
    }
    $.each(Cart, function (key, value) {
        if(Cart[key] != undefined) {
            sum += value['pizza'][value.size].price * value.quantity;
            ammount+= value.quantity;
        }

    });

    $node.find(".cl").click(function(){
        Cart=[];
        Storage.set("cart",Cart);
        sum=0;
        ammount=0;
        updateCart();
    });

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}


function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

                $node.find(".plus").click(function(){
                    //Збільшуємо кількість замовлених піц
                    cart_item.quantity += 1;
                    sum += cart_item.pizza[cart_item.size].price ;
                    ++ammount;
                    //Оновлюємо відображення
                    updateCart();
                });
                $node.find(".minus").click(function(){
                    if(cart_item.quantity===1){
                        removeFromCart(cart_item);
                    }else{
                        cart_item.quantity -= 1;
                        --ammount;
                        sum -= cart_item.pizza[cart_item.size].price;
                    }
                    //Оновлюємо відображення
                    updateCart();
                });

                $node.find(".delete").click(function(){
                    console.log("delete 1");
                    removeFromCart(cart_item,cart_item.id);
                    //Оновлюємо відображення
                    updateCart();
                });



        $cart.append($node);
    }
    var $n = $(".orderFrame");
    console.log(ammount);
    if(ammount===0){
        $n.find(".ord").hide();
    }else{
            $n.find(".ord").show();

    }

    Cart.forEach(showOnePizzaInCart);
    $(".c").text(sum);
    $(".num1").text(ammount);
    Storage.set('cart',Cart);

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;