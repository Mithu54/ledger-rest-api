const app = require('express')();
const PORT = 5000;
var Ledger=[];
app.listen(PORT, () => console.log('running on localhost:', PORT));
app.get('/ledger', (req, res) => {
	getLedger(req.query.start_date, req.query.end_date, req.query.frequency, req.query.weekly_rent, req.query.timezone);
	res.contentType('application/json');
	res.send(JSON.stringify(Ledger));
	Ledger=[];

});


function getLedger(start_date, end_date, frequency, weekly_rent, timezone) {
	var days = getDays(start_date, end_date)+1;
	
	
	frequency= frequency.toUpperCase();
	switch (frequency) {
		case 'WEEKLY':
			var weekStartDate = new Date(start_date);
			var weeks = Math.floor(days / 7);
			for (var i = 1; i <= weeks; i++) {
				var endDate = new Date(addDays(weekStartDate, 6));
				
				Ledger.push({StartDate: weekStartDate, EndDate: endDate, rent: weekly_rent})
				weekStartDate = addDays(endDate, 1);
			}
			var lastWeekdays= days - (weeks * 7);
			if(lastWeekdays!=0){
			var lastWeekRent=(lastWeekdays/7*weekly_rent).toFixed(2);
			Ledger.push({StartDate: weekStartDate, EndDate: end_date, rent: lastWeekRent})}
			break;
		case 'FORTNIGHTLY':
			var fortnightStartDate = new Date(start_date);
			var fortnights = Math.floor(days / 14);
			var fortnightlyRent= weekly_rent*2;
			for (var i = 1; i <= fortnights; i++) {
				var endDate = new Date(addDays(fortnightStartDate, 13));
				
				Ledger.push({StartDate: fortnightStartDate, EndDate: endDate, rent: fortnightlyRent})
				fortnightStartDate = addDays(endDate, 1);
			}
			var lastFortnightdays= days - (fortnights * 14);
			if(lastFortnightdays!=0){
			var lastFortnightRent=(lastFortnightdays/14*fortnightlyRent).toFixed(2);
			Ledger.push({StartDate: fortnightStartDate, EndDate: end_date, rent: lastFortnightRent })}
			break;
		case 'MONTHLY':
			 = new Date(addMonths(startDate, 5));
			
	}
}
function toDateString(ISOdate) {
	var parts = ISOdate.split('-');
	var date = new Date(parts[0], parts[1] - 1, parts[2]);
	return date;
}

function getDays(start_date, end_date, frequency, weekly_rent, time_zone) {
	start_date = toDateString(start_date);
	end_date = toDateString(end_date);
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;

	// Discard the time and time-zone information.
	const utc1 = Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate());
	const utc2 = Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate());
	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
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
