export function processEventData(data1, startDate, endDate) {
    const events = [];
    
    // Extract program keys from data2 skipping the first row
    const programKeys = [];
    for (let i = 1; i < data1.length; i++) {
        programKeys.push(data1[i][0]); // Assuming program key is in the first column
    }

    // Calculate time slots based on start and end dates
    const date1 = new Date(startDate + "T00:00:00+00:00");

    // Temporary array to store event objects
    const tempEvents = [];

    // Handle the first day only
    const currentDate = new Date(date1);
    for (let j = 0; j < programKeys.length; j++) {
        const programKey = programKeys[j];

        const eventDate = new Date(currentDate);
        eventDate.setUTCHours(j); // Set hour of the day

        const isoDateTime = eventDate.toISOString().replace(/\.\d{3}Z$/, '+00:00'); // Replace milliseconds with +00:00
        tempEvents.push({
            "program_key": programKey,
            "time_slot": isoDateTime,
            "duration": 3600 // 1 hour
        });
    }

    return tempEvents;
}
