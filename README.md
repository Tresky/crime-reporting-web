# Crime App
---
### Getting Started
This system relies on a few command-line tools that need to be installed:
 - NodeJS (`node` in terminal)
 - Node Package Manager (`npm` in terminal)
 - `wget` (used in `setup.sh` in Mac/Linux only)

#### Mac/Linux
1. In the root directory of the project, run `npm install` to install all of the dependencies that our project relies on. This will install Express along with a number of other packages.
2. In the root directory of the project there is a setup file I wrote called `setup.sh`. Run it by typing `./setup.sh`.
  - If you get a **permission** denied error run `chmod 755 setup.sh` and rerun the script.
  - If you get an error saying you don't have `wget` installed, install it by running:
     - `brew install wget` on Mac
     - `sudo apt-get install wget` on Linux
3. Test the server by running `npm start` in the root directory of the project and navigating to `localhost:3000` in your browser. If you have any issues, let Tyler know and he will help you get started.

#### Windows
Windows doesn't have some of the command-line tools needed to run the setup script I wrote, so you'll have to do this all manually.

1. In the root directory of the project, run `npm install` to install all of the dependencies that our project relies on. This will install Express along with a number of other packages.
2. Create a file in the root directory of the project called `.env`. Inside of it, paste the following line (we will change the value later):
   - `SESSION_SECRET=TemporarySessionSecret`
3. Go this [this link](https://drive.google.com/file/d/0By1RZW5XyyDdZzl1TV9uV1pfZms/view?usp=sharing) and download the file called `secrets.js`. Place it in the `/config` folder of the project directory.
3. Open your `.gitignore` file in the root directory. Paste the following lines in the bottom of the file. Note: it may be a hidden file, so you'll need to "show hidden files" in order to see it.
   - `.env`
   - `config/secrets.js`
4. Test the server by running `npm start` in the root directory of the project and navigating to `localhost:3000` in your browser. If you have any issues, let Tyler know and he will help you get started.
