
export default function DateFormat(props) {

    var inputDate = props.date.split('T')[0];

    // Parse the input date using the Date object
    var parsedDate = new Date(inputDate);

    // Extract day, month, and year from the parsed date
    var day = parsedDate.getDate();
    var month = parsedDate.getMonth() + 1; // Months are zero-based, so add 1
    var year = parsedDate.getFullYear();

    // Create the re-formatted date string in 'DD-MM-YYYY' format
    var formattedDate = day + ' - ' + (month < 10 ? '0' : '') + month + ' - ' + year;

    return (
        <>
            <p>{formattedDate}</p>
        </>
    )
}