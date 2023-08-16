const rabbit = require('../../rabbit');

async function controller(req, res) {
    try {
        const order = req.body;

        if (order && order.hasOwnProperty('id') && order.hasOwnProperty('status')) {
            const order = req.body;
            rabbit.connectAndPublish(JSON.stringify(order)).then(_ => {
                rabbit.getData(res, order.id)
            })
        } else {
            res.status(400).json({
                message: 'You didn\'t specify the required id and status parameters'
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

exports.controller = controller;
