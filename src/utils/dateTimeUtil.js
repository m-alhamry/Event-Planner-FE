import { DateTime } from "luxon";

// Format date to user's local timezone
export const formatDateToLocal = (dateString) => {
    const dt = DateTime.fromISO(dateString, { zone: 'Asia/Bahrain' });
    if (!dt.isValid) throw new Error('Invalid date');
    return dt.toLocaleString({
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Format time to user's local timezone
export const formatTimeToLocal = (timeString) => {
    const dt = DateTime.fromFormat(timeString, 'HH:mm:ss', { zone: 'Asia/Bahrain' });
    if (!dt.isValid) throw new Error('Invalid time');
    return dt.toLocaleString({
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

// Format date and time to user's local timezone
export const formatDateTimeToLocal = (dateString, timeString) => {
    return `${formatDateToLocal(dateString)} at ${formatTimeToLocal(timeString)}`;
};

// Format date to form's date format
export const formatDateToForm = (dateString) => {
    const eventDate = DateTime.fromISO(dateString, {
        zone: 'Asia/Bahrain',
    });
    return eventDate.toFormat('yyyy-MM-dd');
}

// Check if an event is past
export const isEventPast = (dateString, timeString) => {
    // Parse the date string (e.g., "2025-08-03T00:00:00+03:00") in Asia/Bahrain
    const eventDate = DateTime.fromISO(dateString, { zone: 'Asia/Bahrain' });
    // Parse the time string (e.g., "14:30:00") and combine with date
    const timeParts = timeString.split(':'); // [HH, mm, ss]
    // Set the time from timeString onto eventDate
    const combinedDate = eventDate.set({
        hour: parseInt(timeParts[0], 10),
        minute: parseInt(timeParts[1], 10),
        second: timeParts[2] ? parseInt(timeParts[2], 10) : 0,
    });
    // Get current time in Asia/Bahrain
    const now = DateTime.now().setZone('Asia/Bahrain');
    // Compare
    return combinedDate < now;
};

// Check if an event is today based on user's local timezone
export const isEventToday = (dateString) => {
    // Parse the event date in Asia/Bahrain timezone
    const eventDate = DateTime.fromISO(dateString, { zone: 'Asia/Bahrain' });
    // Get current date in Asia/Bahrain
    const today = DateTime.now().setZone('Asia/Bahrain');
    // Compare dates (ignoring time)
    return eventDate.hasSame(today, 'day');
};

// Check if an event is within the next 7 days
export const isEventSoon = (dateString) => {
    // Parse the event date in Asia/Bahrain timezone
    const eventDate = DateTime.fromISO(dateString, { zone: 'Asia/Bahrain' });
    // Get current date and next 7 days in Asia/Bahrain
    const today = DateTime.now().setZone('Asia/Bahrain');
    const sevenDaysFromNow = today.plus({ days: 7 });
    // Check if event is after today but within 7 days
    return eventDate > today && eventDate <= sevenDaysFromNow && !eventDate.hasSame(today, 'day');
};