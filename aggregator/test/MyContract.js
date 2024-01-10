import { assert } from "chai"
import pkg from 'hardhat';
const { ethers } = pkg;

describe("Oracle, Aggregator 테스트", function () {

    let accounts
    let myContract
    let mockAggregatorContract

    beforeEach(async function () { 
        accounts = await ethers.getSigners()
        myContract = await (await ethers.getContractFactory("MyContract")).deploy()
        mockAggregatorContract = await (await ethers.getContractFactory("MockAggregator")).deploy()
    })

    it("oracle price 얻기, agrregator 호출", async function(){
        let price = await myContract.getPriceByOracle(mockAggregatorContract.address)
        assert.equal(price, 53970922)
    })
})
