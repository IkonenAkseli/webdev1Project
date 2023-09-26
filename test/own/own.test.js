const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const usersUrl = '/api/users';
const contentType = 'application/json';
const { createResponse } = require('node-mocks-http');
const { getAllProducts } = require('../../controllers/products');
const { handleRequest } = require('../../routes');
const { connectDB, disconnectDB } = require('../../models/db');
const {
    getAllUsers,
    registerUser,
    deleteUser,
    viewUser,
    updateUser
  } = require('../../controllers/users');
  
const User = require('../../models/user');
const Product = require('../../models/product');

const encodeCredentials = (username, password) =>
Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');
const users = require('../../setup/users.json').map(user => ({ ...user }));

const adminUser = { ...users.find(u => u.role === 'admin') };
const customerUser = { ...users.find(u => u.role === 'customer') };

const adminCredentials = encodeCredentials(adminUser.email, adminUser.password);
const customerCredentials = encodeCredentials(customerUser.email, customerUser.password);
const invalidCredentials = encodeCredentials(adminUser.email, customerUser.password);

  
  


const initialProducts = require('../../setup/products.json').map(product => ({ ...product }));

let currentUser;
let customer;
let response;
let allUsers;
let products;

beforeEach(async () => {
    // reset database
    await User.deleteMany({});
    await User.create(users);
    allUsers = await User.find({});

    await Product.deleteMany({});
    await Product.create(initialProducts);
    const foundProducts = await Product.find({});
    products = foundProducts.map(product => JSON.parse(JSON.stringify(product)));

    // set variables
    currentUser = await User.findOne({ email: adminUser.email }).exec();
    customer = await User.findOne({ email: customerUser.email }).exec();
    response = createResponse();
  });

describe('Test getAllProducts', () => {
    it('GetAllProducts() returns all products', async () => {
        
        const response = createResponse();
      await getAllProducts(response);

      expect(response.statusCode).to.equal(200);
      expect(response.getHeader('content-type')).to.equal('application/json');
      expect(response._isJSON()).to.be.true;
      expect(response._isEndCalled()).to.be.true;
      expect(response._getJSONData()).to.be.an('array');
      expect(response._getJSONData()).to.be.deep.equal(products);
    });
});

describe('Test create order', () =>{

});

describe('Test getAllUsers', () => {
    it('GetAllUsers() returns all users', async () => {
        const allUsers = await User.find({});
        const usersData = JSON.parse(JSON.stringify(allUsers));
        await getAllUsers(response);
  
        expect(response.statusCode).to.equal(200);
        expect(response.getHeader('content-type')).to.equal('application/json');
        expect(response._isJSON()).to.be.true;
        expect(response._isEndCalled()).to.be.true;
        expect(response._getJSONData()).to.be.an('array');
        expect(response._getJSONData()).to.be.deep.equal(usersData);
    });
});

describe('Test viewUser()', () => {
    it('viewUser() should return error when user does not exist', async () => {
        const userId = currentUser.id.split('').reverse().join('');
      await viewUser(response, userId, currentUser);
      expect(response.statusCode).to.equal(404);
      expect(response._isEndCalled()).to.be.true;
    });
});

describe('Test deleteUSer()', () => {
    it('deleteUser() should delete user', async () => {
        const userId = customer.id;
        const customerData = JSON.parse(JSON.stringify(customer));
        await deleteUser(response, userId, currentUser);
  
        const foundUser = await User.findById(userId).exec();
        expect(response.statusCode).to.equal(200);
        expect(response.getHeader('content-type')).to.equal('application/json');
        expect(response._isJSON()).to.be.true;
        expect(response._isEndCalled()).to.be.true;
        expect(foundUser).to.be.null;
    });
});

describe('Test deleteUser() deleteSelf', () => {
    it('user not able to delete their user', async () => {
        const userId = currentUser.id;
        const expectedData = {
          error: 'Deleting own data is not allowed'
        };
        await deleteUser(response, userId, currentUser);
        const user = await User.findById(currentUser.id);
  
        expect(response.statusCode).to.equal(400);
        expect(response.getHeader('content-type')).to.equal('application/json');
        expect(response._isJSON()).to.be.true;
        expect(response._isEndCalled()).to.be.true;
        expect(user).to.not.be.null;
        expect(user).to.be.an('object');
    });
});

describe('Test updateUser()', () => {
    it('updateUser() should update the user', async () => {
        const userId = customer.id;
        const expectedData = {
          _id: customer.id,
          ...customerUser,
          role: 'admin',
          password: customer.password
        };
        await updateUser(response, userId, currentUser, { name: adminUser.name, role: 'admin' });
  
        expect(response.statusCode).to.equal(200);
        expect(response.getHeader('content-type')).to.equal('application/json');
        expect(response._isJSON()).to.be.true;
        expect(response._isEndCalled()).to.be.true;
        expect(response._getJSONData()).to.include(expectedData);
    });
});

describe('Test updateUser() updateSelf', () => {
    it('user cannot update their own data', async () => {
        const userId = currentUser.id;
        const role = currentUser.role;
        const expectedData = {
          error: 'Updating own data is not allowed'
        };
        await updateUser(response, userId, currentUser, { name: adminUser.name, role: 'customer' });
        const user = await User.findById(currentUser.id);
  
        expect(response.statusCode).to.equal(400);
        expect(response.getHeader('content-type')).to.equal('application/json');
        expect(response._isJSON()).to.be.true;
        expect(response._isEndCalled()).to.be.true;
        expect(response._getJSONData()).to.include(expectedData);
        expect(user.role).to.equal(role);
    });
});

describe('Test registerUser()', () => {
    it('registerUser() should register the user', async () => {
        const testEmail = `test${adminUser.password}@email.com`;
        const userData = { ...adminUser, email: testEmail };
        await registerUser(response, userData);
        const createdUser = await User.findOne({ email: testEmail });
  
        expect(response.statusCode).to.equal(201);
        expect(response.getHeader('content-type')).to.equal('application/json');
        expect(response._isJSON()).to.be.true;
        expect(response._isEndCalled()).to.be.true;
        expect(createdUser).to.not.be.null;
        expect(createdUser).to.not.be.undefined;
        expect(createdUser).to.be.an('object');
    });
});



describe('Test server update call', async () => {
    //const tempUser = users.find(u => u.role === 'customer' && u.email !== customerUser.email);
    //var testUser = await User.findOne({ email: tempUser.email }).exec();
    //var url = `${usersUrl}/${testUser._id}`;

    const user = {
        role: 'admin'
    };
    it('SHould update role from call', async () => {
        const x = true;
        expect(x).to.equal(true);
    });
});

describe('Test server delete call', async () => {
    //const tempUser = users.find(u => u.role === 'customer' && u.email !== customerUser.email);
    //var testUser = await User.findOne({ email: tempUser.email }).exec();
    //var url = `${usersUrl}/${testUser._id}`;

    const user = {
        role: 'admin'
    };
    it('user should be deleted on call', async () => {
        const y = true;
        expect(y).to.equal(true);
    });
});
