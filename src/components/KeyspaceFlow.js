import React from "react";
import KeySpace from "../lib/keyspace";
import { ethers } from "ethers";
import { Heading, Text, TextInput, Button } from "grommet";

const getSigner = () => (new ethers.providers.Web3Provider(window.ethereum).getSigner());

let signer;
let keySpace;

const defaultCallback = res => {
  debugger
  console.log(res);
}

const messageToSign = "test meeeee";

class App extends React.Component {
  state = {
    stage: "initial"
  };
  async init() {
    await window.ethereum.enable();
    this.setState({ stage: 'web3Enabled' })
    signer = getSigner()
    keySpace = new KeySpace({
      signer,
      onRequestSignedSeed: (unsignedSeed) => {
        this.setState({
          unsignedSeed,
          stage: 'waitingForSeedSignature'
        })
      },
      onGeneratedSignedSeed: (signedSeed) => {
        this.setState({
          signedSeed,
          stage: 'seedSigned'
        })
      },
      onRequestPGPKeyPair: (pgpKeyPairAccount) => {
        debugger
        this.setState({
          stage: 'waitingPGPPairSignature'
        })
      },
      onGeneratedPGPKeyPair: (pgpKey) => {
        debugger
        this.setState({
          stage: 'pgpPairGenerated'
        })
      },
    });
    const walletAddress = (await signer.getAddress()).toLowerCase();
    await keySpace.setUpPGP();
    // console.log(messageToSign);
    const signedMessage = await keySpace.sign(messageToSign);
    console.log("signedMessage", signedMessage);
    const validated = await keySpace.validate(signedMessage, walletAddress);
    console.log("validated", validated);
    const encryptedMessage = await keySpace.encrypt(
      messageToSign,
      walletAddress
    );
    console.log("encryptedMessage", encryptedMessage);
    const decryptedMessage = await keySpace.decrypt(
      encryptedMessage,
      walletAddress
    );
    console.log("decryptedMessage", decryptedMessage);

    return;
  }
  render() {
    const { stage } = this.state
    let content
    if(stage === 'initial') {
      content = <Button onClick={() => this.init()}>Connect To Metamask</Button>
    }
    if (stage === 'web3Enabled') {
      content = <Text>Initializing KeySpace, Sign to create your seed</Text>
    }

    return <div>
      <Heading>{stage}</Heading>
      { content }
    </div>;
  }
}

export default App;
