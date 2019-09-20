interface Repository<T> {
    get(predicate: {}): Promise<T[]>;
    insert(entity: T): Promise<void>;
    update(entity: T): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}

export default Repository;