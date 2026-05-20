export interface DtoToEntity<D, E> {
    /**
   * Returns the mapped entities from sql rows.
   * @param dto - The dto structure received from the request body, which needs to be mapped to our business logic entities.
   * @returns the mapped business logic entity
   *
   */

    dtoToEntity(dto: D) : E;

    /**
   * Returns the mapped entities from sql rows.
   * @param entity - The dto structure received from the request body, which needs to be mapped to our business logic entities.
   * @returns the mapped business logic entity
   *
   */
    entityToDto(entity: E) : D;
}