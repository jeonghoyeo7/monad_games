# Molandak Dodge Game

Welcome to the Molandak Dodge Game! This game is created using Matter.js and React, and it features Bibiduk as the main character. The goal is to dodge the falling objects and achieve the highest score possible.

## Play the Game
- [Play Molandak Dodge Game](https://monad-games-bibiduk.pages.dev/)

## Images Credit
- Background image by [@juju5378](https://twitter.com/juju5378)
- Character image by [@dkgk55](https://twitter.com/dkgk55)

## How to Play
- Control Bibiduk using your mouse or touch.
- Dodge the falling obstacles.
- Try to achieve the highest score.

## Inspiration
This game was inspired by the tutorial and code examples from [Make a Game with Matter.js](https://funes-days.com/dev/make-game-to-matter-js). The tutorial provided a great foundation for understanding Matter.js and integrating it with React.

## Project Structure
- **public**: Contains the static assets like images and the HTML file.
- **src**: Contains the React components and game logic.
- **package.json**: Contains the project dependencies and scripts.

## Build and Deployment
This project uses `Create React App` and is deployed using Cloudflare Pages. The following scripts are defined in `package.json`:
- `start`: Runs the development server.
- `build`: Creates an optimized production build.
- `test`: Runs the test suite.
- `eject`: Ejects the Create React App configuration (not recommended).

To build and deploy the project:
1. Install dependencies: `npm install`
2. Build the project: `npm run build`
3. Deploy the `build` directory to your preferred hosting service.

## Environment Variables
To resolve issues related to OpenSSL in Node.js 17 and above, the following environment variable is used:
- `NODE_OPTIONS=--openssl-legacy-provider`

## Contribution
Feel free to fork the repository and submit pull requests. Contributions are welcome!

## License
This project is licensed under the MIT License.
