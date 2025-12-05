const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = 'mongodb://admin:admin123@localhost:27017/noafarin?authSource=admin';

async function check() {
  await mongoose.connect(MONGODB_URI);
  
  const users = await mongoose.connection.db.collection('users').find({
    email: { 
      $in: [
        'ali.mohammadi@znu.ac.ir',
        'zahra.hosseini@znu.ac.ir',
        'reza.ahmadi@gmail.com',
        'maryam.karimi@znu.ac.ir',
        'hossein.rezaei@gmail.com',
        'fatemeh.nazari@znu.ac.ir',
        'mohammad.jafari@gmail.com',
        'sara.moradi@znu.ac.ir',
        'amir.kazemi@gmail.com',
        'narges.bahrami@znu.ac.ir'
      ]
    }
  }).toArray();
  
  console.log('Found', users.length, 'Zanjani users:');
  users.forEach(u => {
    console.log(`- ${u.firstName} ${u.lastName} (${u.email}) - ID: ${u._id} - ${u.role?.join(', ')}`);
  });
  
  await mongoose.disconnect();
}

check();
