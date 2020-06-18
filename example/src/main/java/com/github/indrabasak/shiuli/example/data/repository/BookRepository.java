package com.github.indrabasak.shiuli.example.data.repository;


import java.util.UUID;

import com.github.indrabasak.shiuli.example.data.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * {@code BookRepository} is a JPA book repository. It servers as an example
 * for springfox-data-rest.
 * <p>
 *
 * @author Indra Basak
 * @since 11/23/17
 */
@Repository
public interface BookRepository extends JpaRepository<Book, UUID> {
}
