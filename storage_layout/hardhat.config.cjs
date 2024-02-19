require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },  
   },
  solidity: {    
    compilers: [
      {
        version: "0.8.20",
        settings: {
          evmVersion: "shanghai",
        },
      },
    ], 
  },
};
