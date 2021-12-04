# Safety Goggles: A Transparent Wallet NFT Activity Timeline

This is a website that displays NFT related activity with a few key focuses. It's deployed [here](https://eth-wallet-timeline.vercel.app/).

1. Transparency: Distinguishing between 'real' mints and devs minting to influencers.
2. Shareability: Easily filter data to create simple consumable chunks of alpha.
3. A Timeline View: Show a visual timeline of the wallets activity.

## Transparency and Shareability

When scanning around discords for NFT alpha something I saw a lot was "Hey (insert influencer or whale) bought wagmi etc etc.." w/ an accompanying screenshot. Often, after going back and fourth between OpenSea and etherscan I'd discover that it was just the developers of the project minting to said influencer. If you go look at any popular opensea account it's full of random NFT's from devs trying to trick copy traders.

This website distinguishes between these fake mints and real ones, labeling them accordingly.

![Screen Shot 2021-11-30 at 2 58 41 PM](https://user-images.githubusercontent.com/17352012/144141661-6c069a51-cd77-4a70-995c-1dde716656db.png)


with this, in combination with filtering, the goal of the site is to be a tool to help discover and share alpha and hopefully prevent some people from being tricked into fomo buying something.

## A Timeline View

I think the idea of a timeline is novel, visually appealing, and makes good use of the screen real estate as web3 folks are typically on desktop (the site is mobile friendly). Organizing the data this way may provide some insight in how successful traders act under different market conditions. Finally, showing a timeline of moves in a specific collection could be a fun way to gloat/cry on twitter about major wins/losses.

## Note

This is still a work in progress, expect some issues here and there, especially with labeling less common event types. Event labelling surrounding the core goals of the project (buy, sell, mints vs dev mints mentioned above) is solid right now though.

## Setup

First install dependencies

`npm i`

## Developing Locally in dev mode

First pull in a copy of the environment variables

`npx vercel env pull .env.local`

Next, run the app

`npm run dev`

## Creating a build locally

Dev mode can be pretty slow, creating a build locally is better if you want to do a lot of testing.

`npm run build`

`npm run start`

## Creating a test deployment

In order to create a one off preview deployment, run the following.

`npx vercel`
