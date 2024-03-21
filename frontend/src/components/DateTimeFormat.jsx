//datetime
export default function DateTimeFormat(props) {
    var inputDate = props.date;
    var parsedDate = new Date(inputDate);
    var day = parsedDate.getDate();
    var month = parsedDate.getMonth() + 1;
    var year = parsedDate.getFullYear();
    var hour = parsedDate.getHours();
    var minute = parsedDate.getMinutes();
    var second = parsedDate.getSeconds();
    var formattedDate = day + ' - ' + (month < 10 ? '0' : '') + month + ' - ' + year + ' ' + (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute + ':' + (second < 10 ? '0' : '') + second;
    return (
        <>
            <p>{formattedDate}</p>
        </>
    )
}