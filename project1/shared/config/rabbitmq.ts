import amqp, { Connection, Channel } from 'amqplib';

let connection: Connection;
let channel: Channel;

export const connectRabbitMQ = async (url: string): Promise<void> => {
  try {
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    
    console.log('✅ RabbitMQ connected successfully');
    
    // Create exchanges
    await channel.assertExchange('noafarin.events', 'topic', { durable: true });
    await channel.assertExchange('noafarin.notifications', 'fanout', { durable: true });
    
  } catch (error) {
    console.error('❌ RabbitMQ connection error:', error);
    throw error;
  }
};

export const getChannel = (): Channel => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
};

export const publishMessage = async (
  exchange: string,
  routingKey: string,
  message: any
): Promise<void> => {
  const ch = getChannel();
  ch.publish(
    exchange,
    routingKey,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
};

export const subscribeToQueue = async (
  queueName: string,
  callback: (msg: any) => void
): Promise<void> => {
  const ch = getChannel();
  await ch.assertQueue(queueName, { durable: true });
  
  ch.consume(queueName, (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      callback(content);
      ch.ack(msg);
    }
  });
};

export const closeRabbitMQ = async (): Promise<void> => {
  if (channel) await channel.close();
  if (connection) await connection.close();
  console.log('RabbitMQ connection closed');
};
