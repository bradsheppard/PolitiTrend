interface Repository<T> {
    get(predicate?: {}): Promise<T[]>;
    getOne(id: number): Promise<T>;
    insert(entity: T): Promise<T>;
    update(entity: T): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}

export default Repository;