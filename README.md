# MEAN stack e-commerce project
## Angular Node.js Express MongoDB

#### A general cuisine & home groceries shopping web app.

## Try it online:

- https://jb-brunch.herokuapp.com/

## Try it locally:

### Prerequisites
- Make sure to have Node.js installed on your system (download from https://nodejs.org/en/).
- Create a MongoDB databse and name it "JB-Market".
- Import the attached MongoDB collections to the database.
- Make sure that MongoDB is running on your machine at port `27017`.
- Port `8080` is available to run node.js server.
- Port `4200` is available to run the Angular frontend. 
- replace mongoose connection address at app.js {line 20} with 'mongoose.connect('mongodb://localhost/JB-Market, useNewUrlParser: true, useCreateIndex:true});'

### Local installation

In the server folder, execute the following terminal commands: 
```
    > npm install
    > npm start
```
You can now enter the app through port 8080 at http://localhost:8080.

if you want to also include the client side folder, execute the following terminal commands in the client folder:
```
    > npm install
    > npm start
```
_Enter the app at http://localhost:4200_


- To enter as an administrator, type both username and password "admin".
- To enter as a user, type in username "julian" and password "awdawd" or simply register.