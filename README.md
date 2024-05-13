# Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

# When running the project for the first time:
CD into the Code directory and install the neccessary modules: 
- npm install
- npm install express
- npm install mongoose
- npm install --save-dev nodemon
- npm install cors

Seed the database with the initial data by running the following:
- mongoimport --db catalogue --collection items --file "path_to_the_products_file" --jsonArray

Start the server and navigate to `http://localhost:8080`:
- npm start

## MongoDB Compass:
I created a new database and collection in mongoDB compass called catalogue. Then I ran the following command in my visual studio code to add the items to the database collection:
- mongoimport --db catalogue --collection items --file "C:\Users\srisk\OneDrive - Technological University Dublin\Documents\YEAR 4 SEM 2\Enterprise App Dev\Assignment\Code\products.json" --jsonArray

## Explanation of Directory Structure:
- node_modules/: Contains all the Node.js modules that the application depends on
- public/: Serves static files such as images, CSS, and client-side JavaScript.
- src/: This directory contains the server-side code, organized into models and routes.
- models/: Defines the Mongoose schemas for the data that will be stored in the MongoDB Compass database.
- routes/: Contains route definitions for the application's API endpoints.
- views/: Holds the HTML files served by the server as views, including the main page, about page, and saved items view.
- server.js: The entry point to the server application, establishing the server, connecting to MongoDB, and defining middleware and routes.

#### Sara Egan, C20353056, 28/04/2024