# PWA Budget Tracker
This Project is about making an application work when the connection to the internet is lost temporarily while the user is utilizing the functionality.

The application itself is a simple budget tracker that allows a user to input credit and deficit transactions on a single account. 

The application was provided for me and it was my task to create the service worker and offline capabilities of the app. The client brief is set out below:

### Brief set: 

##### User Story
AS AN avid traveller
I WANT to be able to track my withdrawals and deposits with or without a data/internet connection
SO THAT my account balance is accurate when I am traveling

##### Business Context
Giving users a fast and easy way to track their money is important, but allowing them to access that information anytime is even more important. Having offline functionality is paramount to our applications success.

##### Acceptance Criteria
GIVEN a user is on Budget App without an internet connection
WHEN the user inputs a withdrawal or deposit
THEN that will be shown on the page, and added to their transaction history when their connection is back online.

### What I have learnt

I have learnt about the different methods involved in a service worker, fetch, install, activate, and how to integrate them with the browsers object storage Indexed DB. 
This was a very complicated and difficult homework for me and it has taken a lot of reading and research to get the application to cache and save records while the user is offline. 
I am pleased to say that my motivation to succeed has resulted in a working application that I can use to further develop in these skills, for future more dynamic use of the functionality. 

## Contents: 
1. [Installation](#Instalation) 
2. [Usage](#Usage)
3. [Improvements](#Improvements)
4. [Updates](#Updates)
5. [Credits](#Credits)
6. [License](#License)
7. [Contact](#Contact)

## Installation

* Step 1: Download the zip file of the project.
* Step 2: Install the npm dependencies to your machine using first `>npm init`, then `>npm install <package name>`.

### Project dependencies

* Node.js
* Express
* MongoDB
* Mongoose
* dotenv
* morgan

### Technologies 

Languages I have used are:
* Javascript
* service workers
* IndexedDB
* manifest.json

## Usage

* Step 1: The application once downloaded will be invoked by using the following command in your command-line or terminal: `>node app.` 
* Step 2: You can utilise nodemon by running the command from your terminal `>npm run dev`

## Improvements

There is nothing to display at this time.


## Updates 

There is nothing to display at this time.
    
## Credits 

Resources I have referenced:   
* docs.mongodb.com
* mongoosejs.com


## License 

* GNU GPL v3<br />  

Where appropriate: 
Alot of the graphics included in my projects I have drawn myself and are copyright 2020. 
No useage without permission. 
If I have not originated the imagery I have gained the permission of the owner and acreditied 
where necessary. These are also not for re-purpose without permission of the owner.

You must make reference where the code originated. I would also love to see what changes and improvements you make.  
Design by Samantha Wakelam, please respect copyright 2020. 


## Contact

* Name: Samantha Wakelam  <br />Email: sam.wakelam@hotmail.co.uk <br />Github Profile: Sam Wakelam 