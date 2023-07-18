import { assert } from "chai"
import { keccak256 } from "ethereumjs-util"
import pkg from 'hardhat';
const { ethers } = pkg;

describe("Fallback, receive 테스트", function () {

    let accounts
    let myContract
    let fallbackEvent
    let receiveEvent
    let setDataFunc

    beforeEach(async function () { 
        accounts = await ethers.getSigners()
        myContract = await (await ethers.getContractFactory("MyContract")).deploy()

        fallbackEvent = getEventSignature("FallbackLog", ["string"])
        receiveEvent = getEventSignature("ReceiveLog", ["string"])
        setDataFunc = getFuncSignature("setData", [""])
    })

    it("없는 함수 호출, fallback 호출", async function(){
        let nonFunctionContract = (await ethers.getContractFactory("NonFunction")).attach(myContract.address)

        let tx = await nonFunctionContract.setData()
        let receipt = await tx.wait()

        // 콜 데이터 검증(setData함수)
        assert.equal(tx.data, setDataFunc)

        // 이벤트 검증
        assert.equal(receipt.events[0].topics[0], fallbackEvent)
    })


    it("calldata 존재, fallback 호출", async function(){
        const calldata = "0x012345"
        let tx = await accounts[0].sendTransaction({
            to: myContract.address,
            value: 10,
            data: calldata
        })
        let receipt = await tx.wait()

        assert.equal(receipt.logs[0].topics[0], fallbackEvent)
    })

    it("calldata 비 존재, receive 호출", async function(){
        let tx = await accounts[0].sendTransaction({
            to: myContract.address,
            value: 10,
        })
        let receipt = await tx.wait()

        assert.equal(receipt.logs[0].topics[0], receiveEvent)
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
