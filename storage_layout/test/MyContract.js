import { assert } from "chai"
import pkg from 'hardhat';
import helpers from '@nomicfoundation/hardhat-network-helpers';
const { ethers } = pkg;

describe("StorageLayout, StorageLayout 테스트", function () {

    let accounts
    let StorageV1Contract_1
    let StorageV1Contract_2 
    let StorageV1Contract_3

    let StorageV2Contract_1
    let StorageV2Contract_2 

    beforeEach(async function () { 
        accounts = await ethers.getSigners()
        StorageV1Contract_1 = await (await ethers.getContractFactory("StorageV1_1")).deploy()
        StorageV1Contract_2 = await (await ethers.getContractFactory("StorageV1_2")).deploy()
        StorageV1Contract_3 = await (await ethers.getContractFactory("StorageV1_3")).deploy()

        StorageV2Contract_1 = await (await ethers.getContractFactory("StorageV2_1")).deploy()
        StorageV2Contract_2 = await (await ethers.getContractFactory("StorageV2_2")).deploy()
    })


    it("Storage V1 테스트", async function () {

        let slot0 = await helpers.getStorageAt(StorageV1Contract_1.address, 0);
        console.log("StorageV1 slot0: ", slot0)
        let slot1 = await helpers.getStorageAt(StorageV1Contract_1.address, 1);
        console.log("StorageV1 slot1: ", slot1)
        let slot2 = await helpers.getStorageAt(StorageV1Contract_1.address, 2);
        console.log("StorageV1 slot2: ", slot2)
        let slot3 = await helpers.getStorageAt(StorageV1Contract_1.address, 3);
        console.log("StorageV1 slot3: ", slot3)

        console.log("=====================================")

        slot0 = await helpers.getStorageAt(StorageV1Contract_2.address, 0);
        console.log("StorageV1 slot0: ", slot0)
        slot1 = await helpers.getStorageAt(StorageV1Contract_2.address, 1);
        console.log("StorageV1 slot1: ", slot1)
        slot2 = await helpers.getStorageAt(StorageV1Contract_2.address, 2);
        console.log("StorageV1 slot2: ", slot2)
        slot3 = await helpers.getStorageAt(StorageV1Contract_2.address, 3);
        console.log("StorageV1 slot3: ", slot3)

        console.log("=====================================")

        slot0 = await helpers.getStorageAt(StorageV1Contract_3.address, 0);
        console.log("StorageV1 slot0: ", slot0)
        slot1 = await helpers.getStorageAt(StorageV1Contract_3.address, 1);
        console.log("StorageV1 slot1: ", slot1)
        slot2 = await helpers.getStorageAt(StorageV1Contract_3.address, 2);
        console.log("StorageV1 slot2: ", slot2)
        slot3 = await helpers.getStorageAt(StorageV1Contract_3.address, 3);
        console.log("StorageV1 slot3: ", slot3)
    })

    it("Storage V2 테스트", async function () {

        let namespaceSlot0 = await helpers.getStorageAt(StorageV2Contract_1.address, '0x7e31fe5911f47edfe836974ff5c6ad9d9332d5b2c19560fb77e6c71ff44c8700');
        console.log("StorageV2 namespaceSlot0: ", namespaceSlot0)
        let namespaceSlot1 = await helpers.getStorageAt(StorageV2Contract_1.address, '0x7e31fe5911f47edfe836974ff5c6ad9d9332d5b2c19560fb77e6c71ff44c8701');
        console.log("StorageV2 namespaceSlot1: ", namespaceSlot1)
        let slot0 = await helpers.getStorageAt(StorageV2Contract_1.address, 0);
        console.log("StorageV2 slot0: ", slot0)

        console.log("=====================================")

        namespaceSlot0 = await helpers.getStorageAt(StorageV2Contract_2.address, '0x7e31fe5911f47edfe836974ff5c6ad9d9332d5b2c19560fb77e6c71ff44c8700');
        console.log("StorageV2 namespaceSlot0: ", namespaceSlot0)
        namespaceSlot1 = await helpers.getStorageAt(StorageV2Contract_2.address, '0x7e31fe5911f47edfe836974ff5c6ad9d9332d5b2c19560fb77e6c71ff44c8701');
        console.log("StorageV2 namespaceSlot1: ", namespaceSlot1)
        slot0 = await helpers.getStorageAt(StorageV2Contract_2.address, 0);
        console.log("StorageV2 slot0: ", slot0)

    })
})
