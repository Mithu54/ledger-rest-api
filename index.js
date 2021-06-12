const app = require('express')();
const PORT = 5000;
var Ledger = []; //Creating An array to respond with json data
options = {
	year: 'numeric',
	month: 'long',
	day: 'numeric'
}; //format for printing data
app.listen(PORT, () => console.log('running on localhost:', PORT)); //Server running on http://localhost:5000/
app.get('/ledger', (req, res) => {
	// ledger api on http://localhost:5000/ledger
	getLedger(req.query.start_date, req.query.end_date, req.query.frequency, req.query.weekly_rent, req.query.timezone);
	res.contentType('application/json');
	res.send(JSON.stringify(Ledger)); //sending json data as response
	Ledger = [];
});
function getLedger(start_date, end_date, frequency, weekly_rent, timezone) {
	Ledger.push({ 'Time zone': timezone });
	start_date = toDateString(start_date); //date to standard date format
	end_date = toDateString(end_date);
	var days = getDays(start_date, end_date) + 1; //getting days between two dates
	var lastDate = new Date(end_date);
	frequency = frequency.toUpperCase();
	switch (frequency) {
		case 'WEEKLY':
			var weekStartDate = new Date(start_date);
			var weeks = Math.floor(days / 7); //getting the number of weeks
			for (var i = 1; i <= weeks; i++) {
				var endDate = new Date(addDays(weekStartDate, 6)); //setting end date to the week by adding 6 days
				Ledger.push({
					'Start date': weekStartDate.toLocaleString('en-US', options),
					'End date': endDate.toLocaleString('en-US', options),
					Amount: weekly_rent
				}); //pushes calculated rent and intervels to Ledger[]
				weekStartDate = addDays(endDate, 1); //start date of the next week is 1+ last  day of the current week
			}
			var lastWeekdays = days - weeks * 7; //calculating remainder days after all the full weeks
			if (lastWeekdays != 0) {
				var lastWeekRent = (lastWeekdays / 7 * weekly_rent).toFixed(2); //setting last week's rent
				Ledger.push({
					'Start date': weekStartDate.toLocaleString('en-US', options),
					'End date': lastDate.toLocaleString('en-US', options),
					Amount: lastWeekRent
				}); //pushes calculated rent and intervels to Ledger[]
			}
			break;
		case 'FORTNIGHTLY':
			var fortnightStartDate = new Date(start_date);
			var fortnights = Math.floor(days / 14); // number of full fortnights
			var fortnightlyRent = weekly_rent * 2;
			for (var i = 1; i <= fortnights; i++) {
				var endDate = new Date(addDays(fortnightStartDate, 13)); //setting end date
				Ledger.push({
					'Start date': fortnightStartDate.toLocaleString('en-US', options),
					'End date': endDate.toLocaleString('en-US', options),
					Amount: fortnightlyRent
				}); //pushes calculated rent and intervels to Ledger[]
				fortnightStartDate = addDays(endDate, 1);
			}
			var lastFortnightdays = days - fortnights * 14;
			if (lastFortnightdays != 0) {
				var lastFortnightRent = (lastFortnightdays / 14 * fortnightlyRent).toFixed(2);
				Ledger.push({
					'Start date': fortnightStartDate.toLocaleString('en-US', options),
					'End date': lastDate.toLocaleString('en-US', options),
					Amount: lastFortnightRent
				}); //pushes calculated rent and intervels to Ledger[]
			}
			break;
		case 'MONTHLY':
			var monthStartDate = new Date(start_date);
			months = monthsBetween(monthStartDate, lastDate); //getting number of full months
			var monthlyRent = (weekly_rent / 7 * 365 / 12).toFixed(2); //setting monthly rent based on weekly rent
			for (var i = 1; i <= months; i++) {
				var nextMonth = new Date(addMonths(monthStartDate, 1)); //skipping a month
				var monthEndDate = new Date(addDays(nextMonth, -1)); // end date should be 1 day before the start of the next month
				Ledger.push({
					'Start date': monthStartDate.toLocaleString('en-US', options),
					'End date': monthEndDate.toLocaleString('en-US', options),
					Amount: monthlyRent
				}); //pushes calculated rent and intervels to Ledger[]
				monthStartDate = nextMonth; //setting start date to the next month
			}
			var monthEndDate = new Date(addMonths(monthStartDate, 1));
			var monthEndDate2 = new Date(addDays(monthEndDate, -1));
			//special case where the month is full but dates are different
			//Example satrt date is on August 31 2020 and end date is on November 30
			if (lastDate.getTime() == monthEndDate2.getTime()) {
				Ledger.push({
					'Start date': monthStartDate.toLocaleString('en-US', options),
					'End date': monthEndDate2.toLocaleString('en-US', options),
					Amount: monthlyRent
				}); //pushes calculated rent and intervels to Ledger[]
			} else {
				var lastMonthdays = getDays(monthStartDate, lastDate) + 1; //counting days for the last month
				if (lastMonthdays > 0) {
					var lastMonthRent = (lastMonthdays / 7 * weekly_rent).toFixed(2); // calculating rent for the days left
					Ledger.push({
						'Start date': monthStartDate.toLocaleString('en-US', options),
						'End date': lastDate.toLocaleString('en-US', options),
						Amount: lastMonthRent
					}); //pushes calculated rent and intervels to Ledger[]
				}
			}
			break;
		default: {
			Ledger.push({ Error: 'Invalid Frequency string' });
		}
	}
}
function monthsBetween(datefrom, dateto) {
	var months;
	//getting number of months between dates
	months = (dateto.getFullYear() - datefrom.getFullYear()) * 12;
	months -= datefrom.getMonth();
	months += dateto.getMonth();
	if (dateto.getDate() - datefrom.getDate() > 1) {
		months += 1;
	}
	return months <= 0 ? 0 : months - 1;
}
function toDateString(ISOdate) {
	//Splits ISO date to date components
	var parts = ISOdate.split('-');
	var date = new Date(parts[0], parts[1] - 1, parts[2]);
	return date;
}
function getDays(start_date, end_date) {
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;
	var datefrom = new Date(start_date.setHours(12, 0, 0, 0)); //setting hours so that daylight savings time change won't affect dates
	var dateto = new Date(end_date.setHours(12, 0, 0, 0)); //setting hours so that daylight savings time change won't affect dates
	const date1 = Date.UTC(datefrom.getFullYear(), datefrom.getMonth(), datefrom.getDate()); // setting normal format
	const date2 = Date.UTC(dateto.getFullYear(), dateto.getMonth(), dateto.getDate()); // setting normal format
	return Math.floor((date2 - date1) / _MS_PER_DAY);
}
function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}
function addMonths(date, months) {
	var result = new Date(date);
	result.setMonth(result.getMonth() + months);
	return result;
}
