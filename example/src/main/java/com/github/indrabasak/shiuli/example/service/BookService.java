package com.github.indrabasak.shiuli.example.service;

import java.util.Optional;
import java.util.UUID;

import com.github.indrabasak.shiuli.example.error.exception.DataNotFoundException;
import com.github.indrabasak.shiuli.example.data.entity.Book;
import com.github.indrabasak.shiuli.example.data.repository.BookRepository;
import com.github.indrabasak.shiuli.example.model.BookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * {@code BookService} provides CRUD functionality on book.
 * <p/>
 *
 * @author Indra Basak
 * @since 11/20/17
 */
@Service
public class BookService {

    private final BookRepository repository;

    @Autowired
    public BookService(BookRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Book create(BookRequest request) {
        Book entity = new Book();
        entity.setTitle(request.getTitle());
        entity.setAuthor(request.getAuthor());

        return repository.save(entity);

    }

    public Book read(UUID id) {
        Optional<Book> optional = repository.findById(id);
        if (optional.isPresent()) {
            return optional.get();
        }

        throw new DataNotFoundException("Book with ID " + id + " not found.");
    }
}
