const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // W is capitalized

const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require ('../compile');

let accounts;
let inbox;

beforeEach(async() => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: ['Hi, there!']})
        .send({from: accounts[0], gas: '1000000'})

});

describe('Inbox', () => {
    it('deploys a contract', () => {
        console.log(inbox);
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi, there!');
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('msg updated!').send({from: accounts[0]})
        const message = await inbox.methods.message().call();
        assert.equal(message, 'msg updated!');
    });
});

/*
class Car {
    pack() {
        return 'stopped';
    }

    drive() {
        return 'vroom';
    }
}

let car;
beforeEach(() => {
    car = new Car();
});

describe('Car',() => {
    it('can park', () => {
        assert.equal(car.pack(), 'stopped');
    });
    it('can drive', () => {
        assert.equal(car.drive(), 'vroom');
    });
});*/
