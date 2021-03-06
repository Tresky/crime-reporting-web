# Crime App

### Getting Started
This system relies on a few command-line tools that need to be installed:
 - NodeJS (`node` in terminal, sometimes `nodejs`)
 - Node Package Manager (`npm` in terminal)
 - `wget` (used in `setup.sh` in Mac/Linux only)

#### Mac/Linux
1. In the root directory of the project, run `npm install` to install all of the dependencies that our project relies on. This will install Express along with a number of other packages.
2. In the root directory of the project, use NPM to install Bower: `npm install -g bower`
3. In the root directory of the project, run `bower install` to install of the bower dependencies that our project relies on.
4. In the root directory of the project there is a setup file I wrote called `setup.sh`. Run it by typing `./setup.sh`.
  - If you get a **permission** denied error run `chmod 755 setup.sh` and rerun the script.
  - If you get an error saying you don't have `wget` installed, install it by running:
     - `brew install wget` on Mac
     - `sudo apt-get install wget` on Linux
5. Now you'll need to get PostgreSQL set up. Open the psql command-line interface by clicking the elephant in your Mac status menu (top-right of screen) and selecting the `Open psql` option.
   - `CREATE USER crime_user;`
   - `CREATE DATABASE crime;`
   - `CREATE DATABASE test_crime;`
   - `ALTER ROLE crime_user WITH Superuser;`
   - Type `\q` to exit `psql`.
6. Test the server by running `npm start` in the root directory of the project and navigating to `localhost:3000` in your browser. If you have any issues, let Tyler know and he will help you get started.

#### Windows
Windows doesn't have some of the command-line tools needed to run the setup script I wrote, so you'll have to do this all manually.

1. In the root directory of the project, run `npm install` to install all of the dependencies that our project relies on. This will install Express along with a number of other packages.
2. In the root directory of the project, use NPM to install Bower: `npm install -g bower`
3. In the root directory of the project, run `bower install` to install of the bower dependencies that our project relies on.
4. Create a file in the root directory of the project called `.env`. Inside of it, paste the following line (we will change the value later):
   - `SESSION_SECRET=TemporarySessionSecret`
5. Go this [this link](https://drive.google.com/file/d/0By1RZW5XyyDdZzl1TV9uV1pfZms/view?usp=sharing) and download the file called `secrets.js`. Place it in the `/config` folder of the project directory.
6. Open your `.gitignore` file in the root directory. Paste the following lines in the bottom of the file. Note: it may be a hidden file, so you'll need to "show hidden files" in order to see it.
   - `.env`
   - `config/secrets.js`
7. Now you'll need to setup PostgreSQL. Windows doesn't have an easy to use command-line tool like Linux and Mac. So, you'll have to use PgAdmin which should have been installed when you installed PostgreSQL.
   - Open PgAdmin
   - Click the 'power plug' icon to add a server.
     - Name: `localhost`
     - Host: `localhost`
     - Port: `5432`
   - Double-click the new server
   - Right-click `Login Roles` and add a new login role.
     - Role Name: `crime_user`
     - Role Priveleges Tab: Check `Can Login`, `Inherit Rights`, and `Superuser`
   - Right-click `Databases` and add a new database.
     - Name: `crime`
     - Owner: `crime_user`
   - Right-click `Databases` and add a new database.
     - Name: `test_crime`
     - Owner: `crime_user`
8. Test the server by running `npm start` in the root directory of the project and navigating to `localhost:3000` in your browser. If you have any issues, let Tyler know and he will help you get started.
    - If an error occurs when running the `npm start` that looks like this:

        "Failed to prune sessions: password authentication failed for user 'crime_user'" or says something to the lines of "Password Authentication Failed."

        - In PgAdmin, right click on `crime_user` and go to properties. Go to definition. And put `123` for the password and save it. Now repeat step 6.
