//datetime
export default function DateTimeFormat(props) {
    var inputDate = props.date.split('T')[0];
    var parsedDate = new Date(inputDate);
    var day = parsedDate.getDate();
    var month = parsedDate.getMonth() + 1;
    var year = parsedDate.getFullYear();
    var hour = parsedDate.getHours();
    var minute = parsedDate.getMinutes();
    var formattedDate = day + ' - ' + (month < 10 ? '0' : '') + month + ' - ' + year + ' ' + hour + ':' + minute;
    return (
        <>
            <p>{formattedDate}</p>
        </>
    )
}