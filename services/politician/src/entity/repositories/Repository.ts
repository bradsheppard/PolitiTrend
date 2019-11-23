interface Repository<T> {
    get(predicate?: {}): Promise<T[]>;
    getOne(id: number): Promise<T>;
    insert(entity: T): Promise<T>;
    update(entity: T): Promise<boolean>;
    deleteOne(id: number): Promise<boolean>;
    delete(): Promise<void>;
}

export default Repository;