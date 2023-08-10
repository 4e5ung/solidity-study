// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract MyContract {

    mapping(uint256 => bool) usedNonces;
    uint256 private chainId;
    address private signVerifier;

    uint256 public values;

    constructor(address _signVerifier, uint256 _chainId){
        chainId = _chainId;
        signVerifier = _signVerifier;
    }

    function setValues(uint256 _values, uint256 _nonce, bytes memory _sig) external { 
        require(!usedNonces[_nonce], "Signature Has Already Been Used");
        usedNonces[_nonce] = true;

        bytes32 message = prefixed(keccak256(abi.encodePacked(msg.sender, _values, _nonce, chainId, this)));
        require(recoverSigner(message, _sig) == signVerifier, "Invalid Signature");
        values = _values;
    }

    function recoverSigner(bytes32 message, bytes memory sig)
        public
        pure
        returns (address)
        {
        uint8 v;
        bytes32 r;
        bytes32 s;
        (v, r, s) = splitSignature(sig);
        return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (uint8, bytes32, bytes32)
        {
        require(sig.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }
    
        return (v, r, s);
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
}
