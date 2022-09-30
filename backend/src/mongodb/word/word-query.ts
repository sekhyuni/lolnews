import { Word, WordModel } from './word';

export class QueryOfWord {
    constructor() { }

    create(word: Word): Promise<Word> {
        const newWord = new WordModel(word);
        return newWord.save();
    }

    read(query: any) {
        return WordModel.find(query);
    }

    update(word: Word) {
        return WordModel.updateOne({ _id: word._id }, { ...word });
    }

    delete(word: Word) {
        return WordModel.remove({ _id: word._id });
    }

    aggregate(query: any) {
        return WordModel.aggregate(query);
    }
}