const env = require('./config/env');
const amqp = require('amqplib');

async function connect() {
    try {
        return await amqp.connect('amqp://' + env.rabbitHost);
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
}

async function createChannel(connection) {
    try {
        return await connection.createChannel();
    } catch (error) {
        console.error('Error creating channel:', error);
    }
}

async function publishMessage(channel, message) {
    const queue = env.queueName

    await channel.assertQueue(queue)
    channel.sendToQueue(queue, Buffer.from(message))
}

async function connectAndPublish(message) {
    const connection = await connect();
    const channel = await createChannel(connection);

    await publishMessage(channel, message);

    await channel.close();
    await connection.close();
}

async function connectAndConsume() {
    const connection = await connect();
    const channel = await connection.createChannel();

    const queue = env.queueName;
    const queueM2 = env.queueNameM2;
    await channel.assertQueue(queue);

    channel.consume(queue, async (message) => {
        if (message !== null) {
            const jsonOrder = JSON.parse(message.content.toString());

            if (jsonOrder.status !== 'SUCCESS') {
                jsonOrder.status = 'SUCCESS'
                await channel.assertQueue(queueM2);
                await channel.sendToQueue(queueM2, Buffer.from(JSON.stringify(jsonOrder)));
                console.log(jsonOrder);
            }
            channel.ack(message);
        }
    });

    process.on('SIGINT', async () => {
        await channel.close();
        await connection.close();
        process.exit();
    });
}

async function getData(res, id) {
    const connection = await connect();
    const channel = await connection.createChannel();
    const queue = env.queueNameM2;

    await channel.assertQueue(queue);

    channel.consume(queue, async (message) => {
        if (message !== null) {
            const jsonOrder = JSON.parse(message.content.toString());

            if (jsonOrder.status === 'SUCCESS' && jsonOrder.id === id) {
                channel.ack(message);

                res.status(200).json({
                    data: jsonOrder
                });
                channel.close()
                connection.close()
            }
        }
    });
}


exports.connectAndPublish = connectAndPublish;
exports.connectAndConsume = connectAndConsume;
exports.getData = getData;
