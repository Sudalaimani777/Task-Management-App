export class Task {
    constructor (id, title, quote, completed, createdAt) {
        this.id = Math.floor(Math.random()*1000000);
        this.title = title;
        this.quote = quote;
        this.completed = false;
        this.createdAt = new Date();
    }
}


