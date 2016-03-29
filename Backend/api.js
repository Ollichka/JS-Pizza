/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);
    var pizza = "";
    order_info.pizza.forEach(function(item){
        pizza += 'Quantity:' + item.quantity+ ', ' + 'size:' + item.size + ',name ' + item.pizza.title + ', price of one: '+item.pizza[item.size].price;
    });
    var LIQPAY_PRIVATE_KEY='6jWQPz3ZilLP1GVT12hRTEX9KCQok7jPDU2C4btV';
    var LIQPAY_PUBLIC_KEY='i6622527582';
    var order = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: 1.00,
        currency: "UAH",
        description: "Опис транзакції:"+"\n Name: "+order_info.name + '\n Address: ' + order_info.address + '\n Phone:' + order_info.phone + '\n Pizza: ' + pizza,
        order_id: Math.random(),
        //!!!Важливо щоб було 1, бо інакше візьме гроші!!!
        sandbox: 1
    };
    var crypto = require('crypto');
    function sha1(string) {
        var sha1 = crypto.createHash('sha1');
        sha1.update(string);
        return sha1.digest('base64');
    }
    function base64(str) {
        return new Buffer(str).toString('base64');
    }
    var data = base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);


    res.send({
        success: true,
        data: data,
        signature:signature
    });
};

