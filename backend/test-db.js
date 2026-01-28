const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/onlyfarmers';

console.log('Testing MongoDB connection...');
console.log('MongoDB URI:', MONGO_URI);

mongoose.connect(MONGO_URI, { 
  autoIndex: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 30000
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  
  // Test a simple operation
  const testSchema = new mongoose.Schema({
    name: String,
    email: String
  });
  
  const TestModel = mongoose.model('Test', testSchema);
  
  // Try to create a test document
  const testDoc = new TestModel({
    name: 'Test User',
    email: 'test@example.com'
  });
  
  return testDoc.save();
})
.then((savedDoc) => {
  console.log('✅ Test document saved:', savedDoc);
  
  // Clean up
  return mongoose.connection.db.collection('tests').deleteOne({ _id: savedDoc._id });
})
.then(() => {
  console.log('✅ Test document cleaned up');
  process.exit(0);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
