import Moralis from "moralis";

let isMoralisStarted = false;

export const initMoralis = async () => {
  if (!isMoralisStarted) {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY!,
    });
    isMoralisStarted = true;
  }
};
