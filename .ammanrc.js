const LOCALHOST = "http://localhost:8899";
const WSLOCALHOST = "ws://localhost:8900/";

module.exports = {
  validator: {
    killRunningValidators: true,
    programs: [
    ],
    jsonRpcUrl: LOCALHOST,
    websocketUrl: WSLOCALHOST,
    commitment: 'singleGossip',
    ledgerDir: '.anchor/ledger',
    resetLedger: true,
    verifyFees: false,
    detached: true,
  },
  relay: {
    enabled: process.env.CI == null,
    killlRunningRelay: true,
  },
  storage: {
    enabled: process.env.CI == null,
    storageId: 'mock-storage',
    clearOnStart: true,
  },
}

function localDeployPath(program) {
  switch(program) {
    default:
      throw new Error(`Unknown program ${program}`);
  }
}