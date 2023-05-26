class Counter {
    constructor({
        bookId,
        counter = 1,
        datetime = undefined}
    ) {
        this.bookId = bookId
        this.counter = counter
        this.datetime = datetime ? new Date(datetime) : new Date()
    }

    get() {
        return this.counter
    }

    inc() {
        this.counter++
        this.datetime = new Date()
        return this.counter
    }
}


export { Counter }