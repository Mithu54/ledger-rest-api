# ledger-rest-api

Steps to run ledger rest api

Download zip file
Unzip file
Open folder in VS code
open terminal
run "nodemon ledger.js" or "node ledger.js"
open http://localhost:5000/ledger in your browser or testing frameworks like postman or insomnia
Insert query string after '?' in format start_date=&end_date=&frequency=< WEEKLY, FORTNIGHTLY, MONTHLY>&weekly_rent=&timezone=
Example: http://localhost:5000/ledger?start_date=2020-03-28&end_date=2020-05-27&frequency=fortnightly&weekly_rent=555&timezone=Europe/Zurich

Test

Run "npm test" on terminal
