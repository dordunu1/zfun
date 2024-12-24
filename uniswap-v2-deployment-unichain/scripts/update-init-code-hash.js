const fs = require('fs');
const path = require('path');

async function main() {
  // Read the init code hash from the file
  const initCodeHash = fs.readFileSync('init-code-hash.txt', 'utf8').split('=')[1].trim();

  // Read the UniswapV2Library.sol file
  const libraryPath = path.join(__dirname, '../contracts/libraries/UniswapV2Library.sol');
  let content = fs.readFileSync(libraryPath, 'utf8');

  // Replace the init code hash
  content = content.replace(
    /hex'[0-9a-fA-F]{64}' \/\/ init code hash/,
    `hex'${initCodeHash.slice(2)}' // init code hash`
  );

  // Write the updated content back to the file
  fs.writeFileSync(libraryPath, content);

  console.log('Updated init code hash in UniswapV2Library.sol');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 