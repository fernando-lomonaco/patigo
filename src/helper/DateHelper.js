import { format, parseISO, isAfter, isEqual } from "date-fns";

export default class DateHelper {

    constructor() {
        throw new Error('DateHelper nao pode ser instanciada');
    }

    static formatBrlDate(date) {
        let _dateFormatter = this.parseToDateTime(date);
        return format(_dateFormatter, "dd/MM/yyyy");
    }

    static compareDate(createdDate, updatedDate) {
        var firstDate = this.parseToDateTime(createdDate);
        var secondDate = this.parseToDateTime(updatedDate);

        if (isAfter(secondDate, firstDate)) {
            return format(secondDate, "dd/MM/yyyy HH:mm:ss");
        } else if (isEqual(secondDate, firstDate)) {
            return format(firstDate, "dd/MM/yyyy HH:mm:ss");
        }
        return format(secondDate, "dd/MM/yyyy HH:mm:ss");
    }

    static parseToDateTime(date) {
        return parseISO(date);
    }

}