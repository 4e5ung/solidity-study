import { expect, assert } from "chai"

import pkg from 'hardhat';
const { ethers } = pkg;

describe("ecdsa transaction verify 테스트", function () {

    const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    const toAccount = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

    let accounts
    let formattedNonce
    let chainId
    let gasPrice

    before(async function () { 
        // sign accounts list
        accounts = await ethers.getSigners()
    })    

    beforeEach(async function () { 
        // sign accounts list
        accounts = await ethers.getSigners()

        const nonce = await accounts[0].getTransactionCount()
        formattedNonce = nonce === 0 ? "0x" : ethers.utils.hexlify(nonce)
        chainId = (await ethers.provider.getNetwork()).chainId
        gasPrice = await ethers.provider.getGasPrice()
    })    

    it("트랜잭션 전송(EIP-155 제외)", async function(){   
        // 1. [nonce, gasPrice, gasLimit, to, value, data]의 6개 필드를 포함하는 트랜잭션 데이터 구조 생성한다
        const transactionData = {
            nonce: formattedNonce,
            gasPrice: 875000000,
            gasLimit: 21000,
            to: toAccount,
            value: 10,
            data: "0x"
        };
        
        // 2. RLP로 인코딩된 트랜잭션 데이터 구조의 시리얼라이즈된 메시지를 생성한다
        const rlpData = [
            transactionData.nonce,
            ethers.utils.hexlify(transactionData.gasPrice),
            ethers.utils.hexlify(transactionData.gasLimit),
            ethers.utils.hexlify(transactionData.to),
            ethers.utils.hexlify(transactionData.value),
            transactionData.data
        ];
        const serializeData = ethers.utils.RLP.encode(rlpData);

        // serializeTransaction 함수를 통해서도 가능
        const serializeData2 = ethers.utils.serializeTransaction(transactionData);
        assert.equal(serializeData, serializeData2)


        // 3. 시리얼라이즈된 메시지의 Keccak-256 해시를 계산한다
        const digest = ethers.utils.keccak256(serializeData);

        // 4. EOA의 개인키로 해시에 서명하여 ECDSA 서명을 계산
        const signingKey = new ethers.utils.SigningKey(privateKey);
        const signature = signingKey.signDigest(digest);

        // 5.  ECDSA 서명의 계산된 v, r, s 값을 트랜잭션에 추가        
        const { v, r, s } = ethers.utils.splitSignature(signature);
        const signRlpData = [
            ethers.utils.hexlify(transactionData.nonce),
            ethers.utils.hexlify(transactionData.gasPrice),
            ethers.utils.hexlify(transactionData.gasLimit),
            transactionData.to,
            ethers.utils.hexlify(transactionData.value),
            transactionData.data,
            ethers.utils.hexlify(v),
            r,
            s
        ];

        // 6. 서명이 추가된 트랜잭션 데이터를 RLP 인코딩해 시리얼라이즈하여 전송한다.
        const signData= ethers.utils.RLP.encode(signRlpData);
        
        // 7. 트랜잭션 전송
        const sentTransaction = await ethers.provider.sendTransaction(signData);

        // 서명 검증
        expect(await signVerify(sentTransaction.hash)).equals(true)
    })

    it("트랜잭션 전송(EIP-155 제외) - signTransaction 이용", async function(){
        // 1. [nonce, gasPrice, gasLimit, to, value, data]의 6개 필드를 포함하는 트랜잭션 데이터 구조 생성한다
        const transactionData = {
            nonce: formattedNonce,
            gasPrice: 875000000,
            gasLimit: 21000,
            to: toAccount,
            value: 10,
            data: "0x"
        };

        // 2, 3, 4, 5, 6 = > 트랜잭션 서명
        const wallet = new ethers.Wallet(privateKey);
        const signedTransaction = await wallet.signTransaction(transactionData);        
   
        
        // 7. 트랜잭션 전송
        const sentTransaction = await ethers.provider.sendTransaction(signedTransaction);

        // 서명 검증
        expect(await signVerify(sentTransaction.hash)).equals(true)
    })

    it("트랜잭션 전송(EIP-155)", async function(){
        // 1. [nonce, gasPrice, gasLimit, to, value, data, chainId, 0, 0]의 9개 필드를 포함하는 트랜잭션 데이터 구조 생성한다
        const transactionData = {
            nonce: formattedNonce,
            gasPrice: gasPrice,
            gasLimit: 30000000,
            to: toAccount,
            value: 10,
            data: "0x",
            chainId: chainId
        };


        // 2. RLP로 인코딩된 트랜잭션 데이터 구조의 시리얼라이즈된 메시지를 생성한다
        const rlpData = [
            transactionData.nonce,
            ethers.utils.hexlify(transactionData.gasPrice),
            ethers.utils.hexlify(transactionData.gasLimit),
            ethers.utils.hexlify(transactionData.to),
            ethers.utils.hexlify(transactionData.value),
            transactionData.data,
            ethers.utils.hexlify(transactionData.chainId),
            "0x",
            "0x"
        ];
        const serializeData = ethers.utils.RLP.encode(rlpData);

        // serializeTransaction 함수를 통해서도 가능
        const serializeData2 = ethers.utils.serializeTransaction(transactionData);
        assert.equal(serializeData, serializeData2)


        // 3. 시리얼라이즈된 메시지의 Keccak-256 해시를 계산한다
        const digest = ethers.utils.keccak256(serializeData);

        // 4. EOA의 개인키로 해시에 서명하여 ECDSA 서명을 계산
        const signingKey = new ethers.utils.SigningKey(privateKey);
        const signature = signingKey.signDigest(digest);
        

        // 5.  ECDSA 서명의 계산된 v, r, s 값을 트랜잭션에 추가        
        const { r, s } = ethers.utils.splitSignature(signature);

        const signRlpData = [
            ethers.utils.hexlify(transactionData.nonce),
            ethers.utils.hexlify(transactionData.gasPrice),
            ethers.utils.hexlify(transactionData.gasLimit),
            transactionData.to,
            ethers.utils.hexlify(transactionData.value),
            transactionData.data,
            ethers.utils.hexlify(transactionData.chainId*2+(35+signature.recoveryParam)),
            r,
            s
        ];

        // 6. 서명이 추가된 트랜잭션 데이터를 RLP 인코딩해 시리얼라이즈하여 전송한다.
        const signData= ethers.utils.RLP.encode(signRlpData);

       
        // 7. 트랜잭션 전송
        const sentTransaction = await ethers.provider.sendTransaction(signData);


        // 서명 검증
        expect(await signVerify_EIP155(sentTransaction.hash)).equals(true)
    })

    it("트랜잭션 전송(EIP-155) - signTransaction 이용", async function(){   
        // 1. [nonce, gasPrice, gasLimit, to, value, data, chainId, 0, 0]의 9개 필드를 포함하는 트랜잭션 데이터 구조 생성한다
        const transactionData = {
            nonce: formattedNonce,
            gasPrice: gasPrice,
            gasLimit: 30000000,
            to: toAccount,
            value: 10,
            data: "0x",
            chainId: chainId
        };

        // 2, 3, 4, 5, 6 = > 트랜잭션 서명
        const wallet = new ethers.Wallet(privateKey);
        const signedTransaction = await wallet.signTransaction(transactionData);      
        
        // 7. 트랜잭션 전송
        const sentTransaction = await ethers.provider.sendTransaction(signedTransaction);

        // 서명 검증
        expect(await signVerify_EIP155(sentTransaction.hash)).equals(true)
    })    

    async function signVerify(transactionHash){
        // 1. 트랜잭션 데이터를 갖고온다.
        const transaction = await ethers.provider.getTransaction(transactionHash);

        // 2. 트랜잭션내에 서명값을 추출한다.(r, s) (v도 추출)
        const v = ethers.utils.hexStripZeros(transaction.v);
        const r = ethers.utils.hexZeroPad(transaction.r, 32);
        const s = ethers.utils.hexZeroPad(transaction.s, 32);

        // 3. RLP로 인코딩된 트랜잭션 데이터 구조의 시리얼라이즈된 메시지를 생성한다.
        const nonce = transaction.nonce === 0 ? "0x" : ethers.utils.hexlify(transaction.nonce)
        const rlpData = [
            nonce,
            ethers.utils.hexlify(transaction.gasPrice),
            ethers.utils.hexlify(transaction.gasLimit),
            ethers.utils.hexlify(transaction.to),
            ethers.utils.hexlify(transaction.value),
            transaction.data
        ];
        const signData = ethers.utils.RLP.encode(rlpData);

        // 4. 시리얼라이즈된 메시지의 Keccak-256 해시를 계산한다.
        const messageHash = ethers.utils.keccak256(signData);

        // 5. ECDSA 서명의 계산된 v, r, s 을 통해 서명 공개키를 복구한다.
        const pubKey = ethers.utils.recoverPublicKey(messageHash, { v, r, s });
        
        // 6. 서명 공개키의 이더리움 주소를 얻은 후 개인키에 상응하는 공개키랑 비교한다.
        const signerAddress = ethers.utils.computeAddress(pubKey);   

        if( transaction.from == signerAddress )
            return true       
        
        return false;
    }

    async function signVerify_EIP155(transactionHash){
        // 1. 트랜잭션 데이터를 갖고온다.
        const transaction = await ethers.provider.getTransaction(transactionHash);

        // 2. 트랜잭션내에 서명값을 추출한다.(r, s) (v도 추출)
        const v = ethers.utils.hexStripZeros(transaction.v);
        const r = ethers.utils.hexZeroPad(transaction.r, 32);
        const s = ethers.utils.hexZeroPad(transaction.s, 32);

        // joinSignature 함수를 통해서도 가능 
        const expandedSig = {
            r: transaction.r,
            s: transaction.s,
            v: transaction.v
            };
        // recoverPublicKey(messageHash, signature)
        const signature = ethers.utils.joinSignature(expandedSig);

        // 3. RLP로 인코딩된 트랜잭션 데이터 구조의 시리얼라이즈된 메시지를 생성한다.
        const nonce = transaction.nonce === 0 ? "0x" : ethers.utils.hexlify(transaction.nonce)
        const rlpData = [
            nonce,
            ethers.utils.hexlify(transaction.gasPrice),
            ethers.utils.hexlify(transaction.gasLimit),
            ethers.utils.hexlify(transaction.to),
            ethers.utils.hexlify(transaction.value),
            transaction.data,
            ethers.utils.hexlify(transaction.chainId),
            "0x",
            "0x"
        ];
        const signData = ethers.utils.RLP.encode(rlpData);
        

        // 4. 시리얼라이즈된 메시지의 Keccak-256 해시를 계산한다.
        const messageHash = ethers.utils.keccak256(signData);

        // 5. ECDSA 서명의 계산된 v, r, s 을 통해 서명 공개키를 복구한다.
        const pubKey = ethers.utils.recoverPublicKey(messageHash, { v, r, s });
        
        // 6. 서명 공개키의 이더리움 주소를 얻은 후 개인키에 상응하는 공개키랑 비교한다.
        const signerAddress = ethers.utils.computeAddress(pubKey);   

        if( transaction.from == signerAddress )
            return true       
        
        return false;
    }

})
