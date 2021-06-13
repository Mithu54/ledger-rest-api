Steps to run ledger rest api

1. Download zip file
2. Unzip file
3. Open folder in VS code
4. open terminal
5. run "nodemon ledger.js" or "node ledger.js"
6. open http://localhost:5000/ledger in your browser
7. Insert query string after '?' in format start_date=<YYYY-MM-DD>&end_date=<YYYY-MM-DD>&frequency=< WEEKLY, FORTNIGHTLY, MONTHLY>&weekly_rent=<Rent amount>&timezone= <TZ databasae format>

Example: http://localhost:5000/ledger?start_date=2020-03-28&end_date=2020-05-27&frequency=fortnightly&weekly_rent=550&timezone= Europe/Zurich

Testing
1. run "npm test"