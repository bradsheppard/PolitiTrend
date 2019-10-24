interface Repository<T> {
    get(): Promise<T[]>;
}

export default Repository;