
## Backend for Stock Market Tracking System  

### Application Checklist
- Supports User Registration, User Login, and User Logout with added validation
- Supports session persistence using Cookies and session based authorization
- Users are able to load and unload Wallet
- Users are able to buy and sell stocks, linked to the users wallet
- Users are able to add and remove stocks to a watchlist and get live updates on intraday data
- Users are able to see the stocks they buy and sell in a portfolio
- Robust Error Handling using a Custom ApiError Class and an error handler middleware to catch all errors
- All async operations are wrapped in a try, catch block
- Implements a Model-View-Controller design pattern, minus the View
- Implements Separation of Concern for ease of testing and scalability

### Getting Started
This application requires the Nodejs, MongoDB, and Redis runtime environments be installed locally. For the sake of this exercise, I have added the environment variables in [dev.env](./dev.env).  
First start by cloning this repository, making sure Node, MongoDB, and Redis are installed and running locally. Next install at dependencies by running the command `npm install`.
Now everything should be configured through the [dev.env](./dev.env) file.  
By running the command `npm run dev`, the server should start up locally on localhost:3000 where you can access certain endpoints, where most endpoints require authentication.

### Dependencies
- Express.js Server
- Express Sessions and Setting Cookies
- MongoDB Databasing / Redis Caching
- Axios/Cheerio for Web Scraping Financial Data from Yahoo Finance
- Bcryptjs for hashing and storing passwords

