class JSONError {

    static make(errcode, errmsg = '') {
        return {
            errcode, errmsg
        }
    }

    static err403(errmsg = '') {
        return this.make(403, errmsg ? errmsg : 'Ошибка добавления')
    }

    static err404(errmsg = '') {
        return this.make(404, errmsg ? errmsg : 'Объект не найден')
    }

    static err500(errmsg = '') {
        return this.make(500, errmsg ? errmsg : 'Объект не найден')
    }

}


export {JSONError}