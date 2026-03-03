/**
 * Formats a date string (like YYYY-MM-DD) or a Date object into DD/MM/YYYY format.
 * @param {string | Date} date The date to format.
 * @returns {string} The formatted date or 'Data inválida' if the input is not valid.
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Adding a day to the date to correct potential timezone issues where the date might be off by one.
    // For example, a date like '2023-10-25' might be interpreted as '2023-10-24T21:00:00-03:00'
    // and getDate() would return 24. Adding a day ensures we get the intended day.
    dateObj.setDate(dateObj.getDate() + 1);

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = dateObj.getFullYear();

    if (isNaN(day as any) || isNaN(month as any) || isNaN(year)) {
        return 'Data inválida';
    }

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", date, error);
    return 'Data inválida';
  }
};
