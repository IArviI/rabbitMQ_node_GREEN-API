const rabbit = require("./rabbit");

async function startOrderProcessor(orderId) {

    await rabbit.connectAndConsume()

    console.log('M2 order processor is running');
}

startOrderProcessor().then(_ => {});


