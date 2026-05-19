export interface DtoToEntity<D, E> {
    dtoToEntity(dto: D) : E;
    entityToDto(entity: E) : D;
}