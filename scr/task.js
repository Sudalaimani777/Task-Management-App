class Task {
    constructor(title, quote = null) {
        this.id = Math.floor(Math.random()*1000000000 + 1);
        this.title = title;
        this.quote = quote;
        this.completed = false;
        this.createdAt = new Date();
    }
}

export default Task;
