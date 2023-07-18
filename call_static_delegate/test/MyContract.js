import { assert } from "chai"
import { keccak256 } from "ethereumjs-util"
import pkg from 'hardhat';
const { ethers } = pkg;

describe("call, static, delegate 테스트", function () {

    let accounts
    let myContract
    let callContract
    
    beforeEach(async function () { 
        accounts = await ethers.getSigners()

        callContract = await (await ethers.getContractFactory("CallContract")).deploy()
        myContract = await (await ethers.getContractFactory("MyContract")).deploy()
    })

    it("static call 함수 호출, msg.sender 확인", async function(){
        let sender = await myContract.callStatic.getSenderByStaticCall(callContract.address)

        // myContract address
        assert.equal(sender, myContract.address)
    })

    it("static call 함수 호출, 데이터 확인", async function(){
        await callContract.setValue(1)
        // call contract data 확인
        let value = await myContract.getValueByStaticCall(callContract.address)
        assert.equal(value, 1)

        // myContract data 값 읽지 않음
        await myContract.setValue(2)
        value = await myContract.getValueByStaticCall(callContract.address)
        assert.notEqual(value, 2)
    })

    it("delegate call 함수 호출, msg.sender 확인", async function(){
        let sender = await myContract.callStatic.getSenderByDelegateCall(callContract.address)

        // owner address
        assert.equal(sender, accounts[0].address)
    })

    it("delegate call 함수 호출, 데이터 확인", async function(){
        await myContract.setValueByDelegateCall(callContract.address, 1)

        // callContract에 저장하지 않음
        let value = await callContract.getValue()
        assert.notEqual(value, 1)

        // myContract에 저장
        value = await myContract.getValue()
        assert.equal(value, 1)
    })

    it("call 함수 호출, msg.sender 확인", async function(){
        let sender = await myContract.getSenderByCall(callContract.address)

        // mycontract address
        assert.equal(sender, myContract.address)
    })

    it("call 함수 호출, 데이터 확인", async function(){
        await myContract.setValueByCall(callContract.address, 1)

        // callContract에 저장
        let value = await callContract.getValue()
        assert.equal(value, 1)

        // myContract에 저장되지 않음
        value = await myContract.getValue()
        assert.notEqual(value, 1)
    })

    // 이벤트 signature 생성
    function getEventSignature(eventName, parameterTypes) {
        const types = parameterTypes.join(",")
        return "0x" + keccak256(Buffer.from(`${eventName}(${types})`))
        .toString("hex")
    }

    // 함수 signature 생성
    function getFuncSignature(eventName, parameterTypes) {
        const types = parameterTypes.join(",")
        return "0x" + keccak256(Buffer.from(`${eventName}(${types})`))
        .toString("hex")
        .slice(0, 8)
    }
})
